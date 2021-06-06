import { Component, OnInit } from '@angular/core';
import { RatePlanService } from '../../../../api/rate-plan.service';
import { StorageService } from '../../../../common/session/storage.service';
import { StorageType } from '../../../../common/session/storage.enum';
import { SuiModalService } from '../../../../../../node_modules/ng2-semantic-ui';
import { ConfirmModalComponent, ConfirmModal } from '../../../common/modal/modal.component';
import { ToasterService } from '../../../../api/toaster.service';
import { MessageSetting } from '../../../../constant/message-setting.constant';
import { Router } from '@angular/router';
import { filter } from '../../../../../../node_modules/rxjs/operators';
import { Exception } from '../../../../common/exceptions/exception';
import { AccessRightsService } from '../../../../api/access-rights.service';

@Component({
  selector: 'app-find-rate-plan',
  templateUrl: './find-rate-plan.component.html',
  styleUrls: ['./find-rate-plan.component.css']
})
export class FindRatePlanComponent implements OnInit {

  ratePlanList: any;
  loggedInUserData: any = {};
  toastData: any;
  isLoader: any;
  searchResultFlag = false;
  noResultsMessage = 'No results found';

  constructor(private ratePlanService: RatePlanService,
    private storageService: StorageService,
    private modalService: SuiModalService,
    private toasterService: ToasterService,
    private route: Router,
    private accessRights: AccessRightsService) {
    this.loggedInUserData = JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
  }

  ngOnInit() {
    this.getRatePlanList();
  }

  hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess) {
    return this.accessRights.hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess);
  }

  getRatePlanList() {
    this.isLoader = true;
    this.ratePlanService.getRatePlanList().subscribe(response => {
      this.ratePlanList = response;
      this.searchResultFlag = this.ratePlanList.length > 0 ? true : false;
      this.isLoader = false;
    },
    error => {
      const toastMessage = Exception.exceptionMessage(error);
      this.isLoader = false;
      this.toastData = this.toasterService.error(toastMessage.join(', '));
    });
  }


  confirmDelete = (id, parentId) => {
    this.modalService
      .open(new ConfirmModal('Are you sure you want to delete this Rate Plan?', ''))
      .onApprove(() => this.deleteRatePlan(id, parentId));
  }

  deleteRatePlan(id, parentId) {
    this.isLoader = true;
    this.ratePlanService.deleteRatePlan(id, parentId).subscribe(
      a => {
        this.isLoader = false;
        this.toastData = this.toasterService.success(MessageSetting.ratePlan.delete);
        this.getRatePlanList();
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      });
  }

  editRatePlan(id) {
    this.route.navigate(['/rateplan/edit/' + id], { queryParams:  filter, skipLocationChange: true});
    // commenting conditional code/Component since currently functionality is same for Global and Reseller
    // if (this.loggedInUserData.parentId === 0) {
    //   this.route.navigate(['/rateplan/edit/' + id], { queryParams:  filter, skipLocationChange: true});
    // } else {
    //   this.route.navigate(['reseller/merchant-rate-plan/' + id], { queryParams:  filter, skipLocationChange: true});
    // }
  }
}
