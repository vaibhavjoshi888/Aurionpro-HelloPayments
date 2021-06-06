export enum DownloadToCSV_MerchantCreated {
  merchantId = 'Merchant_Id',
  name = 'Name',
  city = 'City',
  state = 'State',
  createdOn = 'Created_On',
  merchantIsActive = 'Is_Activated',
  activatedOn = 'Activated_On',
  adminUserEmailId = 'Email',
  adminUserPhone = 'Phone',
  ccTxnProceesorName = 'CC_Processor',
  dcTxnProceesorName = 'Debit_Processor',
  achTxnProceesorName = 'ACH_Processor',
  resellerName = 'Reseller_Name'
}

export enum DownloadToCSV_TransactionList {
  authCode = 'Auth_Code',
  merchantId = 'Merchant_Id',
  captureAmount = 'Capture_Amount($)',
  channelType = 'Channel_Type',
  merchantName = 'Merchant_Name',
  refundAmount = 'Refund_Amount($)',
  refundedOn = 'Refunded_On(UTC)',
  traceNumber = 'Trace_No',
  txnCreatedOn = 'Txn_Date(UTC)',
  txnIdentifier = 'Txn_Identifier',
  txnStatus = 'Txn_Staus',
  txnType = 'Txn_Type',
}

export enum DownloadToCSV_MerchantBilling {
  achTransactionAmount = 'ACH_Txn_Amount($)',
  achTransactionCount = 'ACH_Txn_Count',
  achTransactionFees = 'ACH_Txn_Fees($)',
  achTransactionOtherFees = 'ACH_Txn_Other_Fees($)',
  ccTransactionAmount = 'CC_Txn_Amount($)',
  ccTransactionCount = 'CC_Txn_Count',
  ccTransactionFees = 'CC_Txn_Fees($)',
  ccTransactionOtherFees = 'CC_Txn_Other_Fees($)',
  dcTransactionAmount = 'Debit_Txn_Amount($)',
  dcTransactionCount = 'Debit_Txn_Count',
  dcTransactionFees = 'Debit_Txn_Fees($)',
  dcTransactionOtherFees = 'Debit_Txn_Other_Fees($)',
  defaultFee = 'System_Fees($)',
  id = 'Invoice_Id',
  invoiceDate = 'Invoice_Date',
  merchantId = 'Merchant_Id',
  merchantName = 'Merchant_Name',
  totalBillingAmount = 'Total_billing_Amount($)',

}
