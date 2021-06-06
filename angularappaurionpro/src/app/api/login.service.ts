import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {AppSetting} from '../constant/appsetting.constant';
import {CommonAPIFuncService} from './common-api-func.service';


@Injectable({providedIn: 'root'})
export class LoginService {
  constructor(private commonAPIFuncService: CommonAPIFuncService) {
  }

  login(data) {
    return this.commonAPIFuncService.post(AppSetting.common.login, data).pipe(
      tap(_ => this.commonAPIFuncService.log(`deleted id`)),
      catchError(this.commonAPIFuncService.handleError('delete'))
    );
  }
  getloginUserData(userType, username,  parentID) {
    if (userType === 2) {
      return this.commonAPIFuncService.get(AppSetting.common.getUserByUserName + '/' + username).pipe(
        tap(_ => this.commonAPIFuncService.log(`deleted id`)),
        catchError(this.commonAPIFuncService.handleError('delete'))
      );
    } else if (userType === 1) {  // merchant
      return this.commonAPIFuncService.
      get(AppSetting.merchant.getMerchantByUserName + '/' + parentID + '/users/' + username).pipe(
        tap(_ => this.commonAPIFuncService.log(`deleted id`)),
        catchError(this.commonAPIFuncService.handleError('delete'))
      );

    } else if (userType === 0) {  // reseller
      return this.commonAPIFuncService.
      get(AppSetting.reseller.getResellerByUserName + '/' + parentID + '/users/' + username).pipe(
        tap(_ => this.commonAPIFuncService.log(`deleted id`)),
        catchError(this.commonAPIFuncService.handleError('delete'))
      );
    }
  }
}
