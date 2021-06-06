import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
// import { CreditcardComponent } from '../secure/merchant/component/credit-card/credit-card.component';
// import { CreditcardtransactionComponent } from '../secure/merchant/component/creditcard-transaction/creditcard-transaction.component';
// import { CreditcardviewComponent } from '../secure/merchant/component/credit-cardview/credit-cardview.component';
// import { AchComponent } from '../secure/merchant/component/ach/ach.component';
import { PublicContactSupportComponent } from './public-contact-support/public-contact-support.component';

export const PUBLIC_ROUTES: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  /// {path: 'test', component: LoginComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  // { path: 'Creditcard', component: CreditcardComponent},
  // { path: 'creditcardtransaction', component: CreditcardtransactionComponent},
  // { path: 'creditcardview', component: CreditcardviewComponent},
  // { path: 'ach', component: AchComponent},
  // { path: 'rateplans', component: RateplanComponent}
  { path: 'contact-support', component: PublicContactSupportComponent},
];
