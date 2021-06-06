import {Routes, RouterModule} from '@angular/router';
/*admin module*/
import {AdminModule} from './admin/admin.module';

/*reseller module*/
import {ResellerModule} from './reseller/reseller.module';

/*merchant module*/
import {MerchantModule} from './merchant/merchant.module';

import {AuthGuard} from '../../api/auth.guard';

import {ChangePasswordComponent} from './change-password/change-password.component';
import {MenuComponent} from './menu/menu.component';
import {WorkProgressComponent} from './work-progress/work-progress.component';

import { RatePlanModule } from './rate-plan/rate-plan.module';
import { ReportModule } from './report/report.module';
import { PublicContactSupportComponent } from '../public/public-contact-support/public-contact-support.component';


export const SECURE_ROUTES: Routes = [
  {path: 'change_password', component: ChangePasswordComponent, canActivate: [AuthGuard]},
  {path: 'work-progress', component: WorkProgressComponent, canActivate: [AuthGuard]},
  {path: 'admin', loadChildren: () => AdminModule, canActivate: [AuthGuard]},
  {path: 'reseller', loadChildren: () => ResellerModule, canActivate: [AuthGuard]},
  {path: 'merchant', loadChildren: () => MerchantModule, canActivate: [AuthGuard]},
  {path: 'rateplan', loadChildren: () => RatePlanModule, canActivate: [AuthGuard]},
  {path: 'report', loadChildren: () => ReportModule, canActivate: [AuthGuard]},
  {path: 'menu', component: MenuComponent},
  { path: 'contact-support', component: PublicContactSupportComponent},
];
