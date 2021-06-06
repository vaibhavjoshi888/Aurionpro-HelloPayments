import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app.routing.module';
import { DataTablesModule } from 'angular-datatables';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

import { AppComponent } from './app.component';
import {AdminComponent} from './module/secure/admin/admin.component';
import {ResellerComponent} from './module/secure/reseller/reseller.component';
import {MerchantComponent} from './module/secure/merchant/merchant.component';
import {LoginComponent} from './module/public/login/login.component';
import {WorkProgressComponent} from './module/secure/work-progress/work-progress.component';
import {ForgotPasswordComponent} from './module/public/forgot-password/forgot-password.component';
import {ChangePasswordComponent} from './module/secure/change-password/change-password.component';
import {MenuComponent} from './module/secure/menu/menu.component';
import {footerComponent} from './module/public/footer/footer.component';
import {TestComponent} from './module/public/test/test.component';
import {OrderByPipe} from './pipe/orderby.pipe';
import {from} from 'rxjs/internal/observable/from';
import {PublicComponent} from './module/public/public.component';
import {PublicHeaderComponent} from './module/public/header/header.component';
import {SecureHeaderComponent} from './module/secure/header/header.component';
import {SecureComponent} from './module/secure/secure.component';
import {TestVal} from './module/public/testvalid/testval';
import { ResellerModule } from './module/secure/reseller/reseller.module';
import { SharedModule } from './shared/shared.module';
import { TranslateModule, TranslateLoader } from '../../node_modules/@ngx-translate/core';
import { TranslateHttpLoader } from '../../node_modules/@ngx-translate/http-loader';
import { PublicChangePasswordComponent } from './module/public/public-change-password/public-change-password.component';
import { FormsModule } from '@angular/forms';
import { PublicContactSupportComponent } from './module/public/public-contact-support/public-contact-support.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ResellerComponent,
    MerchantComponent,
    LoginComponent,
    WorkProgressComponent,
    ChangePasswordComponent,
    PublicChangePasswordComponent,
    ForgotPasswordComponent,
    PublicHeaderComponent,
    MenuComponent,
    footerComponent,
    TestComponent,
    OrderByPipe,
    PublicComponent,
    SecureComponent,
    PublicHeaderComponent,
    SecureHeaderComponent,
    TestVal,
    PublicContactSupportComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    ResellerModule,
    RecaptchaFormsModule,
    RecaptchaModule.forRoot(),
    DataTablesModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
   providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
