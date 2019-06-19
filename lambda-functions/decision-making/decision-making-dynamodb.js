const YAML = require('js-yaml');
var AWS = require('aws-sdk');
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


exports.putItem = async (item, db_tables) => {
    //check if the member has existed
    var params = {
      TableName: db_tables[0].coordination-services.name,
      Item: item
    };
  
    // Call DynamoDB to add the item to the table
    return ddb.putItem(params).promise();
  }
  

// ---
// # 决策表
// # 定制化协调器服务的发布
// coordination-services:
//     - co_service_id:
//     - co_service_name:
//     - coodinator_id:
//     - topics: 
//         - input_topic:
//         - output_topic:
//         - error_topic:
//         - default_topic:
//     -  decision_services:
//         - decision_policy_id: !ref policy_x
//           decision_policy_name:
//           handler: !ref lambda_func_x
//         - decision_policy_id: !ref policy_y
//           decision_policy_name:
//           handler: !ref lambda_func_y
//         - error_handler: !ref lambda_error_handler
//         - default_handler: !ref lambda_default_func

// Item: {
//     'coordination_service_id' : {S: item}, 
//     'coordination_service_name' : {S: ""},
//     'coodinator_id' : {S: ""},
//     'description' : {S: ""}, 
//     'topics': {L: [
//            { input_topic: {S: ""}},
//            {output_topic: {S: ""}},
//            { default_topic: {S: ""}},
//            { error_topic: {S: ""}}
//     ]},
//     'decision_services': {L: [
//         {
//             'decision_policy_id': {S: ""},
//             'handler':  {S: ""}  
//         },
//         {
//             'decision_policy_id':  {S: ""},
//             'handler':  {S: ""} 
//         },
//         {
//             'error_handler':  {S: ""}
//         },
//         {
//             'default_handler':  {S: ""}
//         }
//     ]},
//     'timestamp': {S: chinaTime().toString()}
//   }