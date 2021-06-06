import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';

import { ChangePasswordService } from '../../../api/change-password.service';
import { MessageSetting } from '../../../constant/message-setting.constant';
import { StorageService } from '../../../common/session/storage.service';
import { StorageType } from '../../../common/session/storage.enum';
import { Validator } from '../../../common/validation/validator';
import { PasswordValidation } from '../../../common/validation/validation';

import { ValidationSetting } from '../../../constant/validation.constant';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from '../../../api/toaster.service';
import { Exception } from '../../../common/exceptions/exception';

@Component({
  selector: 'app-public-change-password',
  templateUrl: './public-change-password.component.html',
  styleUrls: ['./public-change-password.component.css']
})
export class PublicChangePasswordComponent implements OnInit {

  changePasswordForm: any;
  isLoader: any;
  toastData: any;
  showOldPassword: any;
  showPassword: any;
  showConfirmPassword: any;
  validator: Validator;
  formErrors = {};
  userObj = {};
  userType: Number;
  parentID: Number;
  username: string;
  routeParameter: any;

  // validation config
  config = {
    oldPassword: {
      required: { name: ValidationSetting.changePassword.oldPassword.name },
      maxlength: {
        name: ValidationSetting.changePassword.oldPassword.name,
        max: ValidationSetting.changePassword.oldPassword.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.changePassword.oldPassword.name,
        min: ValidationSetting.changePassword.oldPassword.minLength.toString()
      }
    },
    password: {
      required: { name: ValidationSetting.changePassword.password.name },
      maxlength: {
        name: ValidationSetting.changePassword.password.name,
        max: ValidationSetting.changePassword.password.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.changePassword.password.name,
        min: ValidationSetting.changePassword.password.minLength.toString()
      },
      matchPassword: { name: 'Password' },
      blankPassword: { name: 'Password' }
    },
    confirmPassword: {
      required: { name: ValidationSetting.changePassword.confirmPassword.name },
      maxlength: {
        name: ValidationSetting.changePassword.confirmPassword.name,
        max: ValidationSetting.changePassword.confirmPassword.maxLength.toString()
      },
      minlength: {
        name: ValidationSetting.changePassword.confirmPassword.name,
        min: ValidationSetting.changePassword.confirmPassword.minLength.toString()
      },
      matchPassword: { name: 'Password' },
      blankPassword: { name: 'Password' }
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private changePasswordService: ChangePasswordService,
    private toasterService: ToasterService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService
  ) {
    this.validator = new Validator(this.config);
  }

  ngOnInit() {

    this.routeParameter = this.route.params.subscribe(params => {
      this.userType = +params['userType']; // (+) converts string 'id' to a number
      this.parentID = +params['parentID'];
      this.username = params['username'];
      this.changePasswordForm = this.formBuilder.group(
        {
          oldPassword: [
            '',
            [
              Validators.required,
              Validators.maxLength(
                ValidationSetting.changePassword.oldPassword.maxLength
              ),
              Validators.minLength(
                ValidationSetting.changePassword.oldPassword.minLength
              )
            ]
          ],
          password: [
            '',
            [
              Validators.required,
              Validators.maxLength(
                ValidationSetting.changePassword.password.maxLength
              ),
              Validators.minLength(
                ValidationSetting.changePassword.password.minLength
              )
            ]
          ],
          confirmPassword: [
            '',
            [
              Validators.required,
              Validators.maxLength(
                ValidationSetting.changePassword.confirmPassword.maxLength
              ),
              Validators.minLength(
                ValidationSetting.changePassword.confirmPassword.minLength
              )
            ]
          ]
        },
        {
          validator: PasswordValidation.MatchPassword // your validation method
        }
      );
      // this.userObj['userId'] = '1234';
      // this.userObj['userName'] = 'admin';
      // this.userObj['parentId'] = 0;
      this.changePasswordForm.valueChanges.subscribe(data =>
        this.onValueChanged(data)
      );
   });


  }

  onValueChanged(data?: any) {
    if (!this.changePasswordForm) {
      return;
    }
    this.formErrors = this.validator.validate(this.changePasswordForm);
  }

  changePassword() {
    this.validateAllFormFields(this.changePasswordForm);
    this.formErrors = this.validator.validate(this.changePasswordForm);
    if (this.changePasswordForm.invalid) {
      return;
    }
    try {
      if (this.changePasswordForm.controls['oldPassword'].value === this.changePasswordForm.controls['password'].value) {
        this.toastData = this.toasterService.error(MessageSetting.common.errorNewPaaswordSameAsOldPassword);
        return;
      }
      const data = {};
      data['oldPassword'] = this.changePasswordForm.controls['oldPassword'].value;
      data['newpassword'] = this.changePasswordForm.controls['password'].value;
      data['isReset'] = false;
      // data['id'] = this.userObj['userId'];
      this.isLoader = true;
      this.changePasswordService
        .changePassword(data, this.username , this.userType, this.parentID)
        .subscribe(
          a => {
            this.toastData = this.toasterService.successRedirect(
              MessageSetting.common.changePasswordMessage, '/login'
            );
            this.isLoader = false;
            // this.router.navigate(['/login']);
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

  cancel() {
    this.changePasswordForm.reset();
    // this.router.navigate(['/login']);
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
  toggleShow(data) {
    if (data === 'showOldPassword') {
      this.showOldPassword = !this.showOldPassword;
    } else if (data === 'showPassword'){
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

}
