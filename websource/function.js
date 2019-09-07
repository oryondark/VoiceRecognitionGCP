
var mic_dev = navigator.mediaDevices.getUserMedia({audio: true, video: false});
console.log(mic_dev);
const recordedChunks = [];
var recordLenth = 0;
let isStop = false;

function recording() {

	alert("start recording");
	var mediaRecorder = mic_dev.then(mic_handler);
}

function mic_handler(stream){
	var context = new AudioContext();
	var input = context.createMediaStreamSource(stream)
	var processor = context.createScriptProcessor(1024,1,1);

	input.connect(processor);
	processor.connect(context.destination);

	processor.onaudioprocess = function(e){
		// Do something with the data, i.e Convert this to WAV
		recordedChunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
		recordLenth += 1024;
	};
	
	setTimeout(function(){
		input.disconnect(processor);
		processor.disconnect(context.destination);
		const downloadLink = document.getElementById('download');

		var flattenBuffer = flattenArray(recordedChunks, recordLenth);
		var view = encodingWav(flattenBuffer);
		blob = new Blob([view], {type:"audio/wav"});
		console.log("save!");
		uploadToS3(blob);
		downloadLink.href = URL.createObjectURL(blob);
		downloadLink.download = 'accepted.wav';
		downloadLink.click();
	}, 3000)
	
};

function encodingWav(flatten) {
	console.log(flatten[0]);
	var buf = new ArrayBuffer(44 + flatten.length * 2);
	var view = new DataView(buf);
	var sampleRate = 16000
	/*
	DataView is the buffer writer
	In this case, we had using setUnit32. 
	the method usage :
	argument 1 : point of buffer
	argument 2 : value
	argument 3 : set of true if you want little edian, but false in other case.
	*/
	//RIFF header
	writeToBytes(view, 0, 'RIFF'); // size of 0-3
	view.setUint32(4, 44 + (flatten.legnth * 2) - 8, true); // RIFF size 4-7
	writeToBytes(view, 8, 'WAVE'); // 8-11
	
	//FMT header
	writeToByte(view, 12, 'fmt ');
	view.setUint32(16, 16, true); // chunkSize
	view.setUint16(20, 1, true); // Format
	view.setUint16(22, 1, true); // Channel ( 1 is mono )
	view.setUint32(24, sampleRate, true); // samplerate
	view.setUint32(28, sampleRate * 4, true); // byterate ( samplerate * bytesize(4))
	view.setUint16(32, 4, true); // blockalign
	view.setUint16(34, 16, true); // per sample bits
	

	//Data header	
	writeToBytes(view, 36, 'data');
	view.setUint32(40, flatten.length * 2, true);

	// write the PCM samples
	var index = 44;
	var volume = 1;
	for (var i = 0; i < flatten.length; i++) {
		view.setInt16(index, flatten[i] * (0x7FFF * volume), true);
		index += 2;
	}
	return view
}

//String to Bytes
function writeToBytes(view, offset, string) {
	for (var i = 0; i < string.length; i++) {
		view.setUint8(offset + i, string.charCodeAt(i));
	}
}

//Concat buffer.
function flattenArray(channelBuffer, recordingLength) {
	var result = new Float32Array(recordingLength);
	var offset = 0;
	for (var i = 0; i < channelBuffer.length; i++) {
		var buffer = channelBuffer[i];
		result.set(buffer, offset);
		offset += buffer.length;
	};
	return result;
}

