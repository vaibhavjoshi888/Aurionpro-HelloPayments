import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ValidationSetting } from '../../../../../../constant/validation.constant';
import { FrequencyEnum, FrequencyParamEnum } from '../../../../../../enum/billing-execution.enum';
import { DatepickerMode } from 'ng2-semantic-ui';
import { BehaviorSubject, Subject } from 'rxjs';
import { BillingConfig } from '../billing-config';
import { CardValidation } from '../../../../../../common/validation/validation';
import { Validator } from '../../../../../../common/validation/validator';
import { Utilities } from '../../../../../../common/utilities';

@Component({
  selector: 'app-billing-config-card',
  templateUrl: './billing-config-card.component.html',
  styleUrls: ['./billing-config-card.component.css']
})
export class BillingConfigCardComponent implements OnInit, OnChanges{
  private _billingConfig = new BehaviorSubject<BillingConfig[]>([]);
  @Input() set billingConfig(value: BillingConfig[]) {
    this._billingConfig.next(value);
  }
  get items() {
    return this._billingConfig.getValue();
  }

  mode: DatepickerMode = DatepickerMode.Date;
  billingConfigCardForm: any;
  frequencyList = [];
  frequencyParamList = [];
  formErrors = {};
  isfrequencyParamhidden = true;
  validator: Validator;
  billingconfig = {};

  config = {
    'creditCardNumber': {
      required: { name: ValidationSetting.transaction.add.cardNumber.name },
      maxlength: {
        name: ValidationSetting.transaction.add.cardNumber.name,
        max: ValidationSetting.transaction.add.cardNumber.maxLength.toString()
      },
      cardNumber: { name: 'Card' },
    },
    'cardExpiry': {
      required: { name: ValidationSetting.transaction.add.cardExpiry.name },
      maxlength: {
        name: ValidationSetting.transaction.add.cardExpiry.name,
        max: ValidationSetting.transaction.add.cardExpiry.maxLength.toString()
      },
      pattern: { name: ValidationSetting.transaction.add.cardExpiry.name },
      expiryDate: { name: 'Expiry Date'},
    },
    'cardType': {
      required: { name: ValidationSetting.billingConfig.ccType.name},
    },
    'frequency': {
      // required: { name: ValidationSetting.billingConfig.billingExecution.name},
    },
    'frequencyParam': {
      // required: { name: ValidationSetting.billingConfig.billingExecution.name},
    },
    'startDate': {
      required: { name: ValidationSetting.billingConfig.billingStartDate.name},
    },
  };

  constructor(private formBuilder: FormBuilder) {
    this.validator = new Validator(this.config);
   }



  ngOnInit() {
    this.frequencyList = this.enumSelector(FrequencyEnum);
    this._billingConfig.subscribe(x => {
      this.billingConfigCardForm = this.formBuilder.group({
        'creditCardNumber' : ['', [ Validators.required ]],
        'cardExpiry' : ['', [ Validators.required ]],
        'cardType' : [{value: '', disabled: true}, [ Validators.required ]],
        'frequency' : ['0'],
        'frequencyParam' : ['sun'],
        'startDate' : ['', [ Validators.required ]],
        'nextBillingDate' : [{value: '', disabled: true}]
      },
      {
        validator: [CardValidation.valid_card,
          CardValidation.card_Expiry
        ]
      });
      if (x !== undefined) {
        if (x['isCreditCard']) {
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
        if (x['frequency'] === '1' || x['frequency'] === '2' || x['frequency'] === '3' ) {

          this.isfrequencyParamhidden = false;
        } else {
          this.isfrequencyParamhidden = true;
        }
        this.billingConfigCardForm.patchValue(x);
      } else {
        x['startDate'] = new Date();
      }
    });
    this.billingConfigCardForm.valueChanges.subscribe(data => {
      this.onValueChanged(this.billingConfigCardForm); });

    this.billingConfigCardForm.get('creditCardNumber').valueChanges.subscribe(value => {
      const cardValue = this.billingConfigCardForm.get('creditCardNumber').value;
      if (cardValue.length === 0) {
        this.billingConfigCardForm.controls['cardType'].
        patchValue('');
      }
      if (cardValue.length >= 14) {
        this.billingConfigCardForm.controls['cardType'].
        patchValue(Utilities.getCardType(cardValue));
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) { }

  onValueChanged(formType) {
    if (!formType) {
      return;
    }
    this.formErrors = this.validator.validate(formType);
  }

  clear(field) {

  }

  save() {
    this.validateAllFormFields(this.billingConfigCardForm);
    this.formErrors = this.validator.validate(this.billingConfigCardForm);
    if (this.billingConfigCardForm.invalid) {
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

  changeBillingExecution(BillingExecution) {
    if (this.frequencyList[BillingExecution] !== undefined) {
      const frequency = this.frequencyList[BillingExecution].title;
      if (frequency === 'Weekly' || frequency === 'BiWeekly') {
        this.isfrequencyParamhidden = false;
        this.frequencyParamList = this.enumSelector(FrequencyParamEnum);
        this.billingConfigCardForm.controls['frequencyParam'].patchValue('sun');
      } else if ( frequency === 'Monthly') {
        this.isfrequencyParamhidden = false;
        const monthlyValue = [];
          for (let i = 1; i <= 31; i++) {
            monthlyValue.push({ value: i.toString(), title: i.toString() });
          }
          monthlyValue.push({ value: 'Last', title: 'Last' });
        this.frequencyParamList = monthlyValue;
        this.billingConfigCardForm.controls['frequencyParam'].patchValue('1');
      } else {
        this.isfrequencyParamhidden = true;
        this.billingConfigCardForm.controls['frequencyParam'].patchValue(null);
      }
    }
  }

  enumSelector(definition) {
    return Object.keys(definition)
      .map(key => ({ value: definition[key], title: key }));
  }
}
