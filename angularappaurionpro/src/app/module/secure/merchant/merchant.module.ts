import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './component/dashboard/dashboard.component';
import { MerchantRoutingModule } from './merchant.rounting.module';
import { SharedModule } from '../../../shared/shared.module';
import { AddMerchantComponent } from './component/add-merchant/add-merchant.component';
import { FindMerchantComponent } from './component/find-merchant/find-merchant.component';
import { ViewMerchantComponent } from './component/view-merchant/view-merchant.component';
import { FindTransactionComponent } from './component/transactions/transaction-management/find-transaction/find-transaction.component';
import { ViewTransactionComponent } from './component/transactions/transaction-management/view-transaction/view-transaction.component';
import { AddTransactionComponent } from './component/transactions/virtual-terminal/add-transaction/add-transaction.component';
import { TransactionModule } from './component/transactions/virtual-terminal/add-transaction/transaction.module';
import { ProcessorConfigurationComponent} from './component/processor-configuration/processor-configuration.component';
import { BillingConfigComponent} from './component/billing-config/billing-config.component';
import { AllowedTransactionTypeComponent} from './component/allowed-transaction-type/allowed-transaction-type.component';
import { AllowedTransactionService } from '../../../api/allowed-transaction.service';
import { BillingConfigCardComponent } from './component/billing-config/billing-config-card/billing-config-card.component';
import { BillingConfigAchComponent } from './component/billing-config/billing-config-ach/billing-config-ach.component';
import { BillingConfigService } from '../../../api/billing-config.service';

@NgModule({
  imports: [
    CommonModule,
     RouterModule,
     MerchantRoutingModule,
     SharedModule,
     TransactionModule
  ],
  declarations: [
    DashboardComponent,
    AddMerchantComponent,
    FindMerchantComponent,
    ViewMerchantComponent,
    AddTransactionComponent,
    FindTransactionComponent,
    ViewTransactionComponent,
    ProcessorConfigurationComponent,
    BillingConfigComponent,
    AllowedTransactionTypeComponent,
    BillingConfigCardComponent,
    BillingConfigAchComponent
  ],
  providers: [AllowedTransactionService, BillingConfigService],
})
export class MerchantModule { }
