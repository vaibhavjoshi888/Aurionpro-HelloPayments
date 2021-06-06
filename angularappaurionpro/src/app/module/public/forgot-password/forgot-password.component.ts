import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { ForgetPasswordService } from '../../../api/forgot-password.service';
import { ToasterService } from '../../../api/toaster.service';
import { MessageSetting } from '../../../constant/message-setting.constant';
import { Validator } from '../../../common/validation/validator';
import { ValidationSetting } from '../../../constant/validation.constant';
import { Exception } from '../../../common/exceptions/exception';
import { Router } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers: [ForgetPasswordService, ToasterService]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: any;
  isRobot: boolean;
  isLoader: any;
  toastData: any;
  validator: Validator;
  formErrors = {};
  // validation config
  config = {
    userName: {
      required: { name: ValidationSetting.forgotPassword.userName.name },
      maxlength: {
        name: ValidationSetting.forgotPassword.userName.name,
        max: ValidationSetting.forgotPassword.userName.maxLength.toString()
      }
      // email: {name: ValidationSetting.forgotPassword.userName.name},
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private forgetPasswordService: ForgetPasswordService,
    private toasterService: ToasterService,
    private router: Router,
  ) {
    this.validator = new Validator(this.config);
  }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      userName: [
        '',
        [
          Validators.required,
          Validators.maxLength(
            ValidationSetting.forgotPassword.userName.maxLength
          )
        ]
      ], // Validators.email
      IsCaptcha: []
    });
    this.forgotPasswordForm.valueChanges.subscribe(data =>
      this.onValueChanged(data)
    );
  }

  onValueChanged(data?: any) {
    if (!this.forgotPasswordForm) {
      return;
    }
    this.formErrors = this.validator.validate(this.forgotPasswordForm);
  }

  forgetPassword() {
    this.validateAllFormFields(this.forgotPasswordForm);
    this.formErrors = this.validator.validate(this.forgotPasswordForm);
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    // if (this.isRobot) {
    //   this.formErrors['IsCaptcha'] = 'Please check, You are not robot.';
    //   return;
    // }
    this.isLoader = true;
    try {
      const userName = this.forgotPasswordForm.controls['userName'].value;
      this.forgetPasswordService.forgetPassword(userName).subscribe(
        a => {
          this.toastData = this.toasterService.successRedirect(MessageSetting.forgotPassword.common, '/login');
          this.isLoader = false;
        },
        error => {
          const toastMessage = Exception.exceptionMessage(error);
          this.isLoader = false;
          this.toastData = this.toasterService.error(toastMessage.join(', '));
        }
      );
    } catch (e) {
      this.isLoader = false;
      this.toastData = this.toasterService.error(
        MessageSetting.forgotPassword.common
      );
    }
  }

  cancel() {
    this.router.navigate(['/login']);
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
    this.forgotPasswordForm.controls[controlName].setValue(null);
  }
  private resolved(captchaResponse: string) {
    this.isRobot = false;
    // console.log(`Resolved captcha with response: ${captchaResponse}`);
  }
}
