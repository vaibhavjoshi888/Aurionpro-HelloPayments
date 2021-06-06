export class MessageSetting {
  static admin = {
    add: 'User added successfully.',
    edit: 'User edited successfully.',
    delete: 'User deleted successfully.'
  };
  static reseller = {
    add: 'Reseller added successfully.',
    edit: 'Reseller edited successfully.',
    delete: 'Reseller deleted successfully.',
    activate: 'Reseller activated successfully.',
    deactivate: 'Reseller deactivated successfully.'
  };
  static merchant = {
    add: 'Merchant added successfully.',
    edit: 'Merchant edited successfully.',
    delete: 'Merchant deleted successfully.',
    activate: 'Merchant activated successfully.',
    deactivate: 'Merchant deactivated successfully.',
    activateError: 'need to be set before activating merchant.'
  };

  static customer = {
    add: 'Customer added successfully.',
    edit: 'Customer edited successfully.',
    delete: 'Customer deleted successfully.',
    activate: 'Customer activated successfully.',
    deactivate: 'Customer deactivated successfully.',
    // activateError: 'need to be set before activating merchant.'
  };

  static transaction = {
    void: 'Transaction is void attempted.',
    voidattempt: 'Transaction sent for void successfully.',
    refund: 'Refund transaction initiated successfully.',
    refundAmountError: 'Refund amount should be greater than 0(zero) and less than or equal to total amount.',
    partialRefundAmountNotAllowedError: 'Refund amount should be equal to total amount.',
    forceauth: 'Force Auth transaction initiated successfully.',
    adjustSuccess: 'Transaction amount adjusted successfully.',
    adjustError: 'Unable to adjust transaction amount.',
    Key_ChannelConfigurationMissing: 'Transaction failed due to invalid processor configuration.',
    Key_InvalidRequestData: 'Transaction failed due to invalid request data.',
    Key_ProcessorResponseError: `Transaction failed due to error in processor's response.`,
    Key_NetworkError: `Transaction failed due to network issues at processor's end.`,
    reprocessSuccess: `Transaction reprocessed successfully.`,
  };
  static billingConfig = {
    add: 'Billing Configuration added successfully.',
    ratePlanNotExist: 'Rate Plan has not been defined by Reseller.',
  };

  static customerAccount = {
    add: 'Account added successfully'
  };

  static allowTransaction = {
    add: 'Transaction Types added successfully.'
  };

  static common = {
    error: 'Please contact to administrator.',
    errordeletereseller: 'Can not delete this reseller, since it has a child record.',
    // temp error message (need to remove once common error handling is implemented)
    inactiveAccount: 'Your Account is Inactive. Please contact to administrator.',
    sucess: 'Success',
    failed: 'Failed',
    changePasswordMessage: 'Password changed successfully. Please login again.',
    Key_MatchingPassword: 'Password does not meet history requirements.',
    Key_InvalidOldPassword: 'Invalid old password.',
    errorNewPaaswordSameAsOldPassword: 'New password should not be same as old password.',
    resetPasswordMessage: 'Password reset successfully.',
    sessionExpired: 'Session Expired. Please login again.'
  };
  static login = {
    invalidCredential: 'Incorrect username or password.'
  };
  static forgotPassword = {
    failed: 'Failed',
    success: 'Success',
    common: 'Email has been sent to your registered email id.'
  };
  static ratePlan = {
    delete: 'Rate Plan deleted successfully.',
    add: 'Rate Plan added successfully',
    update: 'Rate Plan updated successfully'
  };
  static processorConfiguration = {
    saveSuccess: 'Processor Configuration saved successfully.',
    allowedTransactionTypeError: 'Allowed Transaction Type need to be set before Processor Configuration.'
  };

  static reportAmountFilter = ['captureAmount', 'refundAmount', 'achTransactionAmount',
  'achTransactionFees', 'achTransactionOtherFees', 'ccTransactionAmount', 'ccTransactionFees',
  'ccTransactionOtherFees', 'dcTransactionAmount', 'dcTransactionFees', 'dcTransactionOtherFees', 'defaultFee', 'totalBillingAmount'];
}

