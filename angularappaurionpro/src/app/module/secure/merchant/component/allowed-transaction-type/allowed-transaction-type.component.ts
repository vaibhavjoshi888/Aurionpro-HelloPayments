import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

import { ValidationSetting } from '../../../../../constant/validation.constant';
import { AllowedTransactionService } from '../../../../../api/allowed-transaction.service';
import { ChannelTypeEnum } from '../../../../../enum/channeltypes.enum';
import { CreditCardSubTypeEnum, ACHSubTypeEnum } from '../../../../../enum/channel-subtypes.enum';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToasterService } from '../../../../../api/toaster.service';
import { MessageSetting } from '../../../../../constant/message-setting.constant';
import { Exception } from '../../../../../common/exceptions/exception';
import { filter } from 'rxjs/operators';
import { AccessRightsService } from '../../../../../api/access-rights.service';

@Component({
  selector: 'app-allowed-transaction-type',
  templateUrl: './allowed-transaction-type.component.html',
  styleUrls: ['./allowed-transaction-type.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllowedTransactionTypeComponent implements OnInit {
  isLoader: any;
  toastData: any;
  showtable: boolean;
  allSubtypes = [];
  allChannelType = [];
  defaultChannelTypes = [];
  defaultSubChannelTypes = [];
  channelWithSubType: any;
  resellerId: Number;
  merchantId: Number;
  debitCardSubChannelType: Number;

  // allowedTransactionTypeForm: any;
  subChannelTypes = [];

  constructor(private allowedTransactionService: AllowedTransactionService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private changeDetector: ChangeDetectorRef,
    private toasterService: ToasterService,
    private accessRights: AccessRightsService,
    private router: Router) { }

  ngOnInit() {
    this.isLoader = true;
    this.activatedRoute.params.subscribe(routeParams => {
      this.resellerId = routeParams.resellerId;
      this.merchantId = routeParams.id;
    });
    this.allowedTransactionService.getAllChannels().subscribe(
      values => {
        this.ChannelType(values);
      },
      error => {
        const toastMessage = Exception.exceptionMessage(error);
        this.isLoader = false;
        this.toastData = this.toasterService.error(toastMessage.join(', '));
      });
  }

  hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess) {
    return this.accessRights.hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess);
  }

  ChannelType(value) {
    const observables = [];
    this.allChannelType = value;
    const allChannelTypeKeys = Object.keys(value);

    this.allowedTransactionService.getAllChannelSubTypes().subscribe(dataGroup => {
      // console.log(dataGroup);
      this.channelWithSubType = dataGroup;
      let i = 0;
      for (const type in this.allChannelType) {
        if (type) {
          const tempList = [];
          for (const subtype in dataGroup) {
            if (dataGroup[subtype].channelType === Number(type) ) {
              tempList.push(dataGroup[subtype]);
            }
          }
          this.subChannelTypes[i] = tempList;
          i++;
        }
      }
      this.channelTypes();
      this.GetChannelType();
    },
    error => {
      const toastMessage = Exception.exceptionMessage(error);
      this.isLoader = false;
      this.toastData = this.toasterService.error(toastMessage.join(', '));
    });
  }

  hideChannelType(channelType) {
    if (channelType === 'NotDefined') {
      return true;
    }
    return false;
  }

  GetChannelType() {
    this.allowedTransactionService.getAllowedTransactionTypes(this.merchantId, this.resellerId).
    subscribe(dataGroup => {
      this.channelTypes();
      if (dataGroup['totalRowCount'] === undefined) {
        this.channelTypes();
        for (const data in dataGroup) {
          if (dataGroup[data]) {
            this.defaultChannelTypes[dataGroup[data]['channelType']] = true;
            this.defaultSubChannelTypes[dataGroup[data]['channelSubTypeId']] = true;
          }
        }
      }
      this.isLoader = false;
    },
    error => {
      const toastMessage = Exception.exceptionMessage(error);
      this.isLoader = false;
      this.toastData = this.toasterService.error(toastMessage.join(', '));
    });
  }

  channelTypes() {
    for (const channelType in this.allChannelType) {
      if (channelType) {
        this.defaultChannelTypes[channelType] = false;
      }
    }

    for (const subChannelType in this.subChannelTypes) {
      if (this.subChannelTypes[subChannelType].length > 0) {
        for (const subChannelAttribute of this.subChannelTypes[subChannelType]) {
          this.defaultSubChannelTypes[subChannelAttribute.id] = false;
          if (subChannelAttribute.channelType === 4) {
            this.debitCardSubChannelType = subChannelAttribute.id;
          }
        }
      }
    }
  }

  enumSelector(definition) {
    return Object.keys(definition)
      .map(key => ({ value: definition[key], title: key }));
  }

  save(saveAndContinue) {
    this.isLoader = true;
    const putarray = [];

    const length = this.defaultSubChannelTypes.length;

    const test = this.defaultSubChannelTypes.includes(true);

    if (!this.defaultSubChannelTypes.includes(true) && !this.defaultChannelTypes[4]) {
      this.isLoader = false;
      this.toastData = this.toasterService.error('Please select atleast one transaction type');
      return;
    }

    for (const defaultSubChannelType in this.defaultSubChannelTypes) {
      if (this.defaultSubChannelTypes[defaultSubChannelType]) {
        for (const subChannelType in this.subChannelTypes) {
          if (subChannelType) {
            for (const subChannelAttribute of this.subChannelTypes[subChannelType]) {
              if (subChannelAttribute['id'] === Number(defaultSubChannelType)) {
                putarray.push({channelType: subChannelAttribute['channelType'], channelSubTypeId: subChannelAttribute['id']});
              }
            }
          }
        }
      }
    }
    this.allowedTransactionService.putAllowedTransactionTypes(this.merchantId, this.resellerId, putarray).
    subscribe(dataGroup => {
      this.isLoader = false;
      if (saveAndContinue === true) {
        // Auto navigate on save click
        const redirectLink = `/merchant/view/${this.resellerId}/${this.merchantId}/processorconfiguration/fromAllowedTransactionTypes`;
        this.toastData = this.toasterService.successRedirect(MessageSetting.allowTransaction.add, redirectLink);
      } else {
        this.toastData = this.toasterService.success(
          MessageSetting.allowTransaction.add
        );
      }

    },
    error => {
      const toastMessage = Exception.exceptionMessage(error);
      this.isLoader = false;
      this.toastData = this.toasterService.error(toastMessage.join(', '));
    });
  }

  channelTypeClicked(channelType, isTrue) {
    for (const subChannelType in this.subChannelTypes) {
      if (this.subChannelTypes[subChannelType].length > 0) {
        for (const subChannelAttribute of this.subChannelTypes[subChannelType]) {
          if (channelType === subChannelAttribute.channelType) {
            this.defaultSubChannelTypes[subChannelAttribute.id] = isTrue;
          }
        }
        // break;
      }
    }
  }

  subChannelTypeClicked(subChannelId, id) {
    // let currentChannelType;
    // for (const item of this.channelWithSubType) {
    //   if (item.id === subChannelId) {
    //     currentChannelType = item.channelType;
    //     break;
    //   }
    // }

    for (const channel of this.subChannelTypes) {
      if (channel.length > 0) {
        if (channel[0].channelType === id) {
          for (const eachItem of channel) {
            if (this.defaultSubChannelTypes[eachItem.id] === true) {
              this.defaultChannelTypes[channel[0].channelType] = true;
              break;
            } else {
              this.defaultChannelTypes[channel[0].channelType] = false;
              // break;
            }
          }
        }
      }
    }

    console.log(subChannelId);
  }

  // navigateToView() {
  //   const url = 'merchant/view/' + this.resellerId + '/' + this.merchantId;
  //   this.route.navigate([url], { queryParams:  filter, skipLocationChange: true});
  // }

  cancel() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params !== undefined && params.fromAddMerchant !== undefined && params.fromAddMerchant === 'fromAddMerchant') {
        const url = 'merchant/edit/' + this.resellerId + '/' + this.merchantId;
        this.route.navigate([url], { queryParams:  filter, skipLocationChange: true});
      } else {
        const url = 'merchant/view/' + this.resellerId + '/' + this.merchantId;
        this.route.navigate([url], { queryParams:  filter, skipLocationChange: true});
      }
    });
  }

  clear(field) {

  }

}
