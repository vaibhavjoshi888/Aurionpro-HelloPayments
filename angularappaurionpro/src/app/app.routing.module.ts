/*app dependency module*/
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TestComponent} from './module/public/test/test.component';
import {AuthGuard} from './api/auth.guard';
import {from} from 'rxjs/internal/observable/from';
import {PUBLIC_ROUTES} from './module/public/public.routes';
import {PublicComponent} from './module/public/public.component';
import {SECURE_ROUTES} from './module/secure/secure.routes';
import {SecureComponent} from './module/secure/secure.component';
import { PublicChangePasswordComponent } from './module/public/public-change-password/public-change-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full', data: { breadcrumb: 'login' } },
  { path: '', component: PublicComponent, data: { title: 'Public Views' }, children: PUBLIC_ROUTES },
  { path: '', component: SecureComponent, canActivate: [AuthGuard],
    data: { title: 'Secure Views' }, children: SECURE_ROUTES },
  {path: 'change-password/:parentID/:userType/:username', component: PublicChangePasswordComponent},
  {path: 'test', component: TestComponent},
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
