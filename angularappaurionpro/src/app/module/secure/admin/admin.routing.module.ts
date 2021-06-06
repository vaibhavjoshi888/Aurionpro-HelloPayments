import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { AddResellerComponent } from '../reseller/component/add-reseller/add-reseller.component';
// import { ViewResellerComponent } from '../reseller/component/view-reseller/view-reseller.component';
// import { FindResellerComponent } from '../reseller/component/find-reseller/find-reseller.component';
import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard.component';

const adminRoute: Routes = [
    { path: '', component: AdminDashboardComponent },
];

@NgModule({
    imports: [RouterModule.forChild(adminRoute)],
    exports: [RouterModule]
})
export class AdminRouteModule {

}
