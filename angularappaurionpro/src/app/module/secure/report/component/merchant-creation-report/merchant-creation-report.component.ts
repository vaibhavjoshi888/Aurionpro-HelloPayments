import { Component, OnInit } from '@angular/core';
import { DatepickerMode } from 'ng2-semantic-ui';
import { Validator } from 'src/app/common/validation/validator';
import { ValidationSetting } from 'src/app/constant/validation.constant';
import { CommonService } from 'src/app/api/common.service';
import { ToasterService } from 'src/app/api/toaster.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Utilities } from 'src/app/common/utilities';
import { AppSetting } from 'src/app/constant/appsetting.constant';
import { Exception } from 'src/app/common/exceptions/exception';
import { MerchantStatusEnum } from 'src/app/enum/merchant-status.enum';
import { ReportService } from 'src/app/api/report.service';
import * as moment from 'moment';

@Component({
  selector: 'app-merchant-creation-report',
  templateUrl: './merchant-creation-report.component.html',
  styleUrls: ['./merchant-creation-report.component.css']
})
export class MerchantCreationReportComponent implements OnInit {
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
  channelType = 'creditCard';
  merchantStatus: any;

  // pager object
  pager: any = {};
  pagerOld: any = {};
  // paged items
  pagedItems: any[];
  previousFindTransactionObj;
  transactionReportForm: any;
  validator: Validator;
  formErrors = {};
  merchantType =  'Created';

  maxStartDate = new Date();
  minEndDate: any;
  maxEndDate: any;

  config = {
    'StartDate': {
      required: { name: ValidationSetting.transaction.find.startDate.name }
    },
  };

  constructor(
    private commonService: CommonService,
    private toasterService: ToasterService,
    // private formBuilder: FormBuilder,
    private reportService: ReportService
    ) {
    this.validator = new Validator(this.config);
   }

  ngOnInit() {
    this.merchantStatus = Utilities.enumSelector(MerchantStatusEnum);
    this.transactionReportForm = new FormGroup({
      // tslint:disable-next-line
      StartDate: new FormControl('', [Validators.required]),
      EndDate: new FormControl(''),
      isActive: new FormControl(false)
      // merchantType : new FormControl(false),
    });
    this.initiatePager();
    this.transactionReportForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    if (!this.transactionReportForm) {
      return;
    }
    this.formErrors = this.validator.validate(this.transactionReportForm);

    if (this.transactionReportForm.controls.StartDate.value) {
      this.minEndDate = this.transactionReportForm.controls.StartDate.value;
    }
    if (this.transactionReportForm.controls.EndDate.value !== '' &&
    this.transactionReportForm.controls.EndDate.value !== undefined) {
      this.maxStartDate = this.transactionReportForm.controls.EndDate.value;
    }
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
    // const value = this.transactionReportForm.value;
    if (this.transactionReportForm.value.EndDate === '') {
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
    // merchantcreated = 'Merchant Created',
    // merchantActivated = 'Merchant Activated',
    // let activeMerchantOnly = false;
    // if (this.transactionReportForm.value.merchantStatus === 'merchantcreated') {
    //   activeMerchantOnly = false;
    // }
    // if (this.transactionReportForm.value.merchantStatus === 'merchantActivated') {
    //   activeMerchantOnly = true;
    // }
    // this.searchParamsData.isActive = activeMerchantOnly;
    this.searchParamsData.PageSize = AppSetting.reportResultsPerPage;
    this.searchParamsData.StartRow = this.calculatePageSortRow(this.pager.currentPage, this.pager.resultPerPage);
    this.findReport(1);
  }

  getFormDate() {
    this.searchParamsData.fromdate = this.transactionReportForm.value.StartDate;
    this.searchParamsData.todate = this.transactionReportForm.value.EndDate;
    this.searchParamsData.exportToCsv = false;
    this.sortTransactions('Name', true);
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
    this.reportService.getMerchantCreationReport(this.searchParamsData).subscribe(
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

  // downloadToCsv() {
  //   this.isLoader = true;
  //   const searchParamsData = this.getFormDateforcsv();
  //   this.reportService.getMerchantCreationReporttoCsv(searchParamsData).subscribe(
  //     (response: any) => {
  //       // this.isLoader = false;
  //       // Utilities.exportToCsv(response.data, 'Merchant_Creation_Report.csv');
  //       if (Utilities.exportToCsv(response.data, 'Merchant_Creation_Report.csv')) {
  //         this.isLoader = false;
  //       }
  //     });
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
    this.reportService.getMerchantCreationReporttoCsv(searchParamsData).subscribe(
      (response: any) => {
        if (downloadFormat === 'csv') {
          if (Utilities.exportToCsv(response.data, 'Merchant_Creation_Report.csv')) {
            this.isLoader = false;
          }
        }
        if (downloadFormat === 'pdf') {
          const pdfdata = Utilities.exportToPdf(response.data, 'Merchant_Creation_Report.csv');
          if (pdfdata) {
            const filters = this.getDate(searchParamsData);
            Utilities.pdf(pdfdata, filters, 'Merchant_Creation_Report.pdf');
            this.isLoader = false;
          }
        }
      });
  }

  setMerchantType(value) {

    if (value === 'Created') {
      this.searchParamsData.isActive = false;
      this.transactionReportForm.controls['MerchantName'].patchValue(this.searchParamsData.isActive);
    }
    if (value === 'Activated') {
      this.searchParamsData.isActive = true;
      this.transactionReportForm.controls['MerchantName'].patchValue(this.searchParamsData.isActive);
    }
  }

  getFormDateforcsv() {
    const searchParamsData: any = {};
    searchParamsData.fromdate = this.transactionReportForm.value.StartDate;
    searchParamsData.todate = this.transactionReportForm.value.EndDate;
    searchParamsData.Asc = false;
    searchParamsData.SortField = 'Name';
    searchParamsData.isActive = this.searchParamsData.isActive;
    // this.sortTransactions('Name', true);
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
      // this.transactionReportForm.controls['MerchantName'].patchValue(todaysDate.getTime());
    }
    searchParamsData.SortField = 'Name';
    searchParamsData.Asc = true;
    searchParamsData.exportToCsv = true;

    return searchParamsData;
  }

  clear() {
    this.transactionReportForm.reset();
    this.merchantType =  'Created';
  }

  getFormattedDate(date) {
    if (date) {
      const localDate = moment.utc(date).local();
      const d = this.commonService.getFormattedDate(localDate['_d']);
       return d ;
    } else {
      return null;
    }
  }

  getDate(searchParamData: any) {
    const searchParamDataforPdf: any = {};
    searchParamDataforPdf.fromdate = this.commonService.getFormattedDate(moment.utc(searchParamData.fromdate).local()['_d']);
    searchParamDataforPdf.todate = this.commonService.getFormattedDate(moment.utc(searchParamData.todate).local()['_d']);
    searchParamDataforPdf.isActive = this.transactionReportForm.controls.isActive.value;
    return searchParamDataforPdf;
  }
}
