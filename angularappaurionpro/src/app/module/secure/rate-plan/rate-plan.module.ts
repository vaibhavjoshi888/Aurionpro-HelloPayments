import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRatePlanComponent } from './add-rate-plan/add-rate-plan.component';
import { FindRatePlanComponent } from './find-rate-plan/find-rate-plan.component';
import { RatePlanRoutingModule } from './rate-plan.routing.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RatePlanRoutingModule,
    SharedModule
  ],
  declarations: [
    AddRatePlanComponent,
    FindRatePlanComponent
  ]
})
export class RatePlanModule { }
