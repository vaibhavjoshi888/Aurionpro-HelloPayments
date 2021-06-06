import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AppSetting } from '../constant/appsetting.constant';
import { CommonAPIFuncService } from './common-api-func.service';


@Injectable({ providedIn: 'root' })
export class AdminService {
    constructor(private commonAPIFuncService: CommonAPIFuncService) { }

    deleteAdmin(data) {
        return this.commonAPIFuncService.delete(AppSetting.admin.add).pipe(
            tap(_ => this.log(`deleted id`)),
            catchError(this.handleError('delete'))
        );
    }

    getAdmin(data) {
        return this.commonAPIFuncService.get(AppSetting.admin.get)
            .pipe(
            tap(a => this.log(`fetched`)),
            catchError(this.handleError('', []))
            );
    }

    addAdmin(data) {
        return this.commonAPIFuncService.post(AppSetting.admin.add, data).pipe(
            tap((a) => this.log(`added  w/ id`)),
            catchError(this.handleError<any>('add'))
        );
    }

    updateAdmin(data) {
        return this.commonAPIFuncService.put(AppSetting.admin.edit, data).pipe(
            tap(_ => this.log(`updated`)),
            catchError(this.handleError<any>('update'))
        );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return Observable.throw(error.json().error || error.message);
            //return of(result as T);
        };
    }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        //this.messageService.add('HeroService: ' + message);
    }
}
