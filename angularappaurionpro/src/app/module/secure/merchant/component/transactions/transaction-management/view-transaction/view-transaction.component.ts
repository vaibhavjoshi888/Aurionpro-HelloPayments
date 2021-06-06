import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ComponentModalConfig, ModalSize, SuiModalService } from 'ng2-semantic-ui';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

import { ToasterService } from '../../../../../../../api/toaster.service';
import { TransactionService } from '../../../../../../../api/transaction.service';
import { StorageService } from '../../../../../../../common/session/storage.service';
import { MessageSetting } from '../../../../../../../constant/message-setting.constant';
import { StorageType } from '../../../../../../../common/session/storage.enum';
import { TransactionStatusEnum } from '../../../../../../../enum/transaction-status.enum';
import { TransactionStatusMapEnum } from '../../../../../../../enum/transaction-status-map.enum';
import { TransactionOperationEnum } from '../../../../../../../enum/transaction-operation.enum';
import { TransactionOperationMapEnum } from '../../../../../../../enum/transaction-operation-map.enum';
import { TransactionOriginEnum } from '../../../../../../../enum/transaction-origin.enum';
import { ChannelTypeEnum } from '../../../../../../../enum/channeltypes.enum';
import { CommonService } from '../../../../../../../api/common.service';
import { ConfirmModalComponent } from '../../../../../../common/modal/modal.component';
import { ValidationSetting } from '../../../../../../../constant/validation.constant';
import { Validator } from '../../../../../../../common/validation/validator';
import { ViewTransactionModel } from '../../../../../../../shared/models/view-transaction-model.model';
import { Exception } from '../../../../../../../common/exceptions/exception';
import { AccessRightsService } from '../../../../../../../api/access-rights.service';
import * as moment from 'moment';
import { ProcessorConfigurationService } from '../../../../../../../api/processor-configuration.service';
import { CvDataStatus } from '../../../../../../../enum/cvdata-status.enum';
import { Utilities } from '../../../../../../../common/utilities';
import { CardValidation } from '../../../../../../../common/validation/validation'; // need to check
@Component({
  selector: 'app-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.css'],
  providers: [ViewTransactionModel]
})
export class ViewTransactionComponent implements OnInit {
  viewTransactionForm: any;
  formErrors = {};
  validator: Validator;
  inputValidation = ValidationSetting;
  isLoader: any;
  toastData: any;
  loggedInUserData: any = {};
  transactionDetails: any;
  operation: any;
  adjustOperation: any;
  hiddenFlag = true;
  parentId: any;
  transactionId: any;
  channelType: any;
  showVoid = true;
  showAdjust = false;
  countryId;
  processorName = '';
  showCVVField = true;
  showcvv = false;
  cvDataStatus: any;

  config = {
    amount: {
      required: { name: ValidationSetting.transaction.view.amount.name },
      amountpattern: { name: ValidationSetting.transaction.view.amount.name },
      amount: { name: ValidationSetting.transaction.view.amount.name }
    },
    Description: {
      required: { name: ValidationSetting.transaction.view.description.name },
      maxlength: {
        name: ValidationSetting.transaction.view.description.name,
        max: ValidationSetting.transaction.view.description.maxLength.toString()
      }
    },
    convenienceAmount: {
      required: { name: ValidationSetting.transaction.view.convenienceamount.name },
      amountpattern: { name: ValidationSetting.transaction.view.convenienceamount.name }
    },
    tipAmount: {
      required: { name: ValidationSetting.transaction.view.tipamount.name },
      amountpattern: { name: ValidationSetting.transaction.view.tipamount.name }
    },
    taxAmount: {
      required: { name: ValidationSetting.transaction.view.taxamount.name },
      amountpattern: { name: ValidationSetting.transaction.view.taxamount.name }
    },
    TotalAmount: {
      required: { name: ValidationSetting.transaction.view.totalamount.name }
    },
    creditCardNumber: {
      required: { name: ValidationSetting.transaction.view.cardnumber.name },
      cardNumber: { name: 'Card Number' },
    },
    cardExpiry: {
      required: { name: ValidationSetting.transaction.view.expiration.name },
      expiryDate: { name: 'Expiry date' },
    },
    CVVPresence: {
      required: { name: ValidationSetting.transaction.view.cvvpresence.name },
      pattern: { name: ValidationSetting.transaction.view.cvvpresence.name }
    },
    CVV: {
      required: { name: ValidationSetting.transaction.view.cvv.name },
      minlength: {
        name: ValidationSetting.transaction.view.cvv.name,
        min: ValidationSetting.transaction.view.cvv.minLength.toString()
      },
      maxlength: {
        name: ValidationSetting.transaction.view.cvv.name,
        max: ValidationSetting.transaction.view.cvv.maxLength.toString()
      },
      pattern: { name: ValidationSetting.transaction.view.cvv.name }
    },
    InvoiceNo: {
      required: { name: ValidationSetting.transaction.view.invoiceno.name },
      pattern: { name: ValidationSetting.transaction.view.invoiceno.name }
    },
    AuthCode: {
      required: { name: ValidationSetting.transaction.view.authCode.name }
    }
  };

  constructor(private activatedRoute: ActivatedRoute,
    private transactionService: TransactionService,
    private storageService: StorageService,
    private commonService: CommonService,
    private modalService: SuiModalService,
    private toasterService: ToasterService,
    private router: Router,
    private formBuilder: FormBuilder,
    private viewTransactionModel: ViewTransactionModel,
    private accessRights: AccessRightsService,
    private processorConfigurationService: ProcessorConfigurationService) {
    this.validator = new Validator(this.config);
    this.loggedInUserData = JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
  }

  ngOnInit() {
    this.viewTransactionForm = this.formBuilder.group({
      'amount': ['', [Validators.required]],
      'Description': ['', [Validators.maxLength(ValidationSetting.transaction.view.description.maxLength)]],
      'convenienceAmount': ['', []],
      'tipAmount': ['', []],
      'taxAmount': ['', []],
      'TotalAmount': ['', []],
      'creditCardNumber': ['', []],
      'cardExpiry': ['', []],
      'CVVPresence': ['AV', []],
      'CVV': ['', []],
      'InvoiceNo': ['', [Validators.pattern(ValidationSetting.invoiceNo_regex)]],
      'AuthCode': ['', [
        // Validators.required,
        // Validators.pattern(/^[0-9]{1,9}(\.[0-9]{1,2})?$/)
      ]]
    },
    {
      validator: [CardValidation.valid_card,
        CardValidation.amount,
        CardValidation.convenienceAmount,
        CardValidation.tipAmount,
        CardValidation.taxAmount,
        CardValidation.card_Expiry] // your validation method
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      this.transactionId = params.transactionId;
      this.parentId = this.loggedInUserData.parentId;
      if (params.channelType === 'credit') {
        this.channelType = ChannelTypeEnum.CreditCard;
      } else if (params.channelType === 'debit') {
        this.channelType = ChannelTypeEnum.DebitCard;
      } else {
        this.channelType = ChannelTypeEnum.ACH;
      }
      this.getProcessorConfiguration();
    });

    this.viewTransactionForm.valueChanges.subscribe(data =>
      this.onValueChanged(data)
    );

    this.viewTransactionForm.get('amount').valueChanges.subscribe(value => {
      const totalAmount = this.addAllAmounts();
    });
    this.viewTransactionForm.get('convenienceAmount').valueChanges.subscribe(value => {
      const totalAmount = this.addAllAmounts();
    });
    this.viewTransactionForm.get('tipAmount').valueChanges.subscribe(value => {
      if (this.transactionDetails.channelType === 3 && this.transactionDetails.transactionStatus === 'Authorized') {
        this.showVoid = true;   // value == null ? true : false;
        this.showAdjust = true;   // value == null ? false : true;
      } else {
        const totalAmount = this.addAllAmounts();
      }
    });
    this.viewTransactionForm.get('taxAmount').valueChanges.subscribe(value => {
      const totalAmount = this.addAllAmounts();
    });

  }

  hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess) {
    return this.accessRights.hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess);
  }

  addAllAmounts() {
    this.validateAllFormFields(this.viewTransactionForm);
    this.formErrors = this.validator.validate(this.viewTransactionForm);
    // purposefully added conditional statement while adding amount since we need to exclude invalid amount from totalAmount
    let totalAmount = (this.viewTransactionForm.controls.amount.errors == null ? Number(this.viewTransactionForm.get('amount').value) : 0) +
      (this.viewTransactionForm.controls.convenienceAmount.errors == null ? Number(this.viewTransactionForm.get('convenienceAmount').value) : 0) +
      (this.viewTransactionForm.controls.tipAmount.errors == null ? Number(this.viewTransactionForm.get('tipAmount').value) : 0) +
      (this.viewTransactionForm.controls.taxAmount.errors == null ? Number(this.viewTransactionForm.get('taxAmount').value) : 0);
    totalAmount = Math.round(totalAmount * 100) / 100;
    this.viewTransactionForm.get('TotalAmount').patchValue(totalAmount);
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print').innerHTML;
    printContents = '<div><h3 align="center"><u></u></h3><div>' + printContents;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            table, th, td {
              border: 1px solid black;
              border-collapse: collapse;
            }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  clear(controlName) {
    this.viewTransactionForm.get(controlName).setValue(null);
  }

  onValueChanged(data?: any) {
    if (!this.viewTransactionForm) {
      return;
    }
    this.formErrors = this.validator.validate(this.viewTransactionForm);
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

  onChangeCVVPresence(event) {
    this.showCVVField = event === 'AV' ? true : false;
  }

  toggleShow() {
    this.showcvv = !this.showcvv;
  }

  getProcessorConfiguration() {
    this.isLoader = true;
    this.processorConfigurationService.getProcessorConfiguration(null, this.loggedInUserData.parentId, this.channelType).subscribe(
      response => {
        this.processorName = response[0].processorName;
        this.viewTransaction(this.parentId, this.transactionId);
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );

  }

  populateCountry() {
    this.commonService.getCountryList().subscribe(
      response => {
        const countryList: any = response;
        this.countryId = this.transactionDetails.billingContact.address.country;
        if (this.transactionDetails.billingContact.address.country != null) {
          this.transactionDetails.billingContact.address.country = countryList.filter(
            (x): any => x.countryId == this.transactionDetails.billingContact.address.country
          )[0].name;
        }
        this.hiddenFlag = false;
        this.isLoader = false;
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  viewTransaction(parentId, transactionId) {
    this.isLoader = true;
    this.transactionService.viewTransaction(parentId, transactionId).subscribe(response => {
      this.transactionDetails = this.viewTransactionModel.viewTransactionResponse(response);
      this.populateCountry();
      if (this.transactionDetails.transactionStatus === TransactionStatusEnum.Success
        && this.transactionDetails.operationType === TransactionOperationEnum.VerifyOnly) { // ForceAuth
        this.operation = 'forceauth';
        this.viewTransactionForm.get('amount').patchValue(this.transactionDetails.tenderInfo.amount);
        this.viewTransactionForm.get('convenienceAmount').patchValue(this.transactionDetails.tenderInfo.convenienceAmount);
        this.viewTransactionForm.get('tipAmount').patchValue(this.transactionDetails.tenderInfo.tipAmount);
        this.viewTransactionForm.get('taxAmount').patchValue(this.transactionDetails.tenderInfo.taxAmount);
        this.viewTransactionForm.get('TotalAmount').patchValue(this.transactionDetails.tenderInfo.captureAmount);
      } else if (this.transactionDetails.operationType !== TransactionOperationEnum.Refund
        && (this.transactionDetails.transactionStatus === TransactionStatusEnum.Hold
        || this.transactionDetails.transactionStatus === TransactionStatusEnum.SettlementHold
        || this.transactionDetails.transactionStatus === TransactionStatusEnum.Authorized
        || this.transactionDetails.transactionStatus === TransactionStatusEnum.Captured)) {  // Void
        this.operation = 'void';
        if (this.transactionDetails.channelType === 3
          && this.transactionDetails.transactionStatus === TransactionStatusEnum.Authorized
          && this.transactionDetails.operationType !== 7) {  // Adjust
          this.adjustOperation = 'adjust';
          this.showAdjust = true;
        }
      } else if (this.transactionDetails.transactionStatus === TransactionStatusEnum.Success
        && this.transactionDetails.operationType !== TransactionOperationEnum.VerifyOnly
        && this.transactionDetails.operationType !== TransactionOperationEnum.Refund
        && this.transactionDetails.channelType !== 4) { // Refund
        this.operation = 'refund';
      } else if (this.transactionDetails.channelType === 3
        && this.processorName === 'Tsys'
        && this.transactionDetails.operationType === TransactionOperationEnum.Sale
        && (this.transactionDetails.transactionStatus === TransactionStatusEnum.Cancelled
        || (this.transactionDetails.transactionStatus === TransactionStatusEnum.Failed && this.transactionDetails.isOffline === true))) { // Reprocess
        this.cvDataStatus = Utilities.enumSelector(CvDataStatus);
        this.setValidators();
        this.operation = 'reprocess';
        this.viewTransactionForm.get('CVVPresence').patchValue('AV');
        this.viewTransactionForm.get('amount').patchValue(this.transactionDetails.tenderInfo.amount);
        this.viewTransactionForm.get('convenienceAmount').patchValue(this.transactionDetails.tenderInfo.convenienceAmount);
        this.viewTransactionForm.get('tipAmount').patchValue(this.transactionDetails.tenderInfo.tipAmount);
        this.viewTransactionForm.get('taxAmount').patchValue(this.transactionDetails.tenderInfo.taxAmount);
        this.viewTransactionForm.get('TotalAmount').patchValue(this.transactionDetails.tenderInfo.captureAmount);
        this.viewTransactionForm.get('InvoiceNo').patchValue(this.transactionDetails.invoiceNo);
        this.viewTransactionForm.get('AuthCode').patchValue(this.transactionDetails.transactionResult.processorAuthCode);
      } else {
        this.operation = '';
      }
      this.transactionDetails.operationType = TransactionOperationMapEnum[TransactionOperationEnum[this.transactionDetails.operationType]];
      this.transactionDetails.transactionStatus = TransactionStatusMapEnum[TransactionStatusEnum[this.transactionDetails.transactionStatus]];
      const localDate = moment.utc(this.transactionDetails.transactionDate).local();
      this.transactionDetails.date = this.commonService.getFormattedDate(localDate['_d']);
      this.transactionDetails.time = this.commonService.getFormattedTime(localDate['_d']);

      if ( this.transactionDetails.transactionStatus === 'Failed'
      || this.transactionDetails.transactionStatus === 'Denied'
      || this.transactionDetails.transactionStatus === 'Hold') {

        let msg = '';
        if (this.transactionDetails.transactionResult.reasonMessage != null) {
          msg = Exception.getExceptionMessage(this.transactionDetails.transactionResult.reasonMessage);
        }

        if (msg !== '' && msg !== 'Something went wrong. Please contact administrator.') {
          this.transactionDetails.transactionResult.reasonMessage = msg;
          // this.transactionDetails.transactionResult.reasonMessage = MessageSetting.transaction[this.transactionDetails.transactionResult.reasonMessage];
          // Other than these keys, all other messages will be displayed directly as received from backend
        }
        if ( this.transactionDetails.transactionResult.reasonMessage === null) {
          this.transactionDetails.transactionResult.reasonMessage = this.transactionDetails.transactionResult.reasonCode;
        }
      }
      this.hiddenFlag = false;
      this.isLoader = false;
    }, error => {
      const toastMessage = Exception.exceptionMessage(error);
      this.isLoader = false;
      this.toastData = this.toasterService.error(toastMessage.join(', '));
    });
  }

  setValidators () {
    this.viewTransactionForm.get('amount').setValidators([Validators.required]);
    // this.viewTransactionForm.get('Description').setValidators([Validators.required]);
    this.viewTransactionForm.get('convenienceAmount').setValidators([Validators.required]);
    this.viewTransactionForm.get('tipAmount').setValidators([Validators.required]);
    this.viewTransactionForm.get('taxAmount').setValidators([Validators.required]);
    this.viewTransactionForm.get('TotalAmount').setValidators([Validators.required]);
    this.viewTransactionForm.get('creditCardNumber').setValidators([Validators.required]);
    this.viewTransactionForm.get('cardExpiry').setValidators([Validators.required]);
    this.viewTransactionForm.get('CVVPresence').setValidators([Validators.required]);
    this.viewTransactionForm.get('CVV').setValidators([Validators.required]);
    this.viewTransactionForm.get('InvoiceNo').setValidators([Validators.required]);
    this.viewTransactionForm.get('AuthCode').setValidators([Validators.required]);
  }

  adjust() {
    const confirmationMessage = 'Are you sure, you want to adjust this transaction?';
    this.modalService
      .open(new ConfirmModal(confirmationMessage, ''))
      .onApprove(() => {
        this.isLoader = true;
        this.transactionService.adjustTransaction(this.parentId, this.transactionId, {'tipAmount': this.viewTransactionForm.value.tipAmount})
          .subscribe(response => {
            this.ngOnInit();
            this.isLoader = false;
            const successMessage = MessageSetting.transaction.adjustSuccess;
            this.toastData = this.toasterService.success(successMessage);
          }, err => {
            this.isLoader = false;
            this.toastData = this.toasterService.error(MessageSetting.transaction.adjustError);
          });
      });
  }

  void() {
    const confirmationMessage = this.transactionDetails.transactionStatus === TransactionStatusEnum.Captured
      ? 'Are you sure, you want to attempt to void this transaction?' : 'Are you sure, you want to void this transaction?';
    this.modalService
      .open(new ConfirmModal(confirmationMessage, ''))
      .onApprove(() => {
        this.isLoader = true;
        this.transactionService.voidTransaction(this.parentId, this.channelType, this.transactionId).subscribe(response => {
          this.ngOnInit();
          this.isLoader = false;
          const successMessage = this.transactionDetails.transactionStatus === TransactionStatusEnum['Captured']
            ? MessageSetting.transaction.voidattempt : MessageSetting.transaction.void;
          this.toastData = this.toasterService.success(successMessage);
        }, error => {
          const toastMessage = Exception.exceptionMessage(error);
          this.isLoader = false;
          this.toastData = this.toasterService.error(toastMessage.join(', '));
        });
      });

  }

  refund() {
    this.validateAllFormFields(this.viewTransactionForm);
    this.formErrors = this.validator.validate(this.viewTransactionForm);
    if (this.viewTransactionForm.invalid) {
      return;
    }
    // partial refunf is not supported in Actum (ACH Transaction)
    if (ChannelTypeEnum['ACH'] === this.channelType
      && parseInt(this.viewTransactionForm.value.amount, 10) !== this.transactionDetails.tenderInfo.captureAmount) {
      this.toastData = this.toasterService.error(MessageSetting.transaction.partialRefundAmountNotAllowedError);
      return;
    }
    // Refund Amount should be greater than 0 AND less than or equal to capture amount
    if (this.viewTransactionForm.value.amount <= 0
      || this.viewTransactionForm.value.amount > this.transactionDetails.tenderInfo.captureAmount) {
      this.toastData = this.toasterService.error(MessageSetting.transaction.refundAmountError);
      return;
    }
    const reqObj: any = {};
    reqObj.InvoiceNumber = this.transactionDetails.invoiceNo;
    reqObj.PONumber = this.transactionDetails.poNo;
    reqObj.Amount = this.viewTransactionForm.value.amount;
    reqObj.Remarks = this.viewTransactionForm.value.Description;
    const confirmationMessage = 'Are you sure, you want to initiate refund transaction?';
    this.modalService
      .open(new ConfirmModal(confirmationMessage, ''))
      .onApprove(() => {
        this.isLoader = true;
        this.transactionService.refundTransaction(this.parentId, this.channelType, this.transactionId, reqObj).subscribe(response => {
          this.ngOnInit();
          this.isLoader = false;
          this.toastData = this.toasterService.success(MessageSetting.transaction.refund);
        }, error => {
          const toastMessage = Exception.exceptionMessage(error);
          this.isLoader = false;
          this.toastData = this.toasterService.error(toastMessage.join(', '));
        });
      });
  }

  forceAuth() {
    this.validateAllFormFields(this.viewTransactionForm);
    this.formErrors = this.validator.validate(this.viewTransactionForm);
    if (this.viewTransactionForm.invalid) {
      return;
    }

    // For TSYS processor forceAuth is treated same as offline transaction (Hence we are calling reprocess)
    if (this.processorName === 'Tsys') {
      this.reprocess();
      return;
    }

    const reqObj: any = {};

    reqObj.transactionOrigin = TransactionOriginEnum[this.transactionDetails.transactionOrigin];
    reqObj.transactionCode = this.transactionDetails.transactionCode;
    reqObj.billingContact = this.transactionDetails.billingContact;
    reqObj.billingContact.address.country = this.countryId;
    reqObj.shippingContact = this.transactionDetails.shippingContact;
    reqObj.referenceTransactionId = this.transactionDetails.transactionId; // transactionId
    reqObj.merchantId = this.transactionDetails.merchantId;
    reqObj.operationType = TransactionOperationEnum.ForceSale; // should be 2;
    reqObj.channelType = ChannelTypeEnum.CreditCard;
    reqObj.isDebit = true;  // should be 'true' always (true-->Debit Amount, false-->Credit Amount)
    reqObj.referenceCustomerId = this.transactionDetails.referenceCustomerId,
    reqObj.customerAccountId = this.transactionDetails.customerAccountId,
    reqObj.invoiceNo = this.transactionDetails.invoiceNo,
    reqObj.poNo = this.transactionDetails.poNo,
    reqObj.referenceNo = this.transactionDetails.referenceNo,
    reqObj.remarks = this.transactionDetails.remarks,
    reqObj.recurringType = this.transactionDetails.recurringType,
    reqObj.recurringId = this.transactionDetails.recurringId,
    reqObj.installmentNumber = this.transactionDetails.installmentNumber,
    reqObj.installmentCount = this.transactionDetails.installmentCount,
    reqObj.terminalId = this.transactionDetails.terminalId,
    reqObj.allowDuplicates = true,  // this.transactionDetails.allowDuplicates,
    reqObj.trainingMode = this.transactionDetails.trainingMode; // reqObj.trainingMode = false; when dealing with actual processor

    reqObj.tenderInfo = {
      'cardHolderName': this.transactionDetails.tenderInfo.cardHolderName,
      'cardType': this.transactionDetails.tenderInfo.cardType,
      // 'cardNumber': this.transactionDetails.tenderInfo.maskCardNumber,
      'cardExpiry': this.transactionDetails.tenderInfo.cardExpiry,
      'cvData': this.transactionDetails.tenderInfo.cvData,
      'cvDataStatus': this.transactionDetails.tenderInfo.cvData == null ? 'NS' : this.transactionDetails.tenderInfo.cvDataStatus,
      'rxAmount': this.transactionDetails.tenderInfo.rxAmount,
      'amount': this.viewTransactionForm.value.amount, // this.transactionDetails.tenderInfo.amount,
      'tipAmount': this.viewTransactionForm.value.tipAmount,  // this.transactionDetails.tenderInfo.tipAmount,
      'convenienceAmount': this.viewTransactionForm.value.convenienceAmount,  // this.transactionDetails.tenderInfo.convenienceAmount,
      'taxAmount': this.viewTransactionForm.value.taxAmount, // this.transactionDetails.tenderInfo.taxAmount,
      'preAuthCode': (this.transactionDetails.transactionResult.processorAuthCode != null) ? this.transactionDetails.transactionResult.processorAuthCode : this.viewTransactionForm.value.AuthCode
    };

    const confirmationMessage = 'Are you sure, you want to initiate force auth transaction?';
    this.modalService
      .open(new ConfirmModal(confirmationMessage, ''))
      .onApprove(() => {
        this.isLoader = true;
        this.transactionService.forceAuthTransaction(this.parentId, reqObj).subscribe(response => {
          this.ngOnInit();
          this.isLoader = false;
          this.toastData = this.toasterService.success(MessageSetting.transaction.forceauth);
        }, error => {
          const toastMessage = Exception.exceptionMessage(error);
          this.isLoader = false;
          this.toastData = this.toasterService.error(toastMessage.join(', '));
        });
      });
  }

  // For TSYS processor ForceAuth and Reprocess are same (Hence, we are calling reprocess() in both scenario)
  reprocess() {
    this.validateAllFormFields(this.viewTransactionForm);
    this.formErrors = this.validator.validate(this.viewTransactionForm);
    if (this.viewTransactionForm.invalid) {
      return;
    }
    const reqObj: any = {};
    if (this.transactionDetails.transactionStatus === 'Failed'
    || this.transactionDetails.transactionStatus === 'Void' ) {
      reqObj.PreAuthCode = this.viewTransactionForm.value.AuthCode;
      reqObj.CardNumber = this.viewTransactionForm.value.creditCardNumber;
      reqObj.CardExpiry = this.viewTransactionForm.value.cardExpiry;
      reqObj.CVData = this.viewTransactionForm.value.CVV;
      reqObj.InvoiceNo = this.viewTransactionForm.value.InvoiceNo;
      reqObj.CVDataStatus = this.viewTransactionForm.value.CVVPresence;
    }
    reqObj.Amount  = this.viewTransactionForm.value.amount;
    reqObj.TipAmount  = this.viewTransactionForm.value.tipAmount;
    reqObj.ConvenienceAmount  = this.viewTransactionForm.value.convenienceAmount;
    reqObj.TaxAmount  = this.viewTransactionForm.value.taxAmount;

    const confirmationMessage = (this.transactionDetails.transactionStatus === 'Success')
     ? 'Are you sure, you want to initiate force auth transaction?' : 'Are you sure, you want to reprocess this transaction?';
    this.modalService
      .open(new ConfirmModal(confirmationMessage, ''))
      .onApprove(() => {
        this.isLoader = true;
        this.transactionService.offlineTransaction(this.loggedInUserData.parentId, this.transactionDetails.transactionId, reqObj).subscribe(
          response => {
          this.ngOnInit();
          this.isLoader = false;
          this.toastData = this.toasterService.success((this.transactionDetails.transactionStatus === 'Success') ? MessageSetting.transaction.forceauth : MessageSetting.transaction.reprocessSuccess);
        }, error => {
          const toastMessage = Exception.exceptionMessage(error);
          this.isLoader = false;
          this.toastData = this.toasterService.error(toastMessage.join(', '));
        });
      });
  }

  onReferenceTransactionIdClick() {
    if (this.channelType === 2) {
      this.router.navigate([`/merchant/viewtransaction/ach/${this.transactionDetails.referenceTransactionId}`]);
    } else if (this.channelType === 3) {
      this.router.navigate([`/merchant/viewtransaction/credit/${this.transactionDetails.referenceTransactionId}`]);
    } else {
      this.router.navigate([`/merchant/viewtransaction/debit/${this.transactionDetails.referenceTransactionId}`]);
    }
  }

  cancel() {
    if (this.channelType === 3) {
      this.router.navigate(['/merchant/findtransaction/credit/true']);
    } else if (this.channelType === 4) {
      this.router.navigate(['/merchant/findtransaction/debit/true']);
    } else {
      this.router.navigate(['/merchant/findtransaction/ach/true']);
    }
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
