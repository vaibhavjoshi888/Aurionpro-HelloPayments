import { Injectable } from '@angular/core';
import { AppSetting } from '../constant/appsetting.constant';
import { CommonAPIFuncService } from './common-api-func.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from '../../../node_modules/rxjs';
import { StorageService } from '../common/session/storage.service';
import { StorageType } from '../common/session/storage.enum';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private commonAPIFuncService: CommonAPIFuncService,
    private storageService: StorageService
  ) { }

  // deleteCustomer(merchantId, parentId) {
  //   let url;
  //   if (parentId === 0) {
  //     url = `${AppSetting.customer.delete}/${merchantId}`;
  //   } else {
  //     url = `${AppSetting.customer.delete}/${parentId}/merchants/${merchantId}`;
  //   }
  //   return this.commonAPIFuncService.delete(url).pipe(
  //     tap((a) => this.log(`Deleted  w/ id`)),
  //     catchError(this.handleError<any>('delete'))
  //   );
  // }
  getLoggedInData() {
    return JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
   }

  addCustomer(data) {
    return this.commonAPIFuncService.post(AppSetting.merchant.add + '/' + this.getLoggedInData()['parentId'] + '/customers', data).pipe(
      tap(a => this.log('added  w/ id')),
      catchError(this.handleError<any>('add'))
    );
  }

  editCustomer(data, customerId) {
    const url  = AppSetting.merchant.edit + '/' + this.getLoggedInData()['parentId']  + '/customers/' + customerId;
    return this.commonAPIFuncService.put(url, data).pipe(
      tap((a) => this.log(`added  w/ id`)),
      catchError(this.handleError('add', {}))
    );
  }

  getCustomerById(customerId, parentId) {
    const url  = AppSetting.merchant.edit + '/' + parentId  + '/customers/' + customerId;
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  findCustomer(reqObj, parentId) {
    let url;
    // const parentId = reqObj.ParentId;
    // delete reqObj.ParentId;
    if (reqObj.AllActiveInactive) {
      // delete reqObj.isEnabled;
      delete reqObj.AllActiveInactive;
    }
    url = `${AppSetting.merchant.get}/${parentId}/customers${this.buildQuery(reqObj)}`;
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  fetchCustomerAccount(customerId, parentId) {
    let url;
    url = `${AppSetting.merchant.get}/${parentId}/customers/${customerId}/customeraccounts`;
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  getRecurringPaymentInfo(customerId, merchantId) {
    let url;
    url = `${AppSetting.merchant.get}/${merchantId}/customers/${customerId}/recurringpayments`;
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  getInvoiceInfo(customerId, merchantId) {
    let url;
    url = `${AppSetting.merchant.get}/${merchantId}/customers/${customerId}/invoiceschedule`;
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
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return throwError(error);
     // return Observable.throw(error.json().error || error.message);
      // return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    // this.messageService.add('HeroService: ' + message);
  }
}
