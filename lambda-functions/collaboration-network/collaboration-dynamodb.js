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
      TableName: db_tables[5].collaboration.name,
      Item: item
    };
    // Call DynamoDB to add the item to the table
    return ddb.putItem(params).promise();
  }
  
// #  协作关系表
//  source:
//   - source_app_id: !ref manager_01
//   - source_process_id: !ref pd11
//  destination:
//   - destination_app_id: 
//   - destination_process_id: !ref pd21 # process_definition_id
//  scenario: ssp
//  business_key: ssp-msc
//  coordinator_policy: !ref static
//  handlers: 
//   -   input_topic: T11
//       coordinator_id: msc_1
//       coordination_service_id: 
//       decision_policy: !ref xxx
//       output_topic: T21
//   -   input_topic: T12
//       coordinator_id: msc_1
//       coordination_service_id: 
//       decision_policy: !ref xxx
//       output_topic: T22
//   -   input_topic: T13
//       coordinator_id: msc_1
//       coordination_service_id: 
//       decision_policy: !ref xxx
//       output_topic: T23

// var Item = {
//     'source' : {
//         'source_app_id': {S: ""},
//         'source_process_id': {S: ""}
//     }, 
//     'destination' : {
//         'destination_app_id': {S: ""},
//         'destination_process_id': {S: ""}
//     }, 
//     'scenario' : {S: ""},
//     'business_key' : {S: ""},
//     'coordinator_policy' : {S: ""},
//     'handlers': {L: [
//            { 
//                input_topic: {S: ""},
//                coordinator_id: {S: ""},
//                coordination_service_id: {S: ""},
//                decision_policy: {S: ""},
//                output_topic: {S: ""},
//            },
//            { 
//             input_topic: {S: ""},
//             coordinator_id: {S: ""},
//             coordination_service_id: {S: ""},
//             decision_policy: {S: ""},
//             output_topic: {S: ""},
//            }
//     ]},
//     'timestamp': {S: chinaTime().toString()}
//   }