export class AddTransaction {

  constructor() {
  }
  // getTransaction: object;
  // addTransaction: object;

  // constructor(object, apiType, isNewTransaction) {
  //   if (apiType === 'GET') {
  //     // this.getTransaction = {
  //     //   customerId : object.id,
  //     //   cardHolderName : object.accountHolderName,
  //     //   maskCardNumber : object.maskedCardNumber,
  //     //   cardExpiry : object.cardExpiry,
  //     // };
  //   }
  //   if (apiType === 'POST') {
  //     this.addTransaction = {
  //       referenceCustomerId : object.customerId,
  //       customerAccountId : object.accountId,
  //       merchantId : object.merchantId,
  //       billingContact : object.billingContact,
  //       transactionCode : object.transactionCode,
  //       transactionOrigin : object.transactionOrigin,
  //       isDebit : object.isDebit,
  //       operationType : object.operationType,
  //       channelType : object.ChannelType,
  //       TrainingMode : object.TrainingMode,
  //       tenderInfo : {
  //         bankName : 'bankName' in object.TenderInfo ? object.TenderInfo.bankName : null,
  //         routingNumber : 'routingNumber' in object.TenderInfo ? object.TenderInfo.routingNumber : null,
  //         accountType : 'accountType' in object.TenderInfo ? object.TenderInfo.accountType : null,
  //         checkType : 'checkType' in object.TenderInfo ? object.TenderInfo.checkType : null,
  //         checkNumber : 'checkNumber' in object.TenderInfo ? object.TenderInfo.checkNumber : null,
  //         cardExpiry : 'cardExpiry' in object.TenderInfo ? object.TenderInfo.cardExpiry : null,
  //         amount : object.TenderInfo.amount,
  //         cardHolderName : 'cardHolderName' in object.TenderInfo ? object.TenderInfo.cardHolderName : null,
  //         cardNumber : 'maskCardNumber' in object.TenderInfo ? object.TenderInfo.maskCardNumber : null,
  //         cardType : 'CardType' in object.TenderInfo ? object.TenderInfo.CardType : null,
  //         cvData : 'cvData' in object.TenderInfo ? object.TenderInfo.cvData : null,
  //         cvDataStatus : 'cvDataStatus' in object.TenderInfo ? object.TenderInfo.cvDataStatus : null,
  //       }
  //     };
  //   }
  // }

  getTransaction(object, currentCustomerDetails) {
    let customerName: string;
    // if (currentCustomerDetails !== null || currentCustomerDetails !== undefined) {
    //   if (currentCustomerDetails.billingContact !== null || currentCustomerDetails.billingContact !== undefined) {
    //     customerName = (currentCustomerDetails.billingContact.name.firstName !== null ?
    //     currentCustomerDetails.billingContact.name.firstName : '') + ' ' + (currentCustomerDetails.billingContact.name.middleName !== null ?
    //     currentCustomerDetails.billingContact.name.middleName : '') + ' ' + (currentCustomerDetails.billingContact.name.lastName !== null ?
    //     currentCustomerDetails.billingContact.name.lastName : '');
    //   }
    // }

    if (currentCustomerDetails !== null || currentCustomerDetails !== undefined) {
      if (currentCustomerDetails.billingContact !== null || currentCustomerDetails.billingContact !== undefined) {
        customerName = (currentCustomerDetails.billingContact.name.firstName !== null ?
        currentCustomerDetails.billingContact.name.firstName : '') + ' ' + (currentCustomerDetails.billingContact.name.lastName !== null ?
        currentCustomerDetails.billingContact.name.lastName : '');
      }
    }
    return {
      customerId : object.id,
      customerName: customerName,
      transactionType: '0',
      cvDataStatus: 'AV',
      cardHolderName : object.accountHolderName,
      maskCardNumber : object.maskedCardNumber,
      cardExpiry : object.cardExpiry,
      maskedAccountNumber : 'maskedAccountNumber' in object ? object.maskedAccountNumber : null,
      routingNumber: 'routingNumber' in object ? object.routingNumber : null
    };
  }

  addTransaction(object, isNewTransaction) {
    if (isNewTransaction) {
      return {
        referenceCustomerId : object.customerId !== undefined ? object.customerId : null,
        customerAccountId : object.customerAccountId !== undefined ? object.customerAccountId : null,
        merchantId : object.merchantId,
        billingContact : object.billingContact,
        transactionCode : object.transactionCode,
        transactionOrigin : object.transactionOrigin,
        isDebit : object.isDebit,
        operationType : object.operationType,
        channelType : object.ChannelType,
        TrainingMode : object.TrainingMode,
        InvoiceNo : object.InvoiceNo,
        tenderInfo : {
          NameOnCheck: 'NameOnCheck' in object.TenderInfo ? object.TenderInfo.NameOnCheck : null,
          bankName : 'bankName' in object.TenderInfo ? object.TenderInfo.bankName : null,
          routingNumber : 'routingNumber' in object.TenderInfo ? object.TenderInfo.routingNumber : null,
          accountType : 'accountType' in object.TenderInfo ? object.TenderInfo.accountType : null,
          accountNumber : 'maskedAccountNumber' in object.TenderInfo ? object.TenderInfo.maskedAccountNumber : null,
          checkType : 'checkType' in object.TenderInfo ? object.TenderInfo.checkType : null,
          checkNumber : 'checkNumber' in object.TenderInfo ? object.TenderInfo.checkNumber : null,
          cardExpiry : 'cardExpiry' in object.TenderInfo ? object.TenderInfo.cardExpiry : null,
          amount : object.TenderInfo.amount === null || object.TenderInfo.amount === '' ? 0 : object.TenderInfo.amount,
          tipAmount : object.TenderInfo.tipAmount === null || object.TenderInfo.tipAmount === '' ? 0 : object.TenderInfo.tipAmount,
          convenienceAmount : object.TenderInfo.convenienceAmount === null || object.TenderInfo.convenienceAmount === ''
          ? 0 : object.TenderInfo.convenienceAmount,
          taxAmount : object.TenderInfo.taxAmount === null || object.TenderInfo.taxAmount === '' ? 0 : object.TenderInfo.taxAmount,
          captureAmount : object.TenderInfo.captureAmount,
          cardHolderName : 'cardHolderName' in object.TenderInfo ? object.TenderInfo.cardHolderName : null,
          cardNumber : 'maskCardNumber' in object.TenderInfo ? object.TenderInfo.maskCardNumber : null,
          cardType : 'CardType' in object.TenderInfo ? object.TenderInfo.CardType : null,
          cvData : 'cvData' in object.TenderInfo ? object.TenderInfo.cvData : null,
          cvDataStatus : 'cvDataStatus' in object.TenderInfo ? object.TenderInfo.cvDataStatus : null,
        }
      };
    } else {
      return {
        referenceCustomerId : object.customerId,
        customerAccountId : object.customerAccountId,
        merchantId : object.merchantId,
        billingContact : object.billingContact,
        transactionCode : object.transactionCode,
        transactionOrigin : object.transactionOrigin,
        isDebit : object.isDebit,
        operationType : object.operationType,
        channelType : object.ChannelType,
        TrainingMode : object.TrainingMode,
        InvoiceNo : object.InvoiceNo,
        tenderInfo : {
          routingNumber : 'routingNumber' in object.TenderInfo ? object.TenderInfo.routingNumber : null,
          accountType : 'accountType' in object.TenderInfo ? object.TenderInfo.accountType : null,
          accountNumber : 'maskedAccountNumber' in object.TenderInfo ? object.TenderInfo.maskedAccountNumber : null,
          checkType : 'checkType' in object.TenderInfo ? object.TenderInfo.checkType : null,
          checkNumber : 'checkNumber' in object.TenderInfo ? object.TenderInfo.checkNumber : null,
          amount : object.TenderInfo.amount === null || object.TenderInfo.amount === '' ? 0 : object.TenderInfo.amount,
          tipAmount : object.TenderInfo.tipAmount === null || object.TenderInfo.tipAmount === '' ? 0 : object.TenderInfo.tipAmount,
          convenienceAmount : object.TenderInfo.convenienceAmount === null || object.TenderInfo.convenienceAmount === ''
          ? 0 : object.TenderInfo.convenienceAmount,
          taxAmount : object.TenderInfo.taxAmount === null || object.TenderInfo.taxAmount === '' ? 0 : object.TenderInfo.taxAmount,
          captureAmount : object.TenderInfo.captureAmount,
          cvData : 'cvData' in object.TenderInfo ? object.TenderInfo.cvData : null,
          cvDataStatus : 'cvDataStatus' in object.TenderInfo ? object.TenderInfo.cvDataStatus : null,
        }
      };
    }
  }

  getCustomerName(currentCustomerDetails) {
    let customerName: string;
    if (currentCustomerDetails !== null || currentCustomerDetails !== undefined) {
      // if (currentCustomerDetails.billingContact !== null || currentCustomerDetails.billingContact !== undefined) {
      //   customerName = (currentCustomerDetails.billingContact.name.firstName !== null ?
      //   currentCustomerDetails.billingContact.name.firstName : '') + ' ' + (currentCustomerDetails.billingContact.name.middleName !== null ?
      //   currentCustomerDetails.billingContact.name.middleName : '') + ' ' + (currentCustomerDetails.billingContact.name.lastName !== null ?
      //   currentCustomerDetails.billingContact.name.lastName : '');
      // }
      if (currentCustomerDetails.billingContact !== null || currentCustomerDetails.billingContact !== undefined) {
        customerName = (currentCustomerDetails.billingContact.name.firstName !== null ?
        currentCustomerDetails.billingContact.name.firstName : '') + ' ' + (currentCustomerDetails.billingContact.name.lastName !== null ?
        currentCustomerDetails.billingContact.name.lastName : '');
      }
    }
    return customerName;
  }

  disableFormField(form, disable, isACH) {
    if (isACH) {
      if (disable) {
        form.get('customerName').disable({emitEvent: false});
        form.get('payToTheOrderOf').disable({emitEvent: false});
        form.get('routingNumber').disable({emitEvent: false});
        form.get('maskedAccountNumber').disable({emitEvent: false});
        form.get('accountType').disable({emitEvent: false});
      } else {
        form.get('customerName').enable();
        form.get('payToTheOrderOf').enable();
        form.get('routingNumber').enable();
        form.get('maskedAccountNumber').enable();
        form.get('accountType').enable();
      }
    } else {
      if (disable) {
        form.get('customerId').disable({emitEvent: false});
        form.get('cardHolderName').disable({emitEvent: false});
        form.get('maskCardNumber').disable({emitEvent: false});
        form.get('cardExpiry').disable({emitEvent: false});
      } else {
        form.get('customerId').enable();
        form.get('cardHolderName').enable();
        form.get('maskCardNumber').enable();
        form.get('cardExpiry').enable();
      }
    }
  }
}
