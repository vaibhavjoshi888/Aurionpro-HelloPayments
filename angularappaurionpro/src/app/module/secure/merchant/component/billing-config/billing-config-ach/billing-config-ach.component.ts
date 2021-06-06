import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationSetting } from '../../../../../../constant/validation.constant';
import { FrequencyEnum, FrequencyParamEnum } from '../../../../../../enum/billing-execution.enum';
import { DatepickerMode } from 'ng2-semantic-ui';
import { BillingConfig } from '../billing-config';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { AchAccountType } from '../../../../../../enum/ach-account-type.enum';
import { Validator } from '../../../../../../common/validation/validator';

@Component({
  selector: 'app-billing-config-ach',
  templateUrl: './billing-config-ach.component.html',
  styleUrls: ['./billing-config-ach.component.css']
})
export class BillingConfigAchComponent implements OnInit {
  mode: DatepickerMode = DatepickerMode.Date;
  private _billingConfig = new BehaviorSubject<BillingConfig[]>([]);
  @Input() set billingConfig(value: BillingConfig[]) {
    this._billingConfig.next(value);
  }
  get items() {
    return this._billingConfig.getValue();
  }
  billingConfigAchForm: any;
  frequencyList = [];
  frequencyParamList = [];
  isfrequencyParamhidden = true;
  achAccountType: any;
  validator: Validator;
  formErrors = {};
  config = {
    'bankName': {
      required: { name: ValidationSetting.billingConfig.bankName.name},
    },
    'routingNumber': {
      required: { name: ValidationSetting.billingConfig.routingNumber.name},
    },
    'accountNumber': {
      required: { name: ValidationSetting.billingConfig.accountNumber.name},
    },
    'frequency': {
      required: { name: ValidationSetting.billingConfig.ccType.name},
    },
    'frequencyParam': {
      required: { name: ValidationSetting.billingConfig.ccType.name},
    },
    'startDate': {
      required: { name: ValidationSetting.billingConfig.startDate.name},
    },
    'nextBillingDate': {
      // required: { name: ValidationSetting.billingConfig.billingStartDate.name},
    },
  };
  constructor(private formBuilder: FormBuilder) {
    this.validator = new Validator(this.config);
   }

  ngOnInit() {
    this.frequencyList = this.enumSelector(FrequencyEnum);
    this.achAccountType = this.enumSelector(AchAccountType);
    this._billingConfig.subscribe(x => {
      this.billingConfigAchForm = this.formBuilder.group({
        'bankName' : ['', [ Validators.required ]],
        'accountType' : ['Saving', [ Validators.required ]],
        'routingNumber' : ['', [ Validators.required ]],
        'accountNumber' : ['', [ Validators.required ]],
        'frequency' : ['0'],
        'frequencyParam' : ['sun'],
        'startDate' : ['', [ Validators.required ]],
        'nextBillingDate': [{value: '', disabled: true}]
      });
      if (x !== undefined) {
        if (!x['isCreditCard']) {
          if (x['startDate'] !== undefined && x['startDate'] !== null && x['startDate'] !== '') {
            x['startDate'] = new Date(x['startDate']);
          }
          if (x['nextBillingDate'] !== null && x['nextBillingDate'] !== undefined) {
            const tempNextBillingDate = new Date(x['nextBillingDate']);
            const nextBillingDate = tempNextBillingDate.
            toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
            x['nextBillingDate'] = nextBillingDate;
          }
          if (x['frequency'] !== null && x['frequency'] !== undefined) {
            x['frequency'] = x['frequency'].toString();
          }
        } else {
          // x['startDate'] = new Date();
          // x['nextBillingDate'] = '';
        }
        this.changeBillingExecution(x['frequency']);

        // if (x['frequencyParam'] === 1 && x['frequencyParam'] === 2 && x['frequencyParam'] === 3 ) {
        if (x['frequency'] === '1' || x['frequency'] === '2' || x['frequency'] === '3' ) {

          this.isfrequencyParamhidden = false;
        } else {
          this.isfrequencyParamhidden = true;
        }
        if (x['accountType'] === null) {
          x['accountType'] = 'Saving';
        }
        this.billingConfigAchForm.patchValue(x);
      } else {
        // x['startDate'] = new Date();
      }
      this.billingConfigAchForm.valueChanges.subscribe(data => {
        this.onValueChanged(this.billingConfigAchForm); });
   });
  }

  onValueChanged(formType) {
    if (!formType) {
      return;
    }
    this.formErrors = this.validator.validate(formType);
  }

  changeBillingExecution(BillingExecution) {
    if (this.frequencyList[BillingExecution] !== undefined) {
      const frequency = this.frequencyList[BillingExecution].title;
      if (frequency === 'Weekly' || frequency === 'BiWeekly') {
        this.isfrequencyParamhidden = false;
        this.frequencyParamList = this.enumSelector(FrequencyParamEnum);
        this.billingConfigAchForm.controls['frequencyParam'].patchValue('sun');
      } else if ( frequency === 'Monthly') {
        this.isfrequencyParamhidden = false;
        const monthlyValue = [];
          for (let i = 1; i <= 31; i++) {
            monthlyValue.push({ value: i.toString(), title: i.toString() });
          }
          monthlyValue.push({ value: 'Last', title: 'Last' });
        this.frequencyParamList = monthlyValue;
        this.billingConfigAchForm.controls['frequencyParam'].patchValue(1);
      } else {
        this.isfrequencyParamhidden = true;
        this.billingConfigAchForm.controls['frequencyParam'].patchValue(null);
      }
    }
    // this.billingConfig = this.billingConfigAchForm.value;
  }

  save() {
    this.validateAllFormFields(this.billingConfigAchForm);
    this.formErrors = this.validator.validate(this.billingConfigAchForm);
    if (this.billingConfigAchForm.invalid) {
      return false;
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

  clear(field) {

  }

  enumSelector(definition) {
    return Object.keys(definition)
      .map(key => ({ value: definition[key], title: key }));
  }
}
