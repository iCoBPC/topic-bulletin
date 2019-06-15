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
//Fetch or read application.yaml from aws s3
exports.readConfig = async () => { 
    var conf = {};
    var getParams = {
        Bucket: params.Bucket, //replace example bucket with your s3 bucket name
        Key: params.Key // replace file location with your s3 file location
    }
    var promise = s3.getObject(getParams).promise();
    await promise.then(
        function (data) {
                conf = YAML.safeLoad(data.Body.toString());
                console.log(conf); //this will log data to console
        }).catch(
        function(err){
            console.log(err);
        });
    return  conf.application;
}
 

exports.writeConfig = async(data) => {
    var putParams = {
        Body: data.toString(),//Buffer.from('...') || 'STRING_VALUE' || streamObject,
        Bucket: params.Bucket, //replace example bucket with your s3 bucket name
        Key: params.Key // replace file location with your s3 file location
    }

    var res = null;
    var promise = s3.putObject(putParams).promise();
    await promise.then(
        function (data) {
            res = data;
            console.log(data); //this will log data to console
                 /*
                data = {
                ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
                VersionId: "Bvq0EDKxOcXLJXNo_Lkz37eM3R4pfzyQ"
                }
                */
        }).catch(
        function(err){
            console.log(err);
        }); 
    return res;   
}

// read local files : 
// const env = {
//   "S3_KEY": "resources/application.yaml"
// }
// console.log("S3_KEY: ", env.S3_KEY)
// let doc = YAML.safeLoad(fs.readFileSync(env.S3_KEY, 'utf8'));

