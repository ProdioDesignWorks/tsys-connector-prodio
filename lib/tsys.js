'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuidv4 = require('uuid/v4');
var axios = require('axios');
var parser = require('fast-xml-parser');
var he = require('he');

var options = {
  attributeNamePrefix: "@_",
  attrNodeName: "attr", //default is 'false'
  textNodeName: "#text",
  ignoreAttributes: true,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: false,
  trimValues: true,
  cdataTagName: "__cdata", //default is 'false'
  cdataPositionChar: "\\c",
  localeRange: "", //To support non english character in tag/attribute values.
  parseTrueNumberOnly: false,
  attrValueProcessor: function attrValueProcessor(a) {
    return he.decode(a, { isAttributeValue: true });
  }, //default is a=>a
  tagValueProcessor: function tagValueProcessor(a) {
    return he.decode(a);
  } //default is a=>a
};

var _require = require('./config/constant.js'),
    MASTER_MERCHANT_ACCESS = _require.MASTER_MERCHANT_ACCESS;

var isNull = function isNull(val) {
  if (typeof val === 'string') {
    val = val.trim();
  }
  if (val === undefined || val === null || typeof val === 'undefined' || val === '' || val === 'undefined') {
    return true;
  }
  return false;
};

var masterCredentials = {};

var TSYS = function () {
  function TSYS(config) {
    _classCallCheck(this, TSYS);

    this.config = config;
    masterCredentials["MERCHANT_NAME"] = this.config.MERCHANT_NAME;
    masterCredentials["MERCHANT_SITE_ID"] = this.config.MERCHANT_SITE_ID;
    masterCredentials["MERCHANT_KEY"] = this.config.MERCHANT_KEY;

    // let rootDir = process.mainModule.paths[0].split('server')[0].slice(0, -1);
    // let  = require(rootDir + '/services/paymentsources.json');
  }

  _createClass(TSYS, [{
    key: 'createMerchant',
    value: function createMerchant(payloadJson) {
      return new Promise(function (resolve, reject) {

        resolve({ "success": true, "body": { "merchant": { "mid": uuidv4() } } });
      });
    }
  }, {
    key: 'updateMerchant',
    value: function updateMerchant(payloadJson) {
      return 'This is from Integrity';
    }
  }, {
    key: 'deleteMerchant',
    value: function deleteMerchant(payloadJson) {
      return 'This is from Integrity';
    }
  }, {
    key: 'getMerchantId',
    value: function getMerchantId(payloadJson) {
      return 'this is tes';
    }
  }, {
    key: 'getMerchantActionvationStatus',
    value: function getMerchantActionvationStatus(payloadJson) {
      return new Promise(function (resolve, reject) {

        resolve({ "success": true, "body": { "activationStatus": true } });
      });
    }
  }, {
    key: 'getMerchantProfile',
    value: function getMerchantProfile(payloadJson) {
      return 'this is test';
    }
  }, {
    key: 'createPayer',
    value: function createPayer(payloadJson) {
      return new Promise(function (resolve, reject) {
        resolve({ "success": true, "body": { "gatewayBuyerId": uuidv4() } });
      });
    }
  }, {
    key: 'editPayer',
    value: function editPayer(payloadJson) {

      return new Promise(function (resolve, reject) {
        resolve({ "success": true, "body": { "gatewayBuyerId": payloadJson["payeeInfo"]["gatewayBuyerId"] } });
      });
    }
  }, {
    key: 'removePayer',
    value: function removePayer(payloadJson) {
      return new Promise(function (resolve, reject) {
        resolve({ "success": true, "body": { "gatewayBuyerId": payloadJson["payeeInfo"]["gatewayBuyerId"] } });
      });
    }
  }, {
    key: 'bulkUploadPayers',
    value: function bulkUploadPayers(payloadJson) {
      return 'this is test';
    }
  }, {
    key: 'makeDirectPayment',
    value: function makeDirectPayment(payloadJson) {
      return new Promise(function (resolve, reject) {

        if (!isNull(payloadJson["meta"])) {
          payloadJson = payloadJson["meta"];
        }

        var xmls = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">\
                 <soap:Body>\
                    <Sale xmlns="http://schemas.merchantwarehouse.com/merchantware/v45/">\
                       <Credentials>\
                          <MerchantName>' + masterCredentials["MERCHANT_NAME"] + '</MerchantName>\
                          <MerchantSiteId>' + masterCredentials["MERCHANT_SITE_ID"] + '</MerchantSiteId>\
                          <MerchantKey>' + masterCredentials["MERCHANT_KEY"] + '</MerchantKey>\
                       </Credentials>\
                       <PaymentData>\
                          <Source>Keyed</Source>\
                          <CardNumber>' + payloadJson["cardInfo"]["cardNumber"] + '</CardNumber>\
                          <ExpirationDate>' + payloadJson["cardInfo"]["expirationDate"] + '</ExpirationDate>\
                          <CardHolder>' + payloadJson["cardInfo"]["cardHolderName"] + '</CardHolder>\
                          <AvsStreetAddress>' + payloadJson["cardInfo"]["street"] + '</AvsStreetAddress>\
                          <AvsZipCode>' + payloadJson["cardInfo"]["zip"] + '</AvsZipCode>\
                          <CardVerificationValue>' + payloadJson["cardInfo"]["cvv"] + '</CardVerificationValue>\
                        </PaymentData>\
                       <Request>\
                          <Amount>' + payloadJson["paymentInfo"]["amount"] + '</Amount>\
                          <CashbackAmount>0.00</CashbackAmount>\
                          <SurchargeAmount>0.00</SurchargeAmount>\
                          <TaxAmount>' + payloadJson["paymentInfo"]["taxAmount"] + '</TaxAmount>\
                          <InvoiceNumber>' + payloadJson["paymentInfo"]["invoiceNumber"] + '</InvoiceNumber>\
                          <PurchaseOrderNumber></PurchaseOrderNumber>\
                          <CustomerCode></CustomerCode>\
                          <RegisterNumber></RegisterNumber>\
                          <MerchantTransactionId></MerchantTransactionId>\
                          <CardAcceptorTerminalId></CardAcceptorTerminalId>\
                          <EnablePartialAuthorization>False</EnablePartialAuthorization>\
                          <ForceDuplicate>False</ForceDuplicate>\
                       </Request>\
                    </Sale>\
                 </soap:Body>\
              </soap:Envelope>';

        axios.post(MASTER_MERCHANT_ACCESS["PaymentEndPoint"], xmls, { headers: { 'Content-Type': 'text/xml' }
        }).then(function (res) {
          if (parser.validate(res) === true) {
            //optional (it'll return an object in case it's not valid)
            var jsonObj = parser.parse(res, options);
          }

          // Intermediate obj
          var tObj = parser.getTraversalObj(res, options);
          var jsonObj = parser.convertToJson(tObj, options);
          var SaleResponse = jsonObj["soap:Envelope"]["soap:Body"]["SaleResponse"];
          if (SaleResponse["SaleResult"]["ApprovalStatus"] == "APPROVED") {
            resolve({ "success": true, "body": jsonObj });
          } else {
            reject({ "success": false, "error": SaleResponse["SaleResult"]["ApprovalStatus"] });
          }
        }).catch(function (err) {
          reject({ "success": false, "error": err });
        });
      });
    }
  }, {
    key: 'makePayment',
    value: function makePayment(payloadJson) {
      return new Promise(function (resolve, reject) {
        soap.createClient(MASTER_MERCHANT_ACCESS["TransactionsURL"], soap_client_options, function (err, client) {
          //  TODO : Here we have to use newly created merchant Info and not master info.
          console.log(err);
          console.log(client);
          // var paymentJson = {
          //          "Username":MASTER_MERCHANT_ACCESS["UserName"],
          //          "Password":MASTER_MERCHANT_ACCESS["Password"],
          //          "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
          //          "CcInfoKey": payloadJson["cardInfo"]["gatewayCardId"],
          //          "Amount": payloadJson["paymentInfo"]["totalAmount"],
          //          "InvNum":payloadJson["paymentInfo"]["transactionId"], 
          //          "ExtData":""
          //        };
          var paymentJson = {
            "Username": MASTER_MERCHANT_ACCESS["UserName"],
            "Password": MASTER_MERCHANT_ACCESS["Password"],
            "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
            "TransType": "Sale",
            "CardNum": payloadJson["cardInfo"]["cardNumber"],
            "ExpDate": payloadJson["cardInfo"]["expDate"],
            "MagData": "",
            "NameOnCard": payloadJson["cardInfo"]["cardHolderName"],
            "Amount": payloadJson["paymentInfo"]["totalAmount"],
            "InvNum": payloadJson["paymentInfo"]["transactionId"],
            "PNRef": "",
            "Zip": "",
            "Street": "",
            "CVNum": payloadJson["cardInfo"]["cvv"],
            "ExtData": ""
          };

          console.log(paymentJson);

          try {

            client.ProcessCreditCard(paymentJson, function (err, result, body) {
              console.log(JSON.stringify(result) + ":::" + result["ProcessCreditCardResult"]["Result"]);
              if (result && _typeof(result["ProcessCreditCardResult"]) !== undefined && _typeof(result["ProcessCreditCardResult"]["Result"]) !== undefined) {
                if (result["ProcessCreditCardResult"]["Result"] == "0") {
                  resolve({
                    "success": true,
                    "body": { "gatewayTransactionId": result["ProcessCreditCardResult"]["PNRef"] }
                  });
                } else {
                  var _msg = "";
                  if (!isNull(result["ProcessCreditCardResult"]["Message"])) {
                    _msg = result["ProcessCreditCardResult"]["Message"];
                  } else {
                    _msg = result["ProcessCreditCardResult"]["RespMSG"];
                  }
                  reject({ "success": false, "message": _msg });
                }
              } else {
                reject({ "success": false, "message": err });
              }
            });
          } catch (err) {
            reject({ "success": false, "message": err });
          }
        });
      });
    }
  }, {
    key: 'getPayersListing',
    value: function getPayersListing(payloadJson) {
      return 'this is test';
    }
  }, {
    key: 'saveCardForPayer',
    value: function saveCardForPayer(payloadJson) {
      return new Promise(function (resolve, reject) {
        soap.createClient(MASTER_MERCHANT_ACCESS["RecurringURL"], soap_client_options, function (err, client) {
          //  TODO : Here we have to use newly created merchant Info and not master info.
          var cardNumber = payloadJson["cardInfo"]["cardNumber"];
          cardNumber = cardNumber.replace(" ", "").replace(" ", "").replace(" ", "");

          var cardHolderName = payloadJson["cardInfo"]["cardHolderName"];
          var expDate = payloadJson["cardInfo"]["expDate"];

          var creditCardInfo = {
            "Username": MASTER_MERCHANT_ACCESS["UserName"],
            "Password": MASTER_MERCHANT_ACCESS["Password"],
            "TransType": "ADD",
            "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
            "CustomerKey": payloadJson["payerInfo"]["gatewayBuyerId"],
            "CardInfoKey": "",
            "CcAccountNum": cardNumber,
            "CcExpDate": expDate,
            "CcNameOnCard": cardHolderName,
            "CcStreet": "",
            "CcZip": "",
            "ExtData": ""
          };

          try {
            client.ManageCreditCardInfo(creditCardInfo, function (err, result, body) {
              console.log(JSON.stringify(result) + ":::" + result["ManageCreditCardInfoResult"]["CcInfoKey"]);
              if (result && _typeof(result["ManageCreditCardInfoResult"]) !== undefined && _typeof(result["ManageCreditCardInfoResult"]["CcInfoKey"]) !== undefined) {
                resolve({
                  "success": true,
                  "body": { "gatewayCardId": result["ManageCreditCardInfoResult"]["CcInfoKey"] }
                });
              } else {
                reject({ "success": false, "message": err });
              }
            });
          } catch (err) {
            reject({ "success": false, "message": err });
          }
        });
      });
    }
  }, {
    key: 'removeCard',
    value: function removeCard(payloadJson) {
      return new Promise(function (resolve, reject) {
        soap.createClient(MASTER_MERCHANT_ACCESS["RecurringURL"], soap_client_options, function (err, client) {
          //  TODO : Here we have to use newly created merchant Info and not master info.
          var cardNumber = payloadJson["cardInfo"]["cardNumber"];
          cardNumber = cardNumber.replace(" ", "").replace(" ", "").replace(" ", "");

          var cardHolderName = payloadJson["cardInfo"]["cardHolderName"];
          var expDate = payloadJson["cardInfo"]["expDate"];

          var creditCardInfo = {
            "Username": MASTER_MERCHANT_ACCESS["UserName"],
            "Password": MASTER_MERCHANT_ACCESS["Password"],
            "TransType": "DELETE",
            "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
            "CustomerKey": payloadJson["payerInfo"]["gatewayBuyerId"],
            "CardInfoKey": payloadJson["cardInfo"]["gatewayCardId"],
            "CcAccountNum": cardNumber,
            "CcExpDate": expDate,
            "CcNameOnCard": cardHolderName,
            "CcStreet": "",
            "CcZip": "",
            "ExtData": ""
          };

          try {
            client.ManageCreditCardInfo(creditCardInfo, function (err, result, body) {
              console.log(JSON.stringify(result) + ":::" + result["ManageCreditCardInfoResult"]["CcInfoKey"]);
              if (result && _typeof(result["ManageCreditCardInfoResult"]) !== undefined && _typeof(result["ManageCreditCardInfoResult"]["CcInfoKey"]) !== undefined) {
                resolve({
                  "success": true,
                  "body": { "gatewayCardId": result["ManageCreditCardInfoResult"]["CcInfoKey"] }
                });
              } else {
                reject({ "success": false, "message": err });
              }
            });
          } catch (err) {
            reject({ "success": false, "message": err });
          }
        });
      });
    }
  }, {
    key: 'getPayersTransactions',
    value: function getPayersTransactions(payloadJson) {
      return 'this is test';
    }
  }]);

  return TSYS;
}();

exports.default = TSYS;