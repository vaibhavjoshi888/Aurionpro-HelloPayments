import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import {AdminRouteModule} from './admin.routing.module';

import { SharedModule } from '../../../shared/shared.module';
import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminRouteModule,
    SharedModule
  ],
  declarations: [
    AdminDashboardComponent
  ]
})
export class AdminModule { }
