// const baseUrl = 'https://osnm84ogj3.execute-api.us-east-2.amazonaws.com/Test/api/';
// const baseUrl = 'https://8muxu4mak8.execute-api.us-east-2.amazonaws.com/Test/';
// const baseUrl = 'https://ruchgu8814.execute-api.us-east-2.amazonaws.com/Test/';  // Old Test Environment
const baseUrl = 'https://k5c5nbh1p9.execute-api.us-east-2.amazonaws.com/Test/';  // Test Environment
// const baseUrl = 'https://iw06jidhla.execute-api.us-east-1.amazonaws.com/qa/';  // QA Environment
// const baseUrl = 'https://bid2vsm1df.execute-api.us-east-1.amazonaws.com/v1/';  // UAT Environment
// const baseUrl = 'https://2d2te5u5wi.execute-api.us-east-1.amazonaws.com/v1/';  // New UAT Environment--(PreProd)
// const baseUrl = 'https://api.uat.hellopayments.net/';  // New UAT Environment (PreProd)
// const baseUrl = 'https://api.hellopayments.net/';  // Production Environment

const baseUrl1 = 'http://localhost:10618/';

export class AppSetting {
  static baseUrl = baseUrl;
  static admin = {
    add: baseUrl + 'User/SaveEditUser',
    edit: baseUrl + 'User/SaveEditUser',
    delete: baseUrl + 'User/SaveEditUser',
    get: baseUrl + 'User/SaveEditUser'
  };
  static reseller = {
    add: baseUrl + 'resellers',
    edit: baseUrl + 'resellers',
    delete: baseUrl + 'resellers',
    get: baseUrl + 'resellers',
    getById: baseUrl + 'resellers',
    find: baseUrl + 'resellers/',
    getRatePlanList: baseUrl + 'rateplans',
    getRatePlanById: baseUrl + 'resellers',
    getAllowTransaction: baseUrl + 'resellers',
    common: baseUrl + 'resellers',
    // common: baseUrl + 'reseller',
    getResellerByUserName: baseUrl + 'resellers',
    getFeeConfig: baseUrl + 'fees'

  };
  static merchant = {
    add: baseUrl + 'merchants',
    addUnderReseller: baseUrl + 'resellers',
    edit: baseUrl + 'merchants',
    get: baseUrl + 'merchants',
    getMerchantByUserName: baseUrl + 'merchants',

    commonReseller: baseUrl + 'resellers',
    find: baseUrl + 'merchants/',
    getById: baseUrl + 'merchants',
    common: baseUrl + 'merchants',
    delete: baseUrl + 'merchants',
  };
  static common = {
    login: baseUrl + 'users/sessions',
    getUserByUserName: baseUrl + 'users',
    getCountry: baseUrl + 'countries',
    getState: baseUrl + 'states/',
  };

  static customer = {
    delete: baseUrl + 'customer'
  };

  static transaction = {
    common: baseUrl + 'transactions',
  };

  static processor = {
    common: baseUrl + 'processors'
  };

  static allowedTransaction = {
    allChannelType : baseUrl + 'channels',
    allChannelSubType : baseUrl + 'channelsubtypes',
    resellersAllowedTransactionTypes : baseUrl + 'resellers',
    globalAllowedTransactionTypes : baseUrl
    // channelSubType : baseUrl + 'channels'
  };

  static billingConfig = {
    getGlobalBillingConfig: baseUrl + 'merchants',
    getResellerBillingConfig: baseUrl + 'resellers',
  };

  static resultsPerPage = 10;
  static reportResultsPerPage = 15;
  static getTransactionStatusTimer = 4000;
  static stopGetTransactionStatusTimer = 10000;
  static truncateWordLength = 15;
}
