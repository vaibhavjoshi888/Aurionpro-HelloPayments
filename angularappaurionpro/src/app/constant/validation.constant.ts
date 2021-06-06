export class ValidationSetting {
  // static passwordMaxLength = 50;
  // static passwordMinLength = 5;
  // static userNameMaxLength = 50;
  // static userNameMinLength = 5;
  static admin = {
    fNameMaxLength: 50,
    fNameMinLength: 2,
    lNameMaxLength: 50,
    lNameMinLength: 2,
    emailMaxLength: 100
  };

  static email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  static url_regex = '(http(s)?://|)(www\\.)([^\\.]+)\\.(\\w{2}|(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum|co))$';
  static charactersOnlyWithSpace_regex = '^[a-zA-Z]+([a-zA-Z ]+)*$';
  static alphanumeric_regex = '^[a-zA-Z0-9]*$';
  static alphanumericWithSpace_regex = '^[a-zA-Z0-9]+([a-zA-Z0-9 ]+)*$';
  static numbersOnly_regex = '^[0-9]*$';
  // Need to check alternative regex for "allow everything except space"
  static spaceNotAccepted_regex = '^[a-zA-Z0-9~!@#$%^&*()_+{}|:"<>?`\\-=\\[\\]\\\\;\',./]+([a-zA-Z0-9~!@#$%^&*()_+{}|:"<>?`\\-=\\[\\]\\\\;\',./ \r\n|\r|\n]+)*$';
  // First Name, Last Name, Customer Name, Name on Card, Card Holder Name, Pay To The Order Of
  static firstNameLastName_regex = '^[a-zA-Z]+([a-zA-Z ,.\'-]+)*$';
  static amount_regex = '^([0-9]{1,9})(\\.[0-9]{1,2})?$';
  // static amount_regex = '^\\d{0,9}(\\.\\d{1,2})?$';
  static invoiceNo_regex = /^[^&?=]+$/;
  static percentage_regex = '(^100(\\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\\.[0-9]{1,2})?$)';

  static reseller = {
    add: {
      parentId: { name: 'Parent Reseller', maxLength: 50, minLength: 5 },
      resellerName: { name: 'Reseller Company', maxLength: 50, minLength: 5 },
      resellerAdminUser: { name: 'Reseller Admin User Name', maxLength: 50, minLength: 5 },
      title: { name: 'Title', maxLength: 50, minLength: 5 },
      firstName: { name: 'First Name', maxLength: 50, minLength: 5 },
      middleName: { name: 'Middle Name', maxLength: 50 },
      lastName: { name: 'Last Name', maxLength: 50, minLength: 5 },
      companyName: { name: 'Company Name', maxLength: 50, minLength: 5 },
      department: { name: 'Department', maxLength: 50, minLength: 5 },
      fax: { name: 'Fax', maxLength: 20, minLength: 10 },
      phone: { name: 'Phone', maxLength: 10, minLength: 10 },
      alternatePhone: { name: 'Alternate Phone', maxLength: 10, minLength: 5 },
      mobile: { name: 'Mobile', maxLength: 50, minLength: 5 },
      email: { name: 'Email', maxLength: 256 },
      url: { name: 'URL', maxLength: 50 },
      addressLine1: { name: 'Address Line 1', maxLength: 20 },
      addressLine2: { name: 'Address Line 2', maxLength: 50 },
      city: { name: 'City', maxLength: 50 },
      state: { name: 'State', maxLength: 50 },
      country: { name: 'Country', maxLength: 50 },
      postalCode: { name: 'Postal (Zip) Code', maxLength: 10 },
      timeZone: { name: 'Time Zone', maxLength: 50 },
      ownership: { name: 'Ownership', maxLength: 50 },
      federalTaxId: { name: 'Federal Tax Id', maxLength: 9, minLength: 9 },
      businessStartDate: { name: 'Business Start Date', maxLength: 50 },
      salesTaxId: { name: 'Sales Tax Id', maxLength: 9, minLength: 9 },
      stateTaxId: { name: 'State Tax Id', maxLength: 9, minLength: 9 },
      estimatedSales: { name: 'Other Description', maxLength: 500 }
    },
    find: {
      resellerName: { name: 'Reseller Name', maxLength: 50, minLength: 5 },
      firstName: { name: 'First Name', maxLength: 50, minLength: 5 },
      lastName: { name: 'Last Name', maxLength: 50, minLength: 5 },
      companyName: { name: 'Company Name', maxLength: 50, minLength: 5 },
      phone: { name: 'Phone', maxLength: 10, minLength: 10 },
      email: { name: 'Email' },
      city: { name: 'City', maxLength: 50 },
      postalCode: { name: 'Postal (Zip) Code', maxLength: 10 }
    }
  };
  static merchant = {
    fNameMaxLength: 50,
    fNameMinLength: 2,
    lNameMaxLength: 50,
    lNameMinLength: 2,
    emailMaxLength: 100,
    add: {
      parentId: { name: 'Parent', maxLength: 50, minLength: 5 },
      name: { name: 'Merchant Company', maxLength: 50, minLength: 5 },  // this is same as merchant name
      merchantAdminUser: { name: 'Merchant Admin User Name', maxLength: 50, minLength: 5 },
      title: { name: 'Title', maxLength: 50, minLength: 5 },
      firstName: { name: 'First Name', maxLength: 50, minLength: 5 },
      middleName: { name: 'Middle Name', maxLength: 50 },
      lastName: { name: 'Last Name', maxLength: 50, minLength: 5 },
      companyName: { name: 'Company Name', maxLength: 50, minLength: 5 },
      department: { name: 'Department', maxLength: 50, minLength: 5 },
      fax: { name: 'Fax', maxLength: 20, minLength: 10 },
      phone: { name: 'Phone', maxLength: 10, minLength: 10 },
      alternatePhone: { name: 'Alternate Phone', maxLength: 10, minLength: 5 },
      mobile: { name: 'Mobile', maxLength: 50, minLength: 5 },
      email: { name: 'Email' , maxLength: 256},
      url: { name: 'URL', maxLength: 50 },
      addressLine1: { name: 'Address Line 1', maxLength: 20 },
      addressLine2: { name: 'Address Line 2', maxLength: 50 },
      city: { name: 'City', maxLength: 50 },
      state: { name: 'State', maxLength: 50 },
      country: { name: 'Country', maxLength: 50 },
      postalCode: { name: 'Postal (Zip) Code', maxLength: 10 },
      timeZone: { name: 'Time Zone', maxLength: 50 },
      ownership: { name: 'Ownership', maxLength: 50 },
      merchantid: { name: 'Merchant Id', maxLength: 50},
      federalTaxId: { name: 'Federal Tax Id', maxLength: 9, minLength: 9 },
      businessStartDate: { name: 'Business Start Date', maxLength: 50 },
      salesTaxId: { name: 'Sales Tax Id', maxLength: 9, minLength: 9 },
      stateTaxId: { name: 'State Tax Id', maxLength: 9, minLength: 9 },
      estimatedSales: { name: 'Other Description', maxLength: 500 },
      fileIdentifier: { name: 'File Identifier', maxLength: 50 }
    },
    find: {
      resellerName: { name: 'Reseller Name', maxLength: 50, minLength: 5 },
      firstName: { name: 'First Name', maxLength: 50, minLength: 5 },
      lastName: { name: 'Last Name', maxLength: 50, minLength: 5 },
      companyName: { name: 'Company Name', maxLength: 50, minLength: 5 },
      phone: { name: 'Phone', maxLength: 10, minLength: 10 },
      email: { name: 'Email',  maxLength: 256, minLength: 5  },
      city: { name: 'City', maxLength: 50 },
      postalCode: { name: 'Postal (Zip) Code', maxLength: 10 }
    }
  };
  static customer = {
    find: {
      parentId: { name: 'Parent', maxLength: 50, minLength: 5 },
      customerId: { name: 'Customer Id', maxLength: 50, minLength: 0 },
      firstName: { name: 'First Name', maxLength: 50, minLength: 5 },
      lastName: { name: 'Last Name', maxLength: 50, minLength: 5 },
      // companyName: { name: 'Company Name', maxLength: 50, minLength: 5 },
      email: { name: 'Email' },
    }
  };
  static login = {
    userName: { name: 'User Name', maxLength: 50, minLength: 5 },
    password: { name: 'Password', maxLength: 50, minLength: 8 }
  };
  static common = {
    login: {
      userName: { name: 'User Name', maxLength: '50', vmaxLength: 50 },
      password: { name: 'Password', maxLength: '50', vmaxLength: 50 }
    },
  };
  static forgotPassword = {
    userName: { name: 'User Name', maxLength: 50 },
  };

  // static changePassword = {
  //   oldPassword: {name: 'Old Password', maxLength: ValidationSetting.passwordMaxLength, minLength: ValidationSetting.passwordMinLength},
  //   password: {name: 'New Password', maxLength: ValidationSetting.passwordMaxLength, minLength: ValidationSetting.passwordMinLength},
  //   confirmPassword: {name: 'Confirm new Password',
  // maxLength: ValidationSetting.passwordMaxLength, minLength: ValidationSetting.passwordMinLength},
  // };

  static changePassword = {
    oldPassword: { name: 'Old Password', maxLength: 50, minLength: 8 },
    password: { name: 'New Password', maxLength: 50, minLength: 8 },
    confirmPassword: { name: 'Confirm New Password', maxLength: 50, minLength: 8 },
  };

  static transaction = {
    add: {
      customerId: { name: 'Customer Id', maxLength: 50},
      cardHolderName: { name: 'Card Holder Name', maxLength: 50},
      cardNumber: { name: 'Card Number', maxLength: 19},
      cardExpiry: { name: 'Card Expiry', maxLength: 4},
      cvDataStatus: { name: 'CVV Data Status', minLength: 3 , maxLength: 4},
      cvData: { name: 'CVV', minLength: 3 , maxLength: 4},
      amount: { name: 'Amount', maxLength: 9},
      totalAmount: { name: 'Total Amount', maxLength: 9},
      addressLine1: { name: 'Address Line 1', maxLength: 20 },
      addressLine2: { name: 'Address Line 2', maxLength: 50 },
      city: { name: 'City', maxLength: 50 },
      state: { name: 'State', maxLength: 50 },
      country: { name: 'Country', maxLength: 50 },
      postalCode: { name: 'Postal (Zip) Code', maxLength: 10 },
      timeZone: { name: 'Time Zone', maxLength: 50 },
      ownership: { name: 'Ownership', maxLength: 50 },
      merchantid: { name: 'Merchant Id', maxLength: 50},
      federalTaxId: { name: 'Federal Tax Id', maxLength: 9, minLength: 9 },
      businessStartDate: { name: 'Business Start Date', maxLength: 50 },
      salesTaxId: { name: 'Sales Tax Id', maxLength: 9, minLength: 9 },
      stateTaxId: { name: 'State Tax Id', maxLength: 9, minLength: 9 },
      estimatedSales: { name: 'Estimated Sales', maxLength: 50 },
      fileIdentifier: { name: 'File Identifier', maxLength: 50 },
      secCode: {name: 'SEC Code', maxLength: 50},
      customerName: {name: 'Customer Name', maxLength: 50},
      payToTheOrderOf: {name: 'Payee Name', maxLength: 50},
      routingNumber: {name: 'Routing/Transit No', maxLength: 9},
      checkNumber: {name: 'Check No', maxLength: 6},
      accountNumber: {name: 'Account No', maxLength: 10},
      accountType: {name: 'Account Type', maxLength: 50},
      checkType: {name: 'Check Type', maxLength: 50},
      convenienceAmount: {name: 'Convenience Amount', maxLength: 50},
      tipAmount: {name: 'Tip Amount', maxLength: 50},
      taxAmount: {name: 'Tax Amount', maxLength: 50},
      transactionType: {name: 'Transaction Type', maxLength: 50},
      invoiceno: {name: 'Invoice No', maxLength: 25}
    },
    find: {
      startDate: { name: 'Start Date', maxLength: 50},
      endDate: { name: 'End Date', maxLength: 50}
    },
    view: {
      amount: { name: 'Amount', maxLength: 50},
      description: { name: 'Description', maxLength: 50},
      customerId: { name: 'Customer Id', maxLength: 50, minLength: 5 },
      convenienceamount: { name: 'Convenience Amount', maxLength: 50},
      tipamount: { name: 'Tip Amount', maxLength: 50},
      taxamount: { name: 'Tax Amount', maxLength: 50},
      totalamount: { name: 'Total Amount', maxLength: 50},
      authCode: {name: 'Auth Code', maxLength: 10},
      cardnumber: {name: 'Card Number', maxLength: 19},
      expiration: { name: 'Expiration', maxLength: 4, minLength: 4},
      cvvpresence: {name: 'CVV Presence'},
      cvv: { name: 'CVV', maxLength: 4, minLength: 3},
      invoiceno: {name: 'Invoice No', maxLength: 25}
    }
  };

  static billingConfig = {
    disableBilling: { name: 'Disable Billing', maxlength: 50, minLength: 8},
    ratePlan: { name: 'Rate Plan Name', maxlength: 50, minLength: 8},
    modeOfPayment: { name: 'Mode Of Payment', maxlength: 50, minLength: 8},
    ccNumber: { name: 'CC Number', maxlength: 50, minLength: 8},
    expiration: { name: 'Expiration', maxlength: 50, minLength: 8},
    ccType: { name: 'CC Type', maxlength: 50, minLength: 8},
    billingExecution: { name: 'Billing Execution', maxlength: 50, minLength: 8},
    // billingExecutionParam: { name: 'BillingExecution', maxlength: 50, minLength: 8},
    billingStartDate: { name: 'Billing Start Date', maxlength: 50, minLength: 8},
    bankName: { name: 'Bank Name'},
    routingNumber: {name: 'Routing/Transit No'},
    accountNumber: {name: 'Account No'},
    startDate: {name: 'Start Date'}
  };

  static processorConfiguration = {
    selectProcessor: { name: 'Select Processor', maxlength: 50, minLength: 8},
    fundingDays: { name: 'Funding Days', maxlength: 50, minLength: 8},
    numericProvisionedData: { name: 'Numeric Provisioned Data', maxlength: 50, minLength: 8},
    stringProvisionedData: { name: 'String Provisioned Data', maxlength: 50, minLength: 8},
    listProvisionedData: { name: 'List Provisioned Data', maxlength: 50, minLength: 8}
  };

  static allowedTransactionType = {
    creditCard: { name: 'Credit Card', maxlength: 50, minLength: 8},
    ach: { name: 'ACH', maxlength: 50, minLength: 8},
    debitCard: { name: 'Debit Card', maxlength: 50, minLength: 8},
    ebt: { name: 'EBT', maxlength: 50, minLength: 8}
  };

  static ratePlan = {
    buyRate: {name: 'Buy Rate', maxlength: 10},
    sellRate : {name: 'Sell Rate', maxlength: 10},
    name : {name: 'Rate Plan Name', maxlength: 50},
    description : {name: 'Rate Plan Description', maxlength: 50}
  };
}
