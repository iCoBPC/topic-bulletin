const chinaTime = require('china-time');
var collabration_util = require('./collaboration-dynamodb.js');

var AWS = require('aws-sdk');
var fs = require('fs');
var UUID = require('uuid');
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'}); // Create the DynamoDB service object
var snsClient = new AWS.SNS({apiVersion: '2010-03-31'}); //Create the SNS Client
AWS.config.update({region: 'cn-northwest-1'}); // Set the region 

/**
 * when the event come, find the appropriate coordiantion chain to handle the event.
 */
exports.schedule = async (event, context) => {
    try {
         
         var response = {
          'statusCode': 200,
          'body': JSON.stringify({
              message: "ok"
            })
          };  
         return response;
    } catch (err) {
        console.log(err);
    }
}