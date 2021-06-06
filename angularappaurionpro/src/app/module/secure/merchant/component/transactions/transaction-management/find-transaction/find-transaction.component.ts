import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { DatepickerMode } from 'ng2-semantic-ui';

import { TransactionService } from '../../../../../../../api/transaction.service';
import { StorageService } from '../../../../../../../common/session/storage.service';
import { PagerService } from '../../../../../../../api/pager.service';
import { CommonService } from '../../../../../../../api/common.service';
import { StorageType } from '../../../../../../../common/session/storage.enum';
import { Validator } from '../../../../../../../common/validation/validator';
import { ValidationSetting } from '../../../../../../../constant/validation.constant';
import { TransactionStatusEnum } from '../../../../../../../enum/transaction-status.enum';
import { TransactionStatusMapEnum } from '../../../../../../../enum/transaction-status-map.enum';
import { ChannelTypeEnum } from '../../../../../../../enum/channeltypes.enum';
import { AppSetting } from '../../../../../../../constant/appsetting.constant';
import { Utilities } from '../../../../../../../common/utilities';
import { TransactionOperationEnum } from '../../../../../../../enum/transaction-operation.enum';
import { TransactionOperationMapEnum } from '../../../../../../../enum/transaction-operation-map.enum';
import { Exception } from '../../../../../../../common/exceptions/exception';
import { ToasterService } from '../../../../../../../api/toaster.service';
import { Router, Params, ActivatedRoute } from '../../../../../../../../../node_modules/@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-find-transaction',
  templateUrl: './find-transaction.component.html',
  styleUrls: ['./find-transaction.component.css'],
  providers: [PagerService]
})
export class FindTransactionComponent implements OnInit {
  mode: DatepickerMode = DatepickerMode.Date;
  isLoader: any;
  toastData: any;
  loggedInUserData: any = {};
  validator: Validator;
  findTransactionForm: any;
  formErrors = {};
  accordion = {
    findTransaction: true
  };
  maxStartDate: any;
  minEndDate: any;
  maxEndDate: any;
  transactionList: any;
  searchResultFlag = false;
  noResultsMessage = '';
  transactionCategory: any;

  searchParamsData: any = {};
  sortColumnOrder: any = {};
  isDesc = false;
  column = 'CategoryName';
  direction: number;
  // pager object
  pager: any = {};
  pagerOld: any = {};
  // paged items
  pagedItems: any[];
  findClicked = false;
  previousFindTransactionObj;
  fromBackClick = false;

  config = {
    'StartDate': {
      required: { name: ValidationSetting.transaction.find.startDate.name }
    }
  };

  constructor(private transactionService: TransactionService,
    private storageService: StorageService,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    private pagerService: PagerService,
    private commonService: CommonService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
      if (window.location.hash === '#/merchant/findtransaction/credit' || window.location.hash === '#/merchant/findtransaction/credit/true') {
        this.transactionCategory = 'credit';
      } else if (window.location.hash === '#/merchant/findtransaction/debit' || window.location.hash === '#/merchant/findtransaction/debit/true') {
        this.transactionCategory = 'debit';
      } else {
        this.transactionCategory = 'ach';
      }
      this.validator = new Validator(this.config);
      this.loggedInUserData = JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
      this.maxStartDate = new Date();
      this.maxEndDate = new Date();
  }

  ngOnInit() {
    this.findTransactionForm = this.formBuilder.group({
      'StartDate': ['', [Validators.required]],
      'EndDate': []
    });
    this.findTransactionForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.sortColumnOrder.TransactionId = true;
    this.sortColumnOrder.CustomerId = true;
    this.sortColumnOrder.TransactionDate = true;
    this.sortColumnOrder.CardType = true;
    this.sortColumnOrder.Card = true;
    this.sortColumnOrder.Name = true;
    this.sortColumnOrder.operationType = true;
    this.sortColumnOrder.transactionStatus = true;
    this.sortColumnOrder.Amount = true;
    this.sortColumnOrder.authCode = true;

    this.initiatePager();

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params !== undefined && params.fromBackClick !== undefined && params.fromBackClick === 'true') {
        this.previousFindTransactionObj = this.transactionService.getFindTransactionData();
        this.transactionService.setFindTransactionData(undefined);
        if (this.previousFindTransactionObj !== undefined) {
          this.fromBackClick = true;
          this.handleBackClick();
        }
      }
    });

    // // Temp Fix for Demo As discussed with Biswas
    // const temp = new Date();
    // this.findTransactionForm.controls['StartDate'].patchValue(temp);

  }

  onValueChanged(data?: any) {
    if (!this.findTransactionForm) {
      return;
    }
    this.formErrors = this.validator.validate(this.findTransactionForm);

    if (this.findTransactionForm.controls.StartDate.value) {
      this.minEndDate = this.findTransactionForm.controls.StartDate.value;
    }
    if (this.findTransactionForm.controls.EndDate.value) {
      this.maxStartDate = this.findTransactionForm.controls.EndDate.value;
    }
  }

  // get date in mm-dd-yyyy format
  getFormattedDate(date) {
    const localDate = moment.utc(date).local();
    const d = this.commonService.getFormattedDate(localDate['_d']);
    const t = this.commonService.getFormattedTime(localDate['_d']);
     return d + ' ' + t;
  }

  findTransaction(pageNumber) {
    if (pageNumber <= 0) {
      return;
    }
    if (this.pager.totalPages > 0) {
      if (pageNumber > this.pager.totalPages) {
        return;
      }
    }
    const parentId = this.loggedInUserData.parentId;
    this.searchParamsData.StartRow = this.calculatePageSortRow(pageNumber, this.pager.resultPerPage);
    this.isLoader = true;
    this.transactionService.findTransaction(parentId, this.searchParamsData).subscribe(
      (response: any) => {
        this.setPager(response, pageNumber);
        this.transactionList = response.data;
        if (this.transactionList) {
          this.searchResultFlag = true;
          this.transactionList.forEach(element => {
            element.transactionStatus = TransactionStatusMapEnum[TransactionStatusEnum[element.transactionStatus]];
            element.operationType = TransactionOperationMapEnum[TransactionOperationEnum[element.operationType]];
          });
        } else {
          this.noResultsMessage = 'No results found';
        }
        this.accordion.findTransaction = false;
        this.findClicked = true;
        this.isLoader = false;
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      });
  }

  find() {
    this.validateAllFormFields(this.findTransactionForm);
    this.formErrors = this.validator.validate(this.findTransactionForm);
    if (this.findTransactionForm.invalid) {
      return;
    }
    this.searchParamsData.StartDate = this.findTransactionForm.value.StartDate;
    this.searchParamsData.EndDate = this.findTransactionForm.value.EndDate;

    if (window.location.hash === '#/merchant/findtransaction/credit' || window.location.hash === '#/merchant/findtransaction/credit/true') {
      this.searchParamsData.channelType = ChannelTypeEnum.CreditCard;
    } else if (window.location.hash === '#/merchant/findtransaction/debit' || window.location.hash === '#/merchant/findtransaction/debit/true') {
      this.searchParamsData.channelType = ChannelTypeEnum.DebitCard;
    } else {
      this.searchParamsData.channelType = ChannelTypeEnum.ACH;
    }
    if (this.searchParamsData.StartDate !== undefined && this.searchParamsData.StartDate !== null
      && this.searchParamsData.StartDate !== '') {
      this.searchParamsData.StartDate = new Date(
        this.searchParamsData.StartDate.getTime() - this.searchParamsData.StartDate.getTimezoneOffset() * 60000
      ).toISOString();
    }
    if (this.searchParamsData.EndDate !== undefined && this.searchParamsData.EndDate !== null && this.searchParamsData.EndDate !== '') {
      this.searchParamsData.EndDate = new Date(
        this.searchParamsData.EndDate.getTime() - this.searchParamsData.EndDate.getTimezoneOffset() * 60000
      ).toISOString();
    }
    this.searchParamsData.PageSize = AppSetting.resultsPerPage;
    this.searchParamsData.StartRow = this.calculatePageSortRow(this.pager.currentPage, this.pager.resultPerPage);

    if (this.previousFindTransactionObj !== undefined && this.previousFindTransactionObj !== null
      && this.previousFindTransactionObj.currentPage !== undefined) {
      this.findTransaction(this.previousFindTransactionObj.currentPage);
      this.previousFindTransactionObj = undefined;
    } else {
      this.sortTransactions('TransactionDate', false);
    }
  }

  clearForm() {
    this.findTransactionForm.reset();
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

  handleBackClick() {
    this.findTransactionForm.controls.StartDate.patchValue(this.previousFindTransactionObj.StartDate);
    this.findTransactionForm.controls.EndDate.patchValue(this.previousFindTransactionObj.EndDate);
    this.searchParamsData.SortField = this.previousFindTransactionObj.SortField;
    this.searchParamsData.Asc = this.previousFindTransactionObj.Asc;
    this.find();
  }

  onViewTransactionClick(transaction) {
    let tempObj: any = {};
    tempObj = this.findTransactionForm.value;
    tempObj.currentPage = this.pager['currentPage'];
    tempObj.SortField = this.searchParamsData.SortField;
    tempObj.Asc = this.searchParamsData.Asc;
    this.transactionService.setFindTransactionData(tempObj);
    if (transaction.channelType === parseInt(ChannelTypeEnum.CreditCard.toString(), 10)) {
      this.router.navigate([`/merchant/viewtransaction/credit/${transaction.transactionId}`]);
    } else if (transaction.channelType === parseInt(ChannelTypeEnum.DebitCard.toString(), 10)) {
      this.router.navigate([`/merchant/viewtransaction/debit/${transaction.transactionId}`]);
    } else if (transaction.channelType === parseInt(ChannelTypeEnum.ACH.toString(), 10)) {
      this.router.navigate([`/merchant/viewtransaction/ach/${transaction.transactionId}`]);
    }
  }

  sortTransactions(columnName, orderBy) {
    this.searchResultFlag = false;
    this.resetSortOrder();
    this.searchParamsData.SortField = columnName;
    this.searchParamsData.Asc = orderBy;
    this.sortColumnOrder[columnName] = !orderBy;
    this.findTransaction(1);
  }

  resetSortOrder() {
    if (this.searchParamsData.SortField) {
      delete this.searchParamsData.SortField;
    }
    if (this.searchParamsData.Asc) {
      delete this.searchParamsData.Asc;
    }
    for (const i in this.sortColumnOrder) {
      if (i) {
        this.sortColumnOrder[i] = true;
      }
    }
  }

  initiatePager() {
    this.pager.currentPage = 1;
    this.pager.totalPages = 0;
    this.pager.resultPerPage = AppSetting.resultsPerPage;
    this.pager.totalResults = 0;
    this.pager.pages = [];
    this.pager.data = [];
  }

  setPager(result, pageNumber) {
    const data = result.data;
    const dataCount = result.totalRowCount;
    const pageCount = Math.ceil(dataCount / this.pager.resultPerPage);
    if (dataCount > 0) {
      this.pager.totalPages = pageCount;
      this.pager.results = dataCount;
      this.pager.totalResults = dataCount;
      this.pager.data = data;
      this.pager.currentResults = data.length;
      this.pager.currentPage = pageNumber;
      this.pager.pages = Utilities.getPaginationNumberArray(dataCount, pageNumber, this.pager.resultPerPage);
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
    this.pagerOld = this.pagerService.getPager(this.transactionList.length, page);

    // get current page of items
    this.pagedItems = this.transactionList.slice(this.pagerOld.startIndex, this.pagerOld.endIndex + 1);
  }


}
