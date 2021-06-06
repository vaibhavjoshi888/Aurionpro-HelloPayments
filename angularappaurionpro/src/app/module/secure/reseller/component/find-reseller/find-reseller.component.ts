import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';

import {ResellerService} from '../../../../../api/reseller.service';
import {CommonService} from '../../../../../api/common.service';
import {ToasterService} from '../../../../../api/toaster.service';
import {MessageSetting} from '../../../../../constant/message-setting.constant';
import {StorageService} from '../../../../../common/session/storage.service';
import {StorageType} from '../../../../../common/session/storage.enum';
import {Validator} from '../../../../../common/validation/validator';
import {Utilities} from '../../../../../common/utilities';
import {ValidationSetting} from '../../../../../constant/validation.constant';
import {PagerService} from '../../../../../api/pager.service';
import {AppSetting} from '../../../../../constant/appsetting.constant';
import {ConfirmModalComponent, ConfirmModal} from '../../../../common/modal/modal.component';
import {ComponentModalConfig, ModalSize, SuiModalService} from 'ng2-semantic-ui';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Exception } from '../../../../../common/exceptions/exception';
import * as moment from 'moment';

@Component({
  selector: 'app-find-reseller',
  templateUrl: './find-reseller.component.html',
  styleUrls: ['./find-reseller.component.css'],
  providers: [ToasterService, StorageService, CommonService, PagerService]
})
export class FindResellerComponent implements OnInit {
  findResellerForm: any;
  isLoader: any;
  toastData: any;
  validator: Validator;
  formErrors = {};
  resellerList: any = [];
  resellerData = [];
  resellerDataTemp = [];
  dtOptions: DataTables.Settings = {};
  direction: number;
  isDesc = false;
  column = 'CategoryName';
  lastSearchObj = {};
  searchParamsData = {};
  sortColumnOrder = {};
  // pager object
  pager: any = {};
  pagerOld: any = {};
  searchResultFlag = false;
  // paged items
  pagedItems: any[];
  noResultsMessage = '';

  // selectedParentReseller and tempSelectedParentReseller
  // is used to add the parent reseller name in the grid
  selectedParentReseller = '';
  tempSelectedParentReseller = '';
  inputValidation = ValidationSetting;  // used for maxlength in HTML
  accordion: any = {
    findReseller: true
  };
  previousFindResellerObj;
  findClicked = false;
  truncateWordLength = AppSetting.truncateWordLength;

  // selectedResellerParentId: any;
  // currentResellerName: any;
  loggedInUserData: any;
  fromBackClick = false;

  // validation config
  config = {
    'ParentId': { required: {name: ValidationSetting.reseller.find.resellerName.name}},
    'FirstName': { pattern: { name: ValidationSetting.reseller.find.firstName.name }},
    'LastName': { pattern: { name: ValidationSetting.reseller.find.lastName.name }},
    'ResellerName': { pattern: { name: ValidationSetting.reseller.find.companyName.name }},
    'Phone': {
      minlength: {name: ValidationSetting.reseller.find.phone.name, min: ValidationSetting.reseller.find.phone.minLength.toString()},
      pattern: { name: ValidationSetting.reseller.find.phone.name }
    },
    'Email': { pattern: { name: ValidationSetting.reseller.find.email.name }},
    'City': { pattern: { name: ValidationSetting.reseller.find.city.name }},
    'PostalCode': {}
  };

  constructor(private formBuilder: FormBuilder,
              private pagerService: PagerService,
              private resellerService: ResellerService,
              private toasterService: ToasterService,
              private storageService: StorageService,
              private commonService: CommonService,
              private modalService: SuiModalService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.validator = new Validator(this.config);
  }

  ngOnInit() {
    this.loggedInUserData = this.resellerService.getLoggedInData();
    this.findResellerForm = this.formBuilder.group({
      // 'id': ['', []],
      'ParentId': ['', []],
      'newResellerName': ['', []], // this filed was added to handle the global and resellername field
      'FirstName': ['', [Validators.pattern(ValidationSetting.firstNameLastName_regex)]],
      'LastName': ['', [Validators.pattern(ValidationSetting.firstNameLastName_regex)]],
      'ResellerName': ['', [Validators.pattern(ValidationSetting.alphanumericWithSpace_regex)]],
      'Phone': ['', [Validators.minLength(ValidationSetting.reseller.find.phone.minLength), Validators.pattern(ValidationSetting.numbersOnly_regex)]],
      'Email': ['', [Validators.pattern(ValidationSetting.email_regex)]],
      'City': ['', [Validators.pattern(ValidationSetting.charactersOnlyWithSpace_regex)]],
      'PostalCode': ['', []],
    });
    this.findResellerForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.getResellerList();
    this.sortColumnOrder['ResellerName'] = true;
    this.sortColumnOrder['LastName'] = true;
    this.sortColumnOrder['FirstName'] = true;
    this.sortColumnOrder['Email'] = true;
    this.sortColumnOrder['IsActive'] = true;
    this.sortColumnOrder['createdOn'] = true;

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params !== undefined && params.fromBackClick !== undefined && params.fromBackClick === 'true') {
        this.previousFindResellerObj = this.resellerService.getFindResellerData();
        this.resellerService.setFindResellerData(undefined);
        if (this.previousFindResellerObj !== undefined) {
          this.fromBackClick = true;
          this.handleBackClick();
        }
      }
    });

    this.initiatePager();
  }

  onValueChanged(data?: any) {
    if (!this.findResellerForm) {
      return;
    }
    this.formErrors = this.validator.validate(this.findResellerForm);
  }

  // get date in mm-dd-yyyy format
  getFormattedDate(date) {
    const localDate = moment.utc(date).local();
    const d = this.commonService.getFormattedDate(localDate['_d']);
    // const t = this.commonService.getFormattedTime(localDate['_d']);
     return d;
  }

  handleBackClick() {
    // this.findMerchantForm.controls['ParentId'].patchValue(this.previousFindMerchantObj.ParentId);
    this.findResellerForm.controls['newResellerName'].patchValue(this.previousFindResellerObj.newResellerName);
    this.findResellerForm.controls['FirstName'].patchValue(this.previousFindResellerObj.FirstName);
    this.findResellerForm.controls['LastName'].patchValue(this.previousFindResellerObj.LastName);
    this.findResellerForm.controls['ResellerName'].patchValue(this.previousFindResellerObj.ResellerName);
    this.findResellerForm.controls['Phone'].patchValue(this.previousFindResellerObj.Phone);
    this.findResellerForm.controls['Email'].patchValue(this.previousFindResellerObj.Email);
    this.findResellerForm.controls['City'].patchValue(this.previousFindResellerObj.City);
    this.findResellerForm.controls['PostalCode'].patchValue(this.previousFindResellerObj.PostalCode);

    // temp code need to remove setTimeout
    setTimeout(() => {
      this.findResellerForm.controls['ParentId'].patchValue(this.previousFindResellerObj.ParentId);
      this.tempSelectedParentReseller = this.resellerList.filter(
        (x): any => x.id == this.previousFindResellerObj.ParentId
      )[0].resellerName;
      this.find();
    }, 10);
  }

  getResellerList() {
    this.isLoader = true;
    const parentId = 1;
    this.resellerService.getResellerList(this.loggedInUserData['parentId']).subscribe(
      a => {
        if (this.loggedInUserData['parentId'] === 0) {
          this.resellerList = this.resellerService.addSuperAdminToResellerList(a['data']);
        } else {
          this.resellerList.push(a);
          this.findResellerForm.controls['newResellerName'].patchValue(this.resellerList[0].resellerName);
         // the current reseller id will become the parent reseller for any child reseller under him
          // this.findResellerForm.controls['ParentId'].patchValue(this.resellerList[0].id);
          // tempSelectedParentReseller is used to add the parent reseller name in the grid
          // this.tempSelectedParentReseller = a['resellerName'];
        }
        if (this.previousFindResellerObj !== undefined && this.previousFindResellerObj !== null && this.previousFindResellerObj.ParentId != undefined) {
          this.handleBackClick();
        } else {
          // temp code need to remove setTimeout
          setTimeout(() => {
            this.findResellerForm.controls['ParentId'].patchValue(this.resellerList[0].id);
            this.isLoader = false;
          }, 10);
          this.tempSelectedParentReseller = this.resellerList[0].resellerName;
        }
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      });
  }

  checkUserType() {
    if (this.loggedInUserData['isAdmin'] && this.loggedInUserData['parentId']  === 0) {
      return true;
    } else {
      return false;
    }
  }

  find() {
    this.validateAllFormFields(this.findResellerForm);
    this.formErrors = this.validator.validate(this.findResellerForm);
    if (this.findResellerForm.invalid) {
      return;
    }
    this.isLoader = true;
    let paramData = {};
    paramData = this.findResellerForm.value;
    // we have to delete the keyResellerName from the object as the
    // find reseller url does not have this as a parameter
    if (paramData.hasOwnProperty('newResellerName')) {
      delete paramData['newResellerName'];
    }
    this.searchParamsData = paramData;
    this.searchParamsData['PageSize'] = AppSetting.resultsPerPage;
    this.searchParamsData['StartRow'] = this.calculatePageSortRow(this.pager['currentPage'], this.pager['resultPerPage']);
    if (this.previousFindResellerObj !== undefined && this.previousFindResellerObj !== null
      && this.previousFindResellerObj.currentPage !== undefined) {
      this.searchParamsData['SortField'] = this.previousFindResellerObj.SortField;
      this.searchParamsData['Asc'] = this.previousFindResellerObj.Asc;
      this.fetchResellers(this.previousFindResellerObj.currentPage);
      this.previousFindResellerObj = undefined;
    } else {
      this.sortResellers('createdOn', false);
    }
  }

  fetchResellers(pageNumber) {
    if (pageNumber <= 0) {
      return;
    }
    if (this.pager['totalPages'] > 0) {
      if (pageNumber > this.pager['totalPages']) {
        return;
      }
    }
    this.isLoader = true;
    this.searchParamsData['StartRow'] = this.calculatePageSortRow(pageNumber, this.pager['resultPerPage']);
    this.resellerService.findReseller(this.searchParamsData).subscribe(
      (a: any) => {
        if (a.totalRowCount === 0) {
          this.noResultsMessage = 'No results found';
        }
        this.setPager(a, pageNumber);
        this.selectedParentReseller = this.tempSelectedParentReseller;
        this.accordion.findReseller = false;
        this.findClicked = true;
        this.isLoader = false;
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      });
  }

  sortResellers(columnName, orderBy) {
    this.searchResultFlag = false;
    this.resetSortOrder();
    this.searchParamsData['SortField'] = columnName;
    this.searchParamsData['Asc'] = orderBy;
    this.sortColumnOrder[columnName] = !orderBy;
    this.fetchResellers(1);
  }

  resetSortOrder() {
    if (this.searchParamsData['SortField']) {
      delete this.searchParamsData['SortField'];
    }
    if (this.searchParamsData['Asc']) {
      delete this.searchParamsData['Asc'];
    }
    for (const i in this.sortColumnOrder) {
      if (i) {
        this.sortColumnOrder[i] = true;
      }
    }
  }

  initiatePager() {
    this.pager['currentPage'] = 1;
    this.pager['totalPages'] = 0;
    this.pager['resultPerPage'] = AppSetting.resultsPerPage;
    this.pager['totalResults'] = 0;
    this.pager['pages'] = [];
    this.pager['data'] = [];
  }

  setPager(result, pageNumber) {
    const data = result.data;
    const dataCount = result.totalRowCount;
    const pageCount = Math.ceil(dataCount / this.pager['resultPerPage']);
    if (dataCount > 0) {
      this.pager['totalPages'] = pageCount;
      this.pager['results'] = dataCount;
      this.pager['totalResults'] = dataCount;
      this.pager['data'] = data;
      this.pager['currentResults'] = data.length;
      this.pager['currentPage'] = pageNumber;
      this.pager['pages'] = Utilities.getPaginationNumberArray(dataCount, pageNumber, this.pager['resultPerPage']);
      this.searchResultFlag = true;
    } else {
      this.searchResultFlag = false;
      this.initiatePager();
    }
  }

  calculatePageSortRow(pageNumber, resultPerPage) {
    return (((pageNumber * 1 ) - 1) * (resultPerPage * 1 ));
  }
  calculatePageNumberSortRow(pageNumber, resultPerPage) {
    return (((pageNumber * 1 ) - 1) * (resultPerPage * 1 ));
  }

  confirmDelete = (resellerId, parentId) => {
    this.modalService
      .open(new ConfirmModal('Are you sure you want to delete this Reseller?', ''))
      .onApprove(() => this.deleteReseller(resellerId, parentId));
      // .onDeny(() => alert("User has denied."));
  }

  deleteReseller(resellerId, parentId) {
    this.isLoader = true;
    this.resellerService.deleteReseller(resellerId, parentId).subscribe(
    a => {
      this.fetchResellers(1);
      this.isLoader = false;
      this.toastData = this.toasterService.success(MessageSetting.reseller.delete);
    },
    error => {
      const toastMessage = Exception.exceptionMessage(error);
      this.isLoader = false;
      this.toastData = this.toasterService.error(toastMessage.join(', '));
    });
  }

  checkIdenticalSearch(data) {
    if (Object.keys(this.lastSearchObj).length === 0) {
      if (Utilities.compareObject(this.lastSearchObj, data)) {
        return false;
      } else {
        this.lastSearchObj = data;
      }
    } else {
      this.lastSearchObj = data;
    }
    return true;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
        control.markAsDirty({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  clear(controlName) {
    this.findResellerForm.get(controlName).setValue(null);
  }

  clearForm() {
    this.findResellerForm.reset();
    this.findResellerForm.controls['newResellerName'].patchValue(this.resellerList[0].resellerName);
    this.findResellerForm.controls['ParentId'].patchValue(this.resellerList[0].id);
    this.tempSelectedParentReseller = this.resellerList[0].resellerName;
  }
  changeParentReseller(data) {
    this.tempSelectedParentReseller = data.selectedOption.resellerName;
  }

  sort(property) {
    this.isDesc = !this.isDesc; // change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  }

  setPage(page: number) {
    if (page < 1 || page > this.pagerOld.totalPages) {
      return;
    }
    // get pager object from service
    this.pagerOld = this.pagerService.getPager(this.resellerData.length, page);

    // get current page of items
    this.pagedItems = this.resellerData.slice(this.pagerOld.startIndex, this.pagerOld.endIndex + 1);
  }

  handleEnterKeyPress(event) {
    return;
  }

  onViewResellerClick(reseller) {
    let tempObj: any = {};
    tempObj = this.findResellerForm.value;
    tempObj.currentPage = this.pager['currentPage'];
    tempObj.SortField = this.searchParamsData['SortField'];
    tempObj.Asc = this.searchParamsData['Asc'];
    this.resellerService.setFindResellerData(this.findResellerForm.value);
    this.router.navigate([`/reseller/view/${reseller.id}`]);
  }

}
