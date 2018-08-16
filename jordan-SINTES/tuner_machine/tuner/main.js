/*  ################################## TUNER ########################################  */

/* ES6 web audio class following the API standard
* Author : Jordan Sintes
* Comment: Based on the the pitch detecotr here: https://webaudiodemos.appspot.com/pitchdetect/index.html
*/
window.TunerMachine = class TunerMachine extends WebAudioPluginCompositeNode {
    constructor(ctx, URL, options) {
        super(ctx, URL, options)
        /*    ################     API PROPERTIES    ###############   */

        this.options = options;
        this.state;
        this.params = { "status": "disable" }
        super.setup();

        this.analyser = null;
        this.DEBUGCANVAS = null;
        this.mediaStreamSource = null;
        this.rafID = null,
        this.tracks = null;
        this.buflen = 1024;
        this.buf = new Float32Array(this.buflen);
        this.noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        this.MIN_SAMPLES = 0;
        this.GOOD_ENOUGH_CORRELATION = 0.9; 
        
    }

    /*    ################     API METHODS    ###############   */
    getPatch(index) {
        console.warn("this module does not implements patches use getState / setState to get an array of current params values ");
    }
    setPatch(data, index) {
        console.warn("this module does not implements patches use getState / setState to get an array of current params values ");
    }

    setParam(key, value) {
        console.log(key, value);
        try {
            this[key] = (value);
        } catch (error) {
            console.warn(key, error);
            console.warn("this plugin does not implement this param")
        }
    }

    get numberOfOutputs() {
        return 0;
    }

    createNodes() {
        this.dryGainNode = this.context.createGain();
        this.bandPass = this.context.createBiquadFilter();
        this.analyser = this.context.createAnalyser();

        this.bandPass.gain.value = 1;
    }

    connectNodes() {
        this._input.connect(this.dryGainNode);
        this.dryGainNode.connect(this.bandPass);
    }

    /*  #########  Personnal code for Tuner  #########   */
    set status(_sig) {
        if (_sig === "enable") {
            this.params.status = "enable";
            this.toggleLiveInput();
            console.log("Tuner is on");
        }

        else if (_sig === "disable") {
            this.params.status = "disable"
            console.log("Tuner is off");
        }
    }

    toggleLiveInput() {
        this.getUserMedia(
            {
                "audio": {
                    "mandatory": {
                        "googEchoCancellation": "false",
                        "googAutoGainControl": "false",
                        "googNoiseSuppression": "false",
                        "googHighpassFilter": "false"
                    },
                    "optional": []
                },
            }, gotStream().apply(this));
            function gotStream(stream) {
                // Create an AudioNode from the stream.
                 mediaStreamSource = this.context.createMediaStreamSource(stream);
            
                // Connect it to the destination.
                this.analyser = this.context.createAnalyser();
                this.analyser.fftSize = 2048;
                this.mediaStreamSource.connect( this.analyser );
                this.updatePitch();
                console.log("ok");
            }
    }

   

    getUserMedia(dictionary, callback) {
        try {
            navigator.getUserMedia = 
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;
            navigator.getUserMedia(dictionary, callback, () => console.log("Stream generation failed"));
        } catch (e) {
            alert('getUserMedia threw exception :' + e);
        }
    }
    
    gotStream(stream) {
        // Create an AudioNode from the stream.
        this.options.mediaStreamSource = this.context.createMediaStreamSource(stream);
    
        // Connect it to the destination.
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = 2048;
        this.mediaStreamSource.connect( this.analyser );
        this.updatePitch();
        console.log("ok");
    }

    autoCorrelate( buf, sampleRate ) {
        var SIZE = buf.length;
        var MAX_SAMPLES = Math.floor(SIZE/2);
        var best_offset = -1;
        var best_correlation = 0;
        var rms = 0;
        var foundGoodCorrelation = false;
        var correlations = new Array(MAX_SAMPLES);
    
        for (var i=0;i<SIZE;i++) {
            var val = buf[i];
            rms += val*val;
        }
        rms = Math.sqrt(rms/SIZE);
        if (rms<0.01) // not enough signal
            return -1;
    
        var lastCorrelation=1;
        for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
            var correlation = 0;
    
            for (var i=0; i<MAX_SAMPLES; i++) {
                correlation += Math.abs((buf[i])-(buf[i+offset]));
            }
            correlation = 1 - (correlation/MAX_SAMPLES);
            correlations[offset] = correlation; // store it, for the tweaking we need to do below.
            if ((correlation>GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
                foundGoodCorrelation = true;
                if (correlation > best_correlation) {
                    best_correlation = correlation;
                    best_offset = offset;
                }
            } else if (foundGoodCorrelation) {
                // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
                // Now we need to tweak the offset - by interpolating between the values to the left and right of the
                // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
                // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
                // (anti-aliased) offset.
    
                // we know best_offset >=1, 
                // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
                // we can't drop into this clause until the following pass (else if).
                var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
                return sampleRate/(best_offset+(8*shift));
            }
            lastCorrelation = correlation;
        }
        if (best_correlation > 0.01) {
            // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
            return sampleRate/best_offset;
        }
        return -1;
    //	var best_frequency = sampleRate/best_offset;
    }
    
    updatePitch( time ) {
        this.analyser.getFloatTimeDomainData( buf );
        var ac = autoCorrelate( buf, audioContext.sampleRate );
        // TODO: Paint confidence meter on canvasElem here.
    
        if (this.DEBUGCANVAS) {  // This draws the current waveform, useful for debugging
            waveCanvas.clearRect(0,0,512,256);
            waveCanvas.strokeStyle = "red";
            waveCanvas.beginPath();
            waveCanvas.moveTo(0,0);
            waveCanvas.lineTo(0,256);
            waveCanvas.moveTo(128,0);
            waveCanvas.lineTo(128,256);
            waveCanvas.moveTo(256,0);
            waveCanvas.lineTo(256,256);
            waveCanvas.moveTo(384,0);
            waveCanvas.lineTo(384,256);
            waveCanvas.moveTo(512,0);
            waveCanvas.lineTo(512,256);
            waveCanvas.stroke();
            waveCanvas.strokeStyle = "black";
            waveCanvas.beginPath();
            waveCanvas.moveTo(0,buf[0]);
            for (var i=1;i<512;i++) {
                waveCanvas.lineTo(i,128+(buf[i]*128));
            }
            waveCanvas.stroke();
        }
    
         if (ac == -1) {
             detectorElem.className = "vague";
             pitchElem.innerText = "--";
            noteElem.innerText = "-";
            detuneElem.className = "";
            detuneAmount.innerText = "--";
         } else {
             detectorElem.className = "confident";
             pitch = ac;
             pitchElem.innerText = Math.round( pitch ) ;
             var note =  noteFromPitch( pitch );
            noteElem.innerHTML = noteStrings[note%12];
            var detune = centsOffFromPitch( pitch, note );
            if (detune == 0 ) {
                detuneElem.className = "";
                detuneAmount.innerHTML = "--";
            } else {
                if (detune < 0)
                    detuneElem.className = "flat";
                else
                    detuneElem.className = "sharp";
                detuneAmount.innerHTML = Math.abs( detune );
            }
        }
    
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = window.webkitRequestAnimationFrame;
        rafID = window.requestAnimationFrame( updatePitch );
    }


}

//////////////////////////////////////////////////////////////////////////////////////////

window.WasabiTunerMachine = class WasabiTunerMachine extends WebAudioPluginFactory {
    constructor(context, baseUrl) { super(context, baseUrl); }
}

//////////////////////////////////////////////////////////////////////////////////////////

AudioContext.prototype.createWasabiDelayCompositeNode = OfflineAudioContext.prototype.createWasabiDelayCompositeNode = function (options) { return new TunerMachine(this, options); };