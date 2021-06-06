import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DatepickerMode } from 'ng2-semantic-ui';

import { ValidationSetting } from '../../../../../constant/validation.constant';
import { ResellerService } from '../../../../../api/reseller.service';
import { ToasterService } from '../../../../../api/toaster.service';
// import { StorageService } from '../../../../../common/session/storage.service';
import { CommonService } from '../../../../../api/common.service';
import { Validator } from '../../../../../common/validation/validator';
import { MessageSetting } from '../../../../../constant/message-setting.constant';
import { States } from '../../../../../constant/states.constant';
import { MerchantService } from '../../../../../api/merchant.service';
// import { Location } from '@angular/common';
import { Exception } from '../../../../../common/exceptions/exception';

@Component({
  selector: 'app-add-merchant',
  templateUrl: './add-merchant.component.html',
  styleUrls: ['./add-merchant.component.css']
})
export class AddMerchantComponent implements OnInit {
  mode: DatepickerMode = DatepickerMode.Date;
  addMerchantForm: any;
  isLoader: any;
  toastData: any;
  validator: Validator;
  formErrors = {};
  countryList: any;
  loggedInUserData = {};
  resellerList = [];
  timeZoneList = [];
  editFlag = false;
  isSuperAdmin = true;
  // stateList: any;
  showEverything = false;
  stateList = [];
  States = {};
  accordion = {
    primaryContact: true,
    addressDetail: true,
    additionalInfo: true
  };

  // these variables are used for adding value to the Parent reseller field
  currentResellerId: any;
  currentResellerName: any;
  // this variable is used to set the maxlength property
  inputValidation = ValidationSetting;


  config = {
    name: {  // this is same as merchant name
      required: { name: ValidationSetting.merchant.add.name.name },
      maxlength: {
        name: ValidationSetting.merchant.add.name.name,
        max: ValidationSetting.merchant.add.name.maxLength.toString()
      },
      pattern: { name: ValidationSetting.merchant.add.name.name }
    },
    merchantAdminUser: {
      required: { name: ValidationSetting.merchant.add.merchantAdminUser.name },
      maxlength: {
        name: ValidationSetting.merchant.add.merchantAdminUser.name,
        max: ValidationSetting.merchant.add.merchantAdminUser.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.merchant.add.merchantAdminUser.name,
        min: ValidationSetting.merchant.add.merchantAdminUser.minLength.toString()
      },
      pattern: { name: ValidationSetting.merchant.add.merchantAdminUser.name}
    },
    title: {
      required: { name: ValidationSetting.merchant.add.title.name },
      maxlength: {
        name: ValidationSetting.merchant.add.title.name,
        max: ValidationSetting.merchant.add.title.maxLength.toString()
      }
    },
    firstName: {
      required: { name: ValidationSetting.merchant.add.firstName.name },
      maxlength: {
        name: ValidationSetting.merchant.add.firstName.name,
        max: ValidationSetting.merchant.add.firstName.maxLength.toString()
      },
      pattern: { name: ValidationSetting.merchant.add.firstName.name }
    },
    middleName: {
      required: { name: ValidationSetting.merchant.add.middleName.name },
      maxlength: {
        name: ValidationSetting.merchant.add.middleName.name,
        max: ValidationSetting.merchant.add.middleName.maxLength.toString()
      }
    },
    lastName: {
      required: { name: ValidationSetting.merchant.add.lastName.name },
      maxlength: {
        name: ValidationSetting.merchant.add.lastName.name,
        max: ValidationSetting.merchant.add.lastName.maxLength.toString()
      },
      pattern: { name: ValidationSetting.merchant.add.lastName.name }
    },
    companyName: {
      required: { name: ValidationSetting.merchant.add.companyName.name },
      maxlength: {
        name: ValidationSetting.merchant.add.companyName.name,
        max: ValidationSetting.merchant.add.companyName.maxLength.toString()
      }
    },
    department: {
      maxlength: {
        name: ValidationSetting.merchant.add.department.name,
        max: ValidationSetting.merchant.add.department.maxLength.toString()
      }
    },
    fax: {
      maxlength: {
        name: ValidationSetting.merchant.add.fax.name,
        max: ValidationSetting.merchant.add.fax.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.merchant.add.fax.name,
        min: ValidationSetting.merchant.add.fax.minLength.toString()
      },
      pattern: { name: ValidationSetting.merchant.add.fax.name }
    },
    phone: {
      required: { name: ValidationSetting.merchant.add.phone.name },
      maxlength: {
        name: ValidationSetting.merchant.add.phone.name,
        max: ValidationSetting.merchant.add.phone.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.reseller.add.phone.name,
        min: ValidationSetting.reseller.add.phone.minLength.toString()
      },
      pattern: { name: ValidationSetting.merchant.add.phone.name }
    },
    mobile: {
      maxlength: {
        name: ValidationSetting.merchant.add.mobile.name,
        max: ValidationSetting.merchant.add.mobile.maxLength.toString()
      }
    },
    email: {
      required: { name: ValidationSetting.merchant.add.email.name },
      maxlength: { name: ValidationSetting.merchant.add.email.name },
      email: { name: ValidationSetting.merchant.add.email.name },
      pattern: { name: ValidationSetting.reseller.add.email.name }
    },
    url: {
      required: { name: ValidationSetting.merchant.add.url.name },
      maxlength: {
        name: ValidationSetting.merchant.add.url.name,
        max: ValidationSetting.merchant.add.url.maxLength.toString()
      },
      pattern: { name: ValidationSetting.merchant.add.url.name }
    },
    addressLine1: {
      required: { name: ValidationSetting.merchant.add.addressLine1.name },
      maxlength: {
        name: ValidationSetting.merchant.add.addressLine1.name,
        max: ValidationSetting.merchant.add.addressLine1.maxLength.toString()
      },
      pattern: { name: ValidationSetting.merchant.add.addressLine1.name }
    },
    addressLine2: {
      maxlength: {
        name: ValidationSetting.merchant.add.addressLine2.name,
        max: ValidationSetting.merchant.add.addressLine2.maxLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.addressLine2.name }
    },
    city: {
      required: { name: ValidationSetting.merchant.add.city.name },
      maxlength: {
        name: ValidationSetting.merchant.add.city.name,
        max: ValidationSetting.merchant.add.city.maxLength.toString()
      },
      pattern: { name: ValidationSetting.merchant.add.city.name }
    },
    state: {
      required: { name: ValidationSetting.merchant.add.state.name },
      maxlength: {
        name: ValidationSetting.merchant.add.state.name,
        max: ValidationSetting.merchant.add.state.maxLength.toString()
      }
    },
    country: {
      required: { name: ValidationSetting.merchant.add.country.name },
      maxlength: {
        name: ValidationSetting.merchant.add.country.name,
        max: ValidationSetting.merchant.add.country.maxLength.toString()
      }
    },
    postalCode: {
      required: { name: ValidationSetting.merchant.add.postalCode.name },
      maxlength: {
        name: ValidationSetting.merchant.add.postalCode.name,
        max: ValidationSetting.merchant.add.postalCode.maxLength.toString()
      },
      pattern: { name: ValidationSetting.merchant.add.postalCode.name }
    },
    timeZone: {
      maxlength: {
        name: ValidationSetting.merchant.add.timeZone.name,
        max: ValidationSetting.merchant.add.timeZone.maxLength.toString()
      }
    },
    ownership: {
      maxlength: {
        name: ValidationSetting.merchant.add.ownership.name,
        max: ValidationSetting.merchant.add.ownership.maxLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.ownership.name }
    },
    merchantId: {
      maxlength: {
        name: ValidationSetting.merchant.add.merchantid.name,
        max: ValidationSetting.merchant.add.merchantid.maxLength.toString()
      }
    },
    businessStartDate: {
      maxlength: {
        name: ValidationSetting.merchant.add.businessStartDate.name,
        max: ValidationSetting.merchant.add.businessStartDate.maxLength.toString()
      }
    },
    federalTaxId: {
      required: { name: ValidationSetting.merchant.add.federalTaxId.name },
      maxlength: {
        name: ValidationSetting.merchant.add.federalTaxId.name,
        max: ValidationSetting.merchant.add.federalTaxId.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.merchant.add.federalTaxId.name,
        min: ValidationSetting.merchant.add.federalTaxId.maxLength.toString()
      },
      pattern: {
        name: ValidationSetting.merchant.add.federalTaxId.name
      }
    },
    salesTaxId: {
      maxlength: {
        name: ValidationSetting.merchant.add.salesTaxId.name,
        max: ValidationSetting.merchant.add.salesTaxId.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.merchant.add.salesTaxId.name,
        min: ValidationSetting.merchant.add.salesTaxId.maxLength.toString()
      },
      pattern: { name: ValidationSetting.merchant.add.salesTaxId.name }
    },
    stateTaxId: {
      maxlength: {
        name: ValidationSetting.merchant.add.stateTaxId.name,
        max: ValidationSetting.merchant.add.stateTaxId.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.merchant.add.stateTaxId.name,
        min: ValidationSetting.merchant.add.stateTaxId.maxLength.toString()
      },
      pattern: { name: ValidationSetting.merchant.add.stateTaxId.name }
    },
    estimatedSales: {
      maxlength: {
        name: ValidationSetting.merchant.add.estimatedSales.name,
        max: ValidationSetting.merchant.add.estimatedSales.maxLength.toString()
      },
      pattern: { name: ValidationSetting.merchant.add.estimatedSales.name }
    },
    parentId: {
      required: { name: ValidationSetting.merchant.add.parentId.name },
      maxlength: {
        name: ValidationSetting.merchant.add.parentId.name,
        max: ValidationSetting.merchant.add.parentId.maxLength.toString()
      }
    },
    fileIdentifier: {
      maxlength: {
        name: ValidationSetting.merchant.add.fileIdentifier.name,
        max: ValidationSetting.merchant.add.fileIdentifier.maxLength.toString()
      }
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private resellerService: ResellerService,
    private toasterService: ToasterService,
    private merchantService: MerchantService,
    private router: Router,
    // private location: Location,
    // private storageService: StorageService,
    private commonService: CommonService
  ) {
    this.validator = new Validator(this.config);
  }

  ngOnInit() {
    // this.location.replaceState('/');
    this.showEverything = false;
    this.addMerchantForm = this.formBuilder.group({
      id: [0, []],
      newResellerName: ['', []],
      // this is same as merchant name
      name: ['', [
          Validators.required,
          Validators.maxLength(ValidationSetting.merchant.add.name.maxLength),
          Validators.pattern(ValidationSetting.alphanumericWithSpace_regex)
        ]
      ],
      merchantAdminUser: ['', [
          Validators.required,
          Validators.maxLength(ValidationSetting.merchant.add.merchantAdminUser.maxLength),
          Validators.minLength(ValidationSetting.merchant.add.merchantAdminUser.minLength),
          Validators.pattern(ValidationSetting.alphanumeric_regex)
        ]
      ],
      contact: this.formBuilder.group({
        name: this.formBuilder.group({
          firstName: ['', [
              Validators.required,
              Validators.maxLength(ValidationSetting.merchant.add.firstName.maxLength),
              Validators.pattern(ValidationSetting.firstNameLastName_regex)
            ]
          ],
          lastName: ['', [
              Validators.required,
              Validators.maxLength(ValidationSetting.merchant.add.lastName.maxLength),
              Validators.pattern(ValidationSetting.firstNameLastName_regex)
            ]
          ]
        }),
        fax: ['', [
            Validators.maxLength(ValidationSetting.merchant.add.fax.maxLength),
            Validators.minLength(ValidationSetting.merchant.add.fax.minLength),
            Validators.pattern(ValidationSetting.numbersOnly_regex)
          ]
        ],
        phone: ['', [
            Validators.required,
            Validators.maxLength(ValidationSetting.merchant.add.phone.maxLength),
            Validators.minLength(ValidationSetting.merchant.add.phone.minLength),
            Validators.pattern(ValidationSetting.numbersOnly_regex)
          ]
        ],
        mobile: ['', [
            Validators.maxLength(ValidationSetting.merchant.add.mobile.maxLength)
          ]
        ],
        email: ['', [
            Validators.required,
            Validators.pattern(ValidationSetting.email_regex)
          ]
        ],
        url: ['', [
            Validators.required,
            Validators.maxLength(ValidationSetting.merchant.add.url.maxLength),
            Validators.pattern(ValidationSetting.url_regex)
          ]
        ],
        address: this.formBuilder.group({
          addressLine1: ['', [
              Validators.required,
              Validators.maxLength(ValidationSetting.merchant.add.addressLine1.maxLength),
              Validators.pattern(ValidationSetting.spaceNotAccepted_regex)
            ]
          ],
          addressLine2: ['', [
              Validators.maxLength(ValidationSetting.merchant.add.addressLine2.maxLength),
              Validators.pattern(ValidationSetting.spaceNotAccepted_regex)
            ]
          ],
          city: ['', [
              Validators.required,
              Validators.maxLength(ValidationSetting.merchant.add.city.maxLength),
              Validators.pattern(ValidationSetting.charactersOnlyWithSpace_regex)
            ]
          ],
          state: ['', [
              Validators.required,
              Validators.maxLength(ValidationSetting.merchant.add.state.maxLength)
            ]
          ],
          country: ['', [
              Validators.required,
              Validators.maxLength(ValidationSetting.merchant.add.country.maxLength)
            ]
          ],
          postalCode: ['', [
              Validators.required,
              Validators.maxLength(ValidationSetting.merchant.add.postalCode.maxLength),
            ]
          ],
          timeZone: ['', [
              Validators.maxLength(ValidationSetting.merchant.add.timeZone.maxLength)
            ]
          ]
        })
      }),
      parentId: ['', [
          Validators.required,
          Validators.maxLength(ValidationSetting.merchant.add.parentId.maxLength)
        ]
      ],
      ownership: ['', [
          Validators.maxLength(ValidationSetting.merchant.add.ownership.maxLength),
          Validators.pattern(ValidationSetting.spaceNotAccepted_regex)
        ]
      ],
      merchantId: ['', [
          Validators.maxLength(ValidationSetting.merchant.add.ownership.maxLength)
        ]
      ],
      federalTaxId: ['', [
          Validators.required,
          Validators.maxLength(ValidationSetting.merchant.add.federalTaxId.maxLength),
          Validators.minLength(ValidationSetting.merchant.add.federalTaxId.maxLength),
          Validators.pattern(ValidationSetting.numbersOnly_regex)
        ]
      ],
      businessStartDate: ['', [
          Validators.maxLength(ValidationSetting.merchant.add.businessStartDate.maxLength)
        ]
      ],
      salesTaxId: ['', [
          Validators.maxLength(ValidationSetting.merchant.add.salesTaxId.maxLength),
          Validators.minLength(ValidationSetting.merchant.add.salesTaxId.minLength),
          Validators.pattern(ValidationSetting.numbersOnly_regex)
        ]
      ],
      stateTaxId: ['', [
          Validators.maxLength(ValidationSetting.merchant.add.stateTaxId.maxLength),
          Validators.minLength(ValidationSetting.merchant.add.stateTaxId.minLength),
          Validators.pattern(ValidationSetting.numbersOnly_regex)
        ]
      ],
      estimatedSales: ['', [
          Validators.maxLength(ValidationSetting.merchant.add.estimatedSales.maxLength),
          Validators.pattern(ValidationSetting.spaceNotAccepted_regex)
        ]
      ],
      fileIdentifier: ['', [
          Validators.maxLength(ValidationSetting.merchant.add.estimatedSales.maxLength)
        ]
      ]
    });
    this.addMerchantForm.valueChanges.subscribe(data =>
      this.onValueChanged(data)
    );
    this.loggedInUserData = this.resellerService.getLoggedInData();
    this.isSuperAdmin = this.loggedInUserData['parentId'] === 0 ? true : false;
    this.isLoader = true;
    this.onValueChanged(); // (re)set validation messages now
    this.getTimeZoneList();
    this.States = States.state;
    this.populateCountry();
  }

  editMerchant() {
    this.isLoader = true;
    this.activatedRoute.params.subscribe((params: Params) => {
      const id = params['id'];
      const parentId = params['parentId'];
      if (id) {
        this.editFlag = true;
        this.getMerchantById(id, parentId);
      } else {
        this.editFlag = false;
        this.isLoader = false;
      }
    });
  }

  onValueChanged(data?: any) {
    if (!this.addMerchantForm) {
      return;
    }
    this.formErrors = this.validator.validate(this.addMerchantForm);
  }

  getMerchantById(merchantId, parentId) {
    const id = '';
    this.merchantService.getMerchantById(merchantId, parentId).subscribe(
      a => {
        const parentResellerList = this.resellerList.filter(
          x => x.id === a['parentId']
        )[0];
        const timeZoneName = this.timeZoneList.filter(
          x => x.name === a['contact'].address.timeZone
        )[0];

        if (a.hasOwnProperty('resellerId')) {
          a['parentId'] = a['resellerId'];
        } else {
          this.addMerchantForm.controls['parentId'].patchValue(a['parentId']);
        }
        // this.addMerchantForm.controls['parentId'].patchValue(a['parentId']);
        this.stateList = this.States[a['contact']['address']['country']];

        if (a['businessStartDate'] !== null) {
          a['businessStartDate'] = new Date(a['businessStartDate']);
        }

        // code added due to datatype missmatch issue 18/07/2018
        a['contact']['address']['country'] = Number(
          a['contact']['address']['country']
        );
        this.addMerchantForm.patchValue(a);
        // this.addResellerForm.controls['contact'].address.timeZone.patchValue(timeZoneName);
        this.isLoader = false;
      },
      // Bind to view
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  save() {
    try {
      this.validateAllFormFields(this.addMerchantForm);
      this.formErrors = this.validator.validate(this.addMerchantForm);
      if (this.addMerchantForm.invalid) {
        this.accordion.primaryContact = true;
        this.accordion.addressDetail = true;
        this.accordion.additionalInfo = true;
        return;
      }

      this.isLoader = true;
      const data = this.addMerchantForm.value;
      // if(this.isSuperAdmin) {
      //   data['parentId'] = data['parentId']['id'];
      // }
      // else {
      //   data['parentId'] = this.loggedInUserData['id'];
      // }

      // Commenting check as we not using Time Zone field
      // if (data['contact'].address.timeZone !== undefined && data['contact'].address.timeZone.name !== null) {
      //   data['contact'].address.timeZone = '';
      // }
      data['contact'].address.timeZone = '';

      if (data.hasOwnProperty('newResellerName')) {
        delete data['newResellerName'];
      }
      if (data.hasOwnProperty('id')) {
        delete data['id'];
      }
      if (data['businessStartDate'] !== undefined &&
      data['businessStartDate'] !== null && data['businessStartDate'] !== '') {
        data['businessStartDate'] = new Date(data['businessStartDate'].getTime() -
        data['businessStartDate'].getTimezoneOffset() * 60000).toISOString();
      }
      // this.commonService.getUserNameAvailability(this.addMerchantForm.value.merchantAdminUser).subscribe(b => {
        this.merchantService.addMerchant(data).subscribe(
          a => {
            this.addMerchantForm.reset();
            if (this.loggedInUserData['parentId'] !== 0) {
              this.addMerchantForm.controls['newResellerName'].patchValue(this.currentResellerName);
              this.addMerchantForm.controls['parentId'].patchValue(this.loggedInUserData['parentId']);
            } else {
              this.addMerchantForm.controls['parentId'].patchValue(this.loggedInUserData['parentId']);
            }
            this.isLoader = false;
            // Auto navigate on save click
            this.merchantService.setIsFromAddMerchant(true);
            const redirectLink = `/merchant/view/${a.resellerId}/${a.id}/allowedtransactiontype/fromAddMerchant`;
            this.toastData = this.toasterService.successRedirect(MessageSetting.merchant.add, redirectLink);
          },
          error => {
              const toastMessage = Exception.exceptionMessage(error);
              this.isLoader = false;
              this.toastData = this.toasterService.error(toastMessage.join(', '));
          }
        );
    //   },
    //   error => {
    //     const toastMessage = Exception.exceptionMessage(error);
    //     this.isLoader = false;
    //     this.toastData = this.toasterService.error(toastMessage.join(', '));
    // });
    } catch (e) {
      this.isLoader = false;
    }
  }

  edit() {
    this.validateAllFormFields(this.addMerchantForm);
    this.formErrors = this.validator.validate(this.addMerchantForm);
    if (this.addMerchantForm.invalid) {
      return;
    }
    this.isLoader = true;
    const data = this.addMerchantForm.value;
    // data['parentId'] = data['parentId']['id'];
    // data['parentId'] = data['parentId'];
    if (data.hasOwnProperty('newResellerName')) {
      delete data['newResellerName'];
    }
    if (data['businessStartDate'] !== null) {
      data['businessStartDate'] = new Date(data['businessStartDate'].getTime() -
      data['businessStartDate'].getTimezoneOffset() * 60000).toISOString();
    }
    this.merchantService.editMerchant(data).subscribe(
      a => {
        this.isLoader = false;
        let link;
        this.activatedRoute.params.subscribe((params: Params) => {
          const id = params['id'];
          const parentId = params['parentId'];
          link = `merchant/view/${parentId}/${id}`;
        });
        this.toastData = this.toasterService.successRedirect(MessageSetting.merchant.edit, link);
      },
      // Bind to view
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  cancel() {
    this.activatedRoute.params.subscribe((params: Params) => {
      const id = params['id'];
      const parentId = params['parentId'];
      if (id !== undefined) {
        this.router.navigate([`merchant/view/${parentId}/${id}`], { skipLocationChange: true });
      } else {
        this.addMerchantForm.reset();
        if (this.loggedInUserData['parentId'] !== 0) {
          this.addMerchantForm.controls['newResellerName'].patchValue(this.currentResellerName);
          this.addMerchantForm.controls['parentId'].patchValue(this.loggedInUserData['parentId']);
        } else {
          this.addMerchantForm.controls['parentId'].patchValue(this.loggedInUserData['parentId']);
        }
      }
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

  clear(controlName) {
    this.addMerchantForm.get(controlName).setValue(null);
    // this.addResellerForm.controls[controlName].setValue(null);
  }

  populateCountry() {
    this.commonService.getCountryList().subscribe(
      a => {
        this.countryList = a;
        this.getResellerList();
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  populateState(countryId) {
    // this.addResellerForm.controls['contact']['address']['state'].patchValue('');
    this.addMerchantForm.controls['contact'].controls['address'].controls[
      'state'
    ].patchValue('');
    this.formErrors['state'] = '';
    this.stateList = this.States[countryId];
  }

  getResellerList() {
    this.isLoader = true;
    const parentId = 1;
    this.resellerService.getResellerList(this.loggedInUserData['parentId']).subscribe(
      a => {
        if (this.loggedInUserData['parentId'] === 0) {
          this.resellerList = this.resellerService.addSuperAdminToResellerList(
            a['data']
          );
          setTimeout(() => {
            this.addMerchantForm.controls['parentId'].patchValue(this.loggedInUserData['parentId']);
          }, 10);
        } else {
          this.currentResellerId = a['id'];
          this.currentResellerName = a['resellerName'];

          this.addMerchantForm.controls['newResellerName'].patchValue(this.currentResellerName);
          this.addMerchantForm.controls['parentId'].patchValue(this.currentResellerId);
        }
        this.editMerchant();
        this.isLoader = false;
      },
      // Bind to view
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  getTimeZoneList() {
    this.timeZoneList = [
      { id: 0, name: 'Alaska' },
      { id: 1, name: 'Central' },
      { id: 2, name: 'Eastern' },
      { id: 3, name: 'Hawaii' },
      { id: 4, name: 'Pacific' },
      { id: 5, name: 'Mountain' }
    ];
  }

  hideAll(flag) {
    this.showEverything = flag;
    for (const i in this.accordion) {
      if (i) {
        this.accordion[i] = !flag;
      }
    }
  }

  handleEnterKeyPress(event) {
    return;
  }

  checkUserType() {
    if (this.loggedInUserData['isAdmin'] && this.loggedInUserData['parentId']  === 0) {
      return true;
    } else {
      return false;
    }
  }

}
