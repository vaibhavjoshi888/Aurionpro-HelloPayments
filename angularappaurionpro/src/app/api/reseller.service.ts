import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StorageService} from '../common/session/storage.service';
import {StorageType} from '../common/session/storage.enum';

import {Observable, of, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';


import {AppSetting} from '../constant/appsetting.constant';
import {CommonAPIFuncService} from './common-api-func.service';


@Injectable({providedIn: 'root'})
export class ResellerService {
  // loggedInUserData = {};
  findMerchantData;

  constructor(private commonAPIFuncService: CommonAPIFuncService, private storageService: StorageService) {
    // this.loggedInUserData = JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
  }

  setFindResellerData(data) {
    this.findMerchantData = data;
  }

  getFindResellerData() {
    return this.findMerchantData;
  }

  getLoggedInData() {
   return JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
  }

  // deleteReseller(data) {
  //   return this.commonAPIFuncService.delete(AppSetting.reseller.add).pipe(
  //     tap(_ => this.log(`deleted id`)),
  //     catchError(this.handleError('delete'))
  //   );
  // }

  getResellerList(pId) {
    let parentId = this.getLoggedInData()['parentId'];
    let url;
    if (this.getLoggedInData()['isAdmin'] && this.getLoggedInData()['parentId']  === 0 && pId == 0) { // for Global Admin
      url = `${AppSetting.reseller.get}?ParentID=${parentId}&IsActive=true`;
    } else {  // for Reseller
      // return this.commonAPIFuncService.get(AppSetting.reseller.get + '/' + pId)
      url = `${AppSetting.reseller.get}/${this.getLoggedInData()['resellerId']}/subresellers/${pId}`;
    }
    return this.commonAPIFuncService.get(url)
    .pipe(
      tap(a => this.log(`fetched`)),
      catchError(this.handleError('', []))
    );
  }

  getResellerById(resellerId) {
    if (this.getLoggedInData()['isAdmin'] && this.getLoggedInData()['parentId']  === 0) {
      return this.commonAPIFuncService.get(AppSetting.reseller.getById + '/' + resellerId)
        .pipe(
          tap(a => this.log(`fetched`)),
          catchError(this.handleError('', []))
        );
    } else {
      const url = AppSetting.reseller.edit + '/' + this.getLoggedInData()['parentId']  + '/subresellers/' + resellerId;
      return this.commonAPIFuncService.get(url)
        .pipe(
          tap(a => this.log(`fetched`)),
          catchError(this.handleError('', []))
        );
    }
  }

  activateReseller(resellerId, parentId) {
    const url = AppSetting.reseller.common + '/' + parentId + '/activations/' + resellerId; // AppSetting.reseller.getById + '/' + data;
    return this.commonAPIFuncService.post(url, {parentId: parentId, id: resellerId})
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  deactivateReseller(resellerId, parentId) {
    const url = AppSetting.reseller.common + '/' + parentId + '/activations/' + resellerId; // AppSetting.reseller.getById + '/' + data;
      return this.commonAPIFuncService.delete(url)
        .pipe(
          tap(a => this.log(`fetched`)),
          catchError(this.handleError('', []))
        );
  }

  findReseller(data) {
    const url = AppSetting.reseller.find + this.buildQuery(data);
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  getRatePlanList() {
    return this.commonAPIFuncService.get(AppSetting.reseller.getRatePlanList)
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

  getFeeTabList(parentId) {
    const urlData = AppSetting.reseller.getAllowTransaction + '/' + parentId + '/allowedTansactionTypes';
    return this.commonAPIFuncService.get(urlData)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  updateRatePlanList(data) {
    const url = AppSetting.reseller.getRatePlanById + '/' + data.resellerId + '/rateplans/' + data.id;
    return this.commonAPIFuncService.put(url, data)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }
  addRatePlan(data) {
    const url = AppSetting.baseUrl + '/rateplans';
    return this.commonAPIFuncService.post(url, data)
      .pipe(
        tap(a => this.log(`fetched`)),
        catchError(this.handleError('', []))
      );
  }

  getRatePlanById(id) {
    return this.commonAPIFuncService.get(AppSetting.reseller.getRatePlanList + '/' + id)
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

  addReseller(data) {
    if (this.getLoggedInData()['isAdmin'] && this.getLoggedInData()['parentId']  === 0 &&
    data['parentId']  === 0) {
      return this.commonAPIFuncService.post(AppSetting.reseller.add, data).pipe(
        tap((a) => this.log(`added  w/ id`)),
        catchError(this.handleError('add', {}))
      );
    } else {
      // need to update the url
      const url  = AppSetting.reseller.edit + '/' + data['parentId'] + '/subresellers';
      return this.commonAPIFuncService.post(url, data).pipe(
          tap((a) => this.log(`added  w/ id`)),
          catchError(this.handleError('add', {}))
        );
    }
  }

  editReseller(data) {
    if (this.getLoggedInData()['isAdmin'] && this.getLoggedInData()['parentId']  === 0 && data['parentId'] == 0) {
      const url  = AppSetting.reseller.edit + '/' + data['id'];
      return this.commonAPIFuncService.put(url, data).pipe(
        tap((a) => this.log(`added  w/ id`)),
        catchError(this.handleError('add', {}))
      );
    } else {
      const url  = AppSetting.reseller.edit + '/' + data['parentId'] + '/subresellers/' + data['id'];
      return this.commonAPIFuncService.put(url, data).pipe(
          tap((a) => this.log(`added  w/ id`)),
          catchError(this.handleError('add', {}))
        );
    }
  }

  updateReseller(data) {
    return this.commonAPIFuncService.put(AppSetting.reseller.edit, data).pipe(
      tap(_ => this.log(`updated`)),
      catchError(this.handleError<any>('update'))
    );
  }


  deleteReseller(resellerId, parentId) {
    if (this.getLoggedInData()['isAdmin'] && this.getLoggedInData()['parentId']  === 0 && parentId === 0) {
      return this.commonAPIFuncService.delete(AppSetting.reseller.delete + '/' + resellerId).pipe(
        tap((a) => this.log(`added  w/ id`)),
        catchError(this.handleError<any>('add'))
      );
    } else {
      const url  = AppSetting.reseller.edit + '/' + parentId + '/subresellers/' + resellerId;
      return this.commonAPIFuncService.delete(url).pipe(
        tap((a) => this.log(`added  w/ id`)),
        catchError(this.handleError<any>('add'))
      );
    }
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

  addSuperAdminToResellerList(resellerList) {
    const obj = {};
    obj['id'] = 0;
    obj['parentId'] = 0;
    obj['resellerAdminUser'] = 'AdminUser';
    obj['resellerName'] = 'HelloPayment';
    resellerList.unshift(obj);
    return resellerList;
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    // this.messageService.add('HeroService: ' + message);
  }
}
