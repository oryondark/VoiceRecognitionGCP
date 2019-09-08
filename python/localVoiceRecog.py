import os, sys, io
'''
you have to install google-cloud-speech
In this case, we can use on python3.6, but 3.7+ is not doing in lambda.
Because, AWS Lambda has a gRPC bug in python 3.7+.
'''
sys.path.append(".")
sys.path.append('./google_cloud_speech')

from google.cloud import speech
from google.cloud.speech import enums
from google.cloud.speech import types

class localVoiceRecognition():
	def __init__(self):
		self.client = speech.SpeechClient()

	def recognition(self, filePath):
		with io.open(filePath, 'rb') as f:
			content = f.read()
		audio = types.RecognitionAudio(content=content)
		config = types.RecognitionConfig(
			encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
			sample_rate_hertz=16000,
			language_code='ko-KR'
		)
		res = self.client.recognize(config, audio);
		return res