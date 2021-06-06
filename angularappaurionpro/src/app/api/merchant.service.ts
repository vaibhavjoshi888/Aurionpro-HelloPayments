import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AppSetting } from '../constant/appsetting.constant';
import { CommonAPIFuncService } from './common-api-func.service';
import { StorageService } from '../common/session/storage.service';
import { StorageType } from '../common/session/storage.enum';


@Injectable({ providedIn: 'root' })
export class MerchantService {
  // loggedInUserData = {};
  findMerchantData;
  isFromAddMerchant = false;

  constructor(private commonAPIFuncService: CommonAPIFuncService, private storageService: StorageService) {
  // this.loggedInUserData = JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
  }

  setFindMerchantData(data) {
    this.findMerchantData = data;
  }

  getFindMerchantData() {
    return this.findMerchantData;
  }

  setIsFromAddMerchant(isFromAddMerchant) {
    this.isFromAddMerchant = isFromAddMerchant;
  }

  getIsFromAddMerchant() {
    return this.isFromAddMerchant;
  }

  getLoggedInData() {
    return JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
   }

  getResellerList(pId) {
    let parentId;
    parentId = this.getLoggedInData()['parentId'];
    let url;
    if (this.getLoggedInData()['isAdmin'] && this.getLoggedInData()['parentId']  === 0) {
      url = `${AppSetting.reseller.get}?ParentID=${parentId}&IsActive=true`;
    } else {
      url = `${AppSetting.reseller.get}/${parentId}`;
    }
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  findMerchant(reqObj) {
    let url;
    if (reqObj.ParentId === 0) {
      url = AppSetting.merchant.find + this.buildQuery(reqObj);
    } else {
      const ParentId = reqObj.ParentId;
      // delete reqObj.ParentId;
      url = `${AppSetting.reseller.get}/${ParentId}/merchants/${this.buildQuery(reqObj)}`;
    }
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

  addSuperAdminToResellerList(resellerList) {
    const obj = {};
    obj['id'] = 0;
    obj['parentId'] = 0;
    obj['resellerAdminUser'] = 'AdminUser';
    obj['resellerName'] = 'HelloPayment';
    resellerList.unshift(obj);
    return resellerList;
  }

  deleteMerchant(merchantId, parentId) {
    let url;
    if (parentId === 0) {
      url = `${AppSetting.merchant.delete}/${merchantId}`;
    } else {
      url = `${AppSetting.merchant.commonReseller}/${parentId}/merchants/${merchantId}`;
    }
    return this.commonAPIFuncService.delete(url).pipe(
      tap((a) => this.log(`Deleted  w/ id`)),
      catchError(this.handleError<any>('delete'))
    );
  }

  getMerchantById(merchantId, parentId) {
    let url = '';
    if (parentId !== '0') {
      url = `${AppSetting.reseller.get}/${parentId}/merchants/${merchantId}`;
    } else {
      url = `${AppSetting.merchant.getById}/${merchantId}`;
    }

    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  // /resellers/{parentId}/merchants/{merchantId}/activations
  activateMerchant(merchantId, parentId) {
    let url;
    if (parentId === '0') {
      url = `${AppSetting.merchant.common}/${merchantId}/activations`; // global
    } else {
      url = `${AppSetting.merchant.commonReseller}/${parentId}/merchants/${merchantId}/activations`;  // reseller
    }

    return this.commonAPIFuncService.post(url, { parentId: parentId, id: merchantId })
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  //  /resellers/{parentId}/merchants/{merchantId}/activations
  deactivateMerchant(merchantId, parentId) {
    let url;
    if (parentId) {
      url = `${AppSetting.merchant.commonReseller}/${parentId}/merchants/${merchantId}/activations`;  // reseller
    } else {
      url = `${AppSetting.merchant.common}/${merchantId}/activations`; // global
    }
    return this.commonAPIFuncService.delete(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  getAllActiveMerchants() {
    const url = `${AppSetting.merchant.get}/list`;
    return this.commonAPIFuncService.get(url).pipe(
      tap(a => this.log('fetched')),
      catchError(this.handleError('', []))
    );
  }




  // deleteMerchant(data) {
  //   return this.commonAPIFuncService.delete(AppSetting.merchant.add).pipe(
  //     tap(_ => this.log('deleted id')),
  //     catchError(this.handleError('delete'))
  //   );
  // }

  /** GET heroes from the server */
  getMerchant(data) {
    return this.commonAPIFuncService.get(AppSetting.merchant.get).pipe(
      tap(a => this.log('fetched')),
      catchError(this.handleError('', []))
    );
  }
  addMerchant(data) {
    if (this.getLoggedInData()['isAdmin'] && this.getLoggedInData()['parentId']  === 0 &&
    data['parentId']  === 0) {
      return this.commonAPIFuncService.post(AppSetting.merchant.add, data).pipe(
        tap(a => this.log('added  w/ id')),
        catchError(this.handleError<any>('add'))
      );
    } else {
      data['resellerId'] = data['parentId'];  // this.getLoggedInData()['parentId'];
      if (data.hasOwnProperty('parentId')) {
        delete data['parentId'];
      }
      // data['resellerId'] = data['parentId'];
      return this.commonAPIFuncService.post(AppSetting.merchant.addUnderReseller + '/' +
      data['resellerId'] + '/merchants' , data).pipe(
        tap(a => this.log('added  w/ id')),
        catchError(this.handleError<any>('add'))
      );
    }
  }

  editMerchant(data) {
    if (this.getLoggedInData()['isAdmin'] && this.getLoggedInData()['parentId']  === 0 && data['parentId']) {
      const url  = AppSetting.merchant.edit + '/' + data['id'];
      return this.commonAPIFuncService.put(url, data).pipe(
        tap((a) => this.log(`added  w/ id`)),
        catchError(this.handleError('add', {}))
      );
    } else {
      const url  = AppSetting.reseller.edit + '/' + data['parentId'] + '/merchants/' + data['id'];
      return this.commonAPIFuncService.put(url, data).pipe(
          tap((a) => this.log(`added  w/ id`)),
          catchError(this.handleError('add', {}))
        );
    }
  }

  updateMerchant(data) {
    return this.commonAPIFuncService.put(AppSetting.merchant.edit, data).pipe(
      tap(_ => this.log('updated')),
      catchError(this.handleError<any>('update'))
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

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    // this.messageService.add('HeroService: ' + message);
  }
}
