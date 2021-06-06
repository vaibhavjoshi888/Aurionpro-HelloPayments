import { Component, OnInit } from '@angular/core';
import { ViewTransactionModel } from '../../../../../shared/models/view-transaction-model.model';
import { ActivatedRoute, Router, Params } from '../../../../../../../node_modules/@angular/router';
import { TransactionService } from '../../../../../api/transaction.service';
import { StorageService } from '../../../../../common/session/storage.service';
import { CommonService } from '../../../../../api/common.service';
import { SuiModalService } from '../../../../../../../node_modules/ng2-semantic-ui';
import { ToasterService } from '../../../../../api/toaster.service';
import { AccessRightsService } from '../../../../../api/access-rights.service';
import { ProcessorConfigurationService } from '../../../../../api/processor-configuration.service';
import { StorageType } from '../../../../../common/session/storage.enum';
import { ChannelTypeEnum } from '../../../../../enum/channeltypes.enum';
import * as moment from 'moment';
import { TransactionOperationMapEnum } from '../../../../../enum/transaction-operation-map.enum';
import { TransactionOperationEnum } from '../../../../../enum/transaction-operation.enum';
import { Exception } from '../../../../../common/exceptions/exception';
import { TransactionStatusMapEnum } from '../../../../../enum/transaction-status-map.enum';
import { TransactionStatusEnum } from '../../../../../enum/transaction-status.enum';

@Component({
  selector: 'app-view-transaction-report',
  templateUrl: './view-transaction-report.component.html',
  styleUrls: ['./view-transaction-report.component.css'],
  providers: [ViewTransactionModel]
})
export class ViewTransactionReportComponent implements OnInit {

  isLoader: any;
  toastData: any;
  loggedInUserData: any = {};
  transactionDetails: any;
  operation: any;
  hiddenFlag = true;
  merchantId: any;
  transactionId: any;
  channelType: any;
  countryId;

  constructor(private activatedRoute: ActivatedRoute,
    private transactionService: TransactionService,
    private storageService: StorageService,
    private commonService: CommonService,
    private modalService: SuiModalService,
    private toasterService: ToasterService,
    private router: Router,
    private viewTransactionModel: ViewTransactionModel,
    private accessRights: AccessRightsService,
    private processorConfigurationService: ProcessorConfigurationService) {
      this.loggedInUserData = JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
    }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.transactionId = params.transactionId;
      this.merchantId = params.merchantId;
      if (params.channelType === 'credit') {
        this.channelType = ChannelTypeEnum.CreditCard;
      } else if (params.channelType === 'debit') {
        this.channelType = ChannelTypeEnum.DebitCard;
      } else {
        this.channelType = ChannelTypeEnum.ACH;
      }
      this.viewTransaction(this.merchantId, this.transactionId);
    });
  }

  viewTransaction(merchantId, transactionId) {
    this.isLoader = true;
    this.transactionService.viewTransaction(merchantId, transactionId).subscribe(response => {
      this.transactionDetails = this.viewTransactionModel.viewTransactionResponse(response);
      this.populateCountry();
      this.transactionDetails.operationType = TransactionOperationMapEnum[TransactionOperationEnum[this.transactionDetails.operationType]];
      this.transactionDetails.transactionStatus = TransactionStatusMapEnum[TransactionStatusEnum[this.transactionDetails.transactionStatus]];
      const localDate = moment.utc(this.transactionDetails.transactionDate).local();
      this.transactionDetails.date = this.commonService.getFormattedDate(localDate['_d']);
      this.transactionDetails.time = this.commonService.getFormattedTime(localDate['_d']);

      if ( this.transactionDetails.transactionStatus === 'Failed'
      || this.transactionDetails.transactionStatus === 'Denied'
      || this.transactionDetails.transactionStatus === 'Hold') {
        let msg = '';
        if (this.transactionDetails.transactionResult.reasonMessage != null) {
          msg = Exception.getExceptionMessage(this.transactionDetails.transactionResult.reasonMessage);
        }
        if (msg !== '' && msg !== 'Something went wrong. Please contact administrator.') {
          this.transactionDetails.transactionResult.reasonMessage = msg;
          // Other than these keys, all other messages will be displayed directly as received from backend
        }
        if ( this.transactionDetails.transactionResult.reasonMessage === null) {
          this.transactionDetails.transactionResult.reasonMessage = this.transactionDetails.transactionResult.reasonCode;
        }
      }
      this.hiddenFlag = false;
      this.isLoader = false;
    }, error => {
      const toastMessage = Exception.exceptionMessage(error);
      this.isLoader = false;
      this.toastData = this.toasterService.error(toastMessage.join(', '));
    });
  }

  populateCountry() {
    this.commonService.getCountryList().subscribe(
      response => {
        const countryList: any = response;
        this.countryId = this.transactionDetails.billingContact.address.country;
        if (this.transactionDetails.billingContact.address.country != null) {
          this.transactionDetails.billingContact.address.country = countryList.filter(
            (x): any => x.countryId == this.transactionDetails.billingContact.address.country
          )[0].name;
        }
        this.hiddenFlag = false;
        this.isLoader = false;
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  onReferenceTransactionIdClick() {
    if (this.channelType === 2) {
      this.router.navigate([`/report/view-transaction-report/ach/${this.transactionDetails.referenceTransactionId}/${this.merchantId}`]);
    } else if (this.channelType === 3) {
      this.router.navigate([`/report/view-transaction-report/credit/${this.transactionDetails.referenceTransactionId}/${this.merchantId}`]);
    } else {
      this.router.navigate([`/report/view-transaction-report/debit/${this.transactionDetails.referenceTransactionId}/${this.merchantId}`]);
    }
  }

  cancel() {
    this.router.navigate(['/report/transaction-list-report/true']);
  }

}
