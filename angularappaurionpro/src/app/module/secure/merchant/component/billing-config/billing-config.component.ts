import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { DatepickerMode } from 'ng2-semantic-ui';

import { ValidationSetting } from '../../../../../constant/validation.constant';
import { RatePlanService } from '../../../../../api/rate-plan.service';
// import { BillingExecutionEnum } from '../../../../../enum/billing-execution.enum';
import { BillingConfigService } from '../../../../../api/billing-config.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { BillingConfig } from './billing-config';
import { ToasterService } from '../../../../../api/toaster.service';
import { MessageSetting } from '../../../../../constant/message-setting.constant';
import { Validator } from '../../../../../common/validation/validator';
import { Exception } from '../../../../../common/exceptions/exception';
import { filter } from 'rxjs/operators';
import { AccessRightsService } from '../../../../../api/access-rights.service';
import { StorageType } from '../../../../../enum/storage.enum';
import { StorageService } from '../../../../../common/session/storage.service';

@Component({
  selector: 'app-billing-config',
  templateUrl: './billing-config.component.html',
  styleUrls: ['./billing-config.component.css'],
})
export class BillingConfigComponent implements OnInit {
  @ViewChild('billingconfigcard')
  billingconfigcard: any;
  @ViewChild('billingconfigach')
  billingconfigach: any;
  isLoader: any;
  toastData: any;
  ratePlanList: any;
  selectedRatePlan: Number;
  paymentMode: String;
  isCreditCard: Boolean;
  billingconfig: BillingConfig[];
  merchantId: Number;
  resellerId: Number;
  // isDisabled = false;
  isEnabled = false;
  validator: Validator;
  billingConfigForm: any;
  formErrors = {};

  config = {
    RatePlanName: {
      required: { name: ValidationSetting.billingConfig.ratePlan.name }
    }
  };

  constructor(private formBuilder: FormBuilder,
    private ratePlanService: RatePlanService,
    private billingConfigService: BillingConfigService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private route: Router,
    private accessRights: AccessRightsService,
    private storageService: StorageService) {
    this.validator = new Validator(this.config);
   }

  ngOnInit() {
    this.billingConfigForm = this.formBuilder.group({
      'RatePlanName': ['', [Validators.required]]
    });
    this.isLoader = true;
    this.activatedRoute.params.subscribe(routeParams => {
      this.resellerId = routeParams.resellerId;
      this.merchantId = routeParams.id;
    });
    this.ratePlanService.getRatePlanListforBillingConfig(this.resellerId).subscribe(response => {
      // if rate plan is not added by parent reseller then navigate logged in user to respective screen
      if (response['data'] !== undefined && response['data']['length'] === 0) {
        this.isLoader = false;
        const loggedInUserData = JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
        let redirectLink = '';
        if (loggedInUserData.parentId === 0) {
          redirectLink = `/merchant/view/${this.resellerId}/${this.merchantId}`;
        } else {
          redirectLink = `rateplan/add`;
        }
        this.toastData = this.toasterService.errorRedirect(MessageSetting.billingConfig.ratePlanNotExist, redirectLink);
      } else {
        this.ratePlanList = response;
        this.getBillingConfig();
      }

    },
    error => {
      const toastMessage = Exception.exceptionMessage(error);
      this.isLoader = false;
      this.toastData = this.toasterService.error(toastMessage.join(', '));
    });

    this.billingConfigForm.valueChanges.subscribe(data =>
      this.onValueChanged(data)
    );
  }

  hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess) {
    return this.accessRights.hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess);
  }

  onValueChanged(data?: any) {
    if (!this.billingConfigForm) {
      return;
    }
    this.formErrors = this.validator.validate(this.billingConfigForm);
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

  getBillingConfig() {
    this.billingConfigService.getbillingConfig(this.merchantId, this.resellerId).subscribe((config: BillingConfig[]) => {
      this.billingConfigForm.controls['RatePlanName'].patchValue(config['ratePlanId']);
      // this.selectedRatePlan = config['ratePlanId'];
      this.billingconfig = config;
      if (config['isCreditCard']) {
        this.isCreditCard = config['isCreditCard'];
        this.paymentMode = 'creditCard';
      } else {
        this.paymentMode = 'ach';
      }
      // this.isDisabled = !config['isEnabled'];
      this.isEnabled = config['isEnabled'];

      this.isLoader = false;
    },
    error => {
      const toastMessage = Exception.exceptionMessage(error);
      this.isLoader = false;
      this.toastData = this.toasterService.error(toastMessage.join(', '));
    });
  }

  changeRatePlan(RatePlan) {

  }

  save(saveAndContinue) {
    // this.formError.next('I was clicked');
    this.validateAllFormFields(this.billingConfigForm);
    this.formErrors = this.validator.validate(this.billingConfigForm);

    let billingconfig = {};
    if (this.isCreditCard) {
      if (this.billingconfigcard.save()) {
        billingconfig = this.billingconfigcard.billingConfigCardForm.getRawValue();
      } else {
        this.isLoader = false;
        return;
      }
    } else {
      if (this.billingconfigach.save()) {
        billingconfig = this.billingconfigach.billingConfigAchForm.getRawValue();
      } else {
        this.isLoader = false;
        return;
      }
    }

    if (this.billingConfigForm.invalid) {
      return;
    }
    this.isLoader = true;

    if (billingconfig['startDate'] !== undefined &&
    billingconfig['startDate'] !== null && billingconfig['startDate'] !== '') {
      billingconfig['startDate'] = new Date(billingconfig['startDate'].getTime() -
      billingconfig['startDate'].getTimezoneOffset() * 60000).toISOString();
      }
    billingconfig['ratePlanId'] = this.billingConfigForm.get('RatePlanName').value;
    // billingconfig['ratePlanId'] = this.selectedRatePlan;
    billingconfig['isCreditCard'] = this.isCreditCard;
    billingconfig['merchantId'] = this.merchantId;
    // billingconfig['isEnabled'] = !this.isDisabled;
    billingconfig['isEnabled'] = this.isEnabled;

    if (billingconfig['frequency'] === '0' || billingconfig['frequency'] === '0') {
      billingconfig['frequencyParam'] = null;
    }
    this.billingConfigService.putBillingConfig(this.merchantId, this.resellerId, billingconfig).subscribe(
      a => {
        this.getBillingConfig();
        this.isLoader = false;
        if (saveAndContinue === true) {
          // Auto navigate on save click
          const redirectLink = `/merchant/view/${this.resellerId}/${this.merchantId}`;
          this.toastData = this.toasterService.successRedirect(MessageSetting.billingConfig.add, redirectLink);
        } else {
          this.toastData = this.toasterService.success(MessageSetting.billingConfig.add);
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
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params !== undefined && params.fromProcessorConfiguration !== undefined && params.fromProcessorConfiguration === 'fromProcessorConfiguration') {
        const url =  `/merchant/view/${this.resellerId}/${this.merchantId}/processorconfiguration/fromAllowedTransactionTypes`;
        this.route.navigate([url], {skipLocationChange: true});
      } else {
        const url = `merchant/view/${this.resellerId}/${this.merchantId}`;
        this.route.navigate([url], {skipLocationChange: true});
      }
    });
  }

  clear() {
    if (this.isCreditCard) {
    this.billingconfigcard.billingConfigCardForm.reset();
    } else {
      this.billingconfigach.billingConfigAchForm.reset();
    }
  }

  // navigateToView() {
  //   const url = 'merchant/view/' + this.resellerId + '/' + this.merchantId;
  //   this.route.navigate([url], { queryParams:  filter, skipLocationChange: true});
  // }

  paymentModeChanged(value) {
    if (value === 'ach') {
      const formData = this.billingconfigcard.billingConfigCardForm.getRawValue();
      for (const item in formData) {
        if (item) {
          if (item !== 'startDate' && item !== 'nextBillingDate') {
            this.billingconfig[item] = formData[item];
          }
        }
      }
      this.isCreditCard = false;
    }
    if (value === 'creditCard') {
      const formData = this.billingconfigach.billingConfigAchForm.getRawValue();
      for (const item in formData) {
        if (item) {
          if (item !== 'startDate' && item !== 'nextBillingDate') {
          this.billingconfig[item] = formData[item];
          }
        }
      }
      this.isCreditCard = true;
    }
  }

  enumSelector(definition) {
    return Object.keys(definition)
      .map(key => ({ value: definition[key], title: key }));
  }
}
