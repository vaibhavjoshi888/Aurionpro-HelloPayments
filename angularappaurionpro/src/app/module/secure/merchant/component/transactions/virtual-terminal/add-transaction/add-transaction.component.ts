import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToasterService } from '../../../../../../../api/toaster.service';
import { CustomerService } from '../../../../../../../api/customer.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ValidationSetting } from '../../../../../../../constant/validation.constant';
import { Validator } from '../../../../../../../common/validation/validator';
import { AppSetting } from '../../../../../../../constant/appsetting.constant';
import { MerchantService } from '../../../../../../../api/merchant.service';
import { PagerService } from '../../../../../../../api/pager.service';
import { Utilities } from '../../../../../../../common/utilities';
import { CommonService } from '../../../../../../../api/common.service';
import { States } from '../../../../../../../constant/states.constant';
import { CvDataStatus } from '../../../../../../../enum/cvdata-status.enum';
import { TransactionService} from '../../../../../../../api/transaction.service';
import { ActivatedRoute } from '@angular/router';
import { SuiModalService, TemplateModalConfig, ModalTemplate} from 'ng2-semantic-ui';
import { CardValidation } from '../../../../../../../common/validation/validation';
import { AddTransaction } from '../../../../../../../shared/models/add-transaction.model';
import { interval } from 'rxjs/observable/interval';
import { Subscription } from 'rxjs';
import { TransactionStatusEnum } from '../../../../../../../enum/transaction-status.enum';
import { TransactionOperationEnum, TransactionTypeEnum } from '../../../../../../../enum/transaction-operation.enum';
import { SecCode } from '../../../../../../../enum/sec-code.enum';
import { AchAccountType } from '../../../../../../../enum/ach-account-type.enum';
import { AchCheckType } from '../../../../../../../enum/ach-check-type.enum';
import { ValidationConfig } from './validation-config';
import { ProcessorConfigurationService } from '../../../../../../../api/processor-configuration.service';
import { Exception } from '../../../../../../../common/exceptions/exception';
import { ChannelTypeEnum } from '../../../../../../../enum/channeltypes.enum';
import { MessageSetting } from '../../../../../../../constant/message-setting.constant';
import { AccessRightsService } from '../../../../../../../api/access-rights.service';
import * as moment from 'moment';
import { TransactionStatusMapEnum } from '../../../../../../../enum/transaction-status-map.enum';

export interface IContext {
  data: string;
}

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css'],
  providers: [ToasterService, PagerService]
})

export class AddTransactionComponent implements OnInit {
  @ViewChild('modalTemplateCard')
  public modalTemplateCard: ModalTemplate<IContext, string, string>;
  @ViewChild('modalTemplateAch')
  public modalTemplateAch: ModalTemplate<IContext, string, string>;

  @ViewChild('amount') input: ElementRef;

  findCustomerForm: any;
  creditCardForm: any;
  debitCardForm: any;
  transaction: any;
  transactionStatus: Subscription;
  achTransactionForm: any;
  customerAddressForm: any;
  toastData: any;
  isLoader: boolean;
  loggedInUser: any;
  parentId: any;
  hideCustomerTable: boolean;
  hideCustomerAccountTable: boolean;
  validator: Validator;
  formErrors = {};
  sortColumnOrder = {};
  searchParamsData = {};
  allCustomers = {};
  currentCustomerDetails = {};
  customerAccount: any;
  countryList: any;
  stateList = [];
  States = {};
  cvDataStatus: any;
  transactionType: any;
  achAccountType: any;
  checkType: any;
  secCode: any;
  showcvv = false;
  transactionModalCounter: number;
  pager: any = {};
  noResultsMessage = 'No customer found';
  noCardResultsMessage = 'No account found';
  transactionDetails = {};
  showEverything: boolean;
  searchResultFlag: boolean;
  cardResultFlag: boolean;
  cvvField: boolean;
  isCreditCard: boolean;
  isDebitCard: boolean;
  isACH: boolean;
  showCustomerName: boolean;
  customerstate: object;
  customersAllActiveInactive: object;
  accordion: object;
  isNewTransaction: boolean;
  cardAmount: any;
  cardConvenienceAmount: any;
  cardTipAmount: any;
  cardTaxAmount: any;
  validationConfig = new ValidationConfig();
  inputValidation = ValidationSetting;
  processorName: string;
  isTsys = true;

  // Temporary Code for certification testing
  // isMoto = false;
  // Temporary Code for certification testing


  constructor(
    private formBuilder: FormBuilder,
    private pagerService: PagerService,
    private toasterService: ToasterService,
    private customerService: CustomerService,
    private merchantService: MerchantService,
    private modalService: SuiModalService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private transactionService: TransactionService,
    private processorConfigurationService: ProcessorConfigurationService,
    private accessRights: AccessRightsService
  ) {
    this.validator = new Validator(this.validationConfig.Config);
  }

  ngOnInit() {
    let transactionType = '';
    this.activatedRoute.params.subscribe(routeParams => {
      transactionType = routeParams.type;
      if (transactionType === 'creditcard') {
        this.isCreditCard = true;
        this.isDebitCard = false;
        this.isACH  = false;
        this.getProcessorName(3);
      } else if (transactionType === 'debitcard') {
        this.isDebitCard = true;
        this.isCreditCard = false;
        this.isACH  = false;
      } else if (transactionType === 'ach') {
        this.isACH = true;
        this.isDebitCard = false;
        this.isCreditCard = false;
      }


      this.initializeForm();
      if (!this.hasAccess(0, 0, 1201, 'viewAccess') && !this.hasAccess(0, 0, 1202, 'viewAccess')) {
        this.accordion = {
          searchcustomer: false,
          customers: false,
          listofcustomeraccounts: false,
          transactiondetails: true,
          addressdetails: false
        };
      }

    });
  }

  getProcessorName1() {
    if (this.processorName === 'TSYS') {
      return false;
    } else {
      return true;
    }
  }

  getProcessorName(channelType) {
    this.isLoader = true;
    this.loggedInUser = this.merchantService.getLoggedInData();
    this.processorConfigurationService.getProcessorConfiguration(
      null, this.loggedInUser.parentId, channelType).subscribe(x => {
        this.isLoader = false;
        if (!x.hasOwnProperty('data')) {
          this.processorName = x[0].processorName.toUpperCase();
          if (this.processorName === 'TSYS') {
          this.isTsys = false;
          this.processorName = x[0].processorName;
          this.creditCardForm.get('invoiceNo').setValidators([Validators.required,
          Validators.maxLength(ValidationSetting.reseller.find.lastName.maxLength), Validators.pattern(/^[^&?=]+$/)]);
          this.creditCardForm.get('invoiceNo').updateValueAndValidity();
          return true;
           }
          }
          this.processorName = 'processor not assigned';
        // this.initializeForm();
          return false;
      });
  }

  hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess) {
    return this.accessRights.hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess);
  }

  public open(dynamicContent: string = 'Example') {
    let config = new TemplateModalConfig<IContext, string, string>(this.modalTemplateCard);
    if (this.isACH) {
      config = new TemplateModalConfig<IContext, string, string>(this.modalTemplateAch);
    }
    config.closeResult = 'closed!';
    config.context = { data: dynamicContent };
    config.size = 'tiny';
    this.modalService
        .open(config)
        .onApprove(result => {
          this.accordion = {
            searchcustomer: false,
            customers: false,
            listofcustomeraccounts: false,
            transactiondetails: true,
            addressdetails: false
          };
          this.clearTransactionField();
          this.ngOnInit();
          const scroll = document.querySelector('#initialLoad');
              setTimeout(() => {
                scroll.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
              }, 400);
          /* approve callback */ })
        .onDeny(result => {
          this.accordion = {
            searchcustomer: false,
            customers: false,
            listofcustomeraccounts: false,
            transactiondetails: true,
            addressdetails: false
          };
          const scroll = document.querySelector('#initialLoad');
              setTimeout(() => {
                scroll.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
              }, 400);
          this.clearTransactionField();
        });
  }

  initializeVariable() {
    this.formErrors = {};
    this.transaction = new AddTransaction();
    this.validationConfig = new ValidationConfig();
    this.findCustomerForm = new FormGroup({});
    this.creditCardForm = {};
    this.achTransactionForm = new FormGroup({});
    this.customerAddressForm = new FormGroup({});
    this.showEverything = false;
    this.searchResultFlag = false;
    this.cardResultFlag = false;
    this.cvvField = true;
    this.isLoader = false;
    this.showCustomerName = false;
    this.customerstate = {
      active: false,
      inactive: false,
    };
    this.customersAllActiveInactive = {
      active: true
    };
    this.accordion = {
      searchcustomer: false,
      customers: false,
      listofcustomeraccounts: false,
      transactiondetails: true,
      addressdetails: false
    };
    this.isNewTransaction = true;
    this.validator = new Validator(this.validationConfig.Config);
    this.hideCustomerTable = true;
    this.hideCustomerAccountTable = true;
    this.customerAccount = [];
    this.transactionType = Utilities.enumSelector(TransactionTypeEnum);

    this.activatedRoute.params.subscribe(routeParams => {
      if (routeParams.type === 'debitcard') {
        const temp = [];
        temp.push(this.transactionType[0]);
        this.transactionType = temp;
      }
    });

    this.cvDataStatus = Utilities.enumSelector(CvDataStatus);
    this.secCode = Utilities.enumSelector(SecCode);
    this.achAccountType = Utilities.enumSelector(AchAccountType);
    this.checkType = Utilities.enumSelector(AchCheckType);
    this.loggedInUser = this.merchantService.getLoggedInData();
    this.showEverything = false;
    this.currentCustomerDetails = {};
    this.cardAmount = '';
    this.cardConvenienceAmount = 0;
    this.cardTipAmount = 0;
    this.cardTaxAmount = 0;
  }

  initializeForm() {
    this.initializeVariable();
    this.findCustomerForm = this.formBuilder.group({
      'ParentId': [''],
      'CustomerId': [''],
      'FirstName': ['', [Validators.maxLength(ValidationSetting.reseller.find.firstName.maxLength),
        Validators.pattern(ValidationSetting.firstNameLastName_regex)]],
      'LastName': ['', [Validators.maxLength(ValidationSetting.reseller.find.lastName.maxLength),
        Validators.pattern(ValidationSetting.firstNameLastName_regex)]],
      'Email': ['', [Validators.pattern(ValidationSetting.email_regex)]],
      'CompanyName': [''],
    });

    this.creditCardForm = this.formBuilder.group({
      'customerId': [{value: '', disabled: true}],
      'customerName': [{value: '', disabled: true}, [
        Validators.maxLength(ValidationSetting.reseller.find.firstName.maxLength),
        Validators.pattern(ValidationSetting.firstNameLastName_regex)]],
      'transactionType': ['0', [Validators.required, Validators.maxLength(ValidationSetting.transaction.add.transactionType.maxLength)]],
      'cardHolderName': ['', [Validators.required,
                              Validators.maxLength(ValidationSetting.transaction.add.cardHolderName.maxLength),
                              Validators.pattern(ValidationSetting.firstNameLastName_regex)]],
      'maskCardNumber': ['', [Validators.required]],
      'cardExpiry': ['', [Validators.required]],
      'cvDataStatus': ['AV', [Validators.required]],
      'cvData': ['', [Validators.minLength(ValidationSetting.transaction.add.cvDataStatus.minLength),
        Validators.maxLength(ValidationSetting.transaction.add.cvDataStatus.maxLength),
        Validators.pattern(ValidationSetting.numbersOnly_regex)]],
      'amount': ['', [Validators.required,
        Validators.maxLength(ValidationSetting.transaction.add.amount.maxLength),
        Validators.pattern(ValidationSetting.amount_regex)
      ]],
      'convenienceAmount': ['', [Validators.maxLength(ValidationSetting.transaction.add.convenienceAmount.maxLength),
        Validators.pattern(ValidationSetting.amount_regex)
      ]],
      'tipAmount': ['', [Validators.maxLength(ValidationSetting.transaction.add.tipAmount.maxLength),
        Validators.pattern(ValidationSetting.amount_regex)
      ]],
      'taxAmount': ['', [Validators.maxLength(ValidationSetting.transaction.add.taxAmount.maxLength),
        Validators.pattern(ValidationSetting.amount_regex)
      ]],
      'captureAmount': [{value: '', disabled: true}],
      'invoiceNo': ['', Validators.pattern(/^[^&?=]+$/)]
      }
      ,
      {
        validator: [CardValidation.valid_card,
          CardValidation.amount,
          CardValidation.convenienceAmount,
          CardValidation.tipAmount,
          CardValidation.taxAmount,
          CardValidation.card_Expiry
        ]
      }
    );

    this.debitCardForm = this.formBuilder.group({
      'customerId': [{value: '', disabled: true},
        [Validators.maxLength(ValidationSetting.transaction.add.customerId.maxLength)]],
      'customerName': [{value: '', disabled: true}, [
        Validators.maxLength(ValidationSetting.reseller.find.firstName.maxLength),
        Validators.pattern(ValidationSetting.firstNameLastName_regex)]],
      'transactionType': ['0', [Validators.required, Validators.maxLength(ValidationSetting.reseller.find.lastName.maxLength)]],
      'cardHolderName': ['', [Validators.required,
                              Validators.maxLength(ValidationSetting.transaction.add.cardHolderName.maxLength),
                              Validators.pattern(ValidationSetting.firstNameLastName_regex)]],
      'maskCardNumber': ['', [Validators.required]],
      'cardExpiry': ['', [Validators.required]],
      // 'cvDataStatus': ['AV', [Validators.required]],
      // 'cvData': [''],
      'amount': ['', [Validators.required,
        Validators.maxLength(ValidationSetting.transaction.add.amount.maxLength),
        Validators.pattern(ValidationSetting.amount_regex)
      ]],
      'convenienceAmount': ['', [Validators.maxLength(ValidationSetting.transaction.add.convenienceAmount.maxLength),
        Validators.pattern(ValidationSetting.amount_regex)
      ]],
      'tipAmount': ['', [Validators.maxLength(ValidationSetting.transaction.add.tipAmount.maxLength),
        Validators.pattern(ValidationSetting.amount_regex)
      ]],
      'taxAmount': ['', [Validators.maxLength(ValidationSetting.transaction.add.taxAmount.maxLength),
        Validators.pattern(ValidationSetting.amount_regex)
      ]],
      'captureAmount': [{value: '', disabled: true}],
      'invoiceNo': ['', Validators.pattern(/^[^&?=]+$/)]
      }
      ,
      {
        validator: [CardValidation.valid_card,
          CardValidation.amount,
          CardValidation.convenienceAmount,
          CardValidation.tipAmount,
          CardValidation.taxAmount,
          CardValidation.card_Expiry] // your validation method
      }
    );
    // defaultmerchantname should be merchant company name, currently it the merhant first and last name
      const defaultmerchantName = this.loggedInUser.contact.name.firstName + ' ' + this.loggedInUser.contact.name.lastName;
    this.achTransactionForm = this.formBuilder.group({
      'customerId': [{value: '', disabled: true},
        [Validators.maxLength(ValidationSetting.transaction.add.customerId.maxLength)]],
      'secCode': ['TEL', [Validators.required, Validators.maxLength(ValidationSetting.transaction.add.secCode.maxLength)]],
      'customerName': ['', [Validators.required,
        Validators.maxLength(ValidationSetting.reseller.find.firstName.maxLength),
        Validators.pattern(ValidationSetting.firstNameLastName_regex)]],
      'payToTheOrderOf': [defaultmerchantName, [Validators.required,
        Validators.maxLength(ValidationSetting.transaction.add.payToTheOrderOf.maxLength),
        Validators.pattern(ValidationSetting.firstNameLastName_regex)]],
      'routingNumber': ['', [Validators.required,
        Validators.maxLength(ValidationSetting.transaction.add.routingNumber.maxLength)]],
      'checkNumber': ['', [ // Validators.required,
        Validators.maxLength(ValidationSetting.transaction.add.checkNumber.maxLength)]],
      'maskedAccountNumber': ['', [Validators.required,
        Validators.maxLength(ValidationSetting.transaction.add.accountNumber.maxLength),
        Validators.pattern(ValidationSetting.numbersOnly_regex)]],
      'amount': ['', [Validators.required,
        Validators.maxLength(ValidationSetting.transaction.add.amount.maxLength),
        Validators.pattern(ValidationSetting.amount_regex)
      ]],
      'accountType': ['', [Validators.required, Validators.maxLength(ValidationSetting.transaction.add.accountNumber.maxLength)]],
      'checkType': ['', [Validators.maxLength(ValidationSetting.transaction.add.checkType.maxLength)]],
      'invoiceNo': ['', Validators.pattern(/^[^&?=]+$/)]
    },
    {
      validator: [
        CardValidation.amount,
      ] // your validation method
    });

    this.customerAddressForm = this.formBuilder.group({
        'addressLine1': [null, [Validators.required,
          Validators.maxLength(ValidationSetting.transaction.add.addressLine1.maxLength)]],
        'addressLine2': [null, [Validators.required,
          Validators.maxLength(ValidationSetting.transaction.add.addressLine2.maxLength)]],
        'city': [null, [Validators.required,
          Validators.maxLength(ValidationSetting.transaction.add.city.maxLength)]],
        'state': [null, [Validators.required,
          Validators.maxLength(ValidationSetting.transaction.add.state.maxLength)]],
        'country': [null, [Validators.required,
          Validators.maxLength(ValidationSetting.transaction.add.country.maxLength)]],
        'postalCode': [null, [Validators.required,
          Validators.maxLength(ValidationSetting.transaction.add.postalCode.maxLength),
          // Validators.pattern('^[0-9]*$')
        ]],
        // 'timeZone': [null, [Validators.maxLength(ValidationSetting.transaction.add.timeZone.maxLength)]],
    });

    this.findCustomerForm.valueChanges.subscribe(data => this.onValueChanged(this.findCustomerForm, data, ));
    this.sortColumnOrder['CustomerId'] = true;
    this.sortColumnOrder['FirstName'] = true;
    this.sortColumnOrder['LastName'] = true;
    this.sortColumnOrder['companyName'] = true;
    this.sortColumnOrder['Email'] = true;
    this.sortColumnOrder['IsActive'] = true;
    this.populateCountry();
    this.States = States.state;
    if (this.isCreditCard) {
      this.cardFormFieldValueChange(this.creditCardForm);
    } else if (this.isDebitCard) {
      this.cardFormFieldValueChange(this.debitCardForm);
    } else if (this.isACH) {
      this.cardFormFieldValueChange(this.achTransactionForm);
    }
  }

  cardFormFieldValueChange(form) {
    if (this.isDebitCard || this.isCreditCard || this.isACH) {
      form.valueChanges.subscribe(data => this.onValueChanged(form, data ));
    }
    if (this.isDebitCard || this.isCreditCard) {
      if (this.isCreditCard) {
        form.get('cvDataStatus').valueChanges.subscribe(
          (cvDataStatus: string) => {
            if (cvDataStatus === 'AV') {
              form.get('cvData')
              .setValidators([Validators.required, Validators.maxLength(ValidationSetting.reseller.find.lastName.maxLength)]);
            } else {
              form.get('cvData')
              .setValidators([Validators.maxLength(ValidationSetting.reseller.find.lastName.maxLength)]);
            }
            form.get('cvData').updateValueAndValidity();
          }
        );
      }
      form.get('amount').valueChanges.subscribe(value => {
        const totalAmount = Number(form.get('convenienceAmount').value) +
        Number(form.get('tipAmount').value) +
        Number(form.get('taxAmount').value) + Number(value);
        form.get('captureAmount').patchValue(totalAmount.toFixed(2));
      });
      form.get('convenienceAmount').valueChanges.subscribe(value => {
        const totalAmount = Number(form.get('amount').value) +
        Number(form.get('tipAmount').value) +
        Number(form.get('taxAmount').value) + Number(value);
        form.get('captureAmount').patchValue(totalAmount.toFixed(2));
      });
      form.get('tipAmount').valueChanges.subscribe(value => {
        const totalAmount = Number(form.get('convenienceAmount').value) +
        Number(form.get('amount').value) +
        Number(form.get('taxAmount').value) + Number(value);
        form.get('captureAmount').patchValue(totalAmount.toFixed(2));
      });
      form.get('taxAmount').valueChanges.subscribe(value => {
        const totalAmount = Number(form.get('convenienceAmount').value) +
        Number(form.get('tipAmount').value) +
        Number(form.get('amount').value) + Number(value);
        form.get('captureAmount').patchValue(totalAmount.toFixed(2));
      });
    }
  }

  onValueChanged(formType , data?: any) {
    if (!formType) {
      return;
    }
    this.formErrors = this.validator.validate(formType);
  }

  find() {
    this.initiatePager();

    this.customerAccount = [];
    this.validateAllFormFields(this.findCustomerForm);
    this.formErrors = this.validator.validate(this.findCustomerForm);
    if (this.findCustomerForm.invalid) {
      return;
    }
    this.isLoader = true;
    this.noResultsMessage = 'No results found';
    let paramData = {};
    paramData = this.findCustomerForm.value;
    this.searchParamsData = paramData;
    this.searchParamsData['isEnabled'] = this.customerstate['active'];
    this.searchParamsData['AllActiveInactive'] = this.customersAllActiveInactive['active'];
    this.searchParamsData['PageSize'] = AppSetting.resultsPerPage;
    this.searchParamsData['StartRow'] = this.calculatePageSortRow(this.pager['currentPage'], this.pager['resultPerPage']);
    this.fetchCustomers(1);
  }

  clearForm() {
    this.findCustomerForm.reset();
  }

  clear(controlName) {
    this.findCustomerForm.get(controlName).setValue(null);
  }

  fetchCustomers(pageNumber) {
    this.isLoader = true;
    if (pageNumber <= 0) {
      this.isLoader = false;
      return;
    }
    if (this.pager['totalPages'] > 0) {
      if (pageNumber > this.pager['totalPages']) {
        this.isLoader = false;
        return;
      }
    }
    this.searchParamsData['StartRow'] = this.calculatePageSortRow(pageNumber, this.pager['resultPerPage']);
    this.customerService.findCustomer(this.searchParamsData, this.loggedInUser.parentId).subscribe(
      a => {
        this.hideCustomerTable = false;
        if (a.hasOwnProperty('data') && a['data'].length === 0) {
          this.searchResultFlag = false;
          this.isLoader = false;
        } else {
          this.allCustomers = a['data'];
          this.setPager(a, pageNumber);
          this.isLoader = false;
          this.accordion = {
            searchcustomer: false,
            customers: false,
            listofcustomeraccounts: false,
            transactiondetails: false,
            addressdetails: false
          };
          this.hideCustomerTable = false;
          this.searchResultFlag = true;
        }

      },
      error => {
        this.clearTransactionField();
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
      );
  }

  resetForm() {
    this.formErrors = {};
    this.creditCardForm.reset();
    this.debitCardForm.reset();
    this.achTransactionForm.reset();
    this.customerAddressForm.reset();
  }

  fetchCustomerAccount(customerId) {
    // we need to add the details here
    this.resetForm();
    this.customerAccount = [];
    this.isLoader = true;
    this.showCustomerName = true;
    if (this.isCreditCard) {
      for (const customer in this.allCustomers) {
        if (this.allCustomers[customer].id === customerId) {
          this.allCustomers[customer].billingContact.address.country = Number(this.allCustomers[customer].billingContact.address.country);
          this.stateList = this.States[this.allCustomers[customer].billingContact.address.country];
          this.currentCustomerDetails['billingContact'] = this.allCustomers[customer].billingContact;
          // splice first 20 characters in addressline1 since incase of Elavon more than 20 characters are not allowed.
          this.currentCustomerDetails['billingContact'].address.addressLine1 =
          this.allCustomers[customer].billingContact.address.addressLine1.slice(0, 20);
          this.currentCustomerDetails['customerId'] = customerId;
          this.setFormDetails(this.creditCardForm, customerId);
          this.creditCardForm.patchValue({'convenienceAmount': 0});
          this.creditCardForm.patchValue({'tipAmount': 0});
          this.creditCardForm.patchValue({'taxAmount': 0});
        }
      }

      this.customerService.fetchCustomerAccount(customerId, this.loggedInUser.parentId).subscribe(
        a => {
          this.hideCustomerAccountTable = false;
          if (a.hasOwnProperty('data') && a['data'].length === 0) {
            this.cardResultFlag = false;
            this.isLoader = false;
          } else {
              if (a) {
                let i = 0;
                for (const account in a) {
                  if (a[account].isCreditCard && a[account].isActive) {
                    this.customerAccount[i] = a[account];
                    i++;
                  }
                }
                this.cardResultFlag = true;
              } else {
                this.cardResultFlag = false;
              }
              this.isLoader = false;
              const scroll = document.querySelector('#creditcardAccountDetails');
              setTimeout(() => {
                scroll.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
              }, 250);
          }
        },
        error => {
          const toastMessage = Exception.exceptionMessage(error);
          this.isLoader = false;
          this.toastData = this.toasterService.error(toastMessage.join(', '));
        });
    }
    if (this.isDebitCard) {
      this.isLoader = false;
      this.debitCardForm.patchValue({'convenienceAmount': 0});
      this.debitCardForm.patchValue({'tipAmount': 0});
      this.debitCardForm.patchValue({'taxAmount': 0});
      for (const customer in this.allCustomers) {
        if (this.allCustomers[customer].id === customerId) {
          this.allCustomers[customer].billingContact.address.country = Number(this.allCustomers[customer].billingContact.address.country);
          if (this.allCustomers[customer].billingContact !== undefined) {
            this.currentCustomerDetails['billingContact'] = this.allCustomers[customer].billingContact;
            this.customerAddressForm.patchValue(this.currentCustomerDetails['billingContact']['address']);
          }
          this.currentCustomerDetails['customerId'] = this.allCustomers[customer].id;
        }
      }
      this.setFormDetails(this.debitCardForm, customerId);
      this.currentCustomerDetails['customerId'] = customerId;
      this.cardFormFieldValueChange(this.debitCardForm);
      this.accordion = {
        searchcustomer: false,
        customers: false,
        listofcustomeraccounts: false,
        transactiondetails: true,
        addressdetails: true
      };
    }
    if (this.isACH) {
      for (const customer in this.allCustomers) {
        if (this.allCustomers[customer].id === customerId) {
          this.allCustomers[customer].billingContact.address.country = Number(this.allCustomers[customer].billingContact.address.country);
          this.currentCustomerDetails['billingContact'] = this.allCustomers[customer].billingContact;
          this.currentCustomerDetails['customerId'] = this.allCustomers[customer].id;
        }
      }
      this.achTransactionForm.patchValue({'customerName': this.transaction.getCustomerName(this.currentCustomerDetails)});
      this.customerService.fetchCustomerAccount(customerId, this.loggedInUser.parentId).subscribe(
        a => {
          this.hideCustomerAccountTable = false;
          if (a.hasOwnProperty('data') && a['data'].length === 0) {
            // this.hideCustomerAccountTable = true;
            this.cardResultFlag = true;
            this.isLoader = false;
            // this.toastData = this.toasterService.error('No account details found for the user');
          } else {
            if (a) {
              let i = 0;
              for (const account in a) {
                if (!a[account].isCreditCard && a[account].isActive) {
                  this.customerAccount[i] = a[account];
                  const defaultmerchantName = this.loggedInUser.contact.name.firstName + ' ' + this.loggedInUser.contact.name.lastName;
                  this.achTransactionForm.patchValue({'payToTheOrderOf': defaultmerchantName});
                  this.achTransactionForm.patchValue({'secCode': 'TEL'});
                  i++;
                }
              }
              this.cardResultFlag = true;
            } else {
              this.cardResultFlag = false;
            }
            this.isLoader = false;
            const scroll = document.querySelector('#ACHAccountDetails');
            setTimeout(() => {
              scroll.scrollIntoView(false);
            }, 250);
          }
        },
        error => {
          const toastMessage = Exception.exceptionMessage(error);
          this.isLoader = false;
          this.toastData = this.toasterService.error(toastMessage.join(', '));
        });
    }
    // this.isLoader = false;
  }

  setFormDetails(form, customerId) {
    form.controls['customerId'].patchValue(customerId);
    form.patchValue({'customerName': this.transaction.getCustomerName(this.currentCustomerDetails)});
    form.controls['transactionType'].patchValue('0');
    if (this.isCreditCard) {
      form.controls['cvDataStatus'].patchValue('AV');
    }
  }

  setDataForTransaction(id) {
    this.resetForm();

    for (const account in this.customerAccount) {
      if (this.customerAccount[account].id === id) {
        this.currentCustomerDetails['customerAccountId'] = this.customerAccount[account].id;
        this.currentCustomerDetails['TenderInfo'] = this.customerAccount[account];
        if (this.isACH) {
          this.transaction.disableFormField(this.achTransactionForm, true, this.isACH);
        } else {
          this.transaction.disableFormField(this.creditCardForm, true, this.isACH);
        }
        this.accordion = {
          searchcustomer: false,
          customers: false,
          listofcustomeraccounts: false,
          transactiondetails: true,
          addressdetails: true
        };
        this.isNewTransaction = false;
        if (this.isCreditCard) {
          this.creditCardForm.patchValue(this.transaction.getTransaction(this.customerAccount[account],
            this.currentCustomerDetails));
          this.cardFormFieldValueChange(this.creditCardForm);
          this.creditCardForm.patchValue({'convenienceAmount': 0});
          this.creditCardForm.patchValue({'tipAmount': 0});
          this.creditCardForm.patchValue({'taxAmount': 0});
        } else if (this.isDebitCard) {
          this.debitCardForm.patchValue(this.transaction.getTransaction(this.customerAccount[account],
            this.currentCustomerDetails));
          this.cardFormFieldValueChange(this.debitCardForm);
          this.debitCardForm.patchValue({'convenienceAmount': 0});
          this.debitCardForm.patchValue({'tipAmount': 0});
          this.debitCardForm.patchValue({'taxAmount': 0});
        } else if (this.isACH) {
          const defaultmerchantName = this.loggedInUser.contact.name.firstName + ' ' + this.loggedInUser.contact.name.lastName;
          this.achTransactionForm.patchValue({'payToTheOrderOf': defaultmerchantName});
          this.achTransactionForm.patchValue({'secCode': 'TEL'});
          this.achTransactionForm.patchValue(this.transaction.getTransaction(this.customerAccount[account], this.currentCustomerDetails));
          this.achTransactionForm.patchValue({'accountType': (this.currentCustomerDetails['TenderInfo'].isCheckingAccount === 1) ?
          'Checking' : 'Saving'});
          this.cardFormFieldValueChange(this.achTransactionForm);
        }
        if (this.currentCustomerDetails['billingContact'] !== undefined) {
          this.customerAddressForm.patchValue(this.currentCustomerDetails['billingContact']['address']);
        }
        const scroll = document.querySelector('#transactionForms');
        setTimeout(() => {    // <<<---    using ()=> syntax
            if (scroll) {
              scroll.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
            }
          }, 250);
      }
    }
  }

  populateCountry() {
    this.commonService.getCountryList().subscribe(
      a => {
        this.countryList = a;
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  populateState(countryId) {
    this.formErrors['state'] = '';
    this.stateList = this.States[countryId];
  }

  initiatePager() {
    this.pager = {};
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

  sortCustomers(columnName, orderBy) {
    this.searchResultFlag = false;
    this.resetSortOrder();
    this.searchParamsData['SortField'] = columnName;
    this.searchParamsData['Asc'] = orderBy;

    this.sortColumnOrder[columnName] = !orderBy;
    this.fetchCustomers(1);
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

  calculatePageSortRow(pageNumber, resultPerPage) {
    return (((pageNumber * 1 ) - 1) * (resultPerPage * 1 ));
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

  processTransaction() {
    let tenderInfo: any;
    if (this.isCreditCard) {
      this.currentCustomerDetails['ChannelType'] = 3;
      this.currentCustomerDetails['InvoiceNo'] = this.creditCardForm.value.invoiceNo;
      this.validateAllFormFields(this.creditCardForm);
      this.formErrors = this.validator.validate(this.creditCardForm);
      if (this.creditCardForm.invalid) {
        return;
      }
      tenderInfo = this.creditCardForm.value;
      tenderInfo['captureAmount'] = this.creditCardForm.get('captureAmount').value;
      this.currentCustomerDetails['TenderInfo'] = tenderInfo;
      this.currentCustomerDetails['TenderInfo']['CardType'] =
      this.isNewTransaction ? Utilities.getCardType(tenderInfo.maskCardNumber) : '';
      this.currentCustomerDetails['operationType'] =
      Number(this.creditCardForm.get('transactionType').value);
    } else if (this.isDebitCard) {
      this.currentCustomerDetails['ChannelType'] = 4;
      this.currentCustomerDetails['InvoiceNo'] = this.debitCardForm.value.invoiceNo;
      this.validateAllFormFields(this.debitCardForm);
      this.formErrors = this.validator.validate(this.debitCardForm);
      if (this.debitCardForm.invalid) {
        return;
      }
      tenderInfo = this.debitCardForm.value;
      this.currentCustomerDetails['TenderInfo'] = tenderInfo;
      this.currentCustomerDetails['TenderInfo']['CardType'] =
      this.isNewTransaction ? Utilities.getCardType(tenderInfo.maskCardNumber) : '';
      this.currentCustomerDetails['operationType'] =
      Number(this.debitCardForm.get('transactionType').value);

    } else if (this.isACH) {
      this.currentCustomerDetails['ChannelType'] = 2;
      this.currentCustomerDetails['InvoiceNo'] = this.achTransactionForm.value.invoiceNo;
      this.validateAllFormFields(this.achTransactionForm);
      this.formErrors = this.validator.validate(this.achTransactionForm);
      if (this.achTransactionForm.invalid) {
        return;
      }
       tenderInfo = this.achTransactionForm.value;
       this.currentCustomerDetails['TenderInfo'] = tenderInfo;
       this.currentCustomerDetails['operationType'] = 0;
       this.currentCustomerDetails['TenderInfo']['NameOnCheck'] = tenderInfo.customerName;

    }
    this.isLoader = true;
    const address = this.customerAddressForm.value;
    this.currentCustomerDetails['merchantId'] = this.loggedInUser.parentId;
    this.currentCustomerDetails['isDebit'] = true;
    this.currentCustomerDetails['transactionOrigin'] = 1;
    if (this.isCreditCard || this.isDebitCard) {
      this.currentCustomerDetails['transactionCode'] = 'TEL';
    } else if (this.isACH) {
      this.currentCustomerDetails['transactionCode'] = this.achTransactionForm.controls['secCode'].value;
    }
    if (!this.currentCustomerDetails.hasOwnProperty('billingContact')) {
      this.currentCustomerDetails['billingContact'] = {};
      this.currentCustomerDetails['billingContact'].address = address;
    } else if (this.currentCustomerDetails['billingContact'] !== null) {
      this.currentCustomerDetails['billingContact'].address = address;
    }
      // we will have to change this, need to call an api to set this value
    this.processorConfigurationService.getProcessorConfiguration(
      null, this.currentCustomerDetails['merchantId'],
      this.currentCustomerDetails['ChannelType']).subscribe(x => {
        if (x.hasOwnProperty('data')) {
          if (x['data'].length === 0) {
            this.currentCustomerDetails['TrainingMode'] = true;
            // 'Processor is not set for this channel type'
            const channelType = ChannelTypeEnum[this.currentCustomerDetails['ChannelType']];
            this.isLoader = false;
            this.toastData = this.toasterService.error('Processor is not configured for ' + channelType + ' transactions.');
            // return;
          }
        } else {
          if (x[0].processorName === 'Dummy') {
            this.currentCustomerDetails['TrainingMode'] = true;
          } else {
            this.currentCustomerDetails['TrainingMode'] = false;
          }

        const transactionData = this.transaction.addTransaction(this.currentCustomerDetails, this.isNewTransaction);
        // transactionData.billingContact.phone = '8935550893'; //temporary fix for Actum
        // transactionData.billingContact.name = {
        //   'title': null,
        //   'firstName': this.achTransactionForm.controls['customerName'].value ,
        //   'middleName': null, 'lastName': null};

        // Temporary Code for certification testing
        // transactionData.transactionOrigin = (this.isMoto) ? 1 : 2;
        // Temporary Code for certification testing
        this.transactionService.processTransaction(this.currentCustomerDetails['merchantId'],
        transactionData).subscribe(a => {
            const transactionId = a['transactionId'];
            this.transactionDetails = a;
            this.transactionModalCounter = 0;
            this.transactionStatus = interval(AppSetting.getTransactionStatusTimer)
                        .subscribe((val) => {
                          this.callTransactionStatusapi(transactionId);
                          });
            setTimeout( () => {
              if (this.transactionStatus !== undefined) {
                this.isLoader = false;
                if (this.transactionModalCounter === 0) {
                  this.open();
                  this.transactionModalCounter++;
                }
                this.transactionStatus.unsubscribe();
              }
              }, AppSetting.stopGetTransactionStatusTimer);
          },
          error => {
            const toastMessage = Exception.exceptionMessage(error);
            this.isLoader = false;
            this.toastData = this.toasterService.error(toastMessage.join(', '));
          });
        }
        },
        error => {
          const toastMessage = Exception.exceptionMessage(error);
          this.isLoader = false;
          this.toastData = this.toasterService.error(toastMessage.join(', '));
        });
    }

  clearTransactionField() {
    if (this.isACH) {
      this.transaction.disableFormField(this.achTransactionForm, false, this.isACH);
    } else {
      this.transaction.disableFormField(this.creditCardForm, false, this.isACH);
    }
    this.initializeForm();
  }

  callTransactionStatusapi(transactionId) {
    this.transactionService.getTransactionStatus(this.loggedInUser.parentId, transactionId).subscribe
                      (b => {
                        if ('transactionResult' in b) {
                          if (b['transactionResult'] !== null) {
                            if ('processorAuthCode' in b['transactionResult']) {
                              this.transactionDetails = b;
                              this.isLoader = false;
                              if (this.transactionModalCounter === 0) {
                                this.open();
                                this.transactionModalCounter++;
                              }
                              this.transactionStatus.unsubscribe();
                            }
                          }
                        }
                      },
                      error => {
                        const toastMessage = Exception.exceptionMessage(error);
                        this.isLoader = false;
                        this.toastData = this.toasterService.error(toastMessage.join(', '));
                      });
  }

  cvvDataStatusOnChange(event) {
    this.cvvField = event === 'AV' ? true : false;
  }

  handleEnterKeyPress(event) {
    return;
  }

  hideAll(flag) {
    this.showEverything = flag;
    for (const i in this.accordion) {
      if (i) {
        this.accordion[i] = !flag;
      }
    }
  }

  enumSelector(definition) {
    return Object.keys(definition)
      .map(key => ({ value: definition[key], title: key }));
  }

  date(date, type, transactionDetails) {

    const localDate = moment.utc(date).local();
    if (type === 'date') {
      return this.commonService.getFormattedDate(localDate['_d']);
    }
    if (type === 'time') {
      return this.commonService.getFormattedTime(localDate['_d']);
    }
  }

  convert_to_24h(time_str) {
    // Convert a string like 10:05:23 PM to 24h format, returns like [22,5,23]
    const time = time_str.match(/(\d+):(\d+):(\d+) (\w)/);
    let hours = Number(time[1]);
    const minutes = Number(time[2]);
    const seconds = Number(time[3]);
    const meridian = time[4].toLowerCase();

    if (meridian == 'p' && hours < 12) {
      hours += 12;
    } else if (meridian == 'a' && hours == 12) {
      hours -= 12;
    }
    return hours + ':' + minutes + ':' + seconds;
  }

  convertUTCDateToLocalDate(date) {
    const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    const offset = date.getTimezoneOffset() / 60;
    const hours = date.getHours();
    newDate.setHours(hours - offset);
    return newDate;
  }

  getenum(type) {
    if (type === 'transType') {
      return TransactionOperationEnum[this.transactionDetails['operationType']];
    }
    if (type === 'status') {
      return TransactionStatusMapEnum[TransactionStatusEnum[this.transactionDetails['transactionStatus']]];
    }
  }

  getTransactionAuthCode() {
    const authcode = this.transactionDetails['transactionResult'] !== null ?
    this.transactionDetails['transactionResult'].processorAuthCode : '';
    return authcode;
  }

  toggleShow() {
    this.showcvv = !this.showcvv;
  }

  getAddressDetails(field) {
    try {
        if (this.currentCustomerDetails['billingContact'] !== undefined &&
        this.currentCustomerDetails['billingContact'] !== null) {
            if (this.currentCustomerDetails['billingContact'].address !== undefined &&
            this.currentCustomerDetails['billingContact'].address !== null) {
              if (field === 'addressLine1') {
              return this.currentCustomerDetails['billingContact'].address.addressLine1;
            }
            if (field === 'city') {
              return this.currentCustomerDetails['billingContact'].address.city;
            }
            if (field === 'postalCode') {
              return this.currentCustomerDetails['billingContact'].address.postalCode;
            }
          }
        }
      } catch (e) {
        return '-';
      }
  }

  getTransErrorMessage() {
    if ( this.transactionDetails['transactionStatus'] === 14
      || this.transactionDetails['transactionStatus'] === 5) {
        const msg = Exception.getExceptionMessage(this.transactionDetails['transactionResult'].reasonMessage);
        if (msg !== '') {
          this.transactionDetails['transactionResult'].reasonMessage = msg;
          return this.transactionDetails['transactionResult'].reasonMessage;
        } else {
          if ( this.transactionDetails['transactionResult'].reasonMessage === null) {
            this.transactionDetails['transactionResult'].reasonMessage = this.transactionDetails['transactionResult'].reasonCode;
          }
          // Other than these keys, all other messages will be displayed directly as received from backend
          return this.transactionDetails['transactionResult'].reasonMessage;
        }
      }
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementsByClassName('content modal-content')[0].innerHTML;
    printContents = '<div><h3 align="center"><u>Transaction Receipt</u></h3><div>' + printContents;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}
