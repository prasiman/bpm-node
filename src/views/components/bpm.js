import MusicTempo from "music-tempo";

var pars = {
    minBeatInterval: 0,
    maxBeatInterval: 0
}

var calcTempo = function (buffer) {
    var audioData = [];
    // Take the average of the two channels 
    if (buffer.numberOfChannels === 2) {
        var channel1Data = buffer.getChannelData(0);
        var channel2Data = buffer.getChannelData(1);
        var length = channel1Data.length;
        for (var i = 0; i < length; i++) {
            audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
        }
    } else {
        audioData = buffer.getChannelData(0);
    }
    audioCtx.close().then(function () {
        var mt = new MusicTempo(audioData, pars);
        tempo = mt.tempo;
    });
}

var tempo, audioCtx, file;

export default class BPM {

    constructor(fileInput, pars) {
        this.setBeatInterval(pars);
        file = fileInput.files;
    }

    doCalculate() {
        audioCtx = new AudioContext();
        if (file.length === 0) {
            audioCtx.close();
            return;
        }
        var reader = new FileReader();
        reader.onload = function (fileEvent) {
            audioCtx.decodeAudioData(fileEvent.target.result, calcTempo);
        }
        reader.readAsArrayBuffer(file[0]);
    }

    setBeatInterval(obj) {
        pars.minBeatInterval = obj.min;
        pars.maxBeatInterval = obj.max;
    }

    getTempoValue() {
        return tempo;
    }
}