import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRatePlanComponent } from './add-rate-plan/add-rate-plan.component';
import { FindRatePlanComponent } from './find-rate-plan/find-rate-plan.component';


const ratePlanRouting: Routes = [
  { path: 'add', component: AddRatePlanComponent},
  { path: 'edit/:id', component: AddRatePlanComponent},
  { path: 'find', component: FindRatePlanComponent},
];

@NgModule({
  imports: [RouterModule.forChild(ratePlanRouting)],
  exports: [RouterModule]
})

export class RatePlanRoutingModule {

}
