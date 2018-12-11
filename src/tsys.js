const uuidv4 = require('uuid/v4');
const axios = require('axios');
const soap = require('soap');
const parseString = require('xml2js').parseString;
let soap_client_options = {};

const { MASTER_MERCHANT_ACCESS} = require('./config/constant.js');
const isNull = function (val) {
  if (typeof val === 'string') { val = val.trim(); }
  if (val === undefined || val === null || typeof val === 'undefined' || val === '' || val === 'undefined') {
    return true;
  }
  return false;
};

export default class Integrity {
  constructor(config) {
    this.config = config;
  }

  createMerchant(payloadJson){
    return new Promise((resolve, reject) => {
      let payload = {
        username: MASTER_MERCHANT_ACCESS["BoardingAPIsUserName"],
        password: MASTER_MERCHANT_ACCESS["BoardingAPIsPassword"],
      };

      axios.post(MASTER_MERCHANT_ACCESS["BoardingAuthAPIURL"], payload).then(response => {
        //console.log(" \n \n res==>"+JSON.stringify(response["data"]));
        if(!isNull(response["responseStatus"])){
          return reject({
            "success": false,
            "message": response["responseStatus"]["message"],
            "error": response["responseStatus"]["errorCode"],
          });
        }else{
          //console.log(" \n \n reads==>"+JSON.stringify(response["data"]));
          
          let bearerToken = response["data"]["bearerToken"];
          var config = {
            headers: {
              'Content-Type':'application/json',
              'Authorization': "bearer " + bearerToken
            }
          };

          let createMerchantJson = {
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
              "OwnerContacts": [
                 {
                    "firstName": payloadJson["basic"]["firstName"],
                    "lastName": payloadJson["basic"]["lastName"],
                    "email":payloadJson["basic"]["email"],
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
                  }
              ],
              "BankAccount": {
                "NameOnAccount": (!isNull(payloadJson["basic"]["accountName"]))?payloadJson["basic"]["accountName"]:payloadJson["basic"]["firstName"],
                "RoutingNumber": (!isNull(payloadJson["billing"]["routingNumber"]))?payloadJson["billing"]["routingNumber"]:"",
                "AccountNumber": (!isNull(payloadJson["billing"]["accountNumber"]))?payloadJson["billing"]["accountNumber"]:""
              },
              "FedTaxId": (!isNull(payloadJson["billing"]["fedTaxId"]))?payloadJson["billing"]["fedTaxId"]:""
          };

          axios.post(MASTER_MERCHANT_ACCESS["BoardingCreateMerchantURL"], createMerchantJson,config).then(
            merchantResponse => resolve({
                "success":true,
                "KEY":"!11",
                "body": merchantResponse["data"],
              })
            ).catch(
              error => reject({
                "success":false, 
                "KEY":"222",
                "message": error["response"]["data"]["responseStatus"]["message"]
              })
            );
        }
      })
      // }).catch(
      //   error => reject({
      //     "success": false, 
      //     "KEY":"333",
      //     "message": JSON.stringify(error)
      //   })
      // );
    });
  }

  updateMerchant(payloadJson){
  	return 'This is from Integrity';
  }

  deleteMerchant(payloadJson){
  	return 'This is from Integrity';
  }

  getMerchantId(payloadJson){
    return 'this is tes';
  }

  getMerchantActionvationStatus(payloadJson){
    return new Promise((resolve, reject) => {
      let payload = {
        username: MASTER_MERCHANT_ACCESS["BoardingAPIsUserName"],
        password: MASTER_MERCHANT_ACCESS["BoardingAPIsPassword"],
      };

      axios.post(MASTER_MERCHANT_ACCESS["BoardingAuthAPIURL"], payload).then(response => {
        //console.log(" \n \n res==>"+JSON.stringify(response["data"]));
        if(!isNull(response["responseStatus"])){
          return reject({
            "success": false,
            "message": response["responseStatus"]["message"],
            "error": response["responseStatus"]["errorCode"],
          });
        }else{
          
          let bearerToken = response["data"]["bearerToken"];
          var config = {
            headers: {
              'Content-Type':'application/json',
              'Authorization': "bearer " + bearerToken
            }
          };

          let BoardingMerchantStatusURL = MASTER_MERCHANT_ACCESS["BoardingMerchantStatusURL"];

          BoardingMerchantStatusURL = BoardingMerchantStatusURL.replace("{{MERCHANT_ID}}",payloadJson["merchantId"]);

          axios.get(BoardingMerchantStatusURL,config).then(
            merchantResponse => resolve({
                "success":true,
                "body": merchantResponse["data"],
              })
            ).catch(
              error => reject({
                "success":false, 
                "message": error["response"]["data"]["responseStatus"]["message"]
              })
            );
        }
      })
      // }).catch(
      //   error => reject({
      //     "success": false, 
      //     "KEY":"333",
      //     "message": JSON.stringify(error)
      //   })
      // );
    });
  }

  getMerchantProfile(payloadJson){
    return 'this is test';
  }

  createPayer(payloadJson){
    return new Promise((resolve, reject) => {
      soap.createClient(MASTER_MERCHANT_ACCESS["RecurringURL"], soap_client_options, function(err, client){
        //  TODO : Here we have to use newly created merchant Info and not master info.
         var createCustomerJson = {"Username":MASTER_MERCHANT_ACCESS["UserName"], 
                  "Password":MASTER_MERCHANT_ACCESS["Password"],
                  "TransType":"ADD",
                  "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
                  "CustomerKey":"",
                  "CustomerID": payloadJson["payeeInfo"]["firstName"]+" "+payloadJson["payeeInfo"]["lastName"],
                  "CustomerName":payloadJson["payeeInfo"]["firstName"]+" "+payloadJson["payeeInfo"]["lastName"],
                  "FirstName": payloadJson["payeeInfo"]["firstName"],
                  "LastName": payloadJson["payeeInfo"]["lastName"],
                  "Title":"",
                  "Department":"",
                  "Street1":"",
                  "Street2":"",
                  "Street3":"",
                  "City":"",
                  "StateID":"",
                  "Province":"",
                  "Zip":"",
                  "CountryID":"",
                  "Email": payloadJson["payeeInfo"]["email"],
                  "DayPhone":"",
                  "NightPhone":"",
                  "Fax":"",
                  "Mobile":payloadJson["payeeInfo"]["mobileNumber"],
                  "Status":"",
                  "ExtData":""
              };

          // if(userInfo["integrityCustomerID"]=="" || userInfo["integrityCustomerID"]==null){

          // }else{
          //     createCustomerJson["CustomerKey"] = userInfo["integrityCustomerID"];
          //     createCustomerJson["TransType"] = "UPDATE";
          // }

          try{
              client.ManageCustomer(createCustomerJson, function(err, result, body) {
                  //console.log(JSON.stringify(result)+":::"+result["ManageCustomerResult"]["CustomerKey"]);
                  if(result && typeof result["ManageCustomerResult"] !== undefined && typeof result["ManageCustomerResult"]["CustomerKey"] !== undefined ){
                      resolve({
                        "success":true,
                        "body": {"gatewayBuyerId": result["ManageCustomerResult"]["CustomerKey"] },
                      });
                  }else{
                    reject({ "success":false,  "message": err });
                  }
              });
          }catch(err){
             reject({ "success":false,  "message": err });
          }
      });
    });
  }

  editPayer(payloadJson){
    return new Promise((resolve, reject) => {
      soap.createClient(MASTER_MERCHANT_ACCESS["RecurringURL"], soap_client_options, function(err, client){
        //  TODO : Here we have to use newly created merchant Info and not master info.
         var createCustomerJson = {"Username":MASTER_MERCHANT_ACCESS["UserName"], 
                  "Password":MASTER_MERCHANT_ACCESS["Password"],
                  "TransType":"UPDATE",
                  "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
                  "CustomerKey":payloadJson["payeeInfo"]["gatewayBuyerId"],
                  "CustomerID": payloadJson["payeeInfo"]["firstName"]+" "+payloadJson["payeeInfo"]["lastName"],
                  "CustomerName":payloadJson["payeeInfo"]["firstName"]+" "+payloadJson["payeeInfo"]["lastName"],
                  "FirstName": payloadJson["payeeInfo"]["firstName"],
                  "LastName": payloadJson["payeeInfo"]["lastName"],
                  "Title":"",
                  "Department":"",
                  "Street1":"",
                  "Street2":"",
                  "Street3":"",
                  "City":"",
                  "StateID":"",
                  "Province":"",
                  "Zip":"",
                  "CountryID":"",
                  "Email": payloadJson["payeeInfo"]["email"],
                  "DayPhone":"",
                  "NightPhone":"",
                  "Fax":"",
                  "Mobile":payloadJson["payeeInfo"]["mobileNumber"],
                  "Status":"",
                  "ExtData":""
              };

          try{
              client.ManageCustomer(createCustomerJson, function(err, result, body) {
                  console.log(JSON.stringify(result)+":::"+result["ManageCustomerResult"]["CustomerKey"]);
                  if(result && typeof result["ManageCustomerResult"] !== undefined && typeof result["ManageCustomerResult"]["CustomerKey"] !== undefined ){
                      resolve({
                        "success":true,
                        "body": {"gatewayBuyerId": result["ManageCustomerResult"]["CustomerKey"] },
                      });
                  }else{
                    reject({ "success":false,  "message": err });
                  }
              });
          }catch(err){
             reject({ "success":false,  "message": err });
          }
      });
    });
  }

  removePayer(payloadJson){
    return new Promise((resolve, reject) => {
      soap.createClient(MASTER_MERCHANT_ACCESS["RecurringURL"], soap_client_options, function(err, client){
        //  TODO : Here we have to use newly created merchant Info and not master info.
         var createCustomerJson = {"Username":MASTER_MERCHANT_ACCESS["UserName"], 
                  "Password":MASTER_MERCHANT_ACCESS["Password"],
                  "TransType":"DELETE",
                  "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
                  "CustomerKey":payloadJson["payeeInfo"]["gatewayBuyerId"],
                  "CustomerID": payloadJson["payeeInfo"]["firstName"]+" "+payloadJson["payeeInfo"]["lastName"],
                  "CustomerName":payloadJson["payeeInfo"]["firstName"]+" "+payloadJson["payeeInfo"]["lastName"],
                  "FirstName": payloadJson["payeeInfo"]["firstName"],
                  "LastName": payloadJson["payeeInfo"]["lastName"],
                  "Title":"",
                  "Department":"",
                  "Street1":"",
                  "Street2":"",
                  "Street3":"",
                  "City":"",
                  "StateID":"",
                  "Province":"",
                  "Zip":"",
                  "CountryID":"",
                  "Email": payloadJson["payeeInfo"]["email"],
                  "DayPhone":"",
                  "NightPhone":"",
                  "Fax":"",
                  "Mobile":payloadJson["payeeInfo"]["mobileNumber"],
                  "Status":"",
                  "ExtData":""
              };

          try{
              client.ManageCustomer(createCustomerJson, function(err, result, body) {
                  console.log(JSON.stringify(result)+":::"+result["ManageCustomerResult"]["CustomerKey"]);
                  if(result && typeof result["ManageCustomerResult"] !== undefined && typeof result["ManageCustomerResult"]["CustomerKey"] !== undefined ){
                      resolve({
                        "success":true,
                        "body": {"gatewayBuyerId": result["ManageCustomerResult"]["CustomerKey"] },
                      });
                  }else{
                    reject({ "success":false,  "message": err });
                  }
              });
          }catch(err){
             reject({ "success":false,  "message": err });
          }
      });
    });
  }


  bulkUploadPayers(payloadJson){
    return 'this is test';
  }

  makePayment(payloadJson){
    return new Promise((resolve, reject) => {
      soap.createClient(MASTER_MERCHANT_ACCESS["TransactionsURL"], soap_client_options, function(err, client){
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
                  "Username":MASTER_MERCHANT_ACCESS["UserName"],
                  "Password":MASTER_MERCHANT_ACCESS["Password"],
                  "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
                  "TransType":"Sale",
                  "CardNum": payloadJson["cardInfo"]["cardNumber"],
                  "ExpDate": payloadJson["cardInfo"]["expDate"],
                  "MagData":"", 
                  "NameOnCard": payloadJson["cardInfo"]["cardHolderName"] ,
                  "Amount": payloadJson["paymentInfo"]["totalAmount"] ,
                  "InvNum": payloadJson["paymentInfo"]["transactionId"],
                  "PNRef":"",
                  "Zip":"",
                  "Street":"",
                  "CVNum": payloadJson["cardInfo"]["cvv"] ,
                  "ExtData":""
                };

                console.log(paymentJson);

          try{

              client.ProcessCreditCard(paymentJson, function(err, result, body) {
                  console.log(JSON.stringify(result)+":::"+result["ProcessCreditCardResult"]["Result"]);
                  if(result && typeof result["ProcessCreditCardResult"] !== undefined && typeof result["ProcessCreditCardResult"]["Result"] !== undefined ){
                      if(result["ProcessCreditCardResult"]["Result"]=="0"){
                        resolve({
                          "success":true,
                          "body": {"gatewayTransactionId": result["ProcessCreditCardResult"]["PNRef"] },
                        });
                      }else{
                        let _msg = "";
                        if(!isNull(result["ProcessCreditCardResult"]["Message"])){
                          _msg = result["ProcessCreditCardResult"]["Message"];
                        }else{
                          _msg = result["ProcessCreditCardResult"]["RespMSG"];
                        }
                        reject({ "success":false,  "message": _msg });
                      }
                      
                  }else{
                    reject({ "success":false,  "message": err });
                  }
              });
          }catch(err){
             reject({ "success":false,  "message": err });
          }
      });
    });
  }

  getPayersListing(payloadJson){
    return 'this is test';
  }

  saveCardForPayer(payloadJson){
    return new Promise((resolve, reject) => {
      soap.createClient(MASTER_MERCHANT_ACCESS["RecurringURL"], soap_client_options, function(err, client){
        //  TODO : Here we have to use newly created merchant Info and not master info.
          let cardNumber = payloadJson["cardInfo"]["cardNumber"];
          cardNumber = cardNumber.replace(" ","").replace(" ","").replace(" ","");

          let cardHolderName = payloadJson["cardInfo"]["cardHolderName"];
          let expDate = payloadJson["cardInfo"]["expDate"];

          var creditCardInfo = {
                    "Username":MASTER_MERCHANT_ACCESS["UserName"],
                    "Password":MASTER_MERCHANT_ACCESS["Password"],
                    "TransType":"ADD",
                    "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
                    "CustomerKey": payloadJson["payerInfo"]["gatewayBuyerId"],
                    "CardInfoKey":"",
                    "CcAccountNum": cardNumber,
                    "CcExpDate": expDate,
                    "CcNameOnCard": cardHolderName,
                    "CcStreet": "",
                    "CcZip": "",
                    "ExtData":""
                  };

          try{
              client.ManageCreditCardInfo(creditCardInfo, function(err, result, body) {
                  console.log(JSON.stringify(result)+":::"+result["ManageCreditCardInfoResult"]["CcInfoKey"]);
                  if(result && typeof result["ManageCreditCardInfoResult"] !== undefined && typeof result["ManageCreditCardInfoResult"]["CcInfoKey"] !== undefined ){
                      resolve({
                        "success":true,
                        "body": {"gatewayCardId": result["ManageCreditCardInfoResult"]["CcInfoKey"] },
                      });
                  }else{
                    reject({ "success":false,  "message": err });
                  }
              });
          }catch(err){
             reject({ "success":false,  "message": err });
          }
      });
    });
  }

  removeCard(payloadJson){
    return new Promise((resolve, reject) => {
      soap.createClient(MASTER_MERCHANT_ACCESS["RecurringURL"], soap_client_options, function(err, client){
        //  TODO : Here we have to use newly created merchant Info and not master info.
          let cardNumber = payloadJson["cardInfo"]["cardNumber"];
          cardNumber = cardNumber.replace(" ","").replace(" ","").replace(" ","");

          let cardHolderName = payloadJson["cardInfo"]["cardHolderName"];
          let expDate = payloadJson["cardInfo"]["expDate"];

          var creditCardInfo = {
                    "Username":MASTER_MERCHANT_ACCESS["UserName"],
                    "Password":MASTER_MERCHANT_ACCESS["Password"],
                    "TransType":"DELETE",
                    "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
                    "CustomerKey": payloadJson["payerInfo"]["gatewayBuyerId"],
                    "CardInfoKey":payloadJson["cardInfo"]["gatewayCardId"],
                    "CcAccountNum": cardNumber,
                    "CcExpDate": expDate,
                    "CcNameOnCard": cardHolderName,
                    "CcStreet": "",
                    "CcZip": "",
                    "ExtData":""
                  };

          try{
              client.ManageCreditCardInfo(creditCardInfo, function(err, result, body) {
                  console.log(JSON.stringify(result)+":::"+result["ManageCreditCardInfoResult"]["CcInfoKey"]);
                  if(result && typeof result["ManageCreditCardInfoResult"] !== undefined && typeof result["ManageCreditCardInfoResult"]["CcInfoKey"] !== undefined ){
                      resolve({
                        "success":true,
                        "body": {"gatewayCardId": result["ManageCreditCardInfoResult"]["CcInfoKey"] },
                      });
                  }else{
                    reject({ "success":false,  "message": err });
                  }
              });
          }catch(err){
             reject({ "success":false,  "message": err });
          }
      });
    });
  }

  getPayersTransactions(payloadJson){
    return 'this is test';
  }
}