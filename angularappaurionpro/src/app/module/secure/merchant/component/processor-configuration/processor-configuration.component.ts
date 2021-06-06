import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ComponentModalConfig, ModalSize, SuiModalService, ModalTemplate, TemplateModalConfig } from 'ng2-semantic-ui';

import { ProcessorConfigurationService } from '../../../../../api/processor-configuration.service';
import { ToasterService } from '../../../../../api/toaster.service';
import { ValidationSetting } from '../../../../../constant/validation.constant';
import { MessageSetting } from '../../../../../constant/message-setting.constant';
import { ChannelTypeEnum } from '../../../../../enum/channeltypes.enum';
import { Validator } from '../../../../../common/validation/validator';
import { Exception } from '../../../../../common/exceptions/exception';
import { AccessRightsService } from '../../../../../api/access-rights.service';
import { ConfirmModalComponent } from '../../../../common/modal/modal.component';
import { MerchantService } from '../../../../../api/merchant.service';

export interface IContext {
  data: string;
}

@Component({
  selector: 'app-processor-configuration',
  templateUrl: './processor-configuration.component.html',
  styleUrls: ['./processor-configuration.component.css']
})
export class ProcessorConfigurationComponent implements OnInit {
  @ViewChild('confirmationModal')
  public confirmationModal: ModalTemplate<IContext, string, string>;
  confirmationModalMessage = '';

  isLoader: any;
  toastData: any;
  processorList: any = [];
  channelTypesList: any = [];
  merchantId;
  resellerId;
  channelType;
  gatewayName;
  showCreditTab;
  showDebitTab;
  showAchTab;
  savedProcessorName;
  activeTab = 'DebitCard';
  isActiveCreditCard;
  isActiveDebitCard;
  isActiveAch;
  selectedProcessor = '';
  fundingDays = 0;
  supportedProvisionedData = {};
  processorConfigurationForm: any = {};
  formErrors = {};
  validator: Validator;
  showPassword = false;
  selectProcessorValidationError = false;

  // config = {
  //   'SelectProcessor': {
  //     required: { name: ValidationSetting.processorConfiguration.selectProcessor.name},
  //   },
  //   'FundingDays': {
  //     required: { name: ValidationSetting.processorConfiguration.fundingDays.name},
  //     pattern: { name: ValidationSetting.processorConfiguration.fundingDays.name }
  //   }
  // };

  constructor(private processorConfigurationService: ProcessorConfigurationService,
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private accessRights: AccessRightsService,
    private modalService: SuiModalService,
    private merchantService: MerchantService) {
      // this.validator = new Validator(this.config);
    }

  ngOnInit() {
    this.processorConfigurationForm = this.formBuilder.group({
      'SelectProcessor': ['', [Validators.required]]
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      this.merchantId = params.id;
      this.resellerId = params.resellerId;
      // this.channelType = ChannelTypeEnum['CreditCard'];
      // this.getAllChannelTypes();
      this.getAllGateways();
      this.getAllowedTransactionTypes();
      // this.getProcessorConfiguration();
      // this.getProcessorList();
    });
    // this.processorConfigurationForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess) {
    return this.accessRights.hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess);
  }

  // onValueChanged(data?: any) {
  //   if (!this.processorConfigurationForm) {
  //     return;
  //   }
  //   this.formErrors = this.validator.validate(this.processorConfigurationForm);
  // }

  // validateAllFormFields(formGroup: FormGroup) {
  //   Object.keys(formGroup.controls).forEach(field => {
  //     const control = formGroup.get(field);
  //     if (control instanceof FormControl) {
  //       control.markAsTouched({ onlySelf: true });
  //       control.markAsDirty({ onlySelf: true });
  //     } else if (control instanceof FormGroup) {
  //       this.validateAllFormFields(control);
  //     }
  //   });
  // }

  getAllGateways() {
    this.processorConfigurationService.getAllGateways().subscribe(
      response => {
        this.gatewayName = response[0].name;
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  getAllowedTransactionTypes() {
    this.isLoader = true;
    this.processorConfigurationService.getAllowedTransactionTypes(this.resellerId, this.merchantId).subscribe(
      response => {
        if (Array.isArray(response)) {
          this.getProcessorList();
          // get distinct channel types from response
          this.channelTypesList = response.map(item => item.channelType).filter((value, index, self) => self.indexOf(value) === index);
          if (this.channelTypesList.indexOf(parseInt(ChannelTypeEnum.ACH.toString(), 10)) > -1) {
            this.channelType = ChannelTypeEnum.ACH;
            this.showAchTab = true;
            this.activeTab = 'ACH';
            this.isActiveCreditCard = false;
            this.isActiveDebitCard = false;
            this.isActiveAch = true;
          }
          if (this.channelTypesList.indexOf(parseInt(ChannelTypeEnum.DebitCard.toString(), 10)) > -1) {
            this.channelType = ChannelTypeEnum.DebitCard;
            this.showDebitTab = true;
            this.activeTab = 'DebitCard';
            this.isActiveCreditCard = false;
            this.isActiveDebitCard = true;
            this.isActiveAch = false;
          }
          if (this.channelTypesList.indexOf(parseInt(ChannelTypeEnum.CreditCard.toString(), 10)) > -1) {
            this.channelType = ChannelTypeEnum['CreditCard'];
            this.showCreditTab = true;
            this.activeTab = 'CreditCard';
            this.isActiveCreditCard = true;
            this.isActiveDebitCard = false;
            this.isActiveAch = false;
          }
          // this.showCreditTab = this.channelTypesList.indexOf(parseInt(ChannelTypeEnum['CreditCard'], 10)) > -1 ? true : false;
          // this.showDebitTab = this.channelTypesList.indexOf(parseInt(ChannelTypeEnum['DebitCard'], 10)) > -1 ? true : false;
          // this.showAchTab = this.channelTypesList.indexOf(parseInt(ChannelTypeEnum['ACH'], 10)) > -1 ? true : false;
        } else {
          this.isLoader = false;
          const redirectLink = `merchant/view/${this.resellerId}/${this.merchantId}/allowedtransactiontype`;
          this.toastData = this.toasterService.errorRedirect(MessageSetting.processorConfiguration.allowedTransactionTypeError, redirectLink);
        }
        // this.isLoader = false;
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  getProcessorConfiguration() {
    this.isLoader = true;
    this.processorConfigurationService.getProcessorConfiguration(this.resellerId, this.merchantId, this.channelType).subscribe(
      (response: any) => {
        if (response[0] !== undefined && response[0].provisionedDataMap !== '' && response[0].provisionedDataMap != null) {
          this.fundingDays = response[0].fundingDays;
          // setTimeout(() => {
          //   this.processorConfigurationForm.controls['SelectProcessor'].patchValue(response[0].processorName);
          // }, 10);
          this.selectedProcessor = response[0].processorName;
          this.savedProcessorName = response[0].processorName;
          this.supportedProvisionedData = JSON.parse(response[0].provisionedDataMap);
        } else {
          this.savedProcessorName = '';
        }
        this.isLoader = false;
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  getProcessorList() {
    this.isLoader = true;
    this.processorConfigurationService.getProcessorList().subscribe(
      (response: any) => {
        this.processorList = [];
        this.getProcessorConfiguration();
        response.forEach(element => {
          element.supportedOperations = JSON.parse(element.supportedOperations);
          if (this.channelType === ChannelTypeEnum['CreditCard'] && element.supportedOperations.CreditCard !== undefined) {
            this.processorList.push(element);
          } else if (this.channelType === ChannelTypeEnum['DebitCard'] && element.supportedOperations.DebitCard !== undefined) {
            this.processorList.push(element);
          } else if (this.channelType === ChannelTypeEnum['ACH'] && element.supportedOperations.ACH !== undefined) {
            this.processorList.push(element);
          }
        });
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  generateTemplate(data) {
    data = JSON.parse(data);
    this.supportedProvisionedData = data;
  }

  changeSelectProcessor(processorName) {
    // this.processorConfigurationForm.controls['SelectProcessor'].patchValue(processorName);
    this.selectProcessorValidationError = false;
    this.selectedProcessor = processorName;
    this.fundingDays = 0;
    this.showPassword = false;
    if (this.savedProcessorName === processorName) {
      this.getProcessorConfiguration();
    } else {
      this.supportedProvisionedData = this.processorList.filter(
        (x): any => x.name === processorName
      )[0].supportedProvisionedData;
      this.generateTemplate(this.supportedProvisionedData);

      for ( let i in this.supportedProvisionedData) {
        if (this.supportedProvisionedData[i]) {
          this.supportedProvisionedData[i].ErrorMessage = false;
        }
      }
    }
  }

  onTabChange(channelType) {
    this.activeTab = channelType;
    // this.processorConfigurationForm.controls['SelectProcessor'].patchValue('');
    this.selectProcessorValidationError = false;
    this.selectedProcessor = '';
    this.fundingDays = 0;
    this.supportedProvisionedData = {};
    this.channelType = ChannelTypeEnum[channelType];
    this.showPassword = false;
    this.getProcessorList();
  }

  save(saveAndContinue) {
    // this.validateAllFormFields(this.processorConfigurationForm);
    // this.formErrors = this.validator.validate(this.processorConfigurationForm);
    // if (this.processorConfigurationForm.invalid) {
    //   return;
    // }
    if (this.selectedProcessor === '') {
      this.selectProcessorValidationError = true;
      return;
    }

    let displayValidationMessage = false;
    for (const i in this.supportedProvisionedData) {
      if (this.supportedProvisionedData[i]) {
        if (this.supportedProvisionedData[i].Name === 'TerminalTypeMoto' && this.supportedProvisionedData[i].Value.trim() === '') {
          for (const j in this.supportedProvisionedData) {
            if (this.supportedProvisionedData[j]) {
              if (this.supportedProvisionedData[j].Name === 'TerminalTypeEcom' && this.supportedProvisionedData[j].Value.trim() === '') {
                this.supportedProvisionedData[i].ErrorMessage = true;
                displayValidationMessage = true;
              }
            }
          }
        } else if (this.supportedProvisionedData[i].Value.trim() === '' && (this.supportedProvisionedData[i].Name !== 'TerminalTypeMoto' && this.supportedProvisionedData[i].Name !== 'TerminalTypeEcom')) {
          this.supportedProvisionedData[i].ErrorMessage = true;
          displayValidationMessage = true;
        }
      }
    }
    if (displayValidationMessage) {
      return;
    }
    const reqObj: any = {};
    reqObj.merchantId = this.merchantId;
    reqObj.channelType = this.channelType;
    reqObj.fundingDays = (this.fundingDays !== undefined || this.fundingDays !== null) ? this.fundingDays : 0 ;
    // reqObj.processorName = this.processorConfigurationForm.get('SelectProcessor').value;
    reqObj.processorName = this.selectedProcessor;
    reqObj.gatewayName = this.gatewayName;
    reqObj.provisionedDataMap = JSON.stringify(this.supportedProvisionedData);
    this.isLoader = true;
    this.processorConfigurationService.setProcessorConfiguration(this.resellerId, this.merchantId, this.channelType, reqObj).subscribe(
      response => {
        let message;
        if (reqObj.channelType === ChannelTypeEnum['CreditCard']) {
          message = `Credit Card ${MessageSetting.processorConfiguration.saveSuccess}`;
        } else if (reqObj.channelType === ChannelTypeEnum['DebitCard']) {
          message = `Debit Card ${MessageSetting.processorConfiguration.saveSuccess}`;
        } else if (reqObj.channelType === ChannelTypeEnum['ACH']) {
          message = `ACH ${MessageSetting.processorConfiguration.saveSuccess}`;
        }

        if (saveAndContinue === true) {
          this.processorConfigurationService.getProcessorConfiguration(this.resellerId, this.merchantId, ChannelTypeEnum.CreditCard).subscribe(
            (creditCardProcessorConfiguration: any) => {
              this.processorConfigurationService.getProcessorConfiguration(this.resellerId, this.merchantId, ChannelTypeEnum.DebitCard).subscribe(
                (debitCardProcessorConfiguration: any) => {
                  this.processorConfigurationService.getProcessorConfiguration(this.resellerId, this.merchantId, ChannelTypeEnum.ACH).subscribe(
                    (achProcessorConfiguration: any) => {
                      if (creditCardProcessorConfiguration[0] === undefined && this.showCreditTab) {
                        this.confirmationModalMessage = 'Credit';
                      }
                      if (debitCardProcessorConfiguration[0] === undefined && this.showDebitTab) {
                        this.confirmationModalMessage = this.confirmationModalMessage === '' ? `Debit` : `${this.confirmationModalMessage}, Debit `;
                      }
                      if (achProcessorConfiguration[0] === undefined && this.showAchTab) {
                        this.confirmationModalMessage = this.confirmationModalMessage === '' ? `ACH` : `${this.confirmationModalMessage}, ACH`;
                      }

                      if (this.confirmationModalMessage === '') {
                        this.isLoader = false;
                        // Auto navigate on save click
                        const redirectLink = `/merchant/view/${this.resellerId}/${this.merchantId}/billingconfig/fromProcessorConfiguration`;
                        this.toastData = this.toasterService.successRedirect(message, redirectLink);
                      } else {
                        this.isLoader = false;
                        this.confirmationModalMessage = `Processor configuration for ${this.confirmationModalMessage} is pending`;
                        const config = new TemplateModalConfig<IContext, string, string>(this.confirmationModal);
                        config.isClosable = false;
                        config.transitionDuration = 200;
                        config.size = ModalSize.Small;
                        this.modalService
                          .open(config)
                          .onApprove(result => {
                            // Auto navigate on save click
                            const redirectLink = `/merchant/view/${this.resellerId}/${this.merchantId}/billingconfig/fromProcessorConfiguration`;
                            this.toastData = this.toasterService.successRedirect(message, redirectLink);
                          })
                          .onDeny(result => {
                            this.toastData = this.toasterService.success(message);
                          });
                      }
                    },
                    error => {
                      const toastMessage = Exception.exceptionMessage(error);
                      this.isLoader = false;
                      this.toastData = this.toasterService.error(toastMessage.join(', '));
                    }
                  );
                },
                error => {
                  const toastMessage = Exception.exceptionMessage(error);
                  this.isLoader = false;
                  this.toastData = this.toasterService.error(toastMessage.join(', '));
                }
              );
            },
            error => {
              const toastMessage = Exception.exceptionMessage(error);
              this.isLoader = false;
              this.toastData = this.toasterService.error(toastMessage.join(', '));
            }
          );
        } else {
          this.isLoader = false;
          this.toastData = this.toasterService.success(message);
        }
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  cancel() {
    // this.router.navigate([`merchant/view/${this.resellerId}/${this.merchantId}`], { skipLocationChange: true });

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params !== undefined && params.fromAllowedTransactionTypes !== undefined && params.fromAllowedTransactionTypes === 'fromAllowedTransactionTypes') {
        if (this.merchantService.getIsFromAddMerchant()) {
          const url =  `/merchant/view/${this.resellerId}/${this.merchantId}/allowedtransactiontype/fromAddMerchant`;
          this.router.navigate([url], {skipLocationChange: true});
        } else {
          const url =  `/merchant/view/${this.resellerId}/${this.merchantId}/allowedtransactiontype`;
          this.router.navigate([url], {skipLocationChange: true});
        }
      } else {
        const url = `merchant/view/${this.resellerId}/${this.merchantId}`;
        this.router.navigate([url], {skipLocationChange: true});
      }
    });
  }

  // handle validation messages.
  handleError(inputfield) {
    if (inputfield.Value.trim() === '') {
      inputfield.ErrorMessage = true;
    } else {
      inputfield.ErrorMessage = false;
    }
  }

  // handle Show/Hide password
  toggleShow() {
    this.showPassword = !this.showPassword;
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
