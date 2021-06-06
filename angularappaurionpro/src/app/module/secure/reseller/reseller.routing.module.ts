import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from '../reseller/component/dashboard/dashboard.component';
import { AddResellerComponent } from '../reseller/component/add-reseller/add-reseller.component';
import { ViewResellerComponent } from '../reseller/component/view-reseller/view-reseller.component';
import { FindResellerComponent } from '../reseller/component/find-reseller/find-reseller.component';
// import { FeeConfigurationComponent } from '../reseller/component/fee-configuration/fee-configuration-reseller.component';
// import {
//   MerchantFeeConfigurationComponent
// } from '../reseller/component/fee-configuration/merchant-fee-configuration-reseller.component';
// import { AuthGuard } from '../../../api/auth.guard';
// import { RatePlanComponent } from '../rate-plan/rate-plan.component';
import { MerchantRatePlanComponent } from './component/merchant-rate-plan/merchant-rate-plan.component';


const resellerRouting: Routes = [
    { path: '', component: DashboardComponent},
    { path: 'add', component: AddResellerComponent},
    { path: 'edit/:id', component: AddResellerComponent},
    { path: 'view/:id', component: ViewResellerComponent},
    { path: 'find', component: FindResellerComponent},
    { path: 'find/:fromBackClick', component: FindResellerComponent},
    { path: 'merchant-rate-plan', component: MerchantRatePlanComponent},
    { path: 'merchant-rate-plan/:id', component: MerchantRatePlanComponent}
];

@NgModule({
    imports: [RouterModule.forChild(resellerRouting)],
    exports: [RouterModule]
})

export class ResellerRoutingModule {

}
