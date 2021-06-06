import { Component, OnInit } from '@angular/core';
import { DatepickerMode } from 'ng2-semantic-ui';
import { Validator } from 'src/app/common/validation/validator';
import { ValidationSetting } from 'src/app/constant/validation.constant';
import { CommonService } from 'src/app/api/common.service';
import { ToasterService } from 'src/app/api/toaster.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Utilities } from 'src/app/common/utilities';
import { AppSetting } from 'src/app/constant/appsetting.constant';
import { Exception } from 'src/app/common/exceptions/exception';
import { ReportService } from 'src/app/api/report.service';
import { ChannelTypeForReportEnum, ChannelTypeEnum } from 'src/app/enum/channeltypes.enum';
import { TransactionTypeForReport } from 'src/app/enum/transaction-operation.enum';
import { MerchantService } from 'src/app/api/merchant.service';
import * as moment from 'moment';
import { Router, Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction-list-report',
  templateUrl: './transaction-list-report.component.html',
  styleUrls: ['./transaction-list-report.component.css']
})
export class TransactionListReportComponent implements OnInit {
  mode: DatepickerMode = DatepickerMode.Date;
  isLoader: any;
  toastData: any;
  accordion = {
    findTransaction: true
  };
  sortColumnOrder: any = {};
  report: any;
  searchResultFlag = false;
  searchParamsData: any = {};
  loggedInUserData: any = {};
  noResultsMessage = '';
  findClicked = false;
  channelType = ChannelTypeEnum;
  // merchantStatus: any;
  merchantNameList = [];
  channelTypeList: any;
  transactionType = TransactionTypeForReport;

  // pager object
  pager: any = {};
  pagerOld: any = {};
  // paged items
  pagedItems: any[];
  previousFindTransactionObj;
  transactionReportForm: any;
  validator: Validator;
  formErrors = {};

  maxStartDate = new Date();
  minEndDate: any;
  maxEndDate: any;
  fromBackClick = false;

  config = {
    'StartDate': {
      required: { name: ValidationSetting.transaction.find.startDate.name }
    }
    // 'EndDate': {
    //   required: { name: ValidationSetting.transaction.find.endDate.name }
    // }
  };

  constructor(
    private commonService: CommonService,
    private toasterService: ToasterService,
    private merchantService: MerchantService,
    // private formBuilder: FormBuilder,
    private reportService: ReportService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) {
    this.validator = new Validator(this.config);
   }

  ngOnInit() {
    this.channelTypeList = Utilities.enumSelector(ChannelTypeForReportEnum);
    this.transactionReportForm = new FormGroup({
      // tslint:disable-next-line
      StartDate: new FormControl('', [Validators.required]),
      EndDate: new FormControl(''),
      ChannelType : new FormControl('0'),
      MerchantName: new FormControl(0)
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params !== undefined && params.fromBackClick !== undefined && params.fromBackClick === 'true') {
        this.previousFindTransactionObj = this.reportService.getFindTransactionData();
        if (this.previousFindTransactionObj !== undefined) {
          this.fromBackClick = true;
          this.handleBackClick();
        }
      }
    });

    this.initiatePager();
    this.getAllMerchantName();
    this.transactionReportForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  handleBackClick() {
    this.transactionReportForm.controls.StartDate.patchValue(this.previousFindTransactionObj.StartDate);
    this.transactionReportForm.controls.EndDate.patchValue(this.previousFindTransactionObj.EndDate);
    this.transactionReportForm.controls.ChannelType.patchValue(this.previousFindTransactionObj.ChannelType);
    this.transactionReportForm.controls.MerchantName.patchValue(this.previousFindTransactionObj.MerchantName);
    // this.find();
  }

  getAllMerchantName() {
    this.isLoader = true;
    this.merchantService.getAllActiveMerchants().subscribe((response: any) => {
      this.isLoader = false;
      this.merchantNameList = response;
      const obj = {};
      obj['id'] = 0;
      obj['merchantName'] = 'All';
      this.merchantNameList.unshift(obj);
      this.transactionReportForm.controls['MerchantName'].patchValue(0);
      setTimeout(() => {
        if (this.fromBackClick) {
          this.transactionReportForm.controls.MerchantName.patchValue(this.previousFindTransactionObj.MerchantName);
          this.find();
        } else {
          this.transactionReportForm.controls['MerchantName'].patchValue(0);
        }
      }, 100);
      });
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

  find() {
    // this.validateAllFormFields(this.transactionReportForm);
    if (this.transactionReportForm.value.EndDate === '' || this.transactionReportForm.value.EndDate === null) {
      const todaysDate = new Date();
      todaysDate.setHours(0, 0, 0, 0);
      this.transactionReportForm.controls['EndDate'].patchValue(todaysDate);
    }
    this.validateAllFormFields(this.transactionReportForm);
    this.formErrors = this.validator.validate(this.transactionReportForm);
    if (this.transactionReportForm.invalid) {
      return;
    }
    this.getFormDate();
    this.searchParamsData.MerchantId = this.transactionReportForm.value.MerchantName;
    this.searchParamsData.PageSize = AppSetting.reportResultsPerPage;
    this.searchParamsData.StartRow = this.calculatePageSortRow(this.pager.currentPage, this.pager.resultPerPage);
    // this.findReport(1);
    if (this.fromBackClick && this.previousFindTransactionObj.currentPage !== undefined) {
      this.findReport(this.previousFindTransactionObj.currentPage);
      this.previousFindTransactionObj = undefined;
      this.fromBackClick = false;
    } else {
      this.findReport(1);
    }
  }

  getFormDate() {
    this.searchParamsData.fromdate = this.transactionReportForm.value.StartDate;
    this.searchParamsData.todate = this.transactionReportForm.value.EndDate;
    this.sortTransactions('TransactionDate', false);
    this.searchParamsData.exportToCsv = false;
    if (this.searchParamsData.fromdate !== undefined && this.searchParamsData.fromdate !== null
      && this.searchParamsData.fromdate !== '') {
        this.searchParamsData.fromdate = new Date(
          this.searchParamsData.fromdate.getTime() - this.searchParamsData.fromdate.getTimezoneOffset() * 60000
        ).toISOString();
      }



    if (this.searchParamsData.todate !== undefined && this.searchParamsData.todate !== null
      && this.searchParamsData.todate !== '') {
      this.searchParamsData.todate = new Date(
        this.searchParamsData.todate.getTime() - this.searchParamsData.todate.getTimezoneOffset() * 60000
      ).toISOString();
    }

    if (this.searchParamsData.todate === '') {
      const todaysDate = new Date();
      this.searchParamsData.todate = new Date(
        todaysDate.getTime() - todaysDate.getTimezoneOffset() * 60000
      ).toISOString();
      this.transactionReportForm.controls['MerchantName'].patchValue(todaysDate.getTime());
    }
  }

  onValueChanged(data?: any) {
    if (!this.transactionReportForm) {
      return;
    }
    // this.formErrors = this.validator.validate(this.transactionReportForm);

    if (this.transactionReportForm.controls.StartDate.value) {
      this.minEndDate = this.transactionReportForm.controls.StartDate.value;
    }
    if (this.transactionReportForm.controls.EndDate.value) {
      this.maxStartDate = this.transactionReportForm.controls.EndDate.value;
    }
  }

  sortTransactions(columnName, orderBy) {
    this.searchResultFlag = false;
    this.resetSortOrder();
    this.searchParamsData.SortField = columnName;
    this.searchParamsData.Asc = orderBy;
    this.sortColumnOrder[columnName] = !orderBy;
    // this.findReport(1);
  }

  findReport(pageNumber) {
    if (pageNumber <= 0) {
      return;
    }
    if (this.pager.totalPages > 0) {
      if (pageNumber > this.pager.totalPages) {
        return;
      }
    }
    this.searchParamsData.StartRow = this.calculatePageSortRow(pageNumber, this.pager.resultPerPage);
    this.isLoader = true;
    this.searchParamsData.ChannelType = this.transactionReportForm.value.ChannelType;
    this.reportService.getTransactionListReport(this.searchParamsData).subscribe(
      (response: any) => {
        this.setPager(response, pageNumber);
        this.report = response.data;
        // this.searchResultFlag = true;
        if (this.report.length > 0) {
          this.searchResultFlag = true;
        } else {
          this.searchResultFlag = false;
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

  setPager(result, pageNumber) {
    const data = result;
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

  initiatePager() {
    this.pager.currentPage = 1;
    this.pager.totalPages = 0;
    this.pager.resultPerPage = AppSetting.reportResultsPerPage;
    this.pager.totalResults = 0;
    this.pager.pages = [];
    this.pager.data = [];
  }

  onViewTransactionClick(transaction) {
    let tempObj: any = {};
    tempObj = this.transactionReportForm.value;
    tempObj.currentPage = this.pager['currentPage'];
    this.reportService.setFindTransactionData(tempObj);
    if (transaction.channelType === 'CC') {
      this.router.navigate([`/report/view-transaction-report/credit/${transaction.txnIdentifier}/${transaction.merchantId}`]);
    } else if (transaction.channelType === 'DC') {
      this.router.navigate([`/report/view-transaction-report/debit/${transaction.txnIdentifier}/${transaction.merchantId}`]);
    } else if (transaction.channelType === 'ACH') {
      this.router.navigate([`/report/view-transaction-report/ach/${transaction.txnIdentifier}/${transaction.merchantId}`]);
    }
  }

  calculatePageSortRow(pageNumber, resultPerPage) {
    return (((pageNumber * 1) - 1) * (resultPerPage * 1));
  }
  calculatePageNumberSortRow(pageNumber, resultPerPage) {
    return (((pageNumber * 1) - 1) * (resultPerPage * 1));
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

  // getFormattedDate(date) {
  //   const d = this.commonService.getFormattedDate(date);
  //   // const t = this.commonService.getFormattedTime(date);
  //    return d;
  // }

  download(fileType) {
    if (fileType === 'pdf') {
      this.downloadToPdf();
    }
    if (fileType === 'csv') {
      this.downloadToCsv();
    }
  }

  downloadToCsv() {
    this.isLoader = true;
    const searchParamsData = this.getFormDateforcsv();
    this.reportApi(searchParamsData, 'csv');
  }

  downloadToPdf() {
    this.isLoader = true;
    const searchParamsData = this.getFormDateforcsv();
    this.reportApi(searchParamsData, 'pdf');
  }

  reportApi(searchParamsData, downloadFormat) {
    this.reportService.getTransactionListReporttoCsv(searchParamsData).subscribe(
      (response: any) => {
        if (downloadFormat === 'csv') {
          if (Utilities.exportToCsv(response.data, 'Transaction_List_Report.csv')) {
            this.isLoader = false;
          }
        }
        if (downloadFormat === 'pdf') {
          const pdfdata = Utilities.exportToPdf(response.data, 'Transaction_List_Report.csv');
          if (pdfdata) {
            const filters = this.getDate(searchParamsData);
            Utilities.pdf(pdfdata, filters, 'Transaction_List_Report.pdf');
            this.isLoader = false;
          }
        }
      });
  }

  getFormDateforcsv() {
    const searchParamsData: any = {};
    searchParamsData.fromdate = this.transactionReportForm.value.StartDate;
    searchParamsData.todate = this.transactionReportForm.value.EndDate;
    searchParamsData.MerchantId = this.transactionReportForm.value.MerchantName;
    // this.sortTransactions('TransactionDate', true);
    searchParamsData.exportToCsv = true;
    if (searchParamsData.fromdate !== undefined && searchParamsData.fromdate !== null
      && searchParamsData.fromdate !== '') {
        searchParamsData.fromdate = new Date(
          searchParamsData.fromdate.getTime() - searchParamsData.fromdate.getTimezoneOffset() * 60000
        ).toISOString();
      }



    if (searchParamsData.todate !== undefined && searchParamsData.todate !== null
      && searchParamsData.todate !== '') {
      searchParamsData.todate = new Date(
        searchParamsData.todate.getTime() - searchParamsData.todate.getTimezoneOffset() * 60000
      ).toISOString();
    }

    if (searchParamsData.todate === '') {
      const todaysDate = new Date();
      searchParamsData.todate = new Date(
        todaysDate.getTime() - todaysDate.getTimezoneOffset() * 60000
      ).toISOString();
      this.transactionReportForm.controls['MerchantName'].patchValue(todaysDate.getTime());
    }
    searchParamsData.SortField = 'TransactionDate';
    searchParamsData.Asc = false;
    searchParamsData.exportToCsv = true;
    return searchParamsData;
  }

  setDecimal(amount) {
    if (amount) {
      return Number(amount).toFixed(2);
    } else {
      return '';
    }
  }

  clear() {
    this.transactionReportForm.reset();
    this.transactionReportForm.patchValue({'ChannelType': '0'});
    this.transactionReportForm.patchValue({'MerchantName': 0});
  }

  getFormattedDate(date) {
    if (date) {
      const localDate = moment.utc(date).local();
      const d = this.commonService.getFormattedDate(localDate['_d']);
      const t = this.commonService.getFormattedTime(localDate['_d']);
       return d + ' ' + t;
    } else {
      return null;
    }
  }

  getDate(searchParamData: any) {
    const searchParamDataforPdf: any = {};
    searchParamDataforPdf.fromdate = this.commonService.getFormattedDate(moment.utc(searchParamData.fromdate).local()['_d']);
    searchParamDataforPdf.todate = this.commonService.getFormattedDate(moment.utc(searchParamData.todate).local()['_d']);
    searchParamDataforPdf.merchantName =  this.merchantNameList.filter(
      v => v.id === this.transactionReportForm.controls['MerchantName'].value)[0].merchantName;
      searchParamDataforPdf.cardType = this.channelTypeList[this.transactionReportForm.controls['ChannelType'].value].title;
    return searchParamDataforPdf;
  }
}
