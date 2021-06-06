import {Injectable} from '@angular/core';

import {catchError, map, tap} from 'rxjs/operators';

import {AppSetting} from '../constant/appsetting.constant';
import {CommonAPIFuncService} from './common-api-func.service';
import { Router } from '../../../node_modules/@angular/router';
import { StorageService } from '../common/session/storage.service';
import { StorageType } from '../common/session/storage.enum';
import { Observable, throwError } from 'rxjs';


@Injectable({providedIn: 'root'})
export class BillingConfigService {
  loggedInUserData: any = {};
  constructor(private commonAPIFuncService: CommonAPIFuncService,
    private router: Router, private storageService: StorageService) {
  }

  getLoggedInData() {
    return JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
   }

  getbillingConfig(merchantId, resellerId) {
    // this.loggedInUserData = this.getLoggedInData();
    // const parentId = this.loggedInUserData.parentId;
    let url;
    if (resellerId == 0) {
      url = `${AppSetting.billingConfig.getGlobalBillingConfig}/${merchantId}/billingconfig`;
    } else {
      url = `${AppSetting.billingConfig.getResellerBillingConfig}/${resellerId}/merchants/${merchantId}/billingconfig`;
    }
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  putBillingConfig(merchantId, resellerId, data) {
    // this.loggedInUserData = this.getLoggedInData();
    // const parentId = this.loggedInUserData.parentId;
    let url;
    if (resellerId == 0) {
      url = `${AppSetting.billingConfig.getGlobalBillingConfig}/${merchantId}/billingconfig`;
    } else {
      url = `${AppSetting.billingConfig.getResellerBillingConfig}/${resellerId}/merchants/${merchantId}/billingconfig`;
    }
    return this.commonAPIFuncService.put(url, data)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  getchannelSubType(subtype) {
    return this.commonAPIFuncService.get(AppSetting.allowedTransaction.allChannelType + '/' + subtype + '/subTypes').pipe(
      tap((a) => this.log(`added  w/ id`)),
          catchError(this.handleError('add', {}))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return throwError(error);
     // return Observable.throw(error.json().error || error.message);
      // return of(result as T);
    };
  }

  private log(message: string) {
    // this.messageService.add('HeroService: ' + message);
  }
}
