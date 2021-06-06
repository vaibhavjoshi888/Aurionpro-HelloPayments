export class ViewTransactionModel {

  constructor() {
  }

  viewTransactionResponse(object) {
    return {
      transactionId: object.transactionId,
      transactionCode: object.transactionCode,
      transactionOrigin: object.transactionOrigin,
      billingContact: (object.billingContact == null || object.billingContact === undefined) ? {
        name: {
          title: null,
          firstName: null,
          middleName: null,
          lastName: null,
        },
        companyName: null,
        department: null,
        fax: null,
        phone: null,
        alternatePhone: null,
        mobile: null,
        email: null,
        url: null,
        address: {
          addressLine1: null,
          addressLine2: null,
          city: null,
          state: null,
          country: null,
          postalCode: null,
          timeZone: null,
        }
      }
      : {
        name: {
          title: 'title' in object.billingContact.name ? object.billingContact.name.title : null,
          firstName: 'firstName' in object.billingContact.name ? object.billingContact.name.firstName : null,
          middleName: 'middleName' in object.billingContact.name ? object.billingContact.name.middleName : null,
          lastName: 'lastName' in object.billingContact.name ? object.billingContact.name.lastName : null,
        },
        companyName: object.billingContact.companyName,
        department: object.billingContact.department,
        fax: object.billingContact.fax,
        phone: object.billingContact.phone,
        alternatePhone: object.billingContact.alternatePhone,
        mobile: object.billingContact.mobile,
        email: object.billingContact.email,
        url: object.billingContact.url,
        address: {
          addressLine1: 'addressLine1' in object.billingContact.address ? object.billingContact.address.addressLine1 : null,
          addressLine2: 'addressLine2' in object.billingContact.address ? object.billingContact.address.addressLine2 : null,
          city: 'city' in object.billingContact.address ? object.billingContact.address.city : null,
          state: 'state' in object.billingContact.address ? object.billingContact.address.state : null,
          country: 'country' in object.billingContact.address ? object.billingContact.address.country : null,
          postalCode: 'postalCode' in object.billingContact.address ? object.billingContact.address.postalCode : null,
          timeZone: 'timeZone' in object.billingContact.address ? object.billingContact.address.timeZone : null,
        }
      },
      shippingContact: object.shippingContact,
      referenceTransactionId: object.referenceTransactionId,
      transactionDate: object.transactionDate,
      merchantId: object.merchantId,
      ipAddress: object.ipAddress,
      operationType: object.operationType,
      channelType: object.channelType,
      isDebit: object.isDebit,
      tenderInfo: {
        bankName: 'bankName' in object.tenderInfo ? object.tenderInfo.bankName : null,
        routingNumber: 'routingNumber' in object.tenderInfo ? object.tenderInfo.routingNumber : null,
        rawMICRLine: 'rawMICRLine' in object.tenderInfo ? object.tenderInfo.rawMICRLine : null,
        accountType: 'accountType' in object.tenderInfo ? object.tenderInfo.accountType : null,
        checkType: 'checkType' in object.tenderInfo ? object.tenderInfo.checkType : null,
        checkNumber: 'checkNumber' in object.tenderInfo ? object.tenderInfo.checkNumber : null,
        nameOnCheck: 'nameOnCheck' in object.tenderInfo ? object.tenderInfo.nameOnCheck : null,
        cardHolderName: 'cardHolderName' in object.tenderInfo ? object.tenderInfo.cardHolderName : null,
        cardType: 'cardType' in object.tenderInfo ? object.tenderInfo.cardType : null,
        maskCardNumber: 'maskCardNumber' in object.tenderInfo ? object.tenderInfo.maskCardNumber : null,
        cardExpiry: 'cardExpiry' in object.tenderInfo ? object.tenderInfo.cardExpiry : null,
        cvData: 'cvData' in object.tenderInfo ? object.tenderInfo.cvData : null,
        cvDataStatus: 'cvDataStatus' in object.tenderInfo ? object.tenderInfo.cvDataStatus : null,
        trackData: 'trackData' in object.tenderInfo ? object.tenderInfo.trackData : null,
        rxAmount: 'rxAmount' in object.tenderInfo ? object.tenderInfo.rxAmount : null,
        isCheckCard: 'isCheckCard' in object.tenderInfo ? object.tenderInfo.isCheckCard : null,
        captureAmount: 'captureAmount' in object.tenderInfo ? object.tenderInfo.captureAmount : null,
        amount: 'amount' in object.tenderInfo ? object.tenderInfo.amount : null,
        tipAmount: 'tipAmount' in object.tenderInfo ? object.tenderInfo.tipAmount : null,
        convenienceAmount: 'convenienceAmount' in object.tenderInfo ? object.tenderInfo.convenienceAmount : null,
        taxAmount: 'taxAmount' in object.tenderInfo ? object.tenderInfo.taxAmount : null,
        preAuthCode: 'preAuthCode' in object.tenderInfo ? object.tenderInfo.preAuthCode : null,
        maskAccount: 'maskAccount' in object.tenderInfo ? object.tenderInfo.maskAccount : null,
        epb: 'epb' in object.tenderInfo ? object.tenderInfo.epb : null,
        ksn: 'ksn' in object.tenderInfo ? object.tenderInfo.ksn : null,
        cashBackAmount: 'cashBackAmount' in object.tenderInfo ? object.tenderInfo.cashBackAmount : null,
      },
      referenceCustomerId: object.referenceCustomerId,
      customerAccountId: object.customerAccountId,
      invoiceNo: object.invoiceNo,
      poNo: object.poNo,
      referenceNo: object.referenceNo,
      remarks: object.remarks,
      recurringType: object.recurringType,
      recurringId: object.recurringId,
      installmentNumber: object.installmentNumber,
      installmentCount: object.installmentCount,
      allowDuplicates: object.allowDuplicates,
      verificationEnabled: object.verificationEnabled,
      sentSuccessNotification: object.sentSuccessNotification,
      sentFailedNotification: object.sentFailedNotification,
      trainingMode: object.trainingMode,
      terminalId: object.terminalId,
      transactionStatus: object.transactionStatus,
      transactionResult: (object.transactionResult == null || object.transactionResult === undefined)
        ? {
          success: null,
          processorAuthCode: null,
          traceNumber: null,
          reasonCode: null,
          reasonMessage: null,
          additionResultData: null,
          verificationStatus: null,
          verification1Code: null,
          verification2Code: null,
        }
        : {
          success: 'success' in object.transactionResult ? object.transactionResult.success : null,
          processorAuthCode: 'processorAuthCode' in object.transactionResult ? object.transactionResult.processorAuthCode : null,
          traceNumber: 'traceNumber' in object.transactionResult ? object.transactionResult.traceNumber : null,
          reasonCode: 'reasonCode' in object.transactionResult ? object.transactionResult.reasonCode : null,
          reasonMessage: 'reasonMessage' in object.transactionResult ? object.transactionResult.reasonMessage : null,
          additionResultData: 'additionResultData' in object.transactionResult ? object.transactionResult.additionResultData : null,
          verificationStatus: 'verificationStatus' in object.transactionResult ? object.transactionResult.verificationStatus : null,
          verification1Code: 'verification1Code' in object.transactionResult ? object.transactionResult.verification1Code : null,
          verification2Code: 'verification2Code' in object.transactionResult ? object.transactionResult.verification2Code : null,
        },
      isOffline: object.isOffline
    };
  }




}
