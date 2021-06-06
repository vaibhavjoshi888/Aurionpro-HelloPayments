import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {AppSetting} from '../constant/appsetting.constant';
import {CommonAPIFuncService} from './common-api-func.service';


@Injectable({providedIn: 'root'})
export class ForgetPasswordService {
  constructor(private commonAPIFuncService: CommonAPIFuncService) {
  }

  forgetPassword(userName) {
    const url = AppSetting.baseUrl + 'users/' + userName + '/forgotpasswords';
    return this.commonAPIFuncService.post(url, {}).pipe(
      tap(_ => this.commonAPIFuncService.log('User Name:' + userName)),
      catchError(this.commonAPIFuncService.handleError('forgotPassword'))
    );
  }
}
