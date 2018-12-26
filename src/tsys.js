const uuidv4 = require('uuid/v4');
const axios = require('axios');
var parser = require('fast-xml-parser');
var he = require('he');
var JSParser = require("fast-xml-parser").j2xParser;
 
 //default options need not to set
var defaultOptions = {
    attributeNamePrefix : "@_",
    attrNodeName: "@", //default is false
    textNodeName : "#text",
    ignoreAttributes : true,
    cdataTagName: "__cdata", //default is false
    cdataPositionChar: "\\c",
    format: false,
    indentBy: "  ",
    supressEmptyNode: false,
    tagValueProcessor: a=> he.encode(a, { useNamedReferences: true}),// default is a=>a
    attrValueProcessor: a=> he.encode(a, {isAttributeValue: isAttribute, useNamedReferences: true})// default is a=>a
};
var options = {
    attributeNamePrefix : "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName : "#text",
    ignoreAttributes : true,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    localeRange: "", //To support non english character in tag/attribute values.
    parseTrueNumberOnly: false,
    attrValueProcessor: a => he.decode(a, {isAttributeValue: true}),//default is a=>a
    tagValueProcessor : a => he.decode(a) //default is a=>a
};


const { MASTER_MERCHANT_ACCESS} = require('./config/constant.js');

const isNull = function (val) {
  if (typeof val === 'string') { val = val.trim(); }
  if (val === undefined || val === null || typeof val === 'undefined' || val === '' || val === 'undefined') {
    return true;
  }
  return false;
};


let masterCredentials = {};

export default class TSYS {
  constructor(config) {
    this.config = config;
    masterCredentials["MERCHANT_NAME"] = this.config.MERCHANT_NAME;
    masterCredentials["MERCHANT_SITE_ID"] = this.config.MERCHANT_SITE_ID;
    masterCredentials["MERCHANT_KEY"] = this.config.MERCHANT_KEY;
        
    // let rootDir = process.mainModule.paths[0].split('server')[0].slice(0, -1);
    // let  = require(rootDir + '/services/paymentsources.json');
  }

  createMerchant(payloadJson){
    return new Promise((resolve, reject) => {

      resolve({ "success":true, "body": {"merchant":{"mid": uuidv4() }} });

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

      resolve({ "success":true, "body": {"activationStatus":true} });

    });
  }

  getMerchantProfile(payloadJson){
    return 'this is test';
  }

  createPayer(payloadJson){
    return new Promise((resolve, reject) => {
      resolve({ "success":true,"body": {"gatewayBuyerId": uuidv4() } });
    });
  }

  editPayer(payloadJson){

    return new Promise((resolve, reject) => {
      resolve({ "success":true,"body": {"gatewayBuyerId":  payloadJson["payeeInfo"]["gatewayBuyerId"] } });
    });
  }

  removePayer(payloadJson){
    return new Promise((resolve, reject) => {
      resolve({ "success":true,"body": {"gatewayBuyerId":  payloadJson["payeeInfo"]["gatewayBuyerId"] } });
    });
  }


  bulkUploadPayers(payloadJson){
    return 'this is test';
  }

  makeDirectPayment(payloadJson){
    return new Promise((resolve, reject) => {

      if (!isNull(payloadJson["meta"])) {
            payloadJson = payloadJson["meta"];
        }else{
        if (!isNull(payloadJson["paymentInfo"])) {
            payloadJson = payloadJson["paymentInfo"];
        }
      }
        
        //console.log("payloadJson==>"+JSON.stringify(payloadJson));

      let xmls='<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">\
                 <soap:Body>\
                    <Sale xmlns="http://schemas.merchantwarehouse.com/merchantware/v45/">\
                       <Credentials>\
                          <MerchantName>'+masterCredentials["MERCHANT_NAME"]+'</MerchantName>\
                          <MerchantSiteId>'+masterCredentials["MERCHANT_SITE_ID"]+'</MerchantSiteId>\
                          <MerchantKey>'+masterCredentials["MERCHANT_KEY"]+'</MerchantKey>\
                       </Credentials>\
                       <PaymentData>\
                          <Source>Keyed</Source>\
                          <CardNumber>'+payloadJson["cardInfo"]["cardNumber"]+'</CardNumber>\
                          <ExpirationDate>'+payloadJson["cardInfo"]["expirationDate"]+'</ExpirationDate>\
                          <CardHolder>'+payloadJson["cardInfo"]["cardHolderName"]+'</CardHolder>\
                          <AvsStreetAddress>'+payloadJson["cardInfo"]["street"]+'</AvsStreetAddress>\
                          <AvsZipCode>'+payloadJson["cardInfo"]["zip"]+'</AvsZipCode>\
                          <CardVerificationValue>'+payloadJson["cardInfo"]["cvv"]+'</CardVerificationValue>\
                        </PaymentData>\
                       <Request>\
                          <Amount>'+payloadJson["paymentInfo"]["amount"]+'</Amount>\
                          <CashbackAmount>0.00</CashbackAmount>\
                          <SurchargeAmount>0.00</SurchargeAmount>\
                          <TaxAmount>'+payloadJson["paymentInfo"]["taxAmount"]+'</TaxAmount>\
                          <InvoiceNumber>'+payloadJson["paymentInfo"]["invoiceNumber"]+'</InvoiceNumber>\
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

              console.log("xmls==>"+xmls);

        axios.post(MASTER_MERCHANT_ACCESS["PaymentEndPoint"],
           xmls,
           {headers:
             {'Content-Type': 'text/xml'}
           }).then(res=>{
            //console.log(res["data"]);

              let xmlResponse = res["data"];

              if( parser.validate(xmlResponse) === true) { //optional (it'll return an object in case it's not valid)
                  var jsonObj = parser.parse(xmlResponse,options);
              }
              
              // Intermediate obj
              var tObj = parser.getTraversalObj(xmlResponse,options);
              var jsonObj = parser.convertToJson(tObj,options);
              let SaleResponse = jsonObj["soap:Envelope"]["soap:Body"]["SaleResponse"];

              if(SaleResponse["SaleResult"]["ApprovalStatus"]=="APPROVED"){
                resolve({"success":true,"message": jsonObj});
              }else{
                let _msg = SaleResponse["SaleResult"]["ApprovalStatus"];
                if(isNull(_msg) || _msg==""){
                  _msg = SaleResponse["SaleResult"]["ErrorMessage"];
                }
                reject({"success":false,"message":_msg});
              }

           }).catch(err=>{
              reject({"success":false,"message":err});
          });

    });
  }

  makePayment(payloadJson){
   
  }

  makeRefund(payloadJson){
    return new Promise((resolve, reject) => {

      if (!isNull(payloadJson["meta"])) {
            payloadJson = payloadJson["meta"];
        }
        if (!isNull(payloadJson["paymentInfo"])) {
            payloadJson = payloadJson["paymentInfo"];
        }
        
        //console.log("payloadJson==>"+JSON.stringify(payloadJson));
        let xmls = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">\
                     <soap:Body>\
                        <Refund xmlns="http://schemas.merchantwarehouse.com/merchantware/v45/">\
                           <Credentials>\
                              <MerchantName>'+masterCredentials["MERCHANT_NAME"]+'</MerchantName>\
                              <MerchantSiteId>'+masterCredentials["MERCHANT_SITE_ID"]+'</MerchantSiteId>\
                              <MerchantKey>'+masterCredentials["MERCHANT_KEY"]+'</MerchantKey>\
                           </Credentials>\
                           <PaymentData>\
                              <Source>Keyed</Source>\
                              <CardNumber>'+payloadJson["cardInfo"]["cardNumber"]+'</CardNumber>\
                              <ExpirationDate>'+payloadJson["cardInfo"]["expirationDate"]+'</ExpirationDate>\
                              <CardHolder>'+payloadJson["cardInfo"]["cardHolderName"]+'</CardHolder>\
                           </PaymentData>\
                           <Request>\
                              <Amount>'+payloadJson["amount"]+'</Amount>\
                              <InvoiceNumber></InvoiceNumber>\
                              <RegisterNumber></RegisterNumber>\
                              <MerchantTransactionId></MerchantTransactionId>\
                              <CardAcceptorTerminalId></CardAcceptorTerminalId>\
                           </Request>\
                        </Refund>\
                     </soap:Body>\
                  </soap:Envelope>';

              console.log("xmls==>"+xmls);

        axios.post(MASTER_MERCHANT_ACCESS["PaymentEndPoint"],
           xmls,
           {headers:
             {'Content-Type': 'text/xml'}
           }).then(res=>{
            //console.log(res["data"]);

              let xmlResponse = res["data"];

              if( parser.validate(xmlResponse) === true) { //optional (it'll return an object in case it's not valid)
                  var jsonObj = parser.parse(xmlResponse,options);
              }
              
              // Intermediate obj
              var tObj = parser.getTraversalObj(xmlResponse,options);
              var jsonObj = parser.convertToJson(tObj,options);
              let SaleResponse = jsonObj["soap:Envelope"]["soap:Body"]["RefundResponse"];

              if(SaleResponse["RefundResult"]["ApprovalStatus"]=="APPROVED"){
                resolve({"success":true,"message": jsonObj});
              }else{
                let _msg = SaleResponse["RefundResult"]["ApprovalStatus"];
                if(isNull(_msg) || _msg==""){
                  _msg = SaleResponse["RefundResult"]["ErrorMessage"];
                }
                reject({"success":false,"message":_msg});
              }

           }).catch(err=>{
              reject({"success":false,"message":err});
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