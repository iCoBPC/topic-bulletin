 // const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;
const chinaTime = require('china-time');
var collabration_util = require('./collaboration-dynamodb.js');

var AWS = require('aws-sdk');
var fs = require('fs');
var UUID = require('uuid');
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'}); // Create the DynamoDB service object
var snsClient = new AWS.SNS({apiVersion: '2010-03-31'}); //Create the SNS Client
AWS.config.update({region: 'cn-northwest-1'}); // Set the region 

/**
 * msg : {
 *      'msg_type': "collaboration-relationship-put",
 *      'business_key': "xxxx",
 *       'item' : "collaboration relationship item"
 * }
 */

exports.putItem = async (event, context) => {
  try {
      var global_conf = null;
      var global_conf_promise = s3_util.readConfig(); //load global config
      await global_conf_promise.then((data) =>{
        global_conf = data;
      });
      console.log("global config : ",global_conf.db_tables);
      var db_tables = global_conf.db_tables;

      console.log(event.Records[0].Sns);
      var msg = JSON.parse(event.Records[0].Sns.Message);
       //TODO: decision making logic
       var new_Id = 'l2l:topic-bulletin:collaboration:'+msg.business_Key+':'+UUID.v1();
       msg.item.coordination_service_id = new_id;

       var putItemPromise = collabration_util.putItem(msg , db_tables); // put item into the dynamodb
       await putItemPromise.then((data) =>{
         console.log("Put collaboration item successfully", data);
       }).catch((err) =>{
         console.log("Error", err);
       });
       var response = {
        'statusCode': 200,
        'body': JSON.stringify({
            message: item
          
          })
        };  
       return response;
  } catch (err) {
      console.log(err);
  }
};
