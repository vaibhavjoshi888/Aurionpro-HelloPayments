import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AppSetting } from '../constant/appsetting.constant';
import { CommonAPIFuncService } from './common-api-func.service';
import { StorageService } from '../common/session/storage.service';
import { StorageType } from '../common/session/storage.enum';

@Injectable({
  providedIn: 'root'
})
export class ProcessorConfigurationService {

  loggedInUserData: any = {};

  constructor(private commonAPIFuncService: CommonAPIFuncService, private storageService: StorageService) { }

  getLoggedInData() {
    return JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
  }

  // /channels
  getAllChannelTypes() {
    const url = `${AppSetting.baseUrl}/channels`;
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  // /gateways
  getAllGateways() {
    const url = `${AppSetting.baseUrl}gateways`;
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  // /processors -- Get all processors list
  getProcessorList() {
    const url = AppSetting.processor.common;
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  // merchants/{merchantId:int}/allowedTransactionTypes --for global
  // resellers/{parentId:int}/merchants/{merchantId:int}/allowedTransactionTypes  --for reseller
  getAllowedTransactionTypes(resellerId, merchantId) {
    this.loggedInUserData = this.getLoggedInData();
    let url;
    if (this.loggedInUserData.parentId === 0) {
      url = `${AppSetting.baseUrl}merchants/${merchantId}/allowedtransactiontypes`;
    } else {
      url = `${AppSetting.baseUrl}resellers/${resellerId}/merchants/${merchantId}/allowedtransactiontypes`;
    }
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  // Set processors configuration by merchantId
  // PUT :merchants/{parentId:int}/processorconfigurations/{channelType}  --for global
  // PUT :resellers/{parentId:int}/merchants/{merchantId:int}/processorconfigurations/{channelType} --for reseller
  setProcessorConfiguration(resellerId, merchantId, channelType, reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url;
    if (this.loggedInUserData.parentId === 0) {
      url = `${AppSetting.baseUrl}merchants/${merchantId}/processorconfigurations/${channelType}`;
    } else {
      url = `${AppSetting.baseUrl}resellers/${resellerId}/merchants/${merchantId}/processorconfigurations/${channelType}`;
    }
    return this.commonAPIFuncService.put(url, reqObj)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  // Get processors configuration by merchantId
  // GET :merchants/{parentId:int}/processorconfigurations/{channelType}  -- for global
  // GET :resellers/{parentId:int}/merchants/{merchantId:int}/processorconfigurations/{channelType} -- for reseller
  getProcessorConfiguration(resellerId, merchantId, channelType) {
    this.loggedInUserData = this.getLoggedInData();
    let url;
    if (resellerId === null) {
      url = `${AppSetting.baseUrl}merchants/${merchantId}/processorconfigurations/${channelType}`;
    } else {
      if (this.loggedInUserData.parentId === 0) {
        url = `${AppSetting.baseUrl}merchants/${merchantId}/processorconfigurations/${channelType}`;
      } else {
        url = `${AppSetting.baseUrl}resellers/${resellerId}/merchants/${merchantId}/processorconfigurations/${channelType}`;
      }
    }
    return this.commonAPIFuncService.get(url)
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
