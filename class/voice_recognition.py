import re, sys, os
from six.moves import queue

#Microphone streaming using python
#Recording parameter
import pyaudio


class Streaming_voice(object):
	def __init__(self, rate, chunk):
		'''
		Initation of streaming service
		'''
		self._RATE = rate
		self._CHUNK = chunk
		self._BUF = queue.Queue()
		self._listen = False

	def _collecting_data(self, in_data, frame_count, time_info, status_flags):
		#tolist = [in_data , time_info] # geometric and time
		self._BUF.put(in_data)
		return None, pyaudio.paContinue

	def __enter__(self): # start streaming
		self._audio_interface = pyaudio.PyAudio()
		self._stream = self._audio_interface.open(
			format=pyaudio.paInt16,
			channels=1,
			rate=self._RATE,
			frames_per_buffer=self._CHUNK,
			stream_callback=self._collecting_data,
			input=True
		)

		self._listen = False
		return self

	def __exit__(self): # end streaming
		self._stream.stop_stream()
		self._stream.close()
		self._listen = True
		self._BUF.put(None)
		self._audio_interface.terminate() # terminate stream of microphone


	def generator(self):
		while not self._listen:
			CHUNK = self._BUF.get()
			if CHUNK is None: return
			data = [CHUNK] # stream packet

			while True:
				try:
					cnk = self._BUF.get(block=False)
					if cnk is None: return
					data.append(cnk)
				except queue.Empty:
					break
			yield b''.join(data)
