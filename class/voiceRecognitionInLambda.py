import os, sys
import boto3
from localVoiceRecog import localVoiceRecognition

dynamoDB = boto3.client('dynamodb')
s3 = boto3.client('s3')

def updateDynamoDB():
	json = ''' your json code '''
	res = dynamoDB.update_item(json)

	raise "should be implemented"

def run(filePath):
	try:
		R = localVoiceRecognition()
		res = R.recognition(filePath)

		for response in res.results:
			trasncribeRes = u'{}'.format(response.alternatives[0].transcript)
			print(trasncribeRes)
	except:
		print("Can not transcribe this voice!!")

def lambda_handler(event, context):
	'''
	will be recieved a event from your bucket.
	'''
	filePath = "/tmp/wavfile.wav"

	recordName = event['Records']
	bucketName = recordName[0]['s3']['bucket']['name']
	objectName = recordName[0]['s3']['object']['key']
	with open(filePath, 'wb') as f:
		s3.download_fileobj(bucketName, objectName, f)

	run(filePath)
	return
