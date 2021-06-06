import { ValidationSetting } from '../../../../../../../constant/validation.constant';

export class ValidationConfig {

   config = {
    ParentId: {
      required: {name: ValidationSetting.customer.find.parentId.name},
      maxlength: {
        name: ValidationSetting.customer.find.parentId.name,
        max: ValidationSetting.customer.find.parentId.maxLength.toString()
      }
    },
    customerId: {   // change this
      required: {name: ValidationSetting.customer.find.customerId.name},
      maxlength: {
        name: ValidationSetting.customer.find.customerId.name,
        max: ValidationSetting.customer.find.customerId.maxLength.toString()
      }
    },
    FirstName: {
      required: {name: ValidationSetting.customer.find.firstName.name},
      maxlength: {
        name: ValidationSetting.customer.find.firstName.name,
        max: ValidationSetting.customer.find.firstName.maxLength.toString()
      },
      pattern: {name: ValidationSetting.customer.find.firstName.name}
    },
    LastName: {
      required: {name: ValidationSetting.customer.find.lastName.name},
      maxlength: {
        name: ValidationSetting.customer.find.lastName.name,
        max: ValidationSetting.customer.find.lastName.maxLength.toString()
      },
      pattern: {name: ValidationSetting.customer.find.lastName.name}
    },
    Email: {
      required: {name: ValidationSetting.customer.find.email.name},
      email: {name: ValidationSetting.customer.find.email.name},
      pattern: { name: ValidationSetting.reseller.add.email.name }
    },
    addressLine1: {
      required: { name: ValidationSetting.transaction.add.addressLine1.name },
      maxlength: {
        name: ValidationSetting.transaction.add.addressLine1.name,
        max: ValidationSetting.transaction.add.addressLine1.maxLength.toString()
      }
    },
    addressLine2: {
      maxlength: {
        name: ValidationSetting.transaction.add.addressLine2.name,
        max: ValidationSetting.transaction.add.addressLine2.maxLength.toString()
      }
    },
    city: {
      required: { name: ValidationSetting.transaction.add.city.name },
      maxlength: {
        name: ValidationSetting.transaction.add.city.name,
        max: ValidationSetting.transaction.add.city.maxLength.toString()
      },
      pattern: { name: ValidationSetting.transaction.add.city.name }
    },
    state: {
      required: { name: ValidationSetting.transaction.add.state.name },
      maxlength: {
        name: ValidationSetting.transaction.add.state.name,
        max: ValidationSetting.transaction.add.state.maxLength.toString()
      }
    },
    country: {
      required: { name: ValidationSetting.transaction.add.country.name },
      maxlength: {
        name: ValidationSetting.transaction.add.country.name,
        max: ValidationSetting.transaction.add.country.maxLength.toString()
      }
    },
    postalCode: {
      required: { name: ValidationSetting.transaction.add.postalCode.name },
      maxlength: {
        name: ValidationSetting.transaction.add.postalCode.name,
        max: ValidationSetting.transaction.add.postalCode.maxLength.toString()
      },
      pattern: { name: ValidationSetting.transaction.add.postalCode.name }
    },
    timeZone: {
      maxlength: {
        name: ValidationSetting.transaction.add.timeZone.name,
        max: ValidationSetting.transaction.add.timeZone.maxLength.toString()
      }
    },
    cardHolderName: {
      required: { name: ValidationSetting.transaction.add.cardHolderName.name },
      maxlength: {
        name: ValidationSetting.transaction.add.cardHolderName.name,
        max: ValidationSetting.transaction.add.cardHolderName.maxLength.toString()
      },
      pattern: { name: ValidationSetting.transaction.add.cardHolderName.name }
    },
    maskCardNumber: {
      required: { name: ValidationSetting.transaction.add.cardNumber.name },
      maxlength: {
        name: ValidationSetting.transaction.add.cardNumber.name,
        max: ValidationSetting.transaction.add.cardNumber.maxLength.toString()
      },
      cardNumber: { name: 'Card Number' },
    },
    cardExpiry: {
      required: { name: ValidationSetting.transaction.add.cardExpiry.name },
      maxlength: {
        name: ValidationSetting.transaction.add.cardExpiry.name,
        max: ValidationSetting.transaction.add.cardExpiry.maxLength.toString()
      },
      pattern: { name: ValidationSetting.transaction.add.cardExpiry.name },
      expiryDate: { name: 'Expiry Date'},
    },
    cvDataStatus: {
      required: { name: ValidationSetting.transaction.add.cvDataStatus.name },
      minlength: {
        name: ValidationSetting.transaction.add.cvDataStatus.name,
        min: ValidationSetting.transaction.add.cvDataStatus.minLength.toString()
      },
      maxlength: {
        name: ValidationSetting.transaction.add.cvDataStatus.name,
        max: ValidationSetting.transaction.add.cvDataStatus.maxLength.toString()
      },
      pattern: { name: ValidationSetting.transaction.add.cvDataStatus.name }
    },
    cvData: {
      required: { name: ValidationSetting.transaction.add.cvData.name },
      minlength: {
        name: ValidationSetting.transaction.add.cvData.name,
        min: ValidationSetting.transaction.add.cvData.minLength.toString()
      },
      maxlength: {
        name: ValidationSetting.transaction.add.cvData.name,
        max: ValidationSetting.transaction.add.cvData.maxLength.toString()
      },
      pattern: { name: ValidationSetting.transaction.add.cvData.name }
    },
    amount: {
      required: { name: ValidationSetting.transaction.add.amount.name },
      // maxlength: {
      //   name: ValidationSetting.transaction.add.amount.name,
      //   max: ValidationSetting.transaction.add.amount.maxLength.toString()
      // },
      amount: { name: ValidationSetting.transaction.add.amount.name},
      amountpattern: { name: ValidationSetting.transaction.add.amount.name }
    },
    secCode: {
      required: { name: ValidationSetting.transaction.add.secCode.name },
      maxlength: {
        name: ValidationSetting.transaction.add.secCode.name,
        max: ValidationSetting.transaction.add.secCode.maxLength.toString()
      }
    },
    customerName: {
      required: { name: ValidationSetting.transaction.add.customerName.name },
      maxlength: {
        name: ValidationSetting.transaction.add.customerName.name,
        max: ValidationSetting.transaction.add.customerName.maxLength.toString()
      },
      pattern: { name: ValidationSetting.transaction.add.customerName.name }
    },
    payToTheOrderOf: {
      required: { name: ValidationSetting.transaction.add.payToTheOrderOf.name },
      maxlength: {
        name: ValidationSetting.transaction.add.payToTheOrderOf.name,
        max: ValidationSetting.transaction.add.payToTheOrderOf.maxLength.toString()
      }
    },
    routingNumber: {
      required: { name: ValidationSetting.transaction.add.routingNumber.name },
      maxlength: {
        name: ValidationSetting.transaction.add.routingNumber.name,
        max: ValidationSetting.transaction.add.routingNumber.maxLength.toString()
      }
    },
    checkNumber: {
      required: { name: ValidationSetting.transaction.add.checkNumber.name },
      maxlength: {
        name: ValidationSetting.transaction.add.checkNumber.name,
        max: ValidationSetting.transaction.add.checkNumber.maxLength.toString()
      }
    },
    maskedAccountNumber: {
      required: { name: ValidationSetting.transaction.add.accountNumber.name },
      maxlength: {
        name: ValidationSetting.transaction.add.accountNumber.name,
        max: ValidationSetting.transaction.add.accountNumber.maxLength.toString()
      },
      pattern: {name: ValidationSetting.transaction.add.accountNumber.name}
    },
    accountType: {
      required: { name: ValidationSetting.transaction.add.accountType.name },
      maxlength: {
        name: ValidationSetting.transaction.add.accountType.name,
        max: ValidationSetting.transaction.add.accountType.maxLength.toString()
      }
    },
    checkType: {
      required: { name: ValidationSetting.transaction.add.checkType.name },
      maxlength: {
        name: ValidationSetting.transaction.add.checkType.name,
        max: ValidationSetting.transaction.add.checkType.maxLength.toString()
      }
    },
    convenienceAmount: {
      required: { name: ValidationSetting.transaction.add.convenienceAmount.name },
      maxlength: {
        name: ValidationSetting.transaction.add.convenienceAmount.name,
        max: ValidationSetting.transaction.add.convenienceAmount.maxLength.toString()
      },
      amount: { name: ValidationSetting.transaction.add.convenienceAmount.name },
      amountpattern: { name: ValidationSetting.transaction.add.convenienceAmount.name }
    },
    tipAmount: {
      required: { name: ValidationSetting.transaction.add.tipAmount.name },
      maxlength: {
        name: ValidationSetting.transaction.add.tipAmount.name,
        max: ValidationSetting.transaction.add.tipAmount.maxLength.toString()
      },
      amount: { name: ValidationSetting.transaction.add.tipAmount.name },
      amountpattern: { name: ValidationSetting.transaction.add.tipAmount.name }
    },
    taxAmount: {
      required: { name: ValidationSetting.transaction.add.taxAmount.name },
      maxlength: {
        name: ValidationSetting.transaction.add.taxAmount.name,
        max: ValidationSetting.transaction.add.taxAmount.maxLength.toString()
      },
      amount: { name: ValidationSetting.transaction.add.taxAmount.name },
      amountpattern: { name: ValidationSetting.transaction.add.taxAmount.name }
    },
    captureAmount: {
      maxlength: {
        name: ValidationSetting.transaction.add.amount.name,
        max: ValidationSetting.transaction.add.taxAmount.maxLength.toString()
      }
    },
    invoiceNo: {
      required: { name: ValidationSetting.transaction.add.invoiceno.name },
      maxlength: {
        name: ValidationSetting.transaction.add.invoiceno.name,
        max: ValidationSetting.transaction.add.invoiceno.maxLength.toString()
      },
      pattern: { name: 'Invoice No' }
    },
  };

  get Config() {
    return this.config;
  }

  constructor() {

  }
}
