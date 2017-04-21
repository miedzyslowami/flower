/*
The MIT License (MIT)

Copyright (c) 2014 Chris Wilson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var audioContext = null;
var meter = null;
var rafID = null;
var cloud = document.querySelector('.cloud');
var body = document.querySelector('body');
var mediaStreamSource = null;

window.onload = function() {

    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia({
            'audio': {
                'mandatory': {
                    'googEchoCancellation': 'false',
                    'googAutoGainControl': 'false',
                    'googNoiseSuppression': 'false',
                    'googHighpassFilter': 'false'
                },
                'optional': []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

};


function didntGetStream() {
    alert('Press and hold any key to stop the cloud');
    cloud.style.left = '50vw';
    body.style.backgroundColor = 'rgb(22, 22, 72)';
    window.addEventListener('keydown', backward);
    window.addEventListener('keyup', forward);
}


function backward() {//backward clouds
    cloud.style.left = '0vw';
    body.style.backgroundColor = '';
	cloud.style.transition='left 5s ease-in';
}

function forward() {//forward clouds
    cloud.style.left = '50vw';
	cloud.style.transition='';
    body.style.backgroundColor = 'rgb(22, 22, 72)';
}

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
    move_clouds();
}

function move_clouds() {
    var volume = meter.volume * 70;
    if ((volume * 10) < 10) {
        cloud.style.left = '50vw';
        body.style.backgroundColor = 'rgb(22, 22, 72)';
    } else {
        cloud.style.left = '0vw';
        body.style.backgroundColor = '';
    }
    rafID = window.requestAnimationFrame(move_clouds);
}
//Working solution with pausing animation on voice
// function move_clouds(){
// 		var volume=meter.volume*100;
// 	if((volume*10)>10){
// 		cloud.style.animationPlayState="paused";
// 	}else{
// 			cloud.style.animationPlayState="running";
//
// 	}
//      rafID = window.requestAnimationFrame(move_clouds);
// }
