import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionListReportComponent } from './component/transaction-list-report/transaction-list-report.component';
import { MerchantBillingReportComponent } from './component/merchant-billing-report/merchant-billing-report.component';
import { MerchantCreationReportComponent } from './component/merchant-creation-report/merchant-creation-report.component';
import { ReportRoutingModule } from './report.routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { ViewTransactionReportComponent } from './component/view-transaction-report/view-transaction-report.component';
// import { ViewTransactionReportComponent } from './component/transaction-list-report/
// view-transaction-report/view-transaction-report.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReportRoutingModule
  ],
  declarations: [
    TransactionListReportComponent,
    MerchantBillingReportComponent,
    MerchantCreationReportComponent,
    ViewTransactionReportComponent
  ]
})
export class ReportModule { }
