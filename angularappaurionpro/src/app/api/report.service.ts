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
export class ReportService {
  loggedInUserData: any = {};
  findTransactionData;

  constructor(private commonAPIFuncService: CommonAPIFuncService, private storageService: StorageService) {
    this.loggedInUserData = JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
  }

  getLoggedInData() {
    return JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
  }

  // method used to maintain previous state of transaction report page, when user click back button from view transaction page
  setFindTransactionData(data) {
    this.findTransactionData = data;
  }

  // method used to maintain previous state of transaction report page, when user click back button from view transaction page
  getFindTransactionData() {
    return this.findTransactionData;
  }

  getMerchantCreationReport(data) {
    const url = `${AppSetting.baseUrl}reports/merchantactivationreport${this.buildQuery(data)};`;
    this.loggedInUserData = this.getLoggedInData();
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  getMerchantCreationReporttoCsv(data) {
    const url = `${AppSetting.baseUrl}reports/merchantactivationreport${this.buildQuery(data)}`;
    // this.loggedInUserData = this.getLoggedInData();
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  getTransactionListReport(data) {
    const url = `${AppSetting.baseUrl}reports/transactionlistreport${this.buildQuery(data)};`;
    this.loggedInUserData = this.getLoggedInData();
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  getMerchantbillingReport(data) {
    const url = `${AppSetting.baseUrl}reports/billingreport${this.buildQuery(data)};`;
    this.loggedInUserData = this.getLoggedInData();
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  getMerchantBillingReporttoCsv(data) {
    const url = `${AppSetting.baseUrl}reports/billingreport${this.buildQuery(data)}`;
    // this.loggedInUserData = this.getLoggedInData();
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  getTransactionListReporttoCsv(data) {
    const url = `${AppSetting.baseUrl}reports/transactionlistreport${this.buildQuery(data)}`;
    // this.loggedInUserData = this.getLoggedInData();
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  buildQuery(data) {
    let queryData = '';
    for (const prop in data) {
      if (data[prop] !== '' && data[prop] !== 'undefined' && data[prop] !== null) {
        if (queryData === '') {
          queryData = '?' + prop + '=' + data[prop];
        } else {
          queryData += '&' + prop + '=' + data[prop];
        }
      }
    }
    return queryData;
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
