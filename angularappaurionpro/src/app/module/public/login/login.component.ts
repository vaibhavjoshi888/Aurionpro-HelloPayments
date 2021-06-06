import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { LoginService } from '../../../api/login.service';
import { ToasterService } from '../../../api/toaster.service';
import { MessageSetting } from '../../../constant/message-setting.constant';
import { StorageService } from '../../../common/session/storage.service';
import { StorageType } from '../../../common/session/storage.enum';
import { Validator } from '../../../common/validation/validator';
// import {ConfirmModalComponent} from '../../../module/common/modal/modal.component';
import { ValidationSetting } from '../../../constant/validation.constant';
import { Exception } from '../../../common/exceptions/exception';
import { AccessRightsService } from '../../../api/access-rights.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService, ToasterService, StorageService]
})
export class LoginComponent implements OnInit {
  loginForm: any;
  loggedInUser: any;
  isLoader: any;
  toastData: any;
  validator: Validator;
  formErrors = {};
  showPassword = false;

  // validation config
  config = {
    userName: {
      required: { name: ValidationSetting.login.userName.name },
      maxlength: {
        name: ValidationSetting.login.userName.name,
        max: ValidationSetting.login.userName.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.login.userName.name,
        min: ValidationSetting.login.userName.minLength.toString()
      }
    },
    password: {
      required: { name: ValidationSetting.login.password.name },
      maxlength: {
        name: ValidationSetting.login.password.name,
        max: ValidationSetting.login.password.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.login.password.name,
        min: ValidationSetting.login.password.minLength.toString()
      }
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private toasterService: ToasterService,
    private router: Router,
    private storageService: StorageService,
    private accessRightsService: AccessRightsService
  ) {
    this.validator = new Validator(this.config);
  }

  ngOnInit() {

    this.loginForm = this.formBuilder.group(
      {
        userName: [
          '',
          [
            Validators.required,
            Validators.maxLength(ValidationSetting.login.userName.maxLength),
            Validators.minLength(ValidationSetting.login.userName.minLength)
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.maxLength(ValidationSetting.login.password.maxLength),
            Validators.minLength(ValidationSetting.login.password.minLength)
          ]
        ],
        RememberMe: []
      },
      {
        updateOn: 'blur'
      }
    );

    this.checkAccountStatus();
    // this.loginForm.onFocusOut.subscribe(data => this.onValueChanged(data));
    // this.loginForm.focusout().subscribe(data => this.onValueChanged(data));
    this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));
    if (this.storageService.get(StorageType.local, 'userAuth')) {
      this.loggedInUser = JSON.parse(
        this.storageService.get(StorageType.local, 'userAuth')
      );
      if (this.loggedInUser) {
        if (this.loggedInUser['RememberMe']) {
          this.loginForm.controls['RememberMe'].patchValue(
            this.loggedInUser.RememberMe
          );
          this.loginForm.controls['userName'].patchValue(
            this.loggedInUser.userName
          );
          this.loginForm.controls['password'].patchValue(
            this.loggedInUser.password
          );
        }
      }
    }

    // this.modal
    //   .open(new ConfirmModal("Are you sure?", "Are you sure about accepting this?", 'small'))
    //   .onApprove(() => alert("User has accepted."))
    //   .onDeny(() => alert("User has denied."));
  }

  onValueChanged(data?: any) {
    if (!this.loginForm) {
      return;
    }
    this.formErrors = this.validator.validate(this.loginForm);
  }

  checkAccountStatus () {
    if (this.storageService.get(StorageType.local, 'sessionExpired')) {
      this.isLoader = false;
      this.toastData = this.toasterService.error(MessageSetting.common.sessionExpired);
      this.storageService.remove(StorageType.local, 'sessionExpired');
    }
    if (this.storageService.get(StorageType.local, 'inactiveAccount')) {
      this.isLoader = false;
      this.toastData = this.toasterService.error(MessageSetting.common.inactiveAccount);
      this.storageService.remove(StorageType.local, 'inactiveAccount');
    }
  }

  login() {
    this.validateAllFormFields(this.loginForm);
    this.formErrors = this.validator.validate(this.loginForm);
    if (this.loginForm.invalid) {
      return;
    }
    try {
      this.isLoader = true;
      const data = this.loginForm.value;
      const username = this.loginForm.controls['userName'].value;
      delete data['RemRememberMe'];
      this.loginService.login(data).subscribe(
        a => {
          if (a['changePassword'] === true) {
            this.router.navigate(['/change-password', a['parentId'], a['userType'], username]);
          } else {
            this.storageService.save(
              StorageType.session,
              'auth',
              JSON.stringify(a)
            );
            this.loginService.getloginUserData(a['userType'], data['userName'], a['parentId']).subscribe(
              b => {
                this.storageService.save(
                  StorageType.session,
                  'userDetails',
                  JSON.stringify(b)
                );

                // Get Role Rights for logged in user only if role id is present (ie. GlobalUser/ResellerUser/MerchantUser)
                if (b['roleId'] !== null) {
                  this.accessRightsService.getRoleDetails().subscribe(
                    response => {
                      this.getAllowedTransactionType(a, b);
                    },
                    error => {
                      const toastMessage = Exception.exceptionMessage(error);
                      this.isLoader = false;
                      this.toastData = this.toasterService.error(toastMessage.join(', '));
                    }
                  );
                } else {
                  this.getAllowedTransactionType(a, b);
                }
              },
              error => {
                const toastMessage = Exception.exceptionMessage(error);
                this.isLoader = false;
                this.toastData = this.toasterService.error(toastMessage.join(', '));
              }
            );
          }
        },
        error => {
          const toastMessage = Exception.exceptionMessage(error);
          this.isLoader = false;
          this.toastData = this.toasterService.error(toastMessage.join(', '));
        }
      );
    } catch (e) {
      this.isLoader = false;
      this.toastData = this.toasterService.error(MessageSetting.common.error);
    }
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
    this.loginForm.controls[controlName].setValue(null);
  }

  toggleShow() {
    this.showPassword = !this.showPassword;
  }

  // This function will decide landing page based on logged in userType (ie. Dashboard for GlobalAdmin/Reseller/Merchant/ChangePassword)
  handleNavigation(a, b) {
    if (this.loginForm.value['RememberMe'] === true) {
      this.loginForm.controls['password'].patchValue(null);
      this.storageService.save(StorageType.local, 'userAuth', JSON.stringify(this.loginForm.value));
    } else {
      this.storageService.remove(StorageType.local, 'userAuth');
    }

    this.isLoader = false;
    if (a['changePassword'] === true) {
      this.router.navigate(['/change-password']);
    }
    if (b['userType'] === 0) {
      this.router.navigate(['/reseller']);
    }
    if (b['userType'] === 1) {
      this.router.navigate(['/merchant']);
    }
    if (b['userType'] === 2) {
      this.router.navigate(['/admin']);
      // this.router.navigate(['/global']);
    }
  }

  getAllowedTransactionType(a, b) {
    if (b['userType'] === 1) { // Merchant
      this.accessRightsService.getAllowedTransactionType().subscribe(
        res => {
            this.handleNavigation(a, b);
        },
        error => {
          const toastMessage = Exception.exceptionMessage(error);
          this.isLoader = false;
          this.toastData = this.toasterService.error(toastMessage.join(', '));
        }
      );
    } else {
      this.handleNavigation(a, b);
    }
  }
}
