const YAML = require('js-yaml');
var AWS = require('aws-sdk');
var UUID = require('uuid');
var ddbClient = new AWS.DynamoDB.DocumentClient(); // Create the DynamoDB service object
AWS.config.update({
    accessKeyId: 'AKIASFFPCCPAGLHYS4VW',
    secretAccessKey: '843Yg7BqKHjvkpMNaTUmk66imy1r7TUWXX4QXQRl',
    region: 'cn-northwest-1'
});
var s3 = new AWS.S3();
var params = {
    Bucket: 'l2l-conf-center', //replace example bucket with your s3 bucket name
    Key: 'topic-bulletin/application.yaml' // replace file location with your s3 file location
}


exports.putItem = async (data, db_tables) => {

    var params = {
      TableName: "instant-virtual-enterprise",
      Item: data
    };
    // Call DynamoDB to add the item to the table
    return ddbClient.put(params).promise();
  }


  exports.getItem = async (data, db_tables) => {

    var params = {
      TableName: "instant-virtual-enterprise",
      Item: data
    };
    // Call DynamoDB to add the item to the table
    return ddbClient.put(params).promise();
  }