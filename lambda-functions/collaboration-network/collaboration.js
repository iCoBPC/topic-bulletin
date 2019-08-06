const chinaTime = require('china-time');
var collabration_util = require('./collaboration-dynamodb.js');

var AWS = require('aws-sdk');
var fs = require('fs');
var s3_util = require('../s3-util.js')
var UUID = require('uuid');
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'}); // Create the DynamoDB service object
var snsClient = new AWS.SNS({apiVersion: '2010-03-31'}); //Create the SNS Client
AWS.config.update({region: 'cn-northwest-1'}); // Set the region 

/**
 * when the event come, find the appropriate coordiantion chain to handle the event.
 */


exports.schedule = async (event, context) => {
    try {
         //
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

         var processDefinitionId = msg.processDefinitionId;
         var processInstanceId = msg.processInstanceId;

        // todo: 首先查询ive表，查collaboration
        

        //如果没有查到ive表项，根据策略去选择<协调器，流程b>,如果不存在流程b的实例与PIa协作，则需启动
        //新的流程实例PIa参与协作，如果存在，比如PIa -> PIx -> PIb，则存在<PIa , PIb>是存在协作的
        //todo: 根据collaboration，调用decision service

         var response = {
          'statusCode': 200,
          'body': JSON.stringify({
              message: msg
            })
          };  
         return response;
    } catch (err) {
        console.log(err);
    }
}