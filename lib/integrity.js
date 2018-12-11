'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuidv4 = require('uuid/v4');
var axios = require('axios');
var soap = require('soap');
var parseString = require('xml2js').parseString;
var soap_client_options = {};

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

var Integrity = function () {
  function Integrity(config) {
    _classCallCheck(this, Integrity);

    this.config = config;
  }

  _createClass(Integrity, [{
    key: 'createMerchant',
    value: function createMerchant(payloadJson) {
      return new Promise(function (resolve, reject) {
        var payload = {
          username: MASTER_MERCHANT_ACCESS["BoardingAPIsUserName"],
          password: MASTER_MERCHANT_ACCESS["BoardingAPIsPassword"]
        };

        axios.post(MASTER_MERCHANT_ACCESS["BoardingAuthAPIURL"], payload).then(function (response) {
          //console.log(" \n \n res==>"+JSON.stringify(response["data"]));
          if (!isNull(response["responseStatus"])) {
            return reject({
              "success": false,
              "message": response["responseStatus"]["message"],
              "error": response["responseStatus"]["errorCode"]
            });
          } else {
            //console.log(" \n \n reads==>"+JSON.stringify(response["data"]));

            var bearerToken = response["data"]["bearerToken"];
            var config = {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': "bearer " + bearerToken
              }
            };

            var createMerchantJson = {
              "DoingBusinessAs": payloadJson["business"]["businessName"],
              "LegalBusinessName": payloadJson["business"]["dbaName"],
              "LegalBusinessAddress": {
                "AddressLine1": payloadJson["business"]["address"]["streetAddress"],
                "City": payloadJson["business"]["address"]["city"],
                "Zip": payloadJson["business"]["address"]["zipCode"],
                "State": payloadJson["business"]["address"]["state"]
              },
              "DbaAddress": {
                "AddressLine1": payloadJson["business"]["address"]["streetAddress"],
                "City": payloadJson["business"]["address"]["city"],
                "Zip": payloadJson["business"]["address"]["zipCode"],
                "State": payloadJson["business"]["address"]["state"]
              },
              "OwnerContacts": [{
                "firstName": payloadJson["basic"]["firstName"],
                "lastName": payloadJson["basic"]["lastName"],
                "email": payloadJson["basic"]["email"],
                "phone": payloadJson["basic"]["mobileNumber"],
                "address": {
                  "addressLine1": payloadJson["business"]["address"]["streetAddress"],
                  "city": payloadJson["business"]["address"]["city"],
                  "zip": payloadJson["business"]["address"]["zipCode"],
                  "state": payloadJson["business"]["address"]["state"]
                },
                "equityPercentage": 100,
                "isPrimaryContact": true,
                "SSN": payloadJson["basic"]["ssn"]
              }],
              "BankAccount": {
                "NameOnAccount": !isNull(payloadJson["basic"]["accountName"]) ? payloadJson["basic"]["accountName"] : payloadJson["basic"]["firstName"],
                "RoutingNumber": !isNull(payloadJson["billing"]["routingNumber"]) ? payloadJson["billing"]["routingNumber"] : "",
                "AccountNumber": !isNull(payloadJson["billing"]["accountNumber"]) ? payloadJson["billing"]["accountNumber"] : ""
              },
              "FedTaxId": !isNull(payloadJson["billing"]["fedTaxId"]) ? payloadJson["billing"]["fedTaxId"] : ""
            };

            axios.post(MASTER_MERCHANT_ACCESS["BoardingCreateMerchantURL"], createMerchantJson, config).then(function (merchantResponse) {
              return resolve({
                "success": true,
                "KEY": "!11",
                "body": merchantResponse["data"]
              });
            }).catch(function (error) {
              return reject({
                "success": false,
                "KEY": "222",
                "message": error["response"]["data"]["responseStatus"]["message"]
              });
            });
          }
        });
        // }).catch(
        //   error => reject({
        //     "success": false, 
        //     "KEY":"333",
        //     "message": JSON.stringify(error)
        //   })
        // );
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
        var payload = {
          username: MASTER_MERCHANT_ACCESS["BoardingAPIsUserName"],
          password: MASTER_MERCHANT_ACCESS["BoardingAPIsPassword"]
        };

        axios.post(MASTER_MERCHANT_ACCESS["BoardingAuthAPIURL"], payload).then(function (response) {
          //console.log(" \n \n res==>"+JSON.stringify(response["data"]));
          if (!isNull(response["responseStatus"])) {
            return reject({
              "success": false,
              "message": response["responseStatus"]["message"],
              "error": response["responseStatus"]["errorCode"]
            });
          } else {

            var bearerToken = response["data"]["bearerToken"];
            var config = {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': "bearer " + bearerToken
              }
            };

            var BoardingMerchantStatusURL = MASTER_MERCHANT_ACCESS["BoardingMerchantStatusURL"];

            BoardingMerchantStatusURL = BoardingMerchantStatusURL.replace("{{MERCHANT_ID}}", payloadJson["merchantId"]);

            axios.get(BoardingMerchantStatusURL, config).then(function (merchantResponse) {
              return resolve({
                "success": true,
                "body": merchantResponse["data"]
              });
            }).catch(function (error) {
              return reject({
                "success": false,
                "message": error["response"]["data"]["responseStatus"]["message"]
              });
            });
          }
        });
        // }).catch(
        //   error => reject({
        //     "success": false, 
        //     "KEY":"333",
        //     "message": JSON.stringify(error)
        //   })
        // );
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
        soap.createClient(MASTER_MERCHANT_ACCESS["RecurringURL"], soap_client_options, function (err, client) {
          //  TODO : Here we have to use newly created merchant Info and not master info.
          var createCustomerJson = { "Username": MASTER_MERCHANT_ACCESS["UserName"],
            "Password": MASTER_MERCHANT_ACCESS["Password"],
            "TransType": "ADD",
            "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
            "CustomerKey": "",
            "CustomerID": payloadJson["payeeInfo"]["firstName"] + " " + payloadJson["payeeInfo"]["lastName"],
            "CustomerName": payloadJson["payeeInfo"]["firstName"] + " " + payloadJson["payeeInfo"]["lastName"],
            "FirstName": payloadJson["payeeInfo"]["firstName"],
            "LastName": payloadJson["payeeInfo"]["lastName"],
            "Title": "",
            "Department": "",
            "Street1": "",
            "Street2": "",
            "Street3": "",
            "City": "",
            "StateID": "",
            "Province": "",
            "Zip": "",
            "CountryID": "",
            "Email": payloadJson["payeeInfo"]["email"],
            "DayPhone": "",
            "NightPhone": "",
            "Fax": "",
            "Mobile": payloadJson["payeeInfo"]["mobileNumber"],
            "Status": "",
            "ExtData": ""
          };

          // if(userInfo["integrityCustomerID"]=="" || userInfo["integrityCustomerID"]==null){

          // }else{
          //     createCustomerJson["CustomerKey"] = userInfo["integrityCustomerID"];
          //     createCustomerJson["TransType"] = "UPDATE";
          // }

          try {
            client.ManageCustomer(createCustomerJson, function (err, result, body) {
              //console.log(JSON.stringify(result)+":::"+result["ManageCustomerResult"]["CustomerKey"]);
              if (result && _typeof(result["ManageCustomerResult"]) !== undefined && _typeof(result["ManageCustomerResult"]["CustomerKey"]) !== undefined) {
                resolve({
                  "success": true,
                  "body": { "gatewayBuyerId": result["ManageCustomerResult"]["CustomerKey"] }
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
    key: 'editPayer',
    value: function editPayer(payloadJson) {
      return new Promise(function (resolve, reject) {
        soap.createClient(MASTER_MERCHANT_ACCESS["RecurringURL"], soap_client_options, function (err, client) {
          //  TODO : Here we have to use newly created merchant Info and not master info.
          var createCustomerJson = { "Username": MASTER_MERCHANT_ACCESS["UserName"],
            "Password": MASTER_MERCHANT_ACCESS["Password"],
            "TransType": "UPDATE",
            "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
            "CustomerKey": payloadJson["payeeInfo"]["gatewayBuyerId"],
            "CustomerID": payloadJson["payeeInfo"]["firstName"] + " " + payloadJson["payeeInfo"]["lastName"],
            "CustomerName": payloadJson["payeeInfo"]["firstName"] + " " + payloadJson["payeeInfo"]["lastName"],
            "FirstName": payloadJson["payeeInfo"]["firstName"],
            "LastName": payloadJson["payeeInfo"]["lastName"],
            "Title": "",
            "Department": "",
            "Street1": "",
            "Street2": "",
            "Street3": "",
            "City": "",
            "StateID": "",
            "Province": "",
            "Zip": "",
            "CountryID": "",
            "Email": payloadJson["payeeInfo"]["email"],
            "DayPhone": "",
            "NightPhone": "",
            "Fax": "",
            "Mobile": payloadJson["payeeInfo"]["mobileNumber"],
            "Status": "",
            "ExtData": ""
          };

          try {
            client.ManageCustomer(createCustomerJson, function (err, result, body) {
              console.log(JSON.stringify(result) + ":::" + result["ManageCustomerResult"]["CustomerKey"]);
              if (result && _typeof(result["ManageCustomerResult"]) !== undefined && _typeof(result["ManageCustomerResult"]["CustomerKey"]) !== undefined) {
                resolve({
                  "success": true,
                  "body": { "gatewayBuyerId": result["ManageCustomerResult"]["CustomerKey"] }
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
    key: 'removePayer',
    value: function removePayer(payloadJson) {
      return new Promise(function (resolve, reject) {
        soap.createClient(MASTER_MERCHANT_ACCESS["RecurringURL"], soap_client_options, function (err, client) {
          //  TODO : Here we have to use newly created merchant Info and not master info.
          var createCustomerJson = { "Username": MASTER_MERCHANT_ACCESS["UserName"],
            "Password": MASTER_MERCHANT_ACCESS["Password"],
            "TransType": "DELETE",
            "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
            "CustomerKey": payloadJson["payeeInfo"]["gatewayBuyerId"],
            "CustomerID": payloadJson["payeeInfo"]["firstName"] + " " + payloadJson["payeeInfo"]["lastName"],
            "CustomerName": payloadJson["payeeInfo"]["firstName"] + " " + payloadJson["payeeInfo"]["lastName"],
            "FirstName": payloadJson["payeeInfo"]["firstName"],
            "LastName": payloadJson["payeeInfo"]["lastName"],
            "Title": "",
            "Department": "",
            "Street1": "",
            "Street2": "",
            "Street3": "",
            "City": "",
            "StateID": "",
            "Province": "",
            "Zip": "",
            "CountryID": "",
            "Email": payloadJson["payeeInfo"]["email"],
            "DayPhone": "",
            "NightPhone": "",
            "Fax": "",
            "Mobile": payloadJson["payeeInfo"]["mobileNumber"],
            "Status": "",
            "ExtData": ""
          };

          try {
            client.ManageCustomer(createCustomerJson, function (err, result, body) {
              console.log(JSON.stringify(result) + ":::" + result["ManageCustomerResult"]["CustomerKey"]);
              if (result && _typeof(result["ManageCustomerResult"]) !== undefined && _typeof(result["ManageCustomerResult"]["CustomerKey"]) !== undefined) {
                resolve({
                  "success": true,
                  "body": { "gatewayBuyerId": result["ManageCustomerResult"]["CustomerKey"] }
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
    key: 'bulkUploadPayers',
    value: function bulkUploadPayers(payloadJson) {
      return 'this is test';
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

  return Integrity;
}();

exports.default = Integrity;