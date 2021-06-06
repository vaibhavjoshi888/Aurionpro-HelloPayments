import { Injectable } from '@angular/core';
import { UserType } from '../enum/storage.enum';
import { AccessRights } from '../enum/access-rights.enum';
import { StorageService } from '../common/session/storage.service';
import { StorageType } from '../common/session/storage.enum';
import { AppSetting } from '../constant/appsetting.constant';
import { CommonAPIFuncService } from './common-api-func.service';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccessRightsService {
  loggedInUserData: any = {};
  loggedInUserRoleDetails: any = {};
  allowedTransactionTypes: any = {};

  globalAdmin = {
    '2101': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '2102': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1},
    '2103': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '2131': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '2132': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1},
    '2161': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '2162': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '2201': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1},  // Manage_Merchant
    '2202': {'addAccess': 1, 'deleteAccess': 0, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1},  // Manage_Reseller
    '2203': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 0, 'viewAccess': 1},  // ReportAccess_MerchantActivation
    '2301': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '2302': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '2303': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '2351': {'addAccess': 0, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '2352': {'addAccess': 0, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '2353': {'addAccess': 0, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '2401': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '2402': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},  // Defaults_Rate_Plan
    '2501': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},  // Manage_Merchant_Processor_Config
    '2502': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '2503': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},  // Manage_Merchant_AllowedTransactionType
    '2504': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},  // Prefrence_MerchantBilling_Config
    '2505': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 0, 'viewAccess': 1},  // ReportAccess_MerchantBilling
    '2510': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1},
    '2511': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1},
    '2512': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 0, 'viewAccess': 1},  // ReportAccess_Transaction
  };

  resellerAdmin = {
    '101': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '102': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1},
    '103': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '131': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '132': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '201': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1}, // Manage_Merchant
    '202': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1}, // Manage_Reseller
    '301': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '302': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '351': {'addAccess': 0, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '352': {'addAccess': 0, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '354': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '355': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '401': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1}, // Prefrence_Rate_Plan
    '402': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1}, // Prefrence_Fees
    '501': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1}, // Manage_Merchant_AllowedTransactionType
    '502': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1}, // Manage_Merchant_Processor_Config
    '503': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1}, // Prefrence_MerchantBilling_Config
    '510': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '511': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1}
  };

  merchantAdmin = {
    '1101': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '1102': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1},
    '1103': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '1201': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},  // Customer_Management
    '1202': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},  // Customer_Account
    '1203': {'addAccess': 1, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 0, 'viewAccess': 1},
    '1204': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1},
    '1210': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1},
    '1301': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '1351': {'addAccess': 0, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '1352': {'addAccess': 0, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '1401': {'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '1402': {'addAccess': 0, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},
    '1403': {'addAccess': 1, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1},  // Transactions
    '1501': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 0, 'viewAccess': 1},  // Allowed Transaction Type
    '1502': {'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 0, 'viewAccess': 1}   // Processor Configuration
  };

  constructor(private storageService: StorageService, private commonAPIFuncService: CommonAPIFuncService) { }

  getLoggedInData() {
    return JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
  }

  getloggedInUserRoleDetails() {
    return JSON.parse(this.storageService.get(StorageType.session, 'roleDetails'));
  }

  getAllowedTransactionTypesDetails() {
    return JSON.parse(this.storageService.get(StorageType.session, 'allowedTransactionTypes'));
  }


  // Method to check Operation Permission
  hasAccess(globalOperationId, resellerOperationId, merchantOperationId, requiredAccess) {
    this.loggedInUserData = this.getLoggedInData();
    if (this.loggedInUserData.roleId !== null) {
      this.loggedInUserRoleDetails = this.getloggedInUserRoleDetails();
    }

    if (this.loggedInUserData.userType === 0) {  // Reseller
      if (this.resellerAdmin.hasOwnProperty(resellerOperationId) && this.resellerAdmin[resellerOperationId][requiredAccess] === 1) {
        if (this.loggedInUserData.roleId !== null) {
          if (this.loggedInUserRoleDetails.hasOwnProperty(resellerOperationId) && this.loggedInUserRoleDetails[resellerOperationId][requiredAccess] === true) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      } else {
        return false;
      }
    }

    if (this.loggedInUserData.userType === 1) {  // Merchant
      if (this.merchantAdmin.hasOwnProperty(merchantOperationId) && this.merchantAdmin[merchantOperationId][requiredAccess] === 1) {
        if (this.loggedInUserData.roleId !== null) {
          if (this.loggedInUserRoleDetails.hasOwnProperty(merchantOperationId) && this.loggedInUserRoleDetails[merchantOperationId][requiredAccess] === true) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      } else {
        return false;
      }
    }

    if (this.loggedInUserData.userType === 2) {  // Global
      if (this.globalAdmin.hasOwnProperty(globalOperationId) && this.globalAdmin[globalOperationId][requiredAccess] === 1) {
        if (this.loggedInUserData.roleId !== null) {
          if (this.loggedInUserRoleDetails.hasOwnProperty(globalOperationId) && this.loggedInUserRoleDetails[globalOperationId][requiredAccess] === true) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  }


  hasTransactionTypeAccess(channelType) {
    this.allowedTransactionTypes = this.getAllowedTransactionTypesDetails();
    if (this.allowedTransactionTypes.indexOf(channelType) > -1) {
      return true;
    } else {
      return false;
    }
  }

  // /roles
  // /resellers/{resellerId}/roles
  // /merchants/{merchantId}/roles
  getRoleDetails () {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';
    if (this.loggedInUserData.userType === 0) { // Reseller
      url = `${AppSetting.baseUrl}resellers/${this.loggedInUserData.parentId}/roles/${this.loggedInUserData.roleId}`;
    } else if (this.loggedInUserData.userType === 1) {  // Merchant
      url = `${AppSetting.baseUrl}merchants/${this.loggedInUserData.parentId}/roles/${this.loggedInUserData.roleId}`;
    } else if (this.loggedInUserData.userType === 2) {  // Global
      url = `${AppSetting.baseUrl}roles/${this.loggedInUserData.roleId}`;
    }
    return this.commonAPIFuncService.get(url).pipe(
      tap(a => {
        let loggedInUserRoleDetails = {};
        let tempOperationId;
        a['roleDetails'].forEach(function(item) {
          tempOperationId = item.operationId;
          // delete item.id;
          loggedInUserRoleDetails[tempOperationId] = item;
        });
        this.storageService.save(StorageType.session, 'roleDetails', JSON.stringify(loggedInUserRoleDetails));
        this.log(`fetched`);
      }),
      catchError(this.handleError('', []))
    );
  }

  // Get Allowed Transaction Types for logged in user
  getAllowedTransactionType() {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';
    if (this.loggedInUserData.userType === 1) {
      url = `${AppSetting.baseUrl}merchants/${this.loggedInUserData.parentId}/allowedtransactiontypes`;
    } else {
      url = `${AppSetting.baseUrl}resellers/${this.loggedInUserData.resellerId}/merchants/${this.loggedInUserData.parentId}/allowedtransactiontypes`;
    }
    return this.commonAPIFuncService.get(url)
      .pipe(
        tap((a: any) => {
          const allowedTransactionTypes = a.map(item => item.channelType).filter((value, index, self) => self.indexOf(value) === index);
          this.storageService.save(StorageType.session, 'allowedTransactionTypes', JSON.stringify(allowedTransactionTypes));
          this.log(`fetched`);
        }),
        catchError(this.handleError('', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      // return Observable.throw(error.json().error || error.message);
      return throwError(error);
      // return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    // this.messageService.add('HeroService: ' + message);
  }


}
