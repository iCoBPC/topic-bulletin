let response;
const chinaTime = require('china-time');
var s3_util = require('../s3-util.js')
var collabration_util = require('./ive-ddb.js');

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

      // var msg = JSON.parse(event.Records[0].Sns.Message);
      var msg = event.Records[0].Sns.Message;
      console.log("msg : ", msg);

       //TODO: generate uuid, if item is new
       if(msg.ive_id === "none"){
        var new_Id = 'l2l:topic-bulletin:ive:'+msg.business_key+':'+UUID.v1();
        msg.ive_id= new_Id;
       }
       var putItemPromise = collabration_util.putItem(msg , db_tables); // put item into the dynamodb
       await putItemPromise.then((data) =>{
         console.log("Put collaboration item successfully", data);
       }).catch((err) =>{
         console.log("Error", err);
       });
       var response = {
        'statusCode': 200,
        'body': JSON.stringify({
            message: "ok,  ive is created "+msg.ive_id
          })
        };  
       return response;
  } catch (err) {
      console.log(err);
  }
};
