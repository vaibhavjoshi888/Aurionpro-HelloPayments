import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DatepickerMode } from 'ng2-semantic-ui';

import { ResellerService } from '../../../../../api/reseller.service';
import { CommonService } from '../../../../../api/common.service';
import { ToasterService } from '../../../../../api/toaster.service';
import { MessageSetting } from '../../../../../constant/message-setting.constant';
import { StorageService } from '../../../../../common/session/storage.service';
import { StorageType } from '../../../../../common/session/storage.enum';
import { Validator } from '../../../../../common/validation/validator';
import { ValidationSetting } from '../../../../../constant/validation.constant';
import { Utilities } from '../../../../../common/utilities';
// import {States} from "../../../../../common/master-data/states.constant";
import { States } from '../../../../../constant/states.constant';
import { Exception } from '../../../../../common/exceptions/exception';

@Component({
  selector: 'app-add-reseller',
  templateUrl: './add-reseller.component.html',
  styleUrls: ['./add-reseller.component.css'],
  providers: [ResellerService, ToasterService, CommonService]
})
export class AddResellerComponent implements OnInit {
  mode: DatepickerMode = DatepickerMode.Date;
  addResellerForm: any;
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
  inputValidation = ValidationSetting;

  config = {
    resellerName: {
      required: { name: ValidationSetting.reseller.add.resellerName.name },
      maxlength: {
        name: ValidationSetting.reseller.add.resellerName.name,
        max: ValidationSetting.reseller.add.resellerName.maxLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.resellerName.name }
    },
    resellerAdminUser: {
      required: { name: ValidationSetting.reseller.add.resellerAdminUser.name },
      maxlength: {
        name: ValidationSetting.reseller.add.resellerAdminUser.name,
        max: ValidationSetting.reseller.add.resellerAdminUser.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.reseller.add.resellerAdminUser.name,
        min: ValidationSetting.reseller.add.resellerAdminUser.minLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.resellerAdminUser.name }
    },
    title: {
      required: { name: ValidationSetting.reseller.add.title.name },
      maxlength: {
        name: ValidationSetting.reseller.add.title.name,
        max: ValidationSetting.reseller.add.title.maxLength.toString()
      }
    },
    firstName: {
      required: { name: ValidationSetting.reseller.add.firstName.name },
      maxlength: {
        name: ValidationSetting.reseller.add.firstName.name,
        max: ValidationSetting.reseller.add.firstName.maxLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.firstName.name }
    },
    middleName: {
      required: { name: ValidationSetting.reseller.add.middleName.name },
      maxlength: {
        name: ValidationSetting.reseller.add.middleName.name,
        max: ValidationSetting.reseller.add.middleName.maxLength.toString()
      }
    },
    lastName: {
      required: { name: ValidationSetting.reseller.add.lastName.name },
      maxlength: {
        name: ValidationSetting.reseller.add.lastName.name,
        max: ValidationSetting.reseller.add.lastName.maxLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.lastName.name }
    },
    companyName: {
      required: { name: ValidationSetting.reseller.add.companyName.name },
      maxlength: {
        name: ValidationSetting.reseller.add.companyName.name,
        max: ValidationSetting.reseller.add.companyName.maxLength.toString()
      }
    },
    department: {
      maxlength: {
        name: ValidationSetting.reseller.add.department.name,
        max: ValidationSetting.reseller.add.department.maxLength.toString()
      }
    },
    fax: {
      maxlength: {
        name: ValidationSetting.reseller.add.fax.name,
        max: ValidationSetting.reseller.add.fax.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.reseller.add.fax.name,
        min: ValidationSetting.reseller.add.fax.minLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.fax.name }
    },
    phone: {
      required: { name: ValidationSetting.reseller.add.phone.name },
      maxlength: {
        name: ValidationSetting.reseller.add.phone.name,
        max: ValidationSetting.reseller.add.phone.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.reseller.add.phone.name,
        min: ValidationSetting.reseller.add.phone.minLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.phone.name }
    },
    mobile: {
      maxlength: {
        name: ValidationSetting.reseller.add.mobile.name,
        max: ValidationSetting.reseller.add.mobile.maxLength.toString()
      }
    },
    email: {
      required: { name: ValidationSetting.reseller.add.email.name },
      maxlength: { name: ValidationSetting.reseller.add.email.name },
      email: { name: ValidationSetting.reseller.add.email.name },
      pattern: { name: ValidationSetting.reseller.add.email.name }
    },
    url: {
      required: { name: ValidationSetting.reseller.add.url.name },
      maxlength: {
        name: ValidationSetting.reseller.add.url.name,
        max: ValidationSetting.reseller.add.url.maxLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.url.name }
    },
    addressLine1: {
      required: { name: ValidationSetting.reseller.add.addressLine1.name },
      maxlength: {
        name: ValidationSetting.reseller.add.addressLine1.name,
        max: ValidationSetting.reseller.add.addressLine1.maxLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.addressLine1.name }
    },
    addressLine2: {
      maxlength: {
        name: ValidationSetting.reseller.add.addressLine2.name,
        max: ValidationSetting.reseller.add.addressLine2.maxLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.addressLine2.name }
    },
    city: {
      required: { name: ValidationSetting.reseller.add.city.name },
      maxlength: {
        name: ValidationSetting.reseller.add.city.name,
        max: ValidationSetting.reseller.add.city.maxLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.city.name }
    },
    state: {
      required: { name: ValidationSetting.reseller.add.state.name },
      maxlength: {
        name: ValidationSetting.reseller.add.state.name,
        max: ValidationSetting.reseller.add.state.maxLength.toString()
      }
    },
    country: {
      required: { name: ValidationSetting.reseller.add.country.name },
      maxlength: {
        name: ValidationSetting.reseller.add.country.name,
        max: ValidationSetting.reseller.add.country.maxLength.toString()
      }
    },
    postalCode: {
      required: { name: ValidationSetting.reseller.add.postalCode.name },
      maxlength: {
        name: ValidationSetting.reseller.add.postalCode.name,
        max: ValidationSetting.reseller.add.postalCode.maxLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.postalCode.name }
    },
    timeZone: {
      maxlength: {
        name: ValidationSetting.reseller.add.timeZone.name,
        max: ValidationSetting.reseller.add.timeZone.maxLength.toString()
      }
    },
    ownership: {
      maxlength: {
        name: ValidationSetting.reseller.add.ownership.name,
        max: ValidationSetting.reseller.add.ownership.maxLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.ownership.name }
    },
    businessStartDate: {
      maxlength: {
        name: ValidationSetting.reseller.add.businessStartDate.name,
        max: ValidationSetting.reseller.add.businessStartDate.maxLength.toString()
      }
    },
    federalTaxId: {
      required: { name: ValidationSetting.reseller.add.federalTaxId.name },
      maxlength: {
        name: ValidationSetting.reseller.add.federalTaxId.name,
        max: ValidationSetting.reseller.add.federalTaxId.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.reseller.add.federalTaxId.name,
        min: ValidationSetting.reseller.add.federalTaxId.maxLength.toString()
      },
      pattern: {
        name: ValidationSetting.reseller.add.federalTaxId.name
      }
    },
    salesTaxId: {
      maxlength: {
        name: ValidationSetting.reseller.add.salesTaxId.name,
        max: ValidationSetting.reseller.add.salesTaxId.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.reseller.add.salesTaxId.name,
        min: ValidationSetting.reseller.add.salesTaxId.maxLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.salesTaxId.name }
    },
    stateTaxId: {
      maxlength: {
        name: ValidationSetting.reseller.add.stateTaxId.name,
        max: ValidationSetting.reseller.add.stateTaxId.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.reseller.add.stateTaxId.name,
        min: ValidationSetting.reseller.add.stateTaxId.maxLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.stateTaxId.name }
    },
    estimatedSales: {
      maxlength: {
        name: ValidationSetting.reseller.add.estimatedSales.name,
        max: ValidationSetting.reseller.add.estimatedSales.maxLength.toString()
      },
      pattern: { name: ValidationSetting.reseller.add.estimatedSales.name }
    },
    parentId: {
      required: { name: ValidationSetting.reseller.add.parentId.name },
      maxlength: {
        name: ValidationSetting.reseller.add.parentId.name,
        max: ValidationSetting.reseller.add.parentId.maxLength.toString()
      }
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private resellerService: ResellerService,
    private toasterService: ToasterService,
    private router: Router,
    private commonService: CommonService
  ) {
    this.validator = new Validator(this.config);
  }

  ngOnInit() {
    this.showEverything = false;
    this.addResellerForm = this.formBuilder.group({
      id: [0, []],
      newResellerName: ['', []],
      resellerName: ['', [
          Validators.required,
          Validators.maxLength(ValidationSetting.reseller.add.resellerName.maxLength),
          Validators.pattern(ValidationSetting.alphanumericWithSpace_regex)
        ]
      ],
      resellerAdminUser: ['', [
          Validators.required,
          Validators.maxLength(ValidationSetting.reseller.add.resellerAdminUser.maxLength),
          Validators.minLength(ValidationSetting.reseller.add.resellerAdminUser.minLength),
          Validators.pattern(ValidationSetting.alphanumeric_regex)
        ]
      ],
      contact: this.formBuilder.group({
        name: this.formBuilder.group({
          firstName: ['', [
            Validators.required,
            Validators.maxLength(ValidationSetting.reseller.add.firstName.maxLength),
            Validators.pattern(ValidationSetting.firstNameLastName_regex)
            ]
          ],
          lastName: ['', [
            Validators.required,
            Validators.maxLength(ValidationSetting.reseller.add.lastName.maxLength),
            Validators.pattern(ValidationSetting.firstNameLastName_regex)
            ]
          ]
        }),
        fax: ['', [
            Validators.maxLength(ValidationSetting.reseller.add.fax.maxLength),
            Validators.minLength(ValidationSetting.reseller.add.fax.minLength),
            Validators.pattern(ValidationSetting.numbersOnly_regex)
          ]
        ],
        phone: ['', [
            Validators.required,
            Validators.maxLength(ValidationSetting.reseller.add.phone.maxLength),
            Validators.minLength(ValidationSetting.reseller.add.phone.minLength),
            Validators.pattern(ValidationSetting.numbersOnly_regex)
          ]
        ],
        mobile: ['', [
            Validators.maxLength(ValidationSetting.reseller.add.mobile.maxLength)
          ]
        ],
        email: ['', [
            Validators.required,
            Validators.pattern(ValidationSetting.email_regex)
          ]
        ],
        url: ['', [
            Validators.required,
            Validators.maxLength(ValidationSetting.reseller.add.url.maxLength),
            Validators.pattern(ValidationSetting.url_regex)
          ]
        ],
        address: this.formBuilder.group({
          addressLine1: ['', [
              Validators.required,
              Validators.maxLength(ValidationSetting.reseller.add.addressLine1.maxLength),
              Validators.pattern(ValidationSetting.spaceNotAccepted_regex)
            ]
          ],
          addressLine2: ['', [
              Validators.maxLength(ValidationSetting.reseller.add.addressLine2.maxLength),
              Validators.pattern(ValidationSetting.spaceNotAccepted_regex)
            ]
          ],
          city: ['', [
              Validators.required,
              Validators.maxLength(ValidationSetting.reseller.add.city.maxLength),
              Validators.pattern(ValidationSetting.charactersOnlyWithSpace_regex)
            ]
          ],
          state: ['', [
              Validators.required,
              Validators.maxLength(ValidationSetting.reseller.add.state.maxLength)
            ]
          ],
          country: ['', [
              Validators.required,
              Validators.maxLength(ValidationSetting.reseller.add.country.maxLength)
            ]
          ],
          postalCode: ['', [
              Validators.required,
              Validators.maxLength(ValidationSetting.reseller.add.postalCode.maxLength),
            ]
          ],
          timeZone: ['', [
              Validators.maxLength(ValidationSetting.reseller.add.timeZone.maxLength)
            ]
          ]
        })
      }),
      parentId: ['', [
          Validators.required,
          Validators.maxLength(ValidationSetting.reseller.add.parentId.maxLength)
        ]
      ],
      ownership: ['', [
          Validators.maxLength(ValidationSetting.reseller.add.ownership.maxLength),
          Validators.pattern(ValidationSetting.spaceNotAccepted_regex)
        ]
      ],
      federalTaxId: ['', [
          Validators.required,
          Validators.maxLength(ValidationSetting.reseller.add.federalTaxId.maxLength),
          Validators.minLength(ValidationSetting.reseller.add.federalTaxId.maxLength),
          Validators.pattern(ValidationSetting.numbersOnly_regex)
        ]
      ],
      businessStartDate: ['', [
          Validators.maxLength(ValidationSetting.reseller.add.businessStartDate.maxLength)
        ]
      ],
      salesTaxId: ['', [
          Validators.maxLength(ValidationSetting.reseller.add.salesTaxId.maxLength),
          Validators.minLength(ValidationSetting.reseller.add.salesTaxId.minLength),
          Validators.pattern(ValidationSetting.numbersOnly_regex)
        ]
      ],
      stateTaxId: ['', [
          Validators.maxLength(ValidationSetting.reseller.add.stateTaxId.maxLength),
          Validators.minLength(ValidationSetting.reseller.add.salesTaxId.minLength),
          Validators.pattern(ValidationSetting.numbersOnly_regex)
        ]
      ],
      estimatedSales: ['', [
          Validators.maxLength(ValidationSetting.reseller.add.estimatedSales.maxLength),
          Validators.pattern(ValidationSetting.spaceNotAccepted_regex)
        ]
      ]
    });
    this.addResellerForm.valueChanges.subscribe(data =>
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

  editReseller() {
    this.isLoader = true;
    this.activatedRoute.params.subscribe((params: Params) => {
      const id = params['id'];
      if (id) {
        this.editFlag = true;
        this.getResellerById(id);
      } else {
        this.editFlag = false;
        this.isLoader = false;
      }
    });
  }

  onValueChanged(data?: any) {
    if (!this.addResellerForm) {
      return;
    }
    this.formErrors = this.validator.validate(this.addResellerForm);
  }

  getResellerById(resellerId) {
    this.resellerService.getResellerById(resellerId).subscribe(
      a => {
        const parentResellerList = this.resellerList.filter(
          x => x.id === a['parentId']
        )[0];
        const timeZoneName = this.timeZoneList.filter(
          x => x.name === a['contact'].address.timeZone
        )[0];
        if (a['businessStartDate'] !== null) {
          a['businessStartDate'] = new Date(a['businessStartDate']);
        }
        // a['businessStartDate'] = new Date(a['businessStartDate']);
        this.addResellerForm.controls['parentId'].patchValue(a['parentId']);
        this.stateList = this.States[a['contact']['address']['country']];
        // code added due to datatype missmatch issue 18/07/2018
        a['contact']['address']['country'] = Number(
          a['contact']['address']['country']
        );
        this.addResellerForm.patchValue(a);
        // this.addResellerForm.controls['contact'].address.timeZone.patchValue(timeZoneName);
        this.isLoader = false;
      },
      // Bind to view
      error  => {
        this.isLoader = false;
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  save() {
    try {
      this.validateAllFormFields(this.addResellerForm);
      this.formErrors = this.validator.validate(this.addResellerForm);
      if (this.addResellerForm.invalid) {
        this.accordion.primaryContact = true;
        this.accordion.addressDetail = true;
        this.accordion.additionalInfo = true;
        return;
      }
      this.isLoader = true;
      const data = this.addResellerForm.value;
      // Commenting check as we not using Time Zone field
      // if (data['contact'].address.timeZone !== undefined && data['contact'].address.timeZone.name !== null) {
      //   data['contact'].address.timeZone = '';
      // }
      data['contact'].address.timeZone = '';
      if (data.hasOwnProperty('id')) {
        delete data['id'];
      }
      if (data['businessStartDate'] !== undefined && data['businessStartDate'] !== null
      && data['businessStartDate'] !== '') {
        data['businessStartDate'] = new Date(data['businessStartDate'].getTime() -
        data['businessStartDate'].getTimezoneOffset() * 60000).toISOString();
      }

      this.resellerService.addReseller(data).subscribe(
        a => {
          this.addResellerForm.reset();
          if (this.loggedInUserData['parentId'] !== 0) {
            this.addResellerForm.controls['newResellerName'].patchValue(this.currentResellerName);
            this.addResellerForm.controls['parentId'].patchValue(this.loggedInUserData['parentId']);
          } else {
            this.addResellerForm.controls['parentId'].patchValue(this.loggedInUserData['parentId']);
          }
          this.isLoader = false;
          this.toastData = this.toasterService.success(
            MessageSetting.reseller.add
          );
        },
        // Bind to view
        error => {
          const toastMessage = Exception.exceptionMessage(error);
          this.isLoader = false;
          this.toastData = this.toasterService.error(toastMessage.join(', '));
        }

      );

    } catch (e) {
      this.isLoader = false;
    }
  }

  edit() {
    this.validateAllFormFields(this.addResellerForm);
    this.formErrors = this.validator.validate(this.addResellerForm);
    if (this.addResellerForm.invalid) {
      return;
    }
    this.isLoader = true;
    const data = this.addResellerForm.value;
    // data['parentId'] = data['parentId']['id'];
    data['parentId'] = data['parentId'];
    if (data['businessStartDate'] !== undefined && data['businessStartDate'] !== null
    && data['businessStartDate'] !== '') {
      data['businessStartDate'] = new Date(data['businessStartDate'].getTime() -
      data['businessStartDate'].getTimezoneOffset() * 60000).toISOString();
    }
    this.resellerService.editReseller(data).subscribe(
      a => {
        this.isLoader = false;
        let id;
        this.activatedRoute.params.subscribe((params: Params) => {
          id = params['id'];
        });
        this.toastData = this.toasterService.successRedirect(MessageSetting.reseller.edit, `reseller/view/${id}`);
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
      if (id !== undefined) {
        this.router.navigate([`reseller/view/${id}`], { skipLocationChange: true });
      } else {
        this.addResellerForm.reset();
        if (this.loggedInUserData['parentId'] !== 0) {
          this.addResellerForm.controls['newResellerName'].patchValue(this.currentResellerName);
          this.addResellerForm.controls['parentId'].patchValue(this.loggedInUserData['parentId']);
        } else {
          this.addResellerForm.controls['parentId'].patchValue(this.loggedInUserData['parentId']);
        }
      }
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    // {1}
    Object.keys(formGroup.controls).forEach(field => {
      // {2}
      const control = formGroup.get(field); // {3}
      if (control instanceof FormControl) {
        // {4}
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        // {5}
        this.validateAllFormFields(control); // {6}
      }
    });
  }

  clear(controlName) {
    this.addResellerForm.get(controlName).setValue(null);
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
    this.addResellerForm.controls['contact'].controls['address'].controls[
      'state'
    ].patchValue('');
    this.formErrors['state'] = '';
    this.stateList = this.States[countryId];
  }

  getResellerList() {
    this.isLoader = true;
     this.resellerService.getResellerList(this.loggedInUserData['parentId']).subscribe(
      a => {
        if (this.loggedInUserData['parentId'] === 0) {
          this.resellerList = this.resellerService.addSuperAdminToResellerList(
            a['data']
          );
          setTimeout(() => {
            this.addResellerForm.controls['parentId'].patchValue(this.loggedInUserData['parentId']);
          }, 10);
        } else {
          // the currentresellerid will become the parent id of the reseller
          // which is created under him;
          this.currentResellerId = a['id'];
          this.currentResellerName = a['resellerName'];
            this.addResellerForm.controls['newResellerName'].patchValue(this.currentResellerName);
          // this.addResellerForm.controls['parentId'].patchValue(this.currentResellerId);
          this.addResellerForm.controls['parentId'].patchValue(this.loggedInUserData['parentId']);
        }
        this.editReseller();
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

  checkUserType() {
    if (this.loggedInUserData['isAdmin'] && this.loggedInUserData['parentId']  === 0) {
      return true;
    } else {
      return false;
    }
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
}
