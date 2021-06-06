import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { SuiModule } from 'ng2-semantic-ui';
import { LoaderComponent } from '../module/public/loader/loader.component';
import { ToastComponent } from '../module/public/toaster/toaster.component';
import { StorageService } from '../common/session/storage.service';
import { TokenInterceptor } from '../api/request-interceptor.service';
import { AuthGuard } from '../api/auth.guard';
import { ConfirmModalComponent } from '../module/common/modal/modal.component';
import { ToasterService } from '../api/toaster.service';
import { RatePlanComponent } from '../module/secure/rate-plan/rate-plan.component';
import { AddResellerComponent } from '../module/secure/reseller/component/add-reseller/add-reseller.component';
import { ViewResellerComponent } from '../module/secure/reseller/component/view-reseller/view-reseller.component';
import { FindResellerComponent } from '../module/secure/reseller/component/find-reseller/find-reseller.component';
import { TwoDigitDecimaNumberDirective } from './directives/two-digit-decima-number.directive';
import { ReportComponent } from '../module/secure/report/report.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SuiModule,
    TranslateModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ToastComponent,
    LoaderComponent,
    ReactiveFormsModule,
    SuiModule,
    TranslateModule,
    ConfirmModalComponent,
    RatePlanComponent,
    ReportComponent,
    AddResellerComponent,
    ViewResellerComponent,
    FindResellerComponent,
    TwoDigitDecimaNumberDirective
  ],
  declarations: [
    ToastComponent,
    LoaderComponent,
    ConfirmModalComponent,
    RatePlanComponent,
    AddResellerComponent,
    ViewResellerComponent,
    FindResellerComponent,
    ReportComponent,
    TwoDigitDecimaNumberDirective
  ],
  providers: [
    ToasterService, AuthGuard, StorageService, {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  entryComponents: [
    ConfirmModalComponent,
  ],
})
export class SharedModule { }
