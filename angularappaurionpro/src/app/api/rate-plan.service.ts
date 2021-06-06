import { Injectable } from '@angular/core';
import {StorageService} from '../common/session/storage.service';
import {StorageType} from '../common/session/storage.enum';

import {Observable, of, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';


import {AppSetting} from '../constant/appsetting.constant';
import {CommonAPIFuncService} from './common-api-func.service';
@Injectable({
  providedIn: 'root'
})
export class RatePlanService {
  loggedInUserData: any = {};

  constructor(private commonAPIFuncService: CommonAPIFuncService, private storageService: StorageService) {
    this.loggedInUserData = JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
  }

  getLoggedInData() {
    return JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
   }

  getFeeTabList(parentId) {
    const urlData = AppSetting.reseller.getAllowTransaction + '/' + parentId + '/allowedTansactionTypes';
    return this.commonAPIFuncService.get(urlData)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  getfeeConfigList() {
    return this.commonAPIFuncService.get(AppSetting.reseller.getFeeConfig)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  getFeeById() {
    return this.commonAPIFuncService.get(AppSetting.reseller.getFeeConfig + '/' + 1)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  getRatePlanList() {
    this.loggedInUserData = this.getLoggedInData();
    let url;
    if (this.loggedInUserData.parentId === 0) {
      url = AppSetting.reseller.getRatePlanList;
    } else {
      url = `${AppSetting.baseUrl}resellers/${this.loggedInUserData.parentId}/rateplans`;
    }
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  getRatePlanById(id) {
    this.loggedInUserData = this.getLoggedInData();
    let url: string;
    if (this.loggedInUserData.parentId === 0) {
      url = AppSetting.reseller.getRatePlanList + '/' + id;
    } else {
      url = AppSetting.reseller.getRatePlanById + '/' + this.loggedInUserData.parentId + '/rateplans/' + id;
    }
    // debugger; //this.loggedInUserData.parentId
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  getRatePlanListforBillingConfig(resellerId) {
    // this.loggedInUserData = this.getLoggedInData();
    let url;
    if (resellerId == 0) {
      url = AppSetting.reseller.getRatePlanList;
    } else {
      url = `${AppSetting.baseUrl}resellers/${resellerId}/rateplans`;
    }
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  addRatePlan(data) {
    this.loggedInUserData = this.getLoggedInData();
    let url;
    if (this.loggedInUserData.parentId === 0) {
      url = AppSetting.reseller.getRatePlanList;
    } else {
      url = `${AppSetting.baseUrl}resellers/${this.loggedInUserData.parentId}/rateplans`;
    }
    // const url = AppSetting.baseUrl + '/rateplans';
    return this.commonAPIFuncService.post(url, data)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  editRatePlan(data, ratePlanId) {
    this.loggedInUserData = this.getLoggedInData();
    let url;
    if (this.loggedInUserData.parentId === 0) {
      url = AppSetting.baseUrl + 'rateplans/' + ratePlanId;
    } else {
      url = `${AppSetting.baseUrl}resellers/${this.loggedInUserData.parentId}/rateplans/${ratePlanId}`;
    }
    // const url = AppSetting.baseUrl + 'rateplans/' + parentId;
    return this.commonAPIFuncService.put(url, data)
    .pipe(
      tap(a => this.log(`fetched`)),
      catchError(this.handleError('', []))
    );
  }

  deleteRatePlan(id, parentId) {
    this.loggedInUserData = this.getLoggedInData();
    let url;
    if (this.loggedInUserData.parentId === 0) {
      url = `${AppSetting.baseUrl}rateplans/${id}`;
    } else {
      url = `${AppSetting.baseUrl}resellers/${parentId}/rateplans/${id}`;
    }
    return this.commonAPIFuncService.delete(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      // return Observable.throw(error.json().error || error.message);
      return throwError(error);
      // return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    // this.messageService.add('HeroService: ' + message);
  }
}
