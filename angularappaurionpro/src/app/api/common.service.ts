import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {AppSetting} from '../constant/appsetting.constant';
import {CommonAPIFuncService} from './common-api-func.service';
import { Router } from '../../../node_modules/@angular/router';
import { StorageService } from '../common/session/storage.service';
import { StorageType } from '../common/session/storage.enum';


@Injectable({providedIn: 'root'})
export class CommonService {
  constructor(private commonAPIFuncService: CommonAPIFuncService, private router: Router, private storageService: StorageService) {
  }

  getCountryList() {
    return this.commonAPIFuncService.get(AppSetting.common.getCountry).pipe(
      tap(_ => this.commonAPIFuncService.log(`deleted id`)),
      catchError(this.commonAPIFuncService.handleError('delete'))
    );
  }

  getStateList(countryId) {
    return this.commonAPIFuncService.get(AppSetting.common.getState + countryId).pipe(
      tap(_ => this.commonAPIFuncService.log(`deleted id`)),
      catchError(this.commonAPIFuncService.handleError('delete'))
    );
  }

  getUserNameAvailability(username) {
    const url = AppSetting.common.getUserByUserName + '/' + username + '/isavailable';
    return this.commonAPIFuncService.get(url).pipe(
      tap(_ => this.commonAPIFuncService.log('UserNameCheck')),
      catchError(this.commonAPIFuncService.handleError('UserNameCheck'))
    );
  }

  logOut() {
    try {
      this.storageService.remove(StorageType.session, 'userDetails');
      this.storageService.remove(StorageType.session, 'auth');
      this.storageService.remove(StorageType.session, 'roleDetails');
    } catch (Execption) {
      this.storageService.remove(StorageType.session, 'userDetails');
      this.storageService.remove(StorageType.session, 'auth');
      this.storageService.remove(StorageType.session, 'roleDetails');
    }
    this.router.navigate(['/login']);
  }

  // returns only date (mm-dd-yyyy) from date object
  getFormattedDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = (1 + d.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = d.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return month + '-' + day + '-' + year;
  }

  // returns only time (hh:mm:ss) from date object
  getFormattedTime(date) {
    const d = new Date(date);
    let minutes = d.getMinutes().toString();
    let hours = d.getHours().toString();
    let seconds = d.getSeconds().toString();
    hours = (hours.length > 1) ? hours : '0' + hours;
    minutes = (minutes.length > 1) ? minutes : '0' + minutes;
    seconds = (seconds.length > 1) ? seconds : '0' + seconds;
    return hours + ':' + minutes + ':' + seconds;
  }


}
