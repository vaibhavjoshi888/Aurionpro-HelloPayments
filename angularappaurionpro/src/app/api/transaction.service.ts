import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {AppSetting} from '../constant/appsetting.constant';
import {CommonAPIFuncService} from './common-api-func.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  findTransactionData;

  constructor(private commonAPIFuncService: CommonAPIFuncService) { }

  setFindTransactionData(data) {
    this.findTransactionData = data;
  }

  getFindTransactionData() {
    return this.findTransactionData;
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

  getTransactionStatus(parentId, transactionId) {
    const url = `${AppSetting.merchant.common}/${parentId}/transactions/` + transactionId;
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  // merchants/{parentId}/transactions
  findTransaction(parentId, data) {
    const url = `${AppSetting.merchant.common}/${parentId}/transactions` + this.buildQuery(data);
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  //  /merchants/{parentId}/transactions/{id}
  viewTransaction(parentId, transactionId) {
    const url = `${AppSetting.merchant.common}/${parentId}/transactions/${transactionId}`;
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  // /merchants/{parentId}/{channelType}/transactions/{id}/refunds
  refundTransaction(parentId, channelType, transactionId, data) {
    const url = `${AppSetting.merchant.common}/${parentId}/${channelType}/transactions/${transactionId}/refunds`;
    return this.commonAPIFuncService.post(url, data)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  // /merchants/{parentId}/{channelType}/transactions/{id}/cancellations
  voidTransaction(parentId, channelType, transactionId) {
    const url = `${AppSetting.merchant.common}/${parentId}/${channelType}/transactions/${transactionId}/cancellations`;
    return this.commonAPIFuncService.post(url, null)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  // POST : merchants/{parentId:int}/transactions/{id}/adjustment
  adjustTransaction(merchantId, transactionId, data) {
    const url = `${AppSetting.merchant.common}/${merchantId}/transactions/${transactionId}/adjustment` + this.buildQuery(data);
    return this.commonAPIFuncService.post(url, null)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  // /merchants/{parentId}/transactions
  forceAuthTransaction(parentId, reqObj) {
    const url = `${AppSetting.merchant.common}/${parentId}/transactions`;
    return this.commonAPIFuncService.post(url, reqObj)
    .pipe(
      tap(a => this.log(`fetched`)),
      catchError(this.handleError('', []))
    );
  }

  // /merchants/id/transactions/id/offline
  offlineTransaction(merchantId, transactionId, reqObj) {
    const url = `${AppSetting.merchant.common}/${merchantId}/transactions/${transactionId}/offline`;
    return this.commonAPIFuncService.post(url, reqObj)
    .pipe(
      tap(a => this.log(`fetched`)),
      catchError(this.handleError('', []))
    );
  }

  processTransaction(parentId, data) {
    const url = `${AppSetting.merchant.common}/${parentId}/transactions/`;
    return this.commonAPIFuncService.post(url, data)
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
