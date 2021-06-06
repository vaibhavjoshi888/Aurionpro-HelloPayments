import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { LoginService } from "../../../api/login.service";
import { ToasterService } from "../../../api/toaster.service";
import { MessageSetting } from "../../../constant/message-setting.constant";
import { StorageService } from "../../../common/session/storage.service";
import { StorageType } from "../../../common/session/storage.enum";
import { Validator } from "../../../common/validation/validator";
// import {ConfirmModalComponent} from '../../../module/common/modal/modal.component';
import { ValidationSetting } from "../../../constant/validation.constant";

@Component({
  selector: "testval",
  templateUrl: "./testval.html",
  styleUrls: ['./testval.css'],
  providers: [LoginService, ToasterService, StorageService]
})
export class TestVal implements OnInit {
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
    private storageService: StorageService
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

  login() {
    this.validateAllFormFields(this.loginForm);
    this.formErrors = this.validator.validate(this.loginForm);
    if (this.loginForm.invalid) {
      return;
    }
    try {
      this.isLoader = true;
      var data = this.loginForm.value;
      delete data['RemRememberMe'];
      this.loginService.login(data).subscribe(
        a => {
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

              if (this.loginForm.value['RememberMe'] == true) {
                this.storageService.save(
                  StorageType.local,
                  'userAuth',
                  JSON.stringify(this.loginForm.value)
                );
              } else {
                this.storageService.remove(StorageType.local, 'userAuth');
              }
              this.isLoader = false;
              this.router.navigate(['/dashboard']);
            },
            err => {
              this.isLoader = false;
              this.toastData = this.toasterService.error(
                MessageSetting.login.invalidCredential
              );
            }
          );
        },
        err => {
          this.isLoader = false;
          this.toastData = this.toasterService.error(
            MessageSetting.login.invalidCredential
          );
        }
      );
    } catch (e) {
      this.isLoader = false;
      this.toastData = this.toasterService.error(MessageSetting.common.error);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    //{1}
    Object.keys(formGroup.controls).forEach(field => {
      //{2}
      const control = formGroup.get(field); //{3}
      if (control instanceof FormControl) {
        //{4}
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        //{5}
        this.validateAllFormFields(control); //{6}
      }
    });
  }

  clear(controlName) {
    this.loginForm.controls[controlName].setValue(null);
  }

  toggleShow() {
    this.showPassword = !this.showPassword;
  }
}
