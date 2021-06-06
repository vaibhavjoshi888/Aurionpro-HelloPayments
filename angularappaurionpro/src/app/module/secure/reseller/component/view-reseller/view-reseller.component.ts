import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ResellerService } from '../../../../../api/reseller.service';
import { CommonService } from '../../../../../api/common.service';
import { ToasterService } from '../../../../../api/toaster.service';
import { StorageService } from '../../../../../common/session/storage.service';
import { StorageType } from '../../../../../common/session/storage.enum';
import { MessageSetting } from '../../../../../constant/message-setting.constant';
import { SuiModalService } from '../../../../../../../node_modules/ng2-semantic-ui';
import { ConfirmModal } from '../../../../common/modal/modal.component';
import { ChangePasswordService } from '../../../../../api/change-password.service';
import { Exception } from '../../../../../common/exceptions/exception';
import { AccessRightsService } from '../../../../../api/access-rights.service';

@Component({
  selector: 'app-view-reseller',
  templateUrl: './view-reseller.component.html',
  styleUrls: ['./view-reseller.component.css'],
  providers: [ResellerService, ToasterService, StorageService, CommonService]
})
export class ViewResellerComponent implements OnInit {
  isLoader: any;
  toastData: any;
  viewResellerForm: any;
  resellerDetails: any = {};
  hiddenFlag = true;

  username: string;
  parentId: Number;
  userType: Number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private resellerService: ResellerService,
    private toasterService: ToasterService,
    private storageService: StorageService,
    private commonService: CommonService,
    private modalService: SuiModalService,
    private changePasswordService: ChangePasswordService,
    private router: Router,
    private accessRights: AccessRightsService
  ) {}

  ngOnInit() {
    this.isLoader = true;
    this.activatedRoute.params.subscribe((params: Params) => {
      const id = params['id'];
      this.getResellerById(id);
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

  confirmReset = () => {
    this.modalService
      .open(new ConfirmModal('Are you sure you want to reset the password?', ''))
      .onApprove(() => this.resetPassword());
  }

  resetPassword = () => {
    const data = {};
      data['isReset'] = true;
      this.isLoader = true;
    this.changePasswordService
        .changePassword(data, this.username , this.userType, this.parentId)
        .subscribe(
          response => {
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

  populateCountry() {
    this.commonService.getCountryList().subscribe(
      response => {
        const countryList: any = response;
        if (!isNaN(Number(this.resellerDetails.contact.address.country))) {
          this.resellerDetails.contact.address.country = countryList.filter(
            (x): any => x.countryId == this.resellerDetails.contact.address.country
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

  getResellerById(resellerId) {
    this.resellerService.getResellerById(resellerId).subscribe(
      a => {
        this.username = a['resellerAdminUser'];
        this.parentId = a['parentId'];

        if (this.parentId === 0) {  // logic discussed by vaibhav api team 20/07/2018
          this.userType = 2;
        } else {
          this.userType = 0;
        }
        this.resellerDetails = a;
        this.populateCountry();
        if (this.parentId == 0) {
          this.resellerDetails['resellerParentName'] = 'HelloPayment';
        } else {
          this.resellerService.getResellerList(this.parentId).subscribe(
            b => {
                this.resellerDetails['resellerParentName'] = b['resellerName'];
            });
        }
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  activate(resellerId, parentId) {
    this.isLoader = true;
    this.resellerService.activateReseller(resellerId, parentId).subscribe(
      a => {
        this.resellerDetails['isActive'] = true;
        this.toastData = this.toasterService.success(
          MessageSetting.reseller.activate
        );
        this.isLoader = false;
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  deactivate(resellerId, parentId) {
    this.isLoader = true;
    this.resellerService.deactivateReseller(resellerId, parentId).subscribe(
      a => {
        this.resellerDetails['isActive'] = false;
        this.toastData = this.toasterService.success(
          MessageSetting.reseller.deactivate
        );
        this.isLoader = false;
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      }
    );
  }

  back() {
    this.router.navigate(['/reseller/find/true']);
  }
}
