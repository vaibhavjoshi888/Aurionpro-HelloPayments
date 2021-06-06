// src/app/auth/token.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { Observable } from 'rxjs';
// import { catchError } from '../../../node_modules/rxjs/operators';
import { CommonService } from './common.service';
import { StorageType } from '../common/session/storage.enum';
import { StorageService } from '../common/session/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { filter, map, catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public auth: AuthGuard, private commonService: CommonService, private storageService: StorageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    });

    return next.handle(request).pipe(catchError(err => {
      if (err.status === 403) {
        document.getElementsByTagName('app-loader')['0'].style.visibility = 'hidden';
        this.storageService.save(StorageType.local, 'sessionExpired', JSON.stringify(true));
        this.commonService.logOut();
      } else if (err.error !== null) {
        if (err.error.message === 'Key_InActiveAccount' || err.error.message === 'Key_MerchantInActive' || err.error.message === 'Key_ResellerInActive') {
          try {
            document.getElementsByTagName('app-loader')['0'].style.visibility = 'hidden';
            this.storageService.save(StorageType.local, 'inactiveAccount', JSON.stringify(true));
            // this.activatedRoute.url.subscribe((route) => {
            if (window.location.hash === '#/login') {
              // this.router.navigate(['change_password']);
              document.getElementsByTagName('app-loader')['0'].style.visibility = 'visible';
              window.location.reload();
            } else {
              this.commonService.logOut();
            }
            // });
          } catch (err) {
            this.commonService.logOut();
          }
        } else {
          return throwError(err);
        }
      } else {
        return throwError(err);
      }
    }));
  }
}
