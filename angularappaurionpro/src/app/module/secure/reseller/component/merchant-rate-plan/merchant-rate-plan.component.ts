import { Component, OnInit } from '@angular/core';
import { Validator } from '../../../../../common/validation/validator';
import { ValidationSetting } from '../../../../../constant/validation.constant';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from '../../../../../../../node_modules/@angular/forms';
import { ResellerService } from '../../../../../api/reseller.service';
import { RatePlanService } from '../../../../../api/rate-plan.service';
import { ToasterService } from '../../../../../api/toaster.service';
import { StorageService } from '../../../../../common/session/storage.service';
import { ActivatedRoute, Params } from '../../../../../../../node_modules/@angular/router';
import { CommonService } from '../../../../../api/common.service';
import { StorageType } from '../../../../../common/session/storage.enum';
import { FeeFrequencyEnum } from '../../../../../enum/fee-frequency.enum';
import { FeeTypeEnum } from '../../../../../enum/Fee-type.enum';
import { ChannelTypeEnum } from '../../../../../enum/channeltypes.enum';
import { Exception } from '../../../../../common/exceptions/exception';
import { MessageSetting } from '../../../../../constant/message-setting.constant';

@Component({
  selector: 'app-merchant-rate-plan',
  templateUrl: './merchant-rate-plan.component.html',
  styleUrls: ['./merchant-rate-plan.component.css']
})
export class MerchantRatePlanComponent implements OnInit {

  ratePlanList: any;
  resellerSystemForm: any;
  resellerDebitForm: any;
  resellerACHForm: any;
  resellerForm: any;
  resellerCCForm: any;
  // systemfees: any;
  isLoader: any;
  toastData: any;
  validator: Validator;
  formErrors = {};
  tabName = {};
  // resellerList = [];
  // reSellerById = [];
  // resellerData = [];
  allowTransactionList: any;
  feeConfigs: any[] = [];
  isActive = true;
  editFlag = false;
  loggedInuser: any;
  tabTypeFlag: boolean = false;
  isSystemActive: boolean = true;
  isAcitveTab = { 1: false, 2: false, 3: false, 5: false };
  tabObj = {};
  ratePlanId: any;
  chanelType = {
    1: false,
    2: false,
    3: false,
    5: false
  };
  // validation config
  config = {
    buyRate: {
      // required: { name: ValidationSetting.reseller.add.resellerName.name }
      required: { name: 'buy rate' }
    },
    sellRate: {
      // required: { name: ValidationSetting.reseller.add.resellerName.name }
      required: { name: 'sell rate' }
    },
    name: {
      // required: { name: ValidationSetting.reseller.add.resellerName.name }
      required: { name: 'Rate plan name' }
    },
    description: {
      // required: { name: ValidationSetting.reseller.add.resellerName.name }
      required: { name: 'Rate plan description' }
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private resellerService: ResellerService,
    private ratePlanService: RatePlanService,
    private toasterService: ToasterService,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.validator = new Validator(this.config);
  }

  ngOnInit() {
    this.resellerForm = this.formBuilder.group({
      id: [0, []],
      resellerId: [0, []],
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(
            ValidationSetting.common.login.password.vmaxLength
          )
        ]
      ],
      description: [
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
    this.resellerSystemForm = this.formBuilder.group({
      id: [0, []],
      ratePlan: [
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
    this.resellerDebitForm = this.formBuilder.group({
      id: [0, []],
      ratePlan: [
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
      id: [0, []],
      ratePlan: [
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
      id: [0, []],
      ratePlan: [
        '',
        [
          Validators.required,
          Validators.maxLength(
            ValidationSetting.common.login.password.vmaxLength
          )
        ]
      ],
      ratePlanDescription: [
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
    this.resellerForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.loggedInuser = JSON.parse(
      this.storageService.get(StorageType.session, 'userDetails')
    );
    this.isLoader = true;
    // this.getRatePlanList();
    // this.getAllowTransactionType();
    // this.getActiveTab();
    this.getFeeConfig();
  }

  getAllowTransactionType() {
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
          if (this.tabObj[i] == true) {
            this.isAcitveTab[i] = true;
            break;
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getFeeConfig() {
    this.resellerService.getfeeConfigList().subscribe(
      a => {
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
        this.isLoader = false;
        console.log(err);
      }
    );
  }
  genrateCardTab(data) {
    const systemcontrol = <FormArray>(
      this.resellerSystemForm.controls['feeConfigs']
    );
    const debitControl = <FormArray>(
      this.resellerDebitForm.controls['feeConfigs']
    );
    const achControl = <FormArray>this.resellerACHForm.controls['feeConfigs'];
    const ccControl = <FormArray>this.resellerCCForm.controls['feeConfigs'];

    // while (0 !== systemcontrol.length) {
    //   systemcontrol.removeAt(0);
    // }
    // while (0 !== debitControl.length) {
    //   debitControl.removeAt(0);
    // }
    // while (0 !== achControl.length) {
    //   achControl.removeAt(0);
    // }
    // while (0 !== ccControl.length) {
    //   ccControl.removeAt(0);
    // }

    for (const i in data) {
      if (i) {
        const tmpObj = data[i];
      if (tmpObj) {
        let frequenceName = '';
        let feeName = '';
        if (tmpObj.frequency == FeeFrequencyEnum.Annually) {
          frequenceName = 'Annually';
        } else if (tmpObj.frequency == FeeFrequencyEnum.Monthly) {
          frequenceName = 'Monthly';
        } else if (tmpObj.frequency == FeeFrequencyEnum.OneTime) {
          frequenceName = 'OneTime';
        } else if (tmpObj.frequency == FeeFrequencyEnum.PerTransaction) {
          frequenceName = 'PerTransaction';
        }
        if (tmpObj.feeType == FeeTypeEnum.Fixed) {
          feeName = 'Fixed';
        } else if (tmpObj.feeType == FeeTypeEnum.Percentage) {
          feeName = 'Percentage';
        }
        if (!tmpObj.buyRate) {
          tmpObj['buyRate'] = 0.0;
          tmpObj['sellRate'] = 0.0;
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
          systemcontrol.push(this.formBuilder.group(tmpObj));
        } else {
          if (tmpObj.channel == ChannelTypeEnum.ACH) {
            achControl.push(this.formBuilder.group(tmpObj));
          } else if (tmpObj.channel == ChannelTypeEnum.CreditCard) {
            ccControl.push(this.formBuilder.group(tmpObj));
          } else if (tmpObj.channel == ChannelTypeEnum.DebitCard) {
            debitControl.push(this.formBuilder.group(tmpObj));
          }
        }
      }
    }
  }
    this.isLoader = false;
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
              tmpObj.feeType = 'Fixed ($)';
            } else if (tmpObj.feeType === FeeTypeEnum.Percentage) {
              tmpObj.feeType = 'Percentage';
            }
            if (tmpObj.buyRate === undefined) {
              tmpObj['buyRate'] = 0;
              tmpObj['sellRate'] = 0;
              tmpObj['frequency'] = frequenceName;
              tmpObj['feeType'] = feeName;
              tmpObj['includeInBilling'] = true;
            }
            // if (tmpObj.defaultFee && tmpObj.channel === Number(ChannelTypeEnum.NotDefined)) {
            if (tmpObj.channel === Number(ChannelTypeEnum.NotDefined)) {
              systemcontrol.push(this.formBuilder.group(tmpObj));
            } else {
              if (tmpObj.channel === Number(ChannelTypeEnum.ACH))   {
                achControl.push(this.formBuilder.group(tmpObj));
              } else if (tmpObj.channel === Number(ChannelTypeEnum.CreditCard)) {
                ccControl.push(this.formBuilder.group(tmpObj));
              } else if (tmpObj.channel === Number(ChannelTypeEnum.DebitCard)) {
                debitControl.push(this.formBuilder.group(tmpObj));
              }
            }
          }
        }
      }
    this.isLoader = false;
  }

  onValueChanged(data?: any) {
    if (!this.resellerForm) {
      return;
    }
    this.formErrors = this.validator.validate(this.resellerForm);
  }

  getRatePlanList() {
    this.isLoader = true;
    this.resellerService.getRatePlanList().subscribe(
      a => {
        this.ratePlanList = a;
        // this.getFeeConfig(a[0]);
        this.resellerForm.controls['ratePlan'].patchValue(a[0]);
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
    // ratePlan.id = 3;
    this.resellerService.getRatePlanById(ratePlan.id).subscribe(
      a => {
        this.isLoader = false;
        // this.getFeeConfig(a);
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  getRatePlanListbyId(planId, feedata) {
    this.isLoader = true;
    // debugger;
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

  activeTab(tabName) {
    this.tabName = {
      syst: false,
      cc: false,
      ach: false,
      debit: false
    };
    this.tabName[tabName] = true;
    this.isAcitveTab = { 1: false, 2: false, 3: false, 5: false };
  }

  getActiveTab() {
    const aa = document.getElementById(
      '(\'#tabId\').children(\':first-child\').next().whatever();'
    );
  }

  resetForm() {
    this.ngOnInit();
  }

  save() {
    const data = {};
    this.validateAllFormFields(this.resellerForm);
    this.formErrors = this.validator.validate(this.resellerForm);
    if (this.resellerForm.invalid) {
      return;
    }
    const valdata = this.resellerForm.value;
    const systemFeedata = this.resellerSystemForm.value.feeConfigs;
    const achFeeData = this.resellerACHForm.value.feeConfigs;
    const debitFeeData = this.resellerDebitForm.value.feeConfigs;
    const creditFeeData = this.resellerCCForm.value.feeConfigs;
    Array.prototype.push.apply(systemFeedata, achFeeData);
    Array.prototype.push.apply(debitFeeData, creditFeeData);
    Array.prototype.push.apply(systemFeedata, debitFeeData);
    for (let i = 0; i < systemFeedata.length; i++) {
      systemFeedata[i]['feeId'] = systemFeedata[i].id;
      // delete systemFeedata[i].feeTypeName;
      // delete systemFeedata[i].frequenceName;
      // delete systemFeedata[i].channel;
      // delete systemFeedata[i].feeType;
      // delete systemFeedata[i].frequency;
      // delete systemFeedata[i].name;
      // delete systemFeedata[i].systemFee;
      // delete systemFeedata[i].id;
    }
    data['description'] = this.resellerForm.controls['description'].value;
    data['name'] = this.resellerForm.controls['name'].value;
    data['id'] = this.resellerForm.controls['id'].value;
    data['resellerId'] = this.loggedInuser.parentId;
    data['FeeConfigs'] = systemFeedata;
    this.isLoader = true;
    this.ratePlanService.addRatePlan(data).subscribe(
      a => {
        this.isLoader = false;
        this.toastData = this.toasterService.success(MessageSetting.ratePlan.add);
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
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

  edit() {
    const data = {};
    this.validateAllFormFields(this.resellerForm);
    this.formErrors = this.validator.validate(this.resellerForm);
    if (this.resellerForm.invalid) {
      return;
    }
    const valdata = this.resellerForm.value;
    const systemFeedata = this.resellerSystemForm.value.feeConfigs;
    const achFeeData = this.resellerACHForm.value.feeConfigs;
    const debitFeeData = this.resellerDebitForm.value.feeConfigs;
    const creditFeeData = this.resellerCCForm.value.feeConfigs;
    Array.prototype.push.apply(systemFeedata, achFeeData);
    Array.prototype.push.apply(debitFeeData, creditFeeData);
    Array.prototype.push.apply(systemFeedata, debitFeeData);
    // debugger;
    // for (let i = 0; i < systemFeedata.length; i++) {
    //   // systemFeedata[i]['feeId'] = systemFeedata[i].id;
    //   delete systemFeedata[i].feeTypeName;
    //   delete systemFeedata[i].frequenceName;
    //   delete systemFeedata[i].channel;
    //   delete systemFeedata[i].feeType;
    //   delete systemFeedata[i].frequency;
    //   delete systemFeedata[i].name;
    //   delete systemFeedata[i].systemFee;
    //   delete systemFeedata[i].defaultFee;
    //   // delete systemFeedata[i].id;
    // }
    data['description'] = this.resellerForm.controls['description'].value;
    data['name'] = this.resellerForm.controls['name'].value;
    // data['feeId'] = this.resellerForm.controls['id'].value;
    // data['resellerId'] = 0; // this.loggedInuser.id;
    data['resellerId'] = this.loggedInuser.id;
    data['feeConfigs'] = systemFeedata;
    data['id'] = this.ratePlanId;
    this.isLoader = true;
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
}
