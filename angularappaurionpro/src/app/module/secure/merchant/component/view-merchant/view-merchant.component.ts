import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageSetting } from '../../../../../constant/message-setting.constant';
import { ConfirmModal } from '../../../../common/modal/modal.component';

// services
import { SuiModalService } from '../../../../../../../node_modules/ng2-semantic-ui';
import { MerchantService } from '../../../../../api/merchant.service';
import { CommonService } from '../../../../../api/common.service';
import { ToasterService } from '../../../../../api/toaster.service';
import { ChangePasswordService } from '../../../../../api/change-password.service';
import { ResellerService } from '../../../../../api/reseller.service';
import { Exception } from '../../../../../common/exceptions/exception';
import { AccessRightsService } from '../../../../../api/access-rights.service';

@Component({
  selector: 'app-view-merchant',
  templateUrl: './view-merchant.component.html',
  styleUrls: ['./view-merchant.component.css'],
  providers: [ToasterService, CommonService]
})
export class ViewMerchantComponent implements OnInit {

  isLoader: any;
  toastData: any;
  viewMerchantForm: any;
  merchantDetails: any = {};
  hiddenFlag = true;

  username: string;
  parentId: Number;
  userType: Number;
  merchantId: Number;
  resellerId: Number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: SuiModalService,
    private merchantService: MerchantService,
    private toasterService: ToasterService,
    private commonService: CommonService,
    private resellerService: ResellerService,
    private changePasswordService: ChangePasswordService,
    private router: Router,
    private accessRights: AccessRightsService) { }

  ngOnInit() {
    this.isLoader = true;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.merchantId = params['id'];
      this.resellerId = params.resellerId;
      this.getMerchantById(this.merchantId, this.resellerId);
    });
  }

  hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess) {
    return this.accessRights.hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess);
  }

  // get date in mm-dd-yyyy format
  getFormattedDate(date) {
    if (date != null) {
      return this.commonService.getFormattedDate(date);
    }
  }

  getMerchantById(merchantId, resellerId?) {
    this.merchantService.getMerchantById(merchantId, resellerId).subscribe(
      response => {

        this.username = response['merchantAdminUser'];
        this.parentId = response['resellerId'];

        if (this.parentId === 0) {  // logic discussed by vaibhav api team 20/07/2018
          this.userType = 2;
        } else {
          this.userType = 0;
        }
        this.merchantDetails = response;
        this.populateCountry();
        if (this.parentId == 0) {
          this.merchantDetails['merchantParentName'] = 'HelloPayment';
        } else {
          this.resellerService.getResellerList(this.parentId).subscribe(
            b => {
                this.merchantDetails['merchantParentName'] = b['resellerName'];
            });
        }
      },
      // Bind to view
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  populateCountry() {
    this.commonService.getCountryList().subscribe(
      response => {
        const countryList: any = response;
        if (!isNaN(Number(this.merchantDetails.contact.address.country))) {
          this.merchantDetails.contact.address.country = countryList.filter(
            (x): any => x.countryId == this.merchantDetails.contact.address.country
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

  confirmReset = () => {
    this.modalService
      .open(new ConfirmModal('Are you sure you want to reset the password?', ''))
      .onApprove(() => this.resetPassword());
  }

  resetPassword = () => {
    const data = {};
    data['isReset'] = true;
    this.isLoader = true;
    this.changePasswordService.changePassword(data, this.username, this.userType, this.parentId).subscribe(response => {
        this.isLoader = false;
        this.toastData = this.toasterService.success(MessageSetting.common.resetPasswordMessage);
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  activate(merchantId, resellerId) {
    this.isLoader = true;
    this.merchantService.activateMerchant(merchantId, resellerId).subscribe(
      a => {
        this.merchantDetails['isActive'] = true;
        this.isLoader = false;
        this.toastData = this.toasterService.success(MessageSetting.merchant.activate);
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        const errMessage = `${toastMessage.join(', ')} ${MessageSetting.merchant.activateError}`;
        this.isLoader = false;
        // this.toastData = this.toasterService.error(errMessage);
        let redirectLink = '';
        const errorList = error.error.errors;
        for (const i in errorList) {
          if (i) {
            switch (errorList[i]['field']) {
              case 'Key_AllowedTransactionTypeMissing':
                redirectLink = `/merchant/view/${resellerId}/${merchantId}/allowedtransactiontype`;
                break;
              case 'Key_ProcessorConfigurationMissing':
                redirectLink = `/merchant/view/${resellerId}/${merchantId}/processorconfiguration`;
                break;
              case 'Key_BillingConfigurationMissing':
                redirectLink = `/merchant/view/${resellerId}/${merchantId}/billingconfig`;
                break;
            }
            break;
          }
        }
        if ( redirectLink !== '') {
          this.toastData = this.toasterService.errorRedirect(errMessage, redirectLink);
        }
      }
    );
  }

  deactivate(merchantId, resellerId) {
    this.isLoader = true;
    this.merchantService.deactivateMerchant(merchantId, resellerId).subscribe(
      a => {
        this.merchantDetails['isActive'] = false;
        this.isLoader = false;
        this.toastData = this.toasterService.success(MessageSetting.merchant.deactivate);
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  back() {
    this.router.navigate(['/merchant/find/true']);
  }

  onMenuClick(input) {
    let url = '';
    if (input === 'edit') {
      url = `merchant/edit/${this.resellerId}/${this.merchantId}`;
    } else if (input === 'allowedtransactiontype') {
      this.merchantService.setIsFromAddMerchant(false);
      url = `merchant/view/${this.resellerId}/${this.merchantId}/allowedtransactiontype`;
    } else if (input === 'processorconfiguration') {
      url = `merchant/view/${this.resellerId}/${this.merchantId}/processorconfiguration`;
    } else if (input === 'billingconfig') {
      url = `merchant/view/${this.resellerId}/${this.merchantId}/billingconfig`;
    }
    this.router.navigate([url], {skipLocationChange: true});
  }


}
