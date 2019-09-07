var IdentityPoolId = 'your identity poolid'
var bucketName = 'bucket name';
var bucketRegion = 'ap-northeast-2';


// requests identity to cognito service
AWS.config.region = 'ap-northeast-2'; // 리전
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId,
});
var s3 = new AWS.S3({
	apiVersion: '2006-03-01',
	params: {Bucket: bucketName}
});


//bucket access test
function bucketAccessTest(){

	s3.listObjects({Delimiter:"/"}, function(err, data){
		console.log(err,data);
	})
}

//file upload
function uploadToS3(blob) {
	key = encodeURIComponent('tmp') + '/';
	var parm = {Key:key + "voiceRecord.wav", Body:blob};
	var options = {partSize: 10 * 1024 * 1024, queueSize: 1};
	s3.upload(parm,options, function(err, data){
		if(err == null){
			console.log("success upload file")
		}
	})
}