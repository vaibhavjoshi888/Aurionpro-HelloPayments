import { NgModule } from '@angular/core';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ResellerRoutingModule } from './reseller.routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { MerchantRatePlanComponent } from './component/merchant-rate-plan/merchant-rate-plan.component';
import { ReportModule } from '../report/report.module';

@NgModule({
  imports: [
    ResellerRoutingModule,
    SharedModule,
    // ReportModule
  ],
  declarations: [
    DashboardComponent,
    MerchantRatePlanComponent
  ]
})
export class ResellerModule { }
