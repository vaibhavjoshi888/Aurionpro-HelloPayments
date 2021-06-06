import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../common/session/storage.service';
import { ResellerService } from '../../../api/reseller.service';
import { AccessRightsService } from '../../../api/access-rights.service';

@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  loggedInUserData: any;

  constructor(
    private storageService: StorageService,
    private resellerService: ResellerService,
    private accessRights: AccessRightsService) { }

  ngOnInit() {
    this.loggedInUserData = this.resellerService.getLoggedInData();
  }

  hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess) {
    return this.accessRights.hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess);
  }

  hasTransactionTypeAccess(channelType) {
    return this.accessRights.hasTransactionTypeAccess(channelType);
  }
}
