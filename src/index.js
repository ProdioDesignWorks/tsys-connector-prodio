// import TSYS from './tsys.js';
// export default TSYS;
var parseString = require('xml2js').parseString;

let xml = '<?xml version="1.0" encoding="utf-8"?>\
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\
    <soap:Body>\
        <SaleResponse xmlns="http://schemas.merchantwarehouse.com/merchantware/v45/">\
            <SaleResult>\
                <ApprovalStatus>DECLINED;1023;invalid account num</ApprovalStatus>\
                <Token>1373258563</Token>\
                <AuthorizationCode>Invalid_Account_Number</AuthorizationCode>\
                <TransactionDate>12/13/2018 9:55:25 AM</TransactionDate>\
                <Amount>00</Amount>\
                <RemainingCardBalance />\
                <CardNumber>***********3002</CardNumber>\
                <Cardholder>John Doe</Cardholder>\
                <CardType>4</CardType>\
                <FsaCard />\
                <ReaderEntryMode>1</ReaderEntryMode>\
                <AvsResponse />\
                <CvResponse />\
                <ErrorMessage />\
                <ExtraData />\
                <Rfmiq>1146ISZ4Q3</Rfmiq>\
                <DebitTraceNumber />\
            </SaleResult>\
        </SaleResponse>\
    </soap:Body>\
</soap:Envelope>';


var parser = require('fast-xml-parser');
var he = require('he');
 
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
 
if( parser.validate(xml) === true) { //optional (it'll return an object in case it's not valid)
    var jsonObj = parser.parse(xml,options);
}
 
// Intermediate obj
var tObj = parser.getTraversalObj(xml,options);
var jsonObj = parser.convertToJson(tObj,options);

console.dir(jsonObj["soap:Envelope"]["soap:Body"]);

