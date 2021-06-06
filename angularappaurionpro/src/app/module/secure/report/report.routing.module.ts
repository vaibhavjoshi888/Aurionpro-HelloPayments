import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchantCreationReportComponent } from './component/merchant-creation-report/merchant-creation-report.component';
import { MerchantBillingReportComponent } from './component/merchant-billing-report/merchant-billing-report.component';
import { TransactionListReportComponent } from './component/transaction-list-report/transaction-list-report.component';
import { ViewTransactionReportComponent } from './component/view-transaction-report/view-transaction-report.component';
// import { ViewTransactionReportComponent } from './component/
// transaction-list-report/view-transaction-report/view-transaction-report.component';

const reportRouting: Routes = [
    { path: 'transaction-list-report', component: TransactionListReportComponent},
    { path: 'transaction-list-report/:fromBackClick', component: TransactionListReportComponent},
    { path: 'merchant-creation-report', component: MerchantCreationReportComponent},
    { path: 'merchant-billing-report', component: MerchantBillingReportComponent},
    { path: 'view-transaction-report/:channelType/:transactionId/:merchantId', component: ViewTransactionReportComponent},
    // { path: 'view-report', component: ViewTransactionReportComponent},

];

@NgModule({
    imports: [RouterModule.forChild(reportRouting)],
    exports: [RouterModule]
})
export class ReportRoutingModule {

}
