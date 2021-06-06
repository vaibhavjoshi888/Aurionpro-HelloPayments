import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AddMerchantComponent } from './component/add-merchant/add-merchant.component';
import { ViewMerchantComponent } from './component/view-merchant/view-merchant.component';
import { FindMerchantComponent } from './component/find-merchant/find-merchant.component';
import { FindTransactionComponent } from './component/transactions/transaction-management/find-transaction/find-transaction.component';
import { ViewTransactionComponent } from './component/transactions/transaction-management/view-transaction/view-transaction.component';
import { AddTransactionComponent } from './component/transactions/virtual-terminal/add-transaction/add-transaction.component';
import { ProcessorConfigurationComponent} from './component/processor-configuration/processor-configuration.component';
import { BillingConfigComponent} from './component/billing-config/billing-config.component';
import { AllowedTransactionTypeComponent} from './component/allowed-transaction-type/allowed-transaction-type.component';
// import { CustomerModule } from '../customer/customer.module';
import { AuthGuard } from 'src/app/api/auth.guard';

const merchantRouting: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'add', component: AddMerchantComponent},
    { path: 'edit/:parentId/:id', component: AddMerchantComponent},
    { path: 'view/:id', component: ViewMerchantComponent},
    { path: 'view/:resellerId/:id', component: ViewMerchantComponent},
    { path: 'find', component: FindMerchantComponent},
    { path: 'find/:fromBackClick', component: FindMerchantComponent},
    // {path: 'customer', loadChildren: () => CustomerModule, canActivate: [AuthGuard]},
    // { path: 'creditcard', component: CreditCardComponent},
    { path: 'virtualtransaction/:type', component: AddTransactionComponent},
    { path: 'findtransaction/credit', component: FindTransactionComponent},
    { path: 'findtransaction/credit/:fromBackClick', component: FindTransactionComponent},
    { path: 'findtransaction/debit', component: FindTransactionComponent},
    { path: 'findtransaction/debit/:fromBackClick', component: FindTransactionComponent},
    { path: 'findtransaction/ach', component: FindTransactionComponent},
    { path: 'findtransaction/ach/:fromBackClick', component: FindTransactionComponent},
    { path: 'viewtransaction/:channelType/:transactionId', component: ViewTransactionComponent},
    // { path: 'viewtransaction/debit/:transactionId', component: ViewTransactionComponent},
    // { path: 'viewtransaction/ach/:transactionId', component: ViewTransactionComponent},
    { path: 'view/:resellerId/:id/processorconfiguration', component: ProcessorConfigurationComponent},
    { path: 'view/:resellerId/:id/processorconfiguration/:fromAllowedTransactionTypes', component: ProcessorConfigurationComponent},
    { path: 'view/:resellerId/:id/billingconfig', component: BillingConfigComponent},
    { path: 'view/:resellerId/:id/billingconfig/:fromProcessorConfiguration', component: BillingConfigComponent},
    { path: 'view/:resellerId/:id/allowedtransactiontype', component: AllowedTransactionTypeComponent},
    { path: 'view/:resellerId/:id/allowedtransactiontype/:fromAddMerchant', component: AllowedTransactionTypeComponent},
];

@NgModule({
    imports: [RouterModule.forChild(merchantRouting)],
    exports: [RouterModule]
})
export class MerchantRoutingModule {

}
