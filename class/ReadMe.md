# Pre-requirements for voice recognition
<br>
<br>
My Environment : Python3, MacOS ( or UBUNTU )<br>
1. Install pyaudio using pip3 if you not already listener service for microphone.

> pip install --upgrade pyaudio <br>
> pip install --upgrade google_cloud_speech -t google_cloud_speech/.

<br>2. Note that if you can't install pyaudio, should be prepared to portaudio. please, follow step below.

> apt install portaudio

<br>3. Note that if you use version 2 of python, you have to insert to "from \_\_future__ import division"
<br>4. This script need to adding path of 'voice_recognition.py' into 'voice_recognition_service.py'.

> import sys
> sys.path.append('./google_cloud_speech')
