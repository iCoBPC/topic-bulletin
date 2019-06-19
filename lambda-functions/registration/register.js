 // const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;
const chinaTime = require('china-time');
var s3_util = require('../s3-util.js');
var AWS = require('aws-sdk');
var fs = require('fs');
var UUID = require('uuid');
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'}); // Create the DynamoDB service object
var snsClient = new AWS.SNS({apiVersion: '2010-03-31'}); //Create the SNS Client
AWS.config.update({region: 'cn-northwest-1'}); // Set the region 

exports.lambda_handler = async (event, context) => {
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
      //if event is type of 'Registration', 
      if(msg.msg_Type === "Registration" ){
        console.log("Registration --> msg :",msg);
        if(msg.ID === 'none'){
          var new_Id = 'l2l:coordinators:'+msg.business_Key+':'+UUID.v1();
          msg.ID = new_Id;
          var putItemPromise = putItem(msg , db_tables); // put item into the dynamodb
          await putItemPromise.then((data) =>{
            console.log("PutItem Success", data);
          }).catch((err) =>{
            console.log("Error", err);
          });

          var publishTextPromise =  registerSuccessNotify(msg); // notify the coordinator of the success registration
           // Handle promise's fulfilled/rejected states
          await publishTextPromise.then(function(data) {
            console.log("MessageID is " + data.MessageId);
          }).catch(function(err) {
            console.error(err, err.stack);
          });

          console.log("Registered into AWS topic-bulletin");
        }else{
          console.log("the coordiantor was registerd, id = " , msg.ID);
          //需要检查dynamodb中是否存在该记录，如果，不存在，则重新注册，否则更新，(实现省略)
        }
    }else{
      console.log("the type of event is wrong, should be ", msg.msg_Type);
    }
  } catch (err) {
      console.log(err);
  }
};

var putItem = async (msg, db_tables) => {
  //check if the member has existed
  var params = {
    TableName: db_tables[1].coordinators.name,
    Item: {
      'id' : {S: msg.ID}, 
      'name' : {S:  msg.name},
      'business_key' : {S: msg.business_Key},
      'description' : {S: msg.description}, 
      'timestamp': {S: chinaTime().toString()}
    }
  };

  // Call DynamoDB to add the item to the table
  return ddb.putItem(params).promise();
}

var  registerSuccessNotify = async (msg) => {
  // Create promise and SNS service object
  console.log("=======registerSuccessNotify======")
  var params = {
    Message: JSON.stringify({
      msg_Type: "REGISTRATION",
      status: "success",
      coordinator_Uuid: msg.ID
    }), /* required */
    MessageAttributes: {
      'event_type': {
        DataType: 'String', /* required */
        StringValue: 'setuuid'
      },
      'business_key': {
        DataType: 'String', /* required */
        StringValue: 'lvc'
      },
    },  
    TopicArn: msg.input_Channel
  };

  return  new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
}

