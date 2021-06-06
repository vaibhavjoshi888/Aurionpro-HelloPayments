
export class Exception {

  static exceptionMessage(error) {
    const errormessage = [];
    if (error !== undefined && error !== null
      && error.error !== undefined && error.error !== null
      && error.error.errors !== undefined && error.error.errors !== null) {
      const errorArray = error.error.errors;
      if (errorArray.length === 0) {
        errormessage.push(this.getExceptionMessage(error.error.message));
      } else {
        for (const i in errorArray) {
          if (i) {
            errormessage.push(this.getExceptionMessage(errorArray[i]['field']));
          }
        }
      }
      return errormessage;
    } else if (error.status === 500) {
      errormessage.push('Something went wrong. Please contact administrator.');
      return errormessage;
    }
    errormessage.push('Something went wrong. Please contact administrator.');
    return errormessage;
  }

  static getExceptionMessage(error) {
    let toastMessage = '';
    error = error.charAt(0).toUpperCase() + error.slice(1);
    switch (error) {
      // Payment Form
      case 'Key_FormNameCannotBeEmpty':
      toastMessage = 'Form name cannot be empty';
      break;

      case 'Key_Address1CannotBeEmpty':
      toastMessage = 'Address1 cannot be empty';
      break;

      case 'Key_CityRequired':
      toastMessage = 'City name is required';
      break;

      case 'Key_StateRequired':
      toastMessage = 'State name is required';
      break;

      case 'Key_PostalCodeCannotBeEmpty':
      toastMessage = 'Postal code is required';
      break;

      case 'Key_EmailCannotBeEmpty':
      toastMessage = 'Email id is required';
      break;

      case 'Key_CountryCannotBeEmpty':
      toastMessage = 'Country name is required';
      break;

      case 'Key_InvalidEmail':
      toastMessage = 'Email Id is invalid';
      break;

      case 'Key_MerchantInactive':
      toastMessage = 'Merchant is inactive';
      break;

      case 'Key_MerchantInActive':
      toastMessage = 'Merchant is inactive';
      break;

      case 'Key_InvalidColourCode':
      toastMessage = 'Colour code is invalid';
      break;

      case 'Key_InvalidAllowedCreditCardType':
      toastMessage = 'Credit Card type is invalid';
      break;

      case 'Key_AllowedCreditCardTypeCannotBeEmpty':
      toastMessage = 'Card Card type cannot be empty';
      break;

      case 'Key_AccountAlreadyExists':
      toastMessage = 'Account already exists';
      break;

      case 'Key_NoSuchProvisionMetadataForThisGatewayAndProcessor':
      toastMessage = 'No such provision meta data for this gateway and processor';
      break;

      case 'Key_NoSuchChannelTypeForThisGatewayAndProcessor':
      toastMessage = 'No such channel type for this gateway and processor';
      break;

      case 'Key_NoSuchProcessorForThisGatewayAndChannelType':
      toastMessage = 'No such processor for this gateway and channel type';
      break;

      case 'Key_NoSuchProcessorForThisGateway':
      toastMessage = 'No such processor for this gateway';
      break;

      case 'Key_NoGatewaySupported':
      toastMessage = 'No gateway supported';
      break;

      case 'Key_InvalidGatewayName':
      toastMessage = 'Gateway name is invalid';
      break;

      case 'Key_InvalidProcessorName':
      toastMessage = 'Processor Name is invalid';
      break;

      case 'Key_InvalidChannelType':
      toastMessage = 'ChannelType is invalid';
      break;

      case 'Key_InvalidChannelSubType':
      toastMessage = 'ChannelSubType is invalid';
      break;

      case 'Key_InvalidUserName':
      toastMessage = 'User Name is invalid';
      break;

      case 'Key_InvalidPassword':
      toastMessage = 'Password is invalid';
      break;

      case 'Key_NoSuchCustomerAccount':
      toastMessage = 'Customer account does not exists';
      break;

      case 'Key_InvalidAccountType':
      toastMessage = 'Account type is invalid';
      break;

      case 'Key_InvalidAccountNumber':
      toastMessage = 'Account number is invalid';
      break;

      case 'Key_InvalidAccountNumber':
      toastMessage = 'Account number is invalid';
      break;

      case 'Key_InvalidRoutingNumber':
      toastMessage = 'Routing number is invalid';
      break;

      case 'Key_InvalidRoutingNumber':
      toastMessage = 'Routing number is invalid';
      break;

      case 'Key_CustomerNameInUse':
      toastMessage = 'Customer name is in use';
      break;

      case 'Key_CannotChangeAccountType':
      toastMessage = 'Cannot change account type';
      break;

      case 'Key_InvalidCardExpiry':
      toastMessage = 'Card expiry date is invalid';
      break;

      case 'Key_InvalidCardExpiry':
      toastMessage = 'Card expiry date is invalid';
      break;

      case 'Key_InvalidCardNumber':
      toastMessage = 'Card number is invalid';
      break;

      case 'Key_InvalidCardNumber':
      toastMessage = 'Card number is invalid';
      break;

      case 'Key_InvalidCardType':
      toastMessage = 'Card type is invalid';
      break;

      case 'Key_InvalidCardType':
      toastMessage = 'Card type is invalid';
      break;

      case 'Key_FirstNameCannotBeEmpty':
      toastMessage = 'First name cannot be empty';
      break;

      case 'Key_LastNameCannotBeEmpty':
      toastMessage = 'Last name cannot be empty';
      break;

      case 'Key_PhoneCannotBeEmpty':
      toastMessage = 'Phone number cannot be empty';
      break;

      case 'Key_Address2CannotBeEmpty':
      toastMessage = 'Address 2 cannot be empty';
      break;

      case 'Key_InvalidURL':
      toastMessage = 'URL is invalid';
      break;

      case 'Key_SetMerchant':
      toastMessage = 'Merchant is not set';
      break;

      case 'Key_NoTransactionTypeSet':
      toastMessage = 'Transaction type is not set';
      break;

      case 'Key_NoProcessorsSet':
      toastMessage = 'Processor is not set';
      break;

      case 'Key_NoProcessorSetForEachChannelType':
      toastMessage = 'Processor is not set for each channel type';
      break;

      case 'Key_DuplicateChannelSubType':
      toastMessage = 'Duplicate channel sub type';
      break;

      case 'Key_InValidTransactionType':
      toastMessage = 'Transaction type is invalid';
      break;

      case 'Key_RoleIsInUsed':
      toastMessage = 'Role is in use';
      break;

      case 'Key_InvalidFirstName':
      toastMessage = 'First name is invalid';
      break;

      case 'Key_InvalidLastName':
      toastMessage = 'Last name is invalid';
      break;

      case 'Key_InvalidFaxNo':
      toastMessage = 'Fax number is invalid';
      break;

      case 'Key_InvalidCompanyName':
      toastMessage = 'Company name is invalid';
      break;

      case 'Key_InvalidPhoneNo':
      toastMessage = 'Phone number is invalid';
      break;

      case 'Key_InvalidCity':
      toastMessage = 'City name is invalid';
      break;

      case 'Key_InvalidPostalCode':
      toastMessage = 'Postal code is invalid';
      break;

      case 'Key_InvalidFederalTaxId':
      toastMessage = 'Federal Tax id is invalid';
      break;

      case 'Key_ResellerNameCannotBeEmpty':
      toastMessage = 'Reseller name cannot be empty';
      break;

      case 'Key_NameCannotBeEmpty':
      toastMessage = 'Name cannot be empty';
      break;

      case 'Key_CustomFeeNameAlreadyExists':
      toastMessage = 'Custom fee name already exists';
      break;

      case 'Key_InvalidFeeName':
      toastMessage = 'Fee name is invalid';
      break;

      case 'Key_InvalidFrequency':
      toastMessage = 'Frequency is invalid';
      break;

      case 'Key_InvalidChannelType':
      toastMessage = 'Channel Type is invalid';
      break;

      case 'Key_InvalidFeeType':
      toastMessage = 'Fee Type is invalid';
      break;

      case 'Key_FeeCanNotBeDeletedAsIsItUsedInRatePlan':
      toastMessage = 'Fee cannot be deleted as it is used in rate plan';
      break;

      case 'Key_CanNotDeleteSystemFee':
      toastMessage = 'Cannot delete system fee';
      break;

      case 'Key_RatePlanIdInUse':
      toastMessage = 'Rate plan Id is in use';
      break;

      case 'Key_InvalidFeeId':
      toastMessage = 'Fee Id is invalid';
      break;

      case 'Key_InvalidUserType':
      toastMessage = 'User type is invalid';
      break;

      case 'Key_InvalidTargetId':
      toastMessage = 'Target Id is invalid';
      break;

      case 'Key_RatePlanCanNotBeDeletedAsAssignedResellerOrMerchantIsInActiveMode':
      toastMessage = 'Rate plan cannot be deleted as it is assiged to a reseller or merchant';
      break;

      case 'Key_RatePlanAlreadyAssignedToTargetId':
      toastMessage = 'Rate plan already assigned to target Id';
      break;

      case 'Key_BuyRateCanNotBeNegative':
      toastMessage = 'Buy Rate cannot be negative';
      break;

      case 'Key_SellRateCanNotBeNegative':
      toastMessage = 'Sell Rate cannot be negative';
      break;

      case 'Key_InvalidFrequencyParameter':
      toastMessage = 'Frequency parameter is invalid';
      break;

      case 'Key_StartDateCannotBeEmpty':
      toastMessage = 'Start date cannot be empty';
      break;

      case 'Key_ResellerInActive':
      toastMessage = 'Reseller is inactive';
      break;

      case 'Key_InvalidMerchantId':
      toastMessage = 'Merchant Id is invalid';
      break;

      case 'Key_InvalidRatePlanId':
      toastMessage = 'Please select Rate plan';
      break;

      case 'Key_RatePlanNameCannotBeEmpty':
      toastMessage = 'Rate plan name cannot be empty';
      break;

      case 'Key_RatePlanNameIsInUse':
      toastMessage = 'Rate plan name is in use';
      break;

      case 'Key_ParentIdIsInvalid':
      toastMessage = 'Parent Id is invalid';
      break;

      case 'Key_DuplicateFeeConfig':
      toastMessage = 'Duplicate fee config';
      break;

      // Infrastructure
      case 'Key_CannotGoToEmulationMode':
      toastMessage = 'Cannot go to emulation mode';
      break;

      case 'Key_OldPasswordBlank':
      toastMessage = 'Old password is blank';
      break;

      case 'Key_InvalidOldPassword':
      toastMessage = 'Old Password is invalid';
      break;

      case 'Key_InvalidUsernameOrPassword':
      toastMessage = 'Invalid username or password';
      break;

      case 'Key_PasswordCannotBeEmpty':
      toastMessage = 'Password cannot be empty';
      break;

      case 'Key_InvalidPassword':
      toastMessage = 'Password is invalid';
      break;

      case 'Key_InvalidPasswordLength':
      toastMessage = 'Password length should be greater than 8 characters';
      break;

      case 'Key_MatchingPassword':
      toastMessage = 'Password does not meet history requirements.';
      break;

      case 'Key_LockedAccount':
      toastMessage = 'User is locked';
      break;

      case 'Key_InvalidEmailId':
      toastMessage = 'Email Id is invalid';
      break;

      case 'Key_UserNameCannotBeEmpty':
      toastMessage = 'User name cannot be empty';
      break;

      case 'Key_UserMustBeAtleastOf6Characters':
      toastMessage = 'User name must be of atleast 6 charaters long';
      break;

      case 'Key_UserNameAlreadyExist':
      toastMessage = 'User name already exists';
      break;

      case 'Key_RoleNameCanNotBeEmpty':
      toastMessage = 'Role name cannot be empty';
      break;

      case 'Key_RoleNameIsAlreadyUsed':
      toastMessage = 'Role Name is already used';
      break;

      case 'Key_EmailNotExistsInDatabase':
      toastMessage = 'Email Id does not exists';
      break;

      case 'Key_NoRecordsFound':
      toastMessage = 'No record found';
      break;

      case 'Key_InActiveAccount':
      toastMessage = 'Account is inactive';
      break;

      case 'Key_UserEmailAlreadyExist':
      toastMessage = 'User Email already exists';
      break;

      case 'Key_AccountIdUsedWithContract':
      toastMessage = 'Account Id used with contract';
      break;

      // case 'Key_FirstNameCannotBeEmpty':
      // toastMessage = 'Duplicate fee config';
      // break;

      // case 'Key_LastNameCannotBeEmpty':
      // toastMessage = 'Duplicate fee config';
      // break;

      case 'Key_NumbersNotAllowed':
      toastMessage = 'Numbers not allowed';
      break;

      // case 'Key_InvalidUserType':
      // toastMessage = 'Duplicate fee config';
      // break;

      // case 'Key_InvalidUserType':
      // toastMessage = 'Duplicate fee config';
      // break;

      case 'Key_InvalidModifyAccess':
      toastMessage = 'Modify access is invalid';
      break;

      case 'Key_InvalidDeleteAccesse':
      toastMessage = 'Delete accesse is invalid';
      break;

      case 'Key_InvalidViewAccess':
      toastMessage = 'View access is invalid';
      break;

      case 'Key_InvalidExecuteAccess':
      toastMessage = 'Execute access is invalid';
      break;

      case 'Key_InvalidOperationid':
      toastMessage = 'Operation Id is invalid';
      break;

      case 'Key_OperartionCanNotBeEdited':
      toastMessage = 'Operation cannot be edited';
      break;

      case 'Key_OperartionCanNotBeDuplicate':
      toastMessage = 'Operation cannot be duplicate';
      break;

      case 'Key_InvalidRoleName':
      toastMessage = 'Role Name is invalid';
      break;

      case 'Key_InvalidRole':
      toastMessage = 'Role is invalid';
      break;

      case 'Key_InactiveParentReseller':
      toastMessage = 'Parent reseller is inactive';
      break;

      case 'Key_TransactionDenied':
      toastMessage = 'Transaction Denied';
      break;

      case 'Key_InvalidChannelProvisionedData':
      toastMessage = 'Channel provision data is invalid';
      break;

      case 'Key_CannotRepeatOldTransaction':
      toastMessage = 'Cannot repeat old transaction';
      break;

      case 'Key_CannotRefundOldTransaction':
      toastMessage = 'Cannot refund old transaction';
      break;

      case 'Key_InvalidOperationType':
      toastMessage = 'Operation type is invalid';
      break;

      case 'Key_InvalidEBTCardExpiry':
      toastMessage = 'EBTCard expiry is invalid';
      break;

      case 'Key_CheckNumberMissing':
      toastMessage = 'Check number is missing';
      break;

      case 'Key_InvalidAmount':
      toastMessage = 'Amount is invalid';
      break;

      case 'Key_CardNumberMissing':
      toastMessage = 'Card number is missing';
      break;

      case 'Key_CardExpiryMissing':
      toastMessage = 'Card expiry date is missing';
      break;

      case 'Key_CardTypeMissing':
      toastMessage = 'Card type missing';
      break;

      case 'Key_InvalidTransactionCode':
      toastMessage = 'Transaction code is invalid';
      break;

      case 'Key_TenderInfoMissing':
      toastMessage = 'Tender info is missing';
      break;

      case 'Key_MerchantNotSpecified':
      toastMessage = 'Merchant is not specified';
      break;

      case 'Key_InvalidGatewayInfo':
      toastMessage = 'Gateway Info is invalid';
      break;

      case 'Key_InvalidProcessorInfo':
      toastMessage = 'Parent reseller is inactive';
      break;

      case 'Key_ChannelTypeUnknown':
      toastMessage = 'Channel Type unknown';
      break;

      case 'Key_MerchantDisabled':
      toastMessage = 'Merchant is disabled';
      break;

      case 'Key_CannotAdjustTransactionMerchantDisabled':
      toastMessage = 'Cannot adjust Transaction as merchant is disabled';
      break;

      case 'Key_DuplicateTransaction':
      toastMessage = 'Duplicate transaction';
      break;

      case 'Key_AdjustedAmountCannotbeLessThanZero':
      toastMessage = 'Adjusted amount cannot be less than zero';
      break;

      case 'Key_CannotAdjustTransactionMarchantMismatch':
      toastMessage = 'Cannot adjust Transaction Merchant mismatch';
      break;

      case 'Key_CannotAdjustTransactionNoTransactionResultFound':
      toastMessage = 'No transaction result found';
      break;

      case 'Key_CannotAdjustCancelledTransaction':
      toastMessage = 'Cannot adjust cancelled transaction';
      break;

      case 'Key_CannotAdjustSettledTransaction':
      toastMessage = 'Cannot adjust settled transaction';
      break;

      case 'Key_CannotAdjustTransactionInvalidOperationType':
      toastMessage = 'Operation type is invalid';
      break;

      case 'Key_CannotCancelTransaction':
      toastMessage = 'Cannot cancel transaction';
      break;

      case 'Key_CannotRefundTransaction':
      toastMessage = 'Cannot refund transaction';
      break;

      case 'Key_CannotResubmitTransaction':
      toastMessage = 'Cannot resubmit transaction';
      break;

      case 'Key_OperationNotSupportedByProcessor':
      toastMessage = 'Operation not supported by processor';
      break;

      case 'Key_FraudTransaction':
      toastMessage = 'Fraud transaction';
      break;

      case 'Key_CVVFraudTransaction':
      toastMessage = 'CVV fraud transaction';
      break;

      case 'Key_AVSFraudTransaction':
      toastMessage = 'AVS fraud transaction';
      break;

      case 'Key_PinDataNotCaptured':
      toastMessage = 'Pin data not captured';
      break;

      case 'Key_CancellationFailed':
      toastMessage = 'Cancellation failed';
      break;

      case 'Key_InvalidPNRef':
      toastMessage = 'PNRef is invalid';
      break;

      case 'Key_InvalidAuthCode':
      toastMessage = 'AuthCode is invalid';
      break;

      case 'Key_InvalidTraceNumber':
      toastMessage = 'Trace number is invalid';
      break;

      case 'Key_InvalidMerchantId':
      toastMessage = 'Merchant Id is invalid';
      break;

      case 'Key_TransactionIsNotVerified':
      toastMessage = 'Transaction is not verified';
      break;

      case 'Key_MaximumAllowedRecordExceedsForBatchTransaction':
      toastMessage = 'Maximum allowed record exceeds for batch transaction';
      break;

      case 'Key_InvalidAuthCodeOrPNRef':
      toastMessage = 'Invalid AuthCode or PNRef';
      break;

      case 'Key_OriginalTransactionNotFound':
      toastMessage = 'Original transaction nor found';
      break;

      case 'Key_ResellerInActive':
      toastMessage = 'Reseller is inactive';
      break;

      case 'Key_NoACHDetailFound':
      toastMessage = 'ACH details not found';
      break;

      case 'Key_NoCCDetailFound':
      toastMessage = 'CC details not found';
      break;

      case 'Key_NoDCDetailFound':
      toastMessage = 'DC details not found';
      break;

      case 'Key_CvvDataMissing':
      toastMessage = 'Cvv data missing';
      break;

      case 'Key_ProcessorResponseError':
      toastMessage = 'Transaction failed due to error in processor\'s response';
      break;

      case 'Key_NetworkError':
      toastMessage = 'Transaction failed due to network issues at processor\'s end';
      break;

      case 'Key_ChannelConfigurationMissing':
      toastMessage = 'Transaction failed due to invalid processor configuration';
      break;

      case 'Key_InvalidRequestData':
      toastMessage = 'Transaction failed due to invalid request data';
      break;

      case 'Key_AllowedTransactionTypeMissing':
      toastMessage = 'Allowed Transaction Type';
      break;

      case 'Key_ProcessorConfigurationMissing':
      toastMessage = 'Processor Configuration';
      break;

      case 'Key_BillingConfigurationMissing':
      toastMessage = 'Billing Configuration';
      break;

      case 'Key_InactiveParentMerchant':
      toastMessage = 'Please contact your Reseller, to activate the account';
      break;

      case 'Key_TransactionOnHold':
      toastMessage = 'Transaction is on hold';
      break;

      case 'Key_TransactionDenied':
      toastMessage = 'Transaction is denied';
      break;

      case 'Key_TransactionFailed':
      toastMessage = 'Transaction failed';
      break;

      case 'Key_DailyTransactionAmountExceedsTheLimitForMerchant':
      toastMessage = 'Daily transaction amount exceeds the limit';
      break;

      case 'Key_WeeklyTransactionAmountExceedsTheLimitForMerchant':
      toastMessage = 'Weekly transaction amount exceeds the limit';
      break;

      case 'Key_MonthlyTransactionAmountExceedsTheLimitForMerchant':
      toastMessage = 'Monthly transaction amount exceeds the limit';
      break;

      case 'Key_MaximumTransactionAmountExceedsTheLimitForMerchant':
      toastMessage = 'Maximum transaction amount exceeds the limit';
      break;

      case 'Key_DailyTransactionCountExceedsTheLimitForMerchant':
      toastMessage = 'Daily transaction count exceeds the limit';
      break;

      case 'Key_WeeklyTransactionCountExceedsTheLimitForMerchant':
      toastMessage = 'Weekly transaction count exceeds the limit';
      break;

      case 'Key_MonthlyTransactionCountExceedsTheLimitForMerchant':
      toastMessage = 'Monthly transaction count exceeds the limit';
      break;

      case 'Key_DuplicateTransaction':
      toastMessage = 'Duplication transaction';
      break;

      case 'Key_YourTransactionIsOnHold':
      toastMessage = 'Your transaction is on hold';
      break;

      case 'Key_TransactionNotSucssessfulVelocityNotUpdated':
      toastMessage = 'Transaction not successful, Velocity not updated';
      break;

      case 'Key_CVVFraudTransaction':
      toastMessage = 'Cvv fraud transaction';
      break;

      case 'Key_AVSFraudTransaction':
      toastMessage = 'AVS fraud transaction';
      break;

      case 'Key_CountryOrIpAddressIsBlocked':
      toastMessage = 'Country or IP address is blocked';
      break;

      case 'Key_InvalidChannelType':
      toastMessage = 'Channel type not configured in allowed transaction types and processor configuration';
      break;

      case 'Key_InvalidChannelSubType':
      toastMessage = 'Channel sub type not configured in allowed transaction types and processor configuration ';
      break;

      // Merchant
      case 'Key_MerchantNameCannotBeEmpty':
      toastMessage = 'Merchant name can not be empty';
      break;

      case 'Key_MerchantAdminUserCannotBeEmpty':
      toastMessage = 'Merchant admin user name can not be empty';
      break;

      case 'Key_MerchantIdRequiredForRevenueCalMode':
      toastMessage = 'Merchant id required for revenue cal mode';
      break;

      case 'Key_InvalidChannelProvisionedData':
      toastMessage = 'Invalid provisioned data';
      break;

      case 'Key_ValueNotAvailable':
      toastMessage = 'Value not available';
      break;

      case 'Key_MerchantNameAlreadyExist':
      toastMessage = 'Merchant name already exists';
      break;

      case 'Key_InValidMerchantName':
      toastMessage = 'Invalid merchant name';
      break;

      case 'Key_InValidMerchantAdminUser':
      toastMessage = 'Invalid merchant admin user';
      break;

      case 'Key_InvalidPhone':
      toastMessage = 'Phone number is invalid';
      break;

      case 'Key_InvalidFax':
      toastMessage = 'Fax number is invalid';
      break;

      // case 'Key_InvalidCity':
      // toastMessage = '';
      // break;

      // case 'Key_InvalidPostalCode':
      // toastMessage = '';
      // break;

      // case 'Key_InvalidFirstName':
      // toastMessage = '';
      // break;

      // case 'Key_InvalidLastName':
      // toastMessage = '';
      // break;

      // case 'Key_MerchantInactive':
      // toastMessage = '';
      // break;

      case 'Key_CustomerInactive':
      toastMessage = 'Customer is inactive';
      break;

      case 'Key_InvalidPaymentFormID':
      toastMessage = 'Invalid payment form id';
      break;

      case 'Key_CommunicationException':
      toastMessage = 'Communication exception';
      break;

      case 'Key_MerchantConfiguration':
      toastMessage = 'Merchant configuration';
      break;

      case 'Key_MerchantCannotBeDeleteBillingConfigAssigned':
      toastMessage = 'Merchant can not be deleted since billing config is assigned';
      break;

      // Reseller
      // case 'Key_ResellerNameCannotBeEmpty':
      // toastMessage = '';
      // break;

      case 'Key_ResellerAdminUserCannotBeEmpty':
      toastMessage = 'Reseller admin user can not be empty';
      break;

      case 'Key_ResellerNameInvalid':
      toastMessage = 'Invalid reseller name';
      break;

      case 'Key_FirstNameCannotBeEmpty':
      toastMessage = 'First name can not be empty';
      break;

      case 'Key_LastNameCannotBeEmpty':
      toastMessage = 'Last name can not be empty';
      break;

      case 'Key_EmailCannotBeEmpty':
      toastMessage = 'Email can not be empty';
      break;

      case 'Key_NoTransactionTypeSetForReseller':
      toastMessage = 'Transaction type is not set for reseller';
      break;

      case 'Key_DuplicateTransactionType':
      toastMessage = 'Duplicate transaction type';
      break;

      case 'Key_InvalidTransactionType':
      toastMessage = 'Invalid transaction type';
      break;

      case 'Key_InvalidProcessorName':
      toastMessage = 'Invalid processor name';
      break;

      case 'Key_InvalidGatewayName':
      toastMessage = 'Invalid gateway name';
      break;

      case 'Key_NoProcessorSetForReseller':
      toastMessage = 'No processor set for reseller';
      break;

      case 'Key_InvalidURL':
      toastMessage = 'Invalid URL';
      break;

      // case 'Key_InvalidEmail':
      // toastMessage = '';
      // break;

      case 'Key_PostalCodeCannotBeEmpty':
      toastMessage = 'Postal code can not be empty';
      break;

      case 'Key_CityCannotBeEmpty':
      toastMessage = 'City can not be empty';
      break;

      case 'Key_Address1CannotBeEmpty':
      toastMessage = 'Address1 can not be empty';
      break;

      case 'Key_FederalTaxIdCannotBeEmpty':
      toastMessage = 'Federal tax id can not be empty';
      break;

      case 'Key_StateCannotBeEmpty':
      toastMessage = 'State can not be empty';
      break;

      case 'Key_InvalidIPAddress':
      toastMessage = 'Invalid IP address';
      break;

      case 'Key_ThemeCannotBeEmpty':
      toastMessage = 'Theme can not be empty';
      break;

      case 'Key_ResellerNameAlredyExist':
      toastMessage = 'Reseller name already exists';
      break;

      case 'Key_UserAlreadyExist':
      toastMessage = 'User name already exists';
      break;

      case 'Key_LogoCannotBeEmpty':
      toastMessage = 'Logo can not be empty';
      break;

      case 'Key_CannotDeleteIfChildExist':
      toastMessage = 'Can not delete since child exists';
      break;

      // case 'Key_ResellerInActive':
      // toastMessage = '';
      // break;

      // case 'Key_BillingConfigurationMissing':
      // toastMessage = '';
      // break;

      // case 'Key_ProcessorConfigurationMissing':
      // toastMessage = '';
      // break;

      // case 'Key_AllowedTransactionTypeMissing':
      // toastMessage = '';
      // break;

      case 'Key_TransactionOnHold_CountryIsBlocked':
      toastMessage = 'Transaction originating from this country is blocked.';
      break;

      case 'Key_TransactionDenied_CountryIsBlocked':
      toastMessage = 'Transaction originating from this country is blocked.';
      break;

      case 'Key_TransactionOnHold_IPAddressIsBlocked':
      toastMessage = 'Transaction originating from this IP Address is blocked.';
      break;

      case 'Key_TransactionDenied_IPAddressIsBlocked':
      toastMessage = 'Transaction originating from this IP Address is blocked.';
      break;

      case 'Key_CanNotDoOfflineinCurrentStatusOfTransaction':
      toastMessage = 'Can not perform offline transaction in current status.';
      break;

      case 'Key_OfflineTransactionNotSupported':
      toastMessage = 'Offline transaction not supported.';
      break;

      case 'Key_CardNoNotMatchedWithOriginalTransaction':
      toastMessage = 'Card number does not match with original transaction.';
      break;

      default :
      toastMessage = 'Something went wrong. Please contact administrator.';

    }
    return toastMessage;
  }
}
















