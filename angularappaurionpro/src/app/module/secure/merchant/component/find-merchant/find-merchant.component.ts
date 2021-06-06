import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

import { MerchantService } from '../../../../../api/merchant.service';
import { CommonService } from '../../../../../api/common.service';
import { ToasterService } from '../../../../../api/toaster.service';
import { MessageSetting } from '../../../../../constant/message-setting.constant';
import { StorageType } from '../../../../../common/session/storage.enum';
import { StorageService } from '../../../../../common/session/storage.service';
import { Validator } from '../../../../../common/validation/validator';
import { Utilities } from '../../../../../common/utilities';
import { ValidationSetting } from '../../../../../constant/validation.constant';
import { PagerService } from '../../../../../api/pager.service';
import { AppSetting } from '../../../../../constant/appsetting.constant';
import { ConfirmModalComponent } from '../../../../common/modal/modal.component';
import { ComponentModalConfig, ModalSize, SuiModalService } from 'ng2-semantic-ui';
import { Router, ActivatedRoute, Params } from '../../../../../../../node_modules/@angular/router';
import { Exception } from '../../../../../common/exceptions/exception';
import * as moment from 'moment';

@Component({
  selector: 'app-find-merchant',
  templateUrl: './find-merchant.component.html',
  styleUrls: ['./find-merchant.component.css'],
  providers: [ToasterService, StorageService, CommonService, PagerService]
})
export class FindMerchantComponent implements OnInit {
  findMerchantForm: any;
  isLoader: any;
  toastData: any;
  validator: Validator;
  formErrors = {};
  resellerList = [];
  merchantData = [];
  selectedMerchant = '';
  tempSelectedMerchant = '';
  loggedInUserData: any = {};

  dtOptions: DataTables.Settings = {};
  direction: number;
  isDesc: boolean = false;
  column: string = 'CategoryName';
  lastSearchObj = {};
  searchParamsData = {};
  sortColumnOrder = {};
  // pager object
  pager: any = {};
  pagerOld: any = {};
  searchResultFlag: boolean = false;
  // paged items
  pagedItems: any[];
  noResultsMessage: string = '';
  previousFindMerchantObj;
  findClicked = false;
  inputValidation = ValidationSetting;  // used for maxlength in HTML
  accordion = {
    findMerchant: true
  };
  truncateWordLength = AppSetting.truncateWordLength;
  fromBackClick = false;

  // validation config
  config = {
    'ParentId': { required: { name: ValidationSetting.merchant.find.resellerName.name }},
    'MerchantName': { pattern: { name: ValidationSetting.merchant.find.companyName.name }},
    'FirstName': { pattern: { name: ValidationSetting.merchant.find.firstName.name}},
    'LastName': { pattern: { name: ValidationSetting.merchant.find.lastName.name}},
    'Phone': {
      minlength: {name: ValidationSetting.merchant.find.phone.name, min: ValidationSetting.merchant.find.phone.minLength.toString()},
      pattern: { name: ValidationSetting.merchant.find.phone.name }
    },
    'Email': { pattern: { name: ValidationSetting.merchant.add.email.name }},
    'City': { pattern: { name: ValidationSetting.merchant.find.city.name }},
    'PostalCode': {}
  };

  constructor(private formBuilder: FormBuilder,
    private pagerService: PagerService,
    private merchantService: MerchantService,
    private toasterService: ToasterService,
    private storageService: StorageService,
    private commonService: CommonService,
    private modalService: SuiModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.validator = new Validator(this.config);
    this.loggedInUserData = JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
  }

  ngOnInit() {
    this.findMerchantForm = this.formBuilder.group({
      'ParentId': ['', []],
      'newResellerName': ['', []], // this filed was added to handle the global and resellername field
      'FirstName': ['', [Validators.pattern(ValidationSetting.firstNameLastName_regex)]],
      'LastName': ['', [Validators.pattern(ValidationSetting.firstNameLastName_regex)]],
      'MerchantName': ['', [Validators.pattern(ValidationSetting.alphanumericWithSpace_regex)]],
      'Phone': ['', [Validators.minLength(ValidationSetting.merchant.find.phone.minLength), Validators.pattern(ValidationSetting.numbersOnly_regex)]],
      'Email': ['', [Validators.pattern(ValidationSetting.email_regex)]],
      'City': ['', [Validators.pattern(ValidationSetting.charactersOnlyWithSpace_regex)]],
      'PostalCode': ['', []],
    });
    this.findMerchantForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.getResellerList();
    this.sortColumnOrder['MerchantName'] = true;
    this.sortColumnOrder['LastName'] = true;
    this.sortColumnOrder['FirstName'] = true;
    this.sortColumnOrder['Email'] = true;
    this.sortColumnOrder['IsActive'] = true;
    this.sortColumnOrder['createdOn'] = true;

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params !== undefined && params.fromBackClick !== undefined && params.fromBackClick === 'true') {
        this.previousFindMerchantObj = this.merchantService.getFindMerchantData();
        this.merchantService.setFindMerchantData(undefined);
        if (this.previousFindMerchantObj !== undefined) {
          this.fromBackClick = true;
          this.handleBackClick();
        }
      }
    });

    this.initiatePager();
  }

  onValueChanged(data?: any) {
    if (!this.findMerchantForm) {
      return;
    }
    this.formErrors = this.validator.validate(this.findMerchantForm);
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
    this.findMerchantForm.controls['newResellerName'].patchValue(this.previousFindMerchantObj.newResellerName);
    this.findMerchantForm.controls['FirstName'].patchValue(this.previousFindMerchantObj.FirstName);
    this.findMerchantForm.controls['LastName'].patchValue(this.previousFindMerchantObj.LastName);
    this.findMerchantForm.controls['MerchantName'].patchValue(this.previousFindMerchantObj.MerchantName);
    this.findMerchantForm.controls['Phone'].patchValue(this.previousFindMerchantObj.Phone);
    this.findMerchantForm.controls['Email'].patchValue(this.previousFindMerchantObj.Email);
    this.findMerchantForm.controls['City'].patchValue(this.previousFindMerchantObj.City);
    this.findMerchantForm.controls['PostalCode'].patchValue(this.previousFindMerchantObj.PostalCode);
    // temp code need to remove setTimeout
    setTimeout(() => {
      this.findMerchantForm.controls['ParentId'].patchValue(this.previousFindMerchantObj.ParentId);
      this.tempSelectedMerchant = this.resellerList.filter(
        (x): any => x.id == this.previousFindMerchantObj.ParentId
      )[0].resellerName;
      this.find();
    }, 10);
  }

  getResellerList() {
    this.isLoader = true;
    const parentId = 1;
    this.merchantService.getResellerList(parentId).subscribe(
      a => {
        if (this.loggedInUserData.parentId === 0) { // global user
          this.resellerList = this.merchantService.addSuperAdminToResellerList(a['data']);
        } else {
          this.resellerList.push(a);
          this.findMerchantForm.controls['newResellerName'].patchValue(this.resellerList[0].resellerName);
        }

        if (this.previousFindMerchantObj !== undefined && this.previousFindMerchantObj !== null && this.previousFindMerchantObj.ParentId != undefined) {
          this.handleBackClick();
        } else {
          // temp code need to remove setTimeout
          setTimeout(() => {
            this.findMerchantForm.controls['ParentId'].patchValue(this.resellerList[0].id);
            this.isLoader = false;
          }, 10);
          this.tempSelectedMerchant = this.resellerList[0].resellerName;
        }
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      });
  }

  find() {
    this.validateAllFormFields(this.findMerchantForm);
    this.formErrors = this.validator.validate(this.findMerchantForm);
    if (this.findMerchantForm.invalid) {
      return;
    }
    this.isLoader = true;
    let paramData = {};
    paramData = this.findMerchantForm.value;
    this.searchParamsData = paramData;
    this.searchParamsData['PageSize'] = AppSetting.resultsPerPage;
    this.searchParamsData['StartRow'] = this.calculatePageSortRow(this.pager['currentPage'], this.pager['resultPerPage']);
    if (this.previousFindMerchantObj !== undefined && this.previousFindMerchantObj !== null
      && this.previousFindMerchantObj.currentPage !== undefined) {
        this.searchParamsData['SortField'] = this.previousFindMerchantObj.SortField;
      this.searchParamsData['Asc'] = this.previousFindMerchantObj.Asc;
      this.fetchMerchants(this.previousFindMerchantObj.currentPage);
      this.previousFindMerchantObj = undefined;
    } else {
      this.sortMerchants('createdOn', false);
    }
  }

  fetchMerchants(pageNumber) {
    if (pageNumber <= 0) {
      return;
    }
    if (this.pager['totalPages'] > 0) {
      if (pageNumber > this.pager['totalPages']) {
        return;
      }
    }
    // delete this.searchParamsData['newResellerName'];
    this.searchParamsData['StartRow'] = this.calculatePageSortRow(pageNumber, this.pager['resultPerPage']);
    this.isLoader = true;
    this.merchantService.findMerchant(this.searchParamsData).subscribe(
      (a: any) => {
        if (a.totalRowCount === 0) {
          this.noResultsMessage = 'No results found';
        }
        this.setPager(a, pageNumber);
        this.selectedMerchant = this.tempSelectedMerchant;
        this.accordion.findMerchant = false;
        this.findClicked = true;
        this.isLoader = false;
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      });

  }

  sortMerchants(columnName, orderBy) {
    this.searchResultFlag = false;
    this.resetSortOrder();
    this.searchParamsData['SortField'] = columnName;
    this.searchParamsData['Asc'] = orderBy;

    this.sortColumnOrder[columnName] = !orderBy;
    this.fetchMerchants(1);
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
    return (((pageNumber * 1) - 1) * (resultPerPage * 1));
  }
  calculatePageNumberSortRow(pageNumber, resultPerPage) {
    return (((pageNumber * 1) - 1) * (resultPerPage * 1));
  }

  confirmDelete = (merchantId, resellerId) => {
    this.modalService
      .open(new ConfirmModal('Are you sure you want to delete this Merchant?', ''))
      .onApprove(() => this.deleteMerchant(merchantId, resellerId));
  }

  deleteMerchant(merchantId, resellerId) {
    this.isLoader = true;
    this.merchantService.deleteMerchant(merchantId, resellerId).subscribe(
      a => {
        this.fetchMerchants(1);
        this.isLoader = false;
        this.toastData = this.toasterService.success(MessageSetting.merchant.delete);
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
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  clear(controlName) {
    this.findMerchantForm.get(controlName).setValue(null);
  }

  clearForm() {
    this.findMerchantForm.reset();
    this.findMerchantForm.controls['newResellerName'].patchValue(this.resellerList[0].resellerName);
    this.findMerchantForm.controls['ParentId'].patchValue(this.resellerList[0].id);
    this.tempSelectedMerchant = this.resellerList[0].resellerName;
  }
  changeReseller(data) {
    this.tempSelectedMerchant = data.selectedOption.resellerName;
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
    this.pagerOld = this.pagerService.getPager(this.merchantData.length, page);

    // get current page of items
    this.pagedItems = this.merchantData.slice(this.pagerOld.startIndex, this.pagerOld.endIndex + 1);
  }

  handleEnterKeyPress(event) {
    return;
  }

  onViewMerchantClick(data) {
    let tempObj: any = {};
    tempObj = this.findMerchantForm.value;
    tempObj.currentPage = this.pager['currentPage'];
    tempObj.SortField = this.searchParamsData['SortField'];
    tempObj.Asc = this.searchParamsData['Asc'];
    this.merchantService.setFindMerchantData(this.findMerchantForm.value);
    this.router.navigate([`/merchant/view/${data.resellerId}/${data.id}`], { skipLocationChange: true });
  }

}

interface IConfirmModalContext {
  question: string;
  title?: string;
}

export class ConfirmModal extends ComponentModalConfig<IConfirmModalContext, void, void> {
  constructor(question: string, title?: string) {
    super(ConfirmModalComponent, { question, title });

    this.isClosable = false;
    this.transitionDuration = 200;
    this.size = ModalSize.Small;
  }
}

