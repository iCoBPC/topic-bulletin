 // const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;
var aws = require('aws-sdk')
var fs = require('fs')
var YAML = require('yamljs');

var ddb = new aws.DynamoDB({params : {TableName : 'snsLambda'}})
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'cn-northwest-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
//Create the SNS Client
var snsClient = new AWS.SNS({apiVersion: '2010-03-31'});
const env = {
    "S3_KEY": "resources/application.yaml"
}
console.log("S3_KEY: ", env.S3_KEY)
var tb_Conf = YAML.parse(fs.readFileSync(env.S3_KEY).toString());
console.log("conf : ",config);

exports.lambda_handler = (event, context) => {
  try {
      var msg = event.Records[0].Sns.Message;
      //if event is type of 'Registration', register into AWS topic-bulletin
      if(msg.msg_Type === "Registration" ){
        console.log("Registration --> msg :",msg);
        var params = {
        TableName: tb_Conf.db_Tables.coordinators.name,
        Item: {
          'id' : {S: msg.ID},
          'name' : {S:  msg.name},
          'bussiness_Key' : {S: msg.bussiness_Key},
          'description' : {S: msg.description}, 
          'date': {S: new Date.now().toString}
        }
      };
        // Call DynamoDB to add the item to the table
        ddb.putItem(params, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else {
            console.log("Success", data);
          }
        })

    }
  } catch (err) {
      console.log(err);
  }
};
