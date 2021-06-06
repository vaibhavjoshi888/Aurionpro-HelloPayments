import {AbstractControl} from '@angular/forms';
import { DownloadToCSV_MerchantCreated, DownloadToCSV_TransactionList, DownloadToCSV_MerchantBilling } from '../enum/download-to-csv.enum';
// import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { ReportFilter } from '../enum/report-filter.enum';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { MessageSetting } from '../constant/message-setting.constant';
//import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

export class Utilities {
  static urlReplace(pattern, source, replacementArray) {
    for (var i in replacementArray) {

    }
  }

  static compareObject(obj1, obj2) {
    function _equals(obj1, obj2) {
      var clone = $.extend(true, {}, obj1),
        cloneStr = JSON.stringify(clone);
      return cloneStr === JSON.stringify($.extend(true, clone, obj2));
    }

    return _equals(obj1, obj2) && _equals(obj2, obj1);
  }

  static getPaginationNumberArray(totalItems: number, currentPage: number, pageSize: number) {
    const totalPages = Math.ceil(totalItems / pageSize);
    let startPage: number, endPage: number;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if(totalPages - currentPage < 2) {
        startPage = totalPages - 4;
      } else {
        startPage = (currentPage - 2 <= 0) ? 1 : currentPage - 2;
      }
      if (currentPage <= 2) {
        endPage = 5;
      } else {
        endPage = (currentPage + 2 >= totalPages) ? totalPages : currentPage + 2;
      }
    }

    // if (totalPages <= 3) {
    //   // less than 10 total pages so show all
    //   startPage = 1;
    //   endPage = totalPages;
    // } else {
    //   // more than 10 total pages so calculate start and end pages
    //   if (currentPage <= 6) {
    //     switch (currentPage){
    //       case 4:
    //         startPage = 2;
    //         endPage = 4;
    //         break;
    //       case 5:
    //         startPage = 3;
    //         endPage = 5;
    //         break;
    //       case 6:
    //         startPage = 4;
    //         endPage = 6;
    //         break;
    //       default :
    //         startPage = 1;
    //         endPage = 3;
    //         break;
    //     }
    //   } else if (currentPage + 4 >= totalPages) {
    //     // debugger;
    //     startPage = (totalPages - 9 <= 0) ? 1 :   totalPages - 9;
    //     endPage = totalPages;
    //   } else {
    //     startPage = currentPage - 5;
    //     endPage = currentPage + 4;
    //   }

    //   //For Showing just list of 3 pages
    //   // if (currentPage <= 3) {
    //   //   startPage = 1;
    //   //   endPage = 3;
    //   // }
    //   // else {
    //   //   startPage = currentPage - 2;
    //   //   endPage = currentPage;
    //   // }
    // }
    return Utilities.rangeFunc(startPage, endPage + 1, false);
  }

  static rangeFunc(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  }

  static getCardType(cardNumber) {
    // visa
    let re = new RegExp('^4');
    if (cardNumber.match(re) != null) {
      return 'VISA';
    }
    // Mastercard
    // Updated for Mastercard 2017 BINs expansion
    // /^5[1-5]\d{14}$|^2(?:2(?:2[1-9]|[3-9]\d)|[3-6]\d\d|7(?:[01]\d|20))\d{12}$/
    //  if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(cardNumber)) {
    //     return 'MASTERCARD';
    //  }

    if (/^5[1-5]\d{14}$|^2(?:2(?:2[1-9]|[3-9]\d)|[3-6]\d\d|7(?:[01]\d|20))\d{12}$/.test(cardNumber)) {
      return 'MASTERCARD';
    }

    // AMEX
    re = new RegExp('^3[47]');
    if (cardNumber.match(re) != null) {
      return 'AMEX';
    }

    // Discover
    re = new RegExp('^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65|6282)');
    if (cardNumber.match(re) != null) {
      return 'DISCOVER';
    }

    // Diners
    re = new RegExp('^36');
    if (cardNumber.match(re) != null) {
      return 'DINERS';
    }

    // Diners - Carte Blanche
    re = new RegExp('^30[0-5]');
    if (cardNumber.match(re) != null) {
      // return 'Diners - Carte Blanche';
      return 'DINERS'; // changed as api expect the card type as Diners
    }

    // JCB
    re = new RegExp('^35(2[89]|[3-8][0-9])');
    if (cardNumber.match(re) != null) {
      return 'JCB';
    }

    // Visa Electron
    re = new RegExp('^(4026|417500|4508|4844|491(3|7))');
    if (cardNumber.match(re) != null) {
      return 'Visa Electron';
    }
    return '';
  }

  static exportToCsv(data, fileName) {
    // const items = this.csvData.data;
    const items = data;
    if (data.length > 0) {
      let tempHeader = [];
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(items[0]);
    if (fileName === 'Merchant_Creation_Report.csv') {
      tempHeader = [];
      for (const itemindex in header) {
        if (itemindex) {
          // if (header[itemindex] === 'merchantId') {
          //   header.splice(Number(itemindex), 1);
          //   // break;
          // } else if (header[itemindex] === 'ccTxnProceesorName') {
          //   header.splice(Number(itemindex), 1);
          //   // break;
          // } else if (header[itemindex] === 'achTxnProceesorName') {
          //   header.splice(Number(itemindex), 1);
          //   // break;
          // } else if (header[itemindex] === 'dcTxnProceesorName') {
          //   header.splice(Number(itemindex), 1);
          //   // break;
          // } else {
          //   tempHeader.push(DownloadToCSV_MerchantCreated[header[itemindex]]);
          // }
          tempHeader.push(DownloadToCSV_MerchantCreated[header[itemindex]]);
        }
      }
    }

    if (fileName === 'Transaction_List_Report.csv') {
      tempHeader = [];
      for (const item in header) {
        if (item) {
          tempHeader.push(DownloadToCSV_TransactionList[header[item]]);
        }
      }
    }

    if (fileName === 'Merchant_Billing_Report.csv') {
      tempHeader = [];
      for (const item in header) {
        if (item) {
          tempHeader.push(DownloadToCSV_MerchantBilling[header[item]]);
        }
      }
    }
    let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(tempHeader.join(','));
    csv = csv.join('\r\n');
    const file = new Blob([csv], {type: 'csv'});
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(file, fileName);

    } else { // Others
        const a = document.createElement('a'),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
    }
    return true;
  }

  static exportToPdf(data, fileName) {
    const items = data;
    if (data.length > 0) {
      let tempHeader = [];
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(items[0]);
    if (fileName === 'Merchant_Creation_Report.csv') {
      tempHeader = [];
      for (const itemindex in header) {
        if (itemindex) {
          tempHeader.push(DownloadToCSV_MerchantCreated[header[itemindex]]);
        }
      }
    }

    if (fileName === 'Transaction_List_Report.csv') {
      tempHeader = [];
      for (const item in header) {
        if (item) {
          tempHeader.push(DownloadToCSV_TransactionList[header[item]]);
        }
      }
    }

    if (fileName === 'Merchant_Billing_Report.csv') {
      tempHeader = [];
      for (const item in header) {
        if (item) {
          tempHeader.push(DownloadToCSV_MerchantBilling[header[item]]);
        }
      }
    }
    const csvheaderlist = [];

    const csv = items.map(row => header.map(fieldName => {
      if (MessageSetting.reportAmountFilter.includes(fieldName)) {
        return {text: Number(row[fieldName]).toFixed(2), alignment: 'right'};
      } else {
        return row[fieldName];
      }
    }, replacer)
    );

    for (const item in tempHeader) {
      if (item) {
        csvheaderlist.push({text: tempHeader[item].replace(new RegExp('_', 'g'), ' '),
        fillColor: '#eeeeee', style: 'tableHeader', alignment: 'center'});
      }
    }
    csv.unshift(csvheaderlist);

    return csv;
    }
  }

  static pdf (data, filter, fileName) {
    const filterFields = [];
    let pdfpageSize = 'A2';
    for (const item in filter) {
      if (item) {
        if (item !== 'isActive') {
          filterFields.push({
            border: [false, false, false, false],
            // fillColor: '#eeeeee',
            text: ReportFilter[item] + ': ' + filter[item]
          });
        }
      }
    }

    if (fileName === 'Merchant_Billing_Report.pdf') {
      pdfpageSize = 'A1';
    }

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const docDefinition = {
      pageSize: pdfpageSize,
      pageOrientation: 'landscape',
      footer: function(currentPage, pageCount) { return {text: currentPage.toString() + ' of ' + pageCount , alignment: 'center' }; },
      header: function(currentPage, pageCount) {
    // you can apply any logic and return any valid pdfmake element

    return { text: '', alignment: 'right' };
  },
      content: ['',
      // content: ['This is an sample PDF printed with pdfMake',
    {
      // image: '../../../../../../../../assets/images/logo_login.png',
      image: `data:image/png;base64,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
      r8AAwB+F1AuVNimcwAAAABJRU5ErkJggg==`,
      margin: [ 0, 0, 0, 20 ]
    },
    {
      table: {
        body: [filterFields]
      }
    },
    {
      style: 'tableExample',
      color: '#444',
      table: {
        // widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        headerRows: 1,
        // keepWithHeaderRows: 1,
        body: data
        }
      }],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      }
    };
    pdfMake.createPdf(docDefinition).download(fileName);
  }

  static enumSelector(definition) {
    return Object.keys(definition)
      .map(key => ({ value: definition[key], title: key }));
  }
}
