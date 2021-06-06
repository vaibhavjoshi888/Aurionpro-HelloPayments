import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { ResellerService } from '../../../../api/reseller.service';
import { CommonService } from '../../../../api/common.service';
import { ToasterService } from '../../../../api/toaster.service';
import { StorageService } from '../../../../common/session/storage.service';
import { StorageType } from '../../../../common/session/storage.enum';
import { Validator } from '../../../../common/validation/validator';
import { ValidationSetting } from '../../../../constant/validation.constant';
import { ChannelTypeEnum } from '../../../../enum/channeltypes.enum';
import { FeeFrequencyEnum } from '../../../../enum/fee-frequency.enum';
import { FeeTypeEnum } from '../../../../enum/Fee-type.enum';
import { RatePlanService } from '../../../../api/rate-plan.service';
import { ActivatedRoute, Params } from '../../../../../../node_modules/@angular/router';
import { RatePlanValidation } from '../../../../common/validation/validation';
import { Exception } from '../../../../common/exceptions/exception';
import { MessageSetting } from '../../../../constant/message-setting.constant';

@Component({
  selector: 'app-add-rate-plan',
  templateUrl: './add-rate-plan.component.html?ver=1',
  styleUrls: ['./add-rate-plan.component.css'],
  providers: [ResellerService, ToasterService, StorageService, CommonService]
})
export class AddRatePlanComponent implements OnInit {

  ratePlanList: any;
  resellerSystemForm: any;
  resellerDebitForm: any;
  resellerACHForm: any;
  resellerForm: any;
  resellerCCForm: any;
  systemfees: any;
  isLoader: any;
  toastData: any;
  validator: Validator;
  formErrors = {};
  systemformErrors = {};
  achformErrors = {};
  ccformErrors = {};
  debitformErrors = {};
  tabName = {};
  resellerList = [];
  reSellerById = [];
  resellerData = [];
  editFlag = false;
  allowTransactionList: any;
  feeConfigs: any[] = [];
  isActive = true;
  loggedInuser: any;
  tabTypeFlag = false;
  isAcitveTab = { 1: false, 2: false, 3: false, 5: false };
  isSystemActive = true;
  tabObj = {};
  ratePlanId: any;
  chanelType = {
    1: false,
    2: false,
    3: false,
    5: false
  };
  formErrorsSellRate;
  // validation config
  config = {
    buyRate: {
      // required: { name: ValidationSetting.merchant.add.name.name },
      required: { name: ValidationSetting.ratePlan.buyRate.name },
      buyRate: { name: 'Buy Rate'},
    },
    sellRate: {
      required: { name: ValidationSetting.ratePlan.sellRate.name },
      pattern: { name: ValidationSetting.ratePlan.sellRate.name }
    },
    name: {
      required: { name: ValidationSetting.ratePlan.name.name }
    },
    description: {
      required: { name: ValidationSetting.ratePlan.description.name }
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private resellerService: ResellerService,
    private toasterService: ToasterService,
    private storageService: StorageService,
    private ratePlanService: RatePlanService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.validator = new Validator(this.config);
  }

  ngOnInit() {
    this.resellerForm = this.formBuilder.group({
      'id': [0, []],
      'resellerId': [0, []],
      'name': [
        '',
        [
          Validators.required,
          Validators.maxLength(
            ValidationSetting.ratePlan.name.maxlength
          )
        ]
      ],
      'description': [
        '',
        [
          Validators.required,
          Validators.maxLength(
            ValidationSetting.ratePlan.description.maxlength
          )
        ]
      ],
      feeConfigs: this.formBuilder.array([])
    });
    this.resellerSystemForm = this.formBuilder.group({
      'id': [0, []],
      'ratePlan': [
        '',
        [
          Validators.required,
          Validators.maxLength(
            ValidationSetting.common.login.password.vmaxLength
          )
        ]
      ],
      feeConfigs: this.formBuilder.array([])
    },
    {
      validator: [
        RatePlanValidation.amount,
        ]
    });
    this.resellerDebitForm = this.formBuilder.group({
      'id': [0, []],
      'ratePlan': [
        '',
        [
          Validators.required,
          Validators.maxLength(
            ValidationSetting.common.login.password.vmaxLength
          )
        ]
      ],
      feeConfigs: this.formBuilder.array([])
    });
    this.resellerACHForm = this.formBuilder.group({
      'id': [0, []],
      'ratePlan': [
        '',
        [
          Validators.required,
          Validators.maxLength(
            ValidationSetting.common.login.password.vmaxLength
          )
        ]
      ],
      feeConfigs: this.formBuilder.array([])
    });
    this.resellerCCForm = this.formBuilder.group({
      'id': [0, []],
      'ratePlan': [
        '',
        [
          Validators.required,
          Validators.maxLength(
            ValidationSetting.common.login.password.vmaxLength
          )
        ]
      ],
      'ratePlanDescription': [
        '',
        [
          Validators.required,
          Validators.maxLength(
            ValidationSetting.common.login.password.vmaxLength
          )
        ]
      ],

      feeConfigs: this.formBuilder.array([], Validators.required)
    });
    this.resellerForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.resellerSystemForm.valueChanges.subscribe(data =>
      this.onValueChanged(data)
    );
    this.resellerACHForm.valueChanges.subscribe(data =>
      this.onValueChanged(data)
    );
    this.resellerCCForm.valueChanges.subscribe(data =>
      this.onValueChanged(data)
    );
    this.resellerDebitForm.valueChanges.subscribe(data =>
      this.onValueChanged(data)
    );

    this.loggedInuser = JSON.parse(
      this.storageService.get(StorageType.session, 'userDetails')
    );
    // this.isLoader = true;

    // this.getRatePlanList();
    // const id = 2;
    this.getFeeConfig();
    // this.getRatePlanListbyId(2);
    // this.getAllowTransactionType();
    // this.getActiveTab();

  }

  getAllowTransactionType() {
    // this will be parent id
    this.resellerService.getFeeTabList(75).subscribe(
      a => {
        this.allowTransactionList = a;
        for (let i = 0; i < this.allowTransactionList.length; i++) {
          this.chanelType[this.allowTransactionList[i].channelType] = true;
        }
        const tmpObj = {};
        // const a = this.chanelType;

        Object.keys(a)
          .sort()
          .forEach(function(key) {
            tmpObj[key] = a[key];
          });
        this.tabObj = tmpObj;

        // To make first tab active
        for (const i in this.tabObj) {
          if (this.tabObj[i] === true) {
            this.isAcitveTab[i] = true;
            break;
          }
        }
      },
      err => {
        const toastMessage = Exception.exceptionMessage(err);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  getFeeConfig() {
    this.isLoader = true;
    this.resellerService.getfeeConfigList().subscribe(
      a => {
        // const id = 2;
        this.activatedRoute.params.subscribe((params: Params) => {
          this.ratePlanId = params['id'];
          // const parentId = params['parentId'];
          if (this.ratePlanId) {
            this.editFlag = true;
            this.getRatePlanListbyId(this.ratePlanId, a);
          } else {
            this.editFlag = false;
            this.genrateCardTab(a);
            this.isLoader = false;
          }
        });
      },
      err => {
        const toastMessage = Exception.exceptionMessage(err);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  // generateCardTabForEdit(data) {
  //   const systemcontrol = <FormArray>(
  //     this.resellerSystemForm.controls['feeConfigs']
  //   );
  //   const debitControl = <FormArray>(
  //     this.resellerDebitForm.controls['feeConfigs']
  //   );
  //   const achControl = <FormArray>this.resellerACHForm.controls['feeConfigs'];
  //   const ccControl = <FormArray>this.resellerCCForm.controls['feeConfigs'];
  // }

  genrateCardTab(data) {
    const systemcontrol = <FormArray>(
      this.resellerSystemForm.controls['feeConfigs']
    );
    const debitControl = <FormArray>(
      this.resellerDebitForm.controls['feeConfigs']
    );
    const achControl = <FormArray>this.resellerACHForm.controls['feeConfigs'];
    const ccControl = <FormArray>this.resellerCCForm.controls['feeConfigs'];
      for (const i in data) {
        if (i) {
          const tmpObj = data[i];
          if (tmpObj) {
            let frequenceName = '';
            let feeName = '';

            if (tmpObj.frequency === FeeFrequencyEnum.Annually) {
              frequenceName = 'Annually';
            } else if (tmpObj.frequency === FeeFrequencyEnum.Monthly) {
              frequenceName = 'Monthly';
            } else if (tmpObj.frequency === FeeFrequencyEnum.OneTime) {
              frequenceName = 'OneTime';
            } else if (tmpObj.frequency === FeeFrequencyEnum.PerTransaction) {
              frequenceName = 'PerTransaction';
            }
            if (tmpObj.feeType === FeeTypeEnum.Fixed) {
              feeName = 'Fixed';
            } else if (tmpObj.feeType === FeeTypeEnum.Percentage) {
              feeName = 'Percentage';
            }
            if (tmpObj.buyRate === undefined) {
              tmpObj['buyRate'] = [0, [Validators.required, this.testingAmount]];
              tmpObj['frequency'] = frequenceName;
              // tmpObj['feeType'] = feeName;
              if (feeName === 'Fixed') {
                tmpObj['feeType'] = feeName + ' ($)';
              } else {
                tmpObj['feeType'] = feeName;
              }
              tmpObj['includeInBilling'] = true;
            }

            // if (tmpObj.defaultFee && tmpObj.channel === Number(ChannelTypeEnum.NotDefined)) {
            if (tmpObj.channel === Number(ChannelTypeEnum.NotDefined)) {
              tmpObj[`sellRate${systemcontrol.length}`] = [0, [Validators.required,
              Validators.pattern((tmpObj.feeType === 'Fixed ($)') ? ValidationSetting.amount_regex : ValidationSetting.percentage_regex)]];
              systemcontrol.push(this.formBuilder.group(tmpObj));
            } else {
              if (tmpObj.channel === Number(ChannelTypeEnum.ACH)) {
                tmpObj[`sellRate${achControl.length}`] = [0, [Validators.required,
                Validators.pattern((tmpObj.feeType === 'Fixed ($)') ? ValidationSetting.amount_regex : ValidationSetting.percentage_regex)]];
                achControl.push(this.formBuilder.group(tmpObj));
              } else if (tmpObj.channel === Number(ChannelTypeEnum.CreditCard)) {
                tmpObj[`sellRate${ccControl.length}`] = [0, [Validators.required,
                Validators.pattern((tmpObj.feeType === 'Fixed ($)') ? ValidationSetting.amount_regex : ValidationSetting.percentage_regex)]];
                ccControl.push(this.formBuilder.group(tmpObj));
              } else if (tmpObj.channel === Number(ChannelTypeEnum.DebitCard)) {
                tmpObj[`sellRate${debitControl.length}`] = [0, [Validators.required,
                Validators.pattern((tmpObj.feeType === 'Fixed ($)') ? ValidationSetting.amount_regex : ValidationSetting.percentage_regex)]];
                debitControl.push(this.formBuilder.group(tmpObj));
              }
            }
          }
        }
      }
      let tempArr = [systemcontrol.length, achControl.length, ccControl.length, debitControl.length];
      tempArr.sort(function(a, b) {return b - a; });
      let tempMax= tempArr[0];
      for (let i = 0; i < tempMax; i++) {
        this.config[`sellRate${i}`] = {
          required: { name: ValidationSetting.ratePlan.sellRate.name },
          pattern: { name: ValidationSetting.ratePlan.sellRate.name }
        };
      }
      this.validator = new Validator(this.config);

    this.isLoader = false;
  }

  checkError(form, i) {
    if (form === 'resellerSystemForm' && !this.resellerSystemForm.controls.feeConfigs.controls[i].controls[`sellRate${i}`].valid) {
      this.formErrorsSellRate =  this.systemformErrors[`sellRate${i}`];
      return true;
    } else if (form === 'resellerDebitForm' && !this.resellerDebitForm.controls.feeConfigs.controls[i].controls[`sellRate${i}`].valid) {
      this.formErrorsSellRate =  this.debitformErrors[`sellRate${i}`];
      return true;
    } else if (form === 'resellerACHForm' && !this.resellerACHForm.controls.feeConfigs.controls[i].controls[`sellRate${i}`].valid) {
      this.formErrorsSellRate =  this.achformErrors[`sellRate${i}`];
      return true;
    } else if (form === 'resellerCCForm' && !this.resellerCCForm.controls.feeConfigs.controls[i].controls[`sellRate${i}`].valid) {
      this.formErrorsSellRate =  this.ccformErrors[`sellRate${i}`];
      return true;
    } else {
      this.formErrorsSellRate = '';
      return false;
    }
  }
  testingAmount(control: FormControl) {
    // const cardExpiry = control.get('buyRate').value;
    const cardExpiry = control.value;
    if (cardExpiry < 0) {
      return {buyRate: true};
    } else {
      return null;
    }
  }

  editCardTab(data) {
    this.resellerForm.controls['name'].patchValue(data.name); // resellerId
    this.resellerForm.controls['description'].patchValue(data.description);
    this.resellerForm.controls['resellerId'].patchValue(data.resellerId);
    const systemcontrol = <FormArray>(
      this.resellerSystemForm.controls['feeConfigs']
    );
    const debitControl = <FormArray>(
      this.resellerDebitForm.controls['feeConfigs']
    );
    const achControl = <FormArray>this.resellerACHForm.controls['feeConfigs'];
    const ccControl = <FormArray>this.resellerCCForm.controls['feeConfigs'];
      for (const i in data.feeConfigs) {
        if (i) {
          const tmpObj = data.feeConfigs[i];
          if (tmpObj) {
            const frequenceName = '';
            const feeName = '';

            if (tmpObj.frequency === FeeFrequencyEnum.Annually) {
              tmpObj.frequency = 'Annually';
            } else if (tmpObj.frequency === FeeFrequencyEnum.Monthly) {
              tmpObj.frequency = 'Monthly';
            } else if (tmpObj.frequency === FeeFrequencyEnum.OneTime) {
              tmpObj.frequency = 'OneTime';
            } else if (tmpObj.frequency === FeeFrequencyEnum.PerTransaction) {
              tmpObj.frequency = 'PerTransaction';
            }
            if (tmpObj.feeType === FeeTypeEnum.Fixed) {
              tmpObj.feeType = 'Fixed ($)' ;
            } else if (tmpObj.feeType === FeeTypeEnum.Percentage) {
              tmpObj.feeType = 'Percentage';
            }
            if (tmpObj.buyRate === undefined) {
              tmpObj['buyRate'] = [0, Validators.required];
              // tmpObj['sellRate'] = [0, Validators.required];
              tmpObj['frequency'] = frequenceName;
              tmpObj['feeType'] = feeName;
              tmpObj['includeInBilling'] = true;
            }

            const test = {
              'name': ['', Validators.required],
              'email': ['', [Validators.required]],
              'profile': ['', [Validators.required, Validators.minLength(10)]]
            };
            // if (tmpObj.defaultFee && tmpObj.channel === Number(ChannelTypeEnum.NotDefined)) {
            if (tmpObj.channel === Number(ChannelTypeEnum.NotDefined)) {
              tmpObj[`sellRate${systemcontrol.length}`] = [tmpObj.sellRate, [Validators.required,
              Validators.pattern((tmpObj.feeType === 'Fixed ($)') ? ValidationSetting.amount_regex : ValidationSetting.percentage_regex)]];
              systemcontrol.push(this.formBuilder.group(tmpObj));
            } else {
              if (tmpObj.channel === Number(ChannelTypeEnum.ACH)) {
                tmpObj[`sellRate${achControl.length}`] = [tmpObj.sellRate, [Validators.required,
                Validators.pattern((tmpObj.feeType === 'Fixed ($)') ? ValidationSetting.amount_regex : ValidationSetting.percentage_regex)]];
                achControl.push(this.formBuilder.group(tmpObj));
              } else if (tmpObj.channel === Number(ChannelTypeEnum.CreditCard)) {
                tmpObj[`sellRate${ccControl.length}`] = [tmpObj.sellRate, [Validators.required,
                Validators.pattern((tmpObj.feeType === 'Fixed ($)') ? ValidationSetting.amount_regex : ValidationSetting.percentage_regex)]];
                ccControl.push(this.formBuilder.group(tmpObj));
              } else if (tmpObj.channel === Number(ChannelTypeEnum.DebitCard)) {
                tmpObj[`sellRate${debitControl.length}`] = [tmpObj.sellRate, [Validators.required,
                Validators.pattern((tmpObj.feeType === 'Fixed ($)') ? ValidationSetting.amount_regex : ValidationSetting.percentage_regex)]];
                debitControl.push(this.formBuilder.group(tmpObj));
              }
            }
          }
        }
      }

      let tempArr = [systemcontrol.length, achControl.length, ccControl.length, debitControl.length];
      tempArr.sort(function(a, b) {return b - a; });
      let tempMax= tempArr[0];
      for (let i = 0; i < tempMax; i++) {
        this.config[`sellRate${i}`] = {
          required: { name: ValidationSetting.ratePlan.sellRate.name },
          pattern: { name: ValidationSetting.ratePlan.sellRate.name }
        };
      }
      this.validator = new Validator(this.config);

    this.isLoader = false;
  }


  onValueChanged(data?: any) {
    this.formErrors = this.validator.validate(this.resellerForm);
    this.achformErrors = this.validator.validate(this.resellerACHForm);
    this.systemformErrors = this.validator.validate(this.resellerSystemForm);
    this.ccformErrors = this.validator.validate(this.resellerCCForm);
    this.debitformErrors = this.validator.validate(this.resellerDebitForm);
  }

  getRatePlanListbyId(planId, feedata) {
    this.isLoader = true;
    this.ratePlanService.getRatePlanById(planId).subscribe(
      individalRatePlan => {
        const feeConfigs = individalRatePlan['feeConfigs'];
        const individualfeeobject = {};
        for (const i of feeConfigs) {
          individualfeeobject[i.feeId] = i;
        }
        for (const j of feedata) {
          const currentID = j.id;
          if (j.id in individualfeeobject) {
            if (j.hasOwnProperty('id')) {
              delete j['id'];
            }
            Object.assign(individualfeeobject[currentID], j);
          }
        }
        individalRatePlan['feeConfigs'] = individualfeeobject;
        this.editCardTab(individalRatePlan);
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  ratePlanChanged(ratePlan) {
    this.isLoader = true;
    this.ratePlanService.getRatePlanById(ratePlan.id).subscribe(
      a => {
        this.isLoader = false;
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  activeTab(tabName) {
    this.tabName = {
      syst: false,
      cc: false,
      ach: false,
      debit: false
    };
    // this.tabName[tabName] = true;
    // this.isAcitveTab = { 1: false, 2: false, 3: false, 5: false };
  }

  getActiveTab() {
    const aa = document.getElementById(
      '(\'#tabId\').children(\':first-child\').next().whatever();'
    );
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

  save() {
    const data = {};
    this.validateAllFormFields(this.resellerForm);
    this.formErrors = this.validator.validate(this.resellerForm);
    if (this.resellerForm.invalid
      || this.resellerSystemForm.controls.feeConfigs.status === 'INVALID'
      || this.resellerACHForm.controls.feeConfigs.status === 'INVALID'
      || this.resellerDebitForm.controls.feeConfigs.status === 'INVALID'
      || this.resellerCCForm.controls.feeConfigs.status === 'INVALID') {
        this.toastData = this.toasterService.error('All fields are mandatory.');
      return;
    }

    this.isLoader = true;
    const valdata = this.resellerForm.value;
    for (let i = 0; i < this.resellerSystemForm.value.feeConfigs.length; i++) {
      this.resellerSystemForm.value.feeConfigs[i]['sellRate'] = this.resellerSystemForm.value.feeConfigs[i][`sellRate${i}`];
    }
    for (let i = 0; i < this.resellerACHForm.value.feeConfigs.length; i++) {
      this.resellerACHForm.value.feeConfigs[i]['sellRate'] = this.resellerACHForm.value.feeConfigs[i][`sellRate${i}`];
    }
    for (let i = 0; i < this.resellerDebitForm.value.feeConfigs.length; i++) {
      this.resellerDebitForm.value.feeConfigs[i]['sellRate'] = this.resellerDebitForm.value.feeConfigs[i][`sellRate${i}`];
    }
    for (let i = 0; i < this.resellerCCForm.value.feeConfigs.length; i++) {
      this.resellerCCForm.value.feeConfigs[i]['sellRate'] = this.resellerCCForm.value.feeConfigs[i][`sellRate${i}`];
    }
    const systemFeedata = this.resellerSystemForm.value.feeConfigs;
    const achFeeData = this.resellerACHForm.value.feeConfigs;
    const debitFeeData = this.resellerDebitForm.value.feeConfigs;
    const creditFeeData = this.resellerCCForm.value.feeConfigs;
    // Array.prototype.push.apply(systemFeedata, achFeeData);
    // Array.prototype.push.apply(debitFeeData, creditFeeData);
    // Array.prototype.push.apply(systemFeedata, debitFeeData);
    const combinedArray = [...systemFeedata, ...achFeeData, ...debitFeeData, ...creditFeeData];
    for (let i = 0; i < combinedArray.length; i++) {
      combinedArray[i]['feeId'] = combinedArray[i].id;
    }
    data['description'] = this.resellerForm.controls['description'].value;
    data['name'] = this.resellerForm.controls['name'].value;
    data['resellerId'] = this.loggedInuser.id;
    data['FeeConfigs'] = combinedArray;
    this.ratePlanService.addRatePlan(data).subscribe(
      a => {
        this.isLoader = false;
        this.toastData = this.toasterService.successRedirect(MessageSetting.ratePlan.add, `/rateplan/find`);
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  resetForm() {
    this.ngOnInit();
  }

  edit() {
    const data = {};
    this.validateAllFormFields(this.resellerForm);
    this.formErrors = this.validator.validate(this.resellerForm);
    if (this.resellerForm.invalid
      || this.resellerSystemForm.controls.feeConfigs.status === 'INVALID'
      || this.resellerACHForm.controls.feeConfigs.status === 'INVALID'
      || this.resellerDebitForm.controls.feeConfigs.status === 'INVALID'
      || this.resellerCCForm.controls.feeConfigs.status === 'INVALID') {
      this.toastData = this.toasterService.error('All fields are mandatory.');
      return;
    }
    this.isLoader = true;
    const valdata = this.resellerForm.value;
    for (let i = 0; i < this.resellerSystemForm.value.feeConfigs.length; i++) {
      this.resellerSystemForm.value.feeConfigs[i]['sellRate'] = this.resellerSystemForm.value.feeConfigs[i][`sellRate${i}`];
    }
    for (let i = 0; i < this.resellerACHForm.value.feeConfigs.length; i++) {
      this.resellerACHForm.value.feeConfigs[i]['sellRate'] = this.resellerACHForm.value.feeConfigs[i][`sellRate${i}`];
    }
    for (let i = 0; i < this.resellerDebitForm.value.feeConfigs.length; i++) {
      this.resellerDebitForm.value.feeConfigs[i]['sellRate'] = this.resellerDebitForm.value.feeConfigs[i][`sellRate${i}`];
    }
    for (let i = 0; i < this.resellerCCForm.value.feeConfigs.length; i++) {
      this.resellerCCForm.value.feeConfigs[i]['sellRate'] = this.resellerCCForm.value.feeConfigs[i][`sellRate${i}`];
    }
    const systemFeedata = this.resellerSystemForm.value.feeConfigs;
    const achFeeData = this.resellerACHForm.value.feeConfigs;
    const debitFeeData = this.resellerDebitForm.value.feeConfigs;
    const creditFeeData = this.resellerCCForm.value.feeConfigs;
    const combinedArray = [...systemFeedata, ...achFeeData, ...debitFeeData, ...creditFeeData];
    // Array.prototype.push.apply(systemFeedata, achFeeData);
    // Array.prototype.push.apply(debitFeeData, creditFeeData);
    // Array.prototype.push.apply(systemFeedata, debitFeeData);
    data['description'] = this.resellerForm.controls['description'].value;
    data['name'] = this.resellerForm.controls['name'].value;
    data['resellerId'] = this.loggedInuser.id;
    data['feeConfigs'] = combinedArray;
    data['id'] = this.ratePlanId;
    this.ratePlanService.editRatePlan(data, this.ratePlanId).subscribe(
      a => {
        this.isLoader = false;
        this.toastData = this.toasterService.successRedirect(MessageSetting.ratePlan.update, 'rateplan/find');
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  clear(controlName) {
    this.resellerForm.get(controlName).setValue(null);
  }

}
