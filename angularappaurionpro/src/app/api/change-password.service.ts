import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable, of, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {AppSetting} from '../constant/appsetting.constant';
import {CommonAPIFuncService} from './common-api-func.service';

@Injectable({providedIn: 'root'})
export class ChangePasswordService {
  constructor(private commonAPIFuncService: CommonAPIFuncService) {
  }

  changePassword(data, userName, userType, parentID) {
    let url = '';
    if (userType === 0 ) {
      url = AppSetting.baseUrl + 'resellers/' + parentID + '/users/' + userName + '/passwords';
    }
    if (userType === 1 ) {
      url = AppSetting.baseUrl + 'merchants/' + parentID + '/users/' + userName + '/passwords';
    }
    if (userType === 2 ) {
      url = AppSetting.baseUrl + 'users/' + userName + '/passwords';
    }
    return this.commonAPIFuncService.post(url, data).pipe(
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
