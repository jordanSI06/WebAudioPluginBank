
// Events
// init() once the page has finished loading.
window.onload = init;
var lastDrawTime = -1;
var kNumInstruments = 6; //Tom 1, Tom2, Tom 3, Hi-Hat...
var kInitialKitIndex = 10;
var kMaxSwing = .08;

var beatReset = { "kitIndex": 0, "tempo": 100, "swingFactor": 0, "kickPitchVal": 0.5, "snarePitchVal": 0.5, "hihatPitchVal": 0.5, "tom1PitchVal": 0.5, "tom2PitchVal": 0.5, "tom3PitchVal": 0.5, "rhythm1": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "rhythm2": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "rhythm3": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "rhythm4": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "rhythm5": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "rhythm6": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
var beatInitial = { "kitIndex": 11, "tempo": 100, "swingFactor": 0, "kickPitchVal": 0.46478873239436624, "snarePitchVal": 0.45070422535211263, "hihatPitchVal": 0.15492957746478875, "tom1PitchVal": 0.7183098591549295, "tom2PitchVal": 0.704225352112676, "tom3PitchVal": 0.8028169014084507, "rhythm1": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "rhythm2": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "rhythm3": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "rhythm4": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "rhythm5": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "rhythm6": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };

function cloneBeat(source) {
    var beat = new Object();

    beat.kitIndex = source.kitIndex;
    beat.tempo = source.tempo;
    beat.swingFactor = source.swingFactor;
    beat.kickPitchVal = source.kickPitchVal;
    beat.snarePitchVal = source.snarePitchVal;
    beat.hihatPitchVal = source.hihatPitchVal;
    beat.tom1PitchVal = source.tom1PitchVal;
    beat.tom2PitchVal = source.tom2PitchVal;
    beat.tom3PitchVal = source.tom3PitchVal;
    beat.rhythm1 = source.rhythm1.slice(0);        // slice(0) is an easy way to copy the full array
    beat.rhythm2 = source.rhythm2.slice(0);
    beat.rhythm3 = source.rhythm3.slice(0);
    beat.rhythm4 = source.rhythm4.slice(0);
    beat.rhythm5 = source.rhythm5.slice(0);
    beat.rhythm6 = source.rhythm6.slice(0);

    return beat;
}

// theBeat is the object representing the current beat/groove
// ... it is saved/loaded via JSON
var theBeat = cloneBeat(beatReset);

kickPitch = snarePitch = hihatPitch = tom1Pitch = tom2Pitch = tom3Pitch = 0;

var mouseCapture = null;
var mouseCaptureOffset = 0;

var loopLength = 16;
var rhythmIndex = 0;
var kMinTempo = 52;
var kMaxTempo = 180;
var noteTime = 0.0;

var instruments = ['Kick', 'Snare', 'HiHat', 'Tom1', 'Tom2', 'Tom3'];

var volumes = [0, 0.3, 1];

var kitName = [
    "R8",
    "CR78",
    "KPR77",
    "LINN",
    "Kit3",
    "Kit8",
    "Techno",
    "Stark",
    "breakbeat8",
    "breakbeat9",
    "breakbeat13",
    "acoustic-kit",
    "4OP-FM",
    "TheCheebacabra1",
    "TheCheebacabra2"
];

var kitNamePretty = [
    "Roland R-8",
    "Roland CR-78",
    "Korg KPR-77",
    "LinnDrum",
    "Kit 3",
    "Kit 8",
    "Techno",
    "Stark",
    "Breakbeat 8",
    "Breakbeat 9",
    "Breakbeat 13",
    "Acoustic Kit",
    "4OP-FM",
    "The Cheebacabra 1",
    "The Cheebacabra 2"
];

function Kit(name) {
    this.name = name;
    this.pathName = function () {
        var pathName = "mididrum/sounds/drum-samples/" + this.name + "/";
        return pathName;
    };

    this.kickBuffer = 0;
    this.snareBuffer = 0;
    this.hihatBuffer = 0;

    this.instrumentCount = kNumInstruments;
    this.instrumentLoadCount = 0;

    this.startedLoading = false;
    this.isLoaded = false;

    this.demoIndex = -1;
}

Kit.prototype.setDemoIndex = function (index) {
    this.demoIndex = index;
}

Kit.prototype.load = function () {
    if (this.startedLoading)
        return;

    this.startedLoading = true;

    var pathName = this.pathName();

    var kickPath = pathName + "kick.wav";
    var snarePath = pathName + "snare.wav";
    var hihatPath = pathName + "hihat.wav";
    var tom1Path = pathName + "tom1.wav";
    var tom2Path = pathName + "tom2.wav";
    var tom3Path = pathName + "tom3.wav";

    //put to true to have sound position in function to the click position on drumMachine
    this.loadSample(0, kickPath, false);
    this.loadSample(1, snarePath, false);
    this.loadSample(2, hihatPath, false);
    this.loadSample(3, tom1Path, false);
    this.loadSample(4, tom2Path, false);
    this.loadSample(5, tom3Path, false);
}

var decodedFunctions = [
    function (buffer) { this.kickBuffer = buffer; },
    function (buffer) { this.snareBuffer = buffer; },
    function (buffer) { this.hihatBuffer = buffer; },
    function (buffer) { this.tom1 = buffer; },
    function (buffer) { this.tom2 = buffer; },
    function (buffer) { this.tom3 = buffer; }];

Kit.prototype.loadSample = function (sampleID, url) {
    // Load asynchronously

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var kit = this;

    request.onload = function () {
        context.decodeAudioData(request.response, decodedFunctions[sampleID].bind(kit));

        kit.instrumentLoadCount++;
        if (kit.instrumentLoadCount == kit.instrumentCount) {
            kit.isLoaded = true;

            if (kit.demoIndex != -1) {
                beatInitial.setKitLoaded();
            }
        }
    }

    request.send();
}


function startLoadingAssets() {

    // Initialize drum kits
    var numKits = kitName.length;
    kits = new Array(numKits);
    for (var i = 0; i < numKits; i++) {
        kits[i] = new Kit(kitName[i]);
    }

    // Start loading the assets used by the presets first, in order of the presets.
    for (var demoIndex = 0; demoIndex < 2; ++demoIndex) {
        var kit = kits[beatInitial.kitIndex];
        kit.setDemoIndex(demoIndex);
        kit.load();
    }

    // Then load the remaining assets.
    // Note that any assets which have previously started loading will be skipped over.
    for (var i = 0; i < numKits; i++) {
        kits[i].load();
    }



    // Setup initial drumkit
    currentKit = kits[kInitialKitIndex];
}



// This gets rid of the loading spinner in each of the demo buttons.
function showDemoAvailable(demoIndex /* zero-based */) {

    showPlayAvailable();
    loadBeat(beatInitial);

}

// This gets rid of the loading spinner on the play button.
function showPlayAvailable() {
    var play = document.getElementById("play");
    play.src = "mididrum/images/btn_play.png";
}

function init() {
    // Let the beat demos know when all of their assets have been loaded.
    // Add some new methods to support this.
    beatInitial.isKitLoaded = false;

    beatInitial.setKitLoaded = function () {
        this.isKitLoaded = true;
        this.checkIsLoaded();
    };



    beatInitial.checkIsLoaded = function () {
        if (this.isLoaded()) {
            showDemoAvailable(this.index);
        }
    };

    beatInitial.isLoaded = function () {
        return this.isKitLoaded;
    };

    startLoadingAssets();

    // NOTE: THIS NOW RELIES ON THE MONKEYPATCH LIBRARY TO LOAD
    // IN CHROME AND SAFARI (until they release unprefixed)
    context = new AudioContext();

    var finalMixNode;
    if (context.createDynamicsCompressor) {
        // Create a dynamics compressor to sweeten the overall mix.
        compressor = context.createDynamicsCompressor();
        compressor.connect(context.destination);
        finalMixNode = compressor;
    } else {
        // No compressor available in this implementation.
        finalMixNode = context.destination;
    }

    // create master filter node
    filterNode = context.createBiquadFilter();
    filterNode.type = "lowpass";
    filterNode.frequency.value = 0.5 * context.sampleRate;
    filterNode.Q.value = 1;
    filterNode.connect(finalMixNode);

    // Create master volume.
    masterGainNode = context.createGain();
    masterGainNode.gain.value = 0.7; // reduce overall volume to avoid clipping
    masterGainNode.connect(filterNode);

    var elKitCombo = document.getElementById('kitcombo');
    elKitCombo.addEventListener("mousedown", handleKitComboMouseDown, true);



    document.body.addEventListener("mousedown", handleBodyMouseDown, true);

    initControls();
    updateControls();

    var timerWorkerBlob = new Blob([
        "var timeoutID=0;function schedule(){timeoutID=setTimeout(function(){postMessage('schedule'); schedule();},100);} onmessage = function(e) { if (e.data == 'start') { if (!timeoutID) schedule();} else if (e.data == 'stop') {if (timeoutID) clearTimeout(timeoutID); timeoutID=0;};}"]);

    // Obtain a blob URL reference to our worker 'file'.
    var timerWorkerBlobURL = window.URL.createObjectURL(timerWorkerBlob);

    timerWorker = new Worker(timerWorkerBlobURL);
    timerWorker.onmessage = function (e) {
        schedule();
    };
    timerWorker.postMessage('init'); // Start the worker.

}

function initControls() {
    // Initialize note buttons
    initButtons();
    makeKitList();


    // sliders

    document.getElementById('tom1_thumb').addEventListener('mousedown', handleSliderMouseDown, true);
    document.getElementById('tom2_thumb').addEventListener('mousedown', handleSliderMouseDown, true);
    document.getElementById('tom3_thumb').addEventListener('mousedown', handleSliderMouseDown, true);
    document.getElementById('hihat_thumb').addEventListener('mousedown', handleSliderMouseDown, true);
    document.getElementById('snare_thumb').addEventListener('mousedown', handleSliderMouseDown, true);
    document.getElementById('kick_thumb').addEventListener('mousedown', handleSliderMouseDown, true);
    document.getElementById('swing_thumb').addEventListener('mousedown', handleSliderMouseDown, true);




    // tool buttons
    document.getElementById('play').addEventListener('mousedown', handlePlay, true);
    document.getElementById('stop').addEventListener('mousedown', handleStop, true);
    document.getElementById('save').addEventListener('mousedown', handleSave, true);
    document.getElementById('save_ok').addEventListener('mousedown', handleSaveOk, true);
    document.getElementById('load').addEventListener('mousedown', handleLoad, true);
    document.getElementById('load_ok').addEventListener('mousedown', handleLoadOk, true);
    document.getElementById('load_cancel').addEventListener('mousedown', handleLoadCancel, true);
    document.getElementById('reset').addEventListener('mousedown', handleReset, true);

    var elBody = document.getElementById('body');
    elBody.addEventListener('mousemove', handleMouseMove, true);
    elBody.addEventListener('mouseup', handleMouseUp, true);

    document.getElementById('tempoinc').addEventListener('mousedown', tempoIncrease, true);
    document.getElementById('tempodec').addEventListener('mousedown', tempoDecrease, true);
}

function initButtons() {
    var elButton;

    for (i = 0; i < loopLength; ++i) {
        for (j = 0; j < kNumInstruments; j++) {
            elButton = document.getElementById(instruments[j] + '_' + i);
            elButton.addEventListener("mousedown", handleButtonMouseDown, true);
        }
    }
}


function makeKitList() {
    var elList = document.getElementById('kitlist');
    var numKits = kitName.length;

    for (var i = 0; i < numKits; i++) {
        var elItem = document.createElement('li');
        elItem.innerHTML = kitNamePretty[i];
        elList.appendChild(elItem);
        elItem.addEventListener("mousedown", handleKitMouseDown, true);
    }
}

function advanceNote() {
    // Advance time by a 16th note...
    var secondsPerBeat = 60.0 / theBeat.tempo;

    rhythmIndex++;
    if (rhythmIndex == loopLength) {
        rhythmIndex = 0;
    }

    // apply swing    
    if (rhythmIndex % 2) {
        noteTime += (0.25 + kMaxSwing * theBeat.swingFactor) * secondsPerBeat;
    } else {
        noteTime += (0.25 - kMaxSwing * theBeat.swingFactor) * secondsPerBeat;
    }
}

function playNote(buffer, pan, x, y, z, sendGain, mainGain, playbackRate, noteTime) {
    // Create the note
    var voice = context.createBufferSource();
    voice.buffer = buffer;
    voice.playbackRate.value = playbackRate;

    // Optionally, connect to a panner
    var finalNode;
    if (pan) {
        var panner = context.createPanner();
        panner.panningModel = "HRTF";
        voice.connect(panner);
        finalNode = panner;
    } else {
        finalNode = voice;
    }

    // Connect to dry mix
    var dryGainNode = context.createGain();
    dryGainNode.gain.value = mainGain;
    finalNode.connect(dryGainNode);
    dryGainNode.connect(masterGainNode);

    // Connect to wet mix
    var wetGainNode = context.createGain();
    wetGainNode.gain.value = sendGain;
    finalNode.connect(wetGainNode);

    voice.start(noteTime);
}

function schedule() {
    var currentTime = context.currentTime;

    // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
    currentTime -= startTime;

    while (noteTime < currentTime + 0.120) {
        // Convert noteTime to context time.
        var contextPlayTime = noteTime + startTime;

        // Kick
        if (theBeat.rhythm1[rhythmIndex] && instrumentActive[0]) {
            playNote(currentKit.kickBuffer, false, 0, 0, -2, 0.5, volumes[theBeat.rhythm1[rhythmIndex]] * 1.0, kickPitch, contextPlayTime);
        }

        // Snare
        if (theBeat.rhythm2[rhythmIndex] && instrumentActive[1]) {
            playNote(currentKit.snareBuffer, false, 0, 0, -2, 1, volumes[theBeat.rhythm2[rhythmIndex]] * 0.6, snarePitch, contextPlayTime);
        }

        // Hihat
        if (theBeat.rhythm3[rhythmIndex] && instrumentActive[2]) {
            // Pan the hihat according to sequence position.
            playNote(currentKit.hihatBuffer, true, 0.5 * rhythmIndex - 4, 0, -1.0, 1, volumes[theBeat.rhythm3[rhythmIndex]] * 0.7, hihatPitch, contextPlayTime);
        }

        // Toms    
        if (theBeat.rhythm4[rhythmIndex] && instrumentActive[3]) {
            playNote(currentKit.tom1, false, 0, 0, -2, 1, volumes[theBeat.rhythm4[rhythmIndex]] * 0.6, tom1Pitch, contextPlayTime);
        }

        if (theBeat.rhythm5[rhythmIndex] && instrumentActive[4]) {
            playNote(currentKit.tom2, false, 0, 0, -2, 1, volumes[theBeat.rhythm5[rhythmIndex]] * 0.6, tom2Pitch, contextPlayTime);
        }

        if (theBeat.rhythm6[rhythmIndex] && instrumentActive[5]) {
            playNote(currentKit.tom3, false, 0, 0, -2, 1, volumes[theBeat.rhythm6[rhythmIndex]] * 0.6, tom3Pitch, contextPlayTime);
        }


        // Attempt to synchronize drawing time with sound
        if (noteTime != lastDrawTime) {
            lastDrawTime = noteTime;
            drawPlayhead((rhythmIndex + 15) % 16);
        }

        advanceNote();
    }
}

function playDrum(noteNumber, velocity) {
    switch (noteNumber) {
        case 0x24:
            playNote(currentKit.kickBuffer, false, 0, 0, -2, 0.5, (velocity / 127), kickPitch, 0);
            break;
        case 0x26:
            playNote(currentKit.snareBuffer, false, 0, 0, -2, 1, (velocity / 127), snarePitch, 0);
            break;
        case 0x28:
            playNote(currentKit.hihatBuffer, true, 0, 0, -1.0, 1, (velocity / 127), hihatPitch, 0);
            break;
        case 0x2d:
            playNote(currentKit.tom1, false, 0, 0, -2, 1, (velocity / 127), tom1Pitch, 0);
            break;
        case 0x2f:
            playNote(currentKit.tom2, false, 0, 0, -2, 1, (velocity / 127), tom2Pitch, 0);
            break;
        case 0x32:
            playNote(currentKit.tom3, false, 0, 0, -2, 1, (velocity / 127), tom3Pitch, 0);
            break;
        default:
            console.log("note:0x" + noteNumber.toString(16));
    }
}


function tempoIncrease() {
    theBeat.tempo = Math.min(kMaxTempo, theBeat.tempo + 2);
    document.getElementById('tempo').innerHTML = theBeat.tempo;
}

function tempoDecrease() {
    theBeat.tempo = Math.max(kMinTempo, theBeat.tempo - 2);
    document.getElementById('tempo').innerHTML = theBeat.tempo;
}

function handleSliderMouseDown(event) {
    mouseCapture = event.target.id;
    // calculate offset of mousedown on slider
    var el = event.target;
    if (mouseCapture == 'swing_thumb') {
        var thumbX = 0;
        do {
            thumbX += el.offsetLeft;
        } while (el = el.offsetParent);

        mouseCaptureOffset = event.pageX - thumbX;
    } else {
        var thumbY = 0;
        do {
            thumbY += el.offsetTop;
        } while (el = el.offsetParent);

        mouseCaptureOffset = event.pageY - thumbY;
    }
}


function handleMouseMove(event) {
    if (!mouseCapture) return;
    var elThumb = document.getElementById(mouseCapture);
    var elTrack = elThumb.parentNode;
    if (mouseCapture != 'swing_thumb') {
        var thumbH = elThumb.clientHeight;
        var trackH = elTrack.clientHeight;
        var travelH = trackH - thumbH;

        var trackY = 0;
        var el = elTrack;
        do {
            trackY += el.offsetTop;
        } while (el = el.offsetParent);

        var offsetY = Math.max(0, Math.min(travelH, event.pageY - mouseCaptureOffset - trackY));
        var value = 1.0 - offsetY / travelH;
        elThumb.style.top = travelH * (1.0 - value) + 'px';
    } else {
        var thumbW = elThumb.clientWidth;
        var trackW = elTrack.clientWidth;
        var travelW = trackW - thumbW;

        var trackX = 0;
        var el = elTrack;
        do {
            trackX += el.offsetLeft;
        } while (el = el.offsetParent);

        var offsetX = Math.max(0, Math.min(travelW, event.pageX - mouseCaptureOffset - trackX));
        var value = offsetX / travelW;
        elThumb.style.left = travelW * value + 'px';
    }

    sliderSetValue(mouseCapture, value);
}

function handleMouseUp() {
    mouseCapture = null;
}

function sliderSetValue(slider, value) {
    var pitchRate = Math.pow(2.0, 2.0 * (value - 0.5));

    switch (slider) {
        case 'kick_thumb':
            theBeat.kickPitchVal = value;
            kickPitch = pitchRate;
            break;
        case 'snare_thumb':
            theBeat.snarePitchVal = value;
            snarePitch = pitchRate;
            break;
        case 'hihat_thumb':
            theBeat.hihatPitchVal = value;
            hihatPitch = pitchRate;
            break;
        case 'tom1_thumb':
            theBeat.tom1PitchVal = value;
            tom1Pitch = pitchRate;
            break;
        case 'tom2_thumb':
            theBeat.tom2PitchVal = value;
            tom2Pitch = pitchRate;
            break;
        case 'tom3_thumb':
            theBeat.tom3PitchVal = value;
            tom3Pitch = pitchRate;
            break;
        case 'swing_thumb':
            theBeat.swingFactor = value;
            break;
    }
}



function handleButtonMouseDown(event) {
    var notes = theBeat.rhythm1;

    var instrumentIndex;
    var rhythmIndex;

    var elId = event.target.id;
    rhythmIndex = elId.substr(elId.indexOf('_') + 1, 2);
    instrumentIndex = instruments.indexOf(elId.substr(0, elId.indexOf('_')));

    switch (instrumentIndex) {
        case 0: notes = theBeat.rhythm1; break;
        case 1: notes = theBeat.rhythm2; break;
        case 2: notes = theBeat.rhythm3; break;
        case 3: notes = theBeat.rhythm4; break;
        case 4: notes = theBeat.rhythm5; break;
        case 5: notes = theBeat.rhythm6; break;
    }

    notes[rhythmIndex] = (notes[rhythmIndex] + 1) % 3;

    if (instrumentIndex == currentlyActiveInstrument)
        showCorrectNote(rhythmIndex, notes[rhythmIndex]);

    drawNote(notes[rhythmIndex], rhythmIndex, instrumentIndex);

    var note = notes[rhythmIndex];

    if (note) {
        switch (instrumentIndex) {
            //put to true to have sound position in function to the click position on drumMachine
            case 0:  // Kick
                playNote(currentKit.kickBuffer, false, 0, 0, -2, 0.5 * 1, volumes[note] * 1.0, kickPitch, 0);
                break;

            case 1:  // Snare
                playNote(currentKit.snareBuffer, false, 0, 0, -2, 1, volumes[note] * 0.6, snarePitch, 0);
                break;

            case 2:  // Hihat
                // Pan the hihat according to sequence position.
                playNote(currentKit.hihatBuffer, false, 0.5 * rhythmIndex - 4, 0, -1.0, 1, volumes[note] * 0.7, hihatPitch, 0);
                break;

            case 3:  // Tom 1   
                playNote(currentKit.tom1, false, 0, 0, -2, 1, volumes[note] * 0.6, tom1Pitch, 0);
                break;

            case 4:  // Tom 2   
                playNote(currentKit.tom2, false, 0, 0, -2, 1, volumes[note] * 0.6, tom2Pitch, 0);
                break;

            case 5:  // Tom 3   
                playNote(currentKit.tom3, false, 0, 0, -2, 1, volumes[note] * 0.6, tom3Pitch, 0);
                break;
        }
    }
}

function handleKitComboMouseDown(event) {
    document.getElementById('kitcombo').classList.toggle('active');
}

function handleKitMouseDown(event) {
    var index = kitNamePretty.indexOf(event.target.innerHTML);
    theBeat.kitIndex = index;
    currentKit = kits[index];
    document.getElementById('kitname').innerHTML = kitNamePretty[index];
}

function handleBodyMouseDown(event) {
    var elKitcombo = document.getElementById('kitcombo');

    if (elKitcombo.classList.contains('active') && !isDescendantOfId(event.target, 'kitcombo_container')) {
        elKitcombo.classList.remove('active');
    }


}

function isDescendantOfId(el, id) {
    if (el.parentElement) {
        if (el.parentElement.id == id) {
            return true;
        } else {
            return isDescendantOfId(el.parentElement, id);
        }
    } else {
        return false;
    }
}

function handlePlay(event) {
    noteTime = 0.0;
    startTime = context.currentTime + 0.005;
    schedule();
    timerWorker.postMessage("start");

    document.getElementById('play').classList.add('playing');
    document.getElementById('stop').classList.add('playing');
    if (midiOut) {
        // turn off the play button
        midiOut.send([0x80, 3, 32]);
        // light up the stop button
        midiOut.send([0x90, 7, 1]);
    }
}

function handleStop(event) {
    timerWorker.postMessage("stop");

    var elOld = document.getElementById('LED_' + (rhythmIndex + 14) % 16);
    elOld.src = 'mididrum/images/LED_off.png';

    hideBeat((rhythmIndex + 14) % 16);

    rhythmIndex = 0;

    document.getElementById('play').classList.remove('playing');
    document.getElementById('stop').classList.remove('playing');
    if (midiOut) {
        // light up the play button
        midiOut.send([0x90, 3, 32]);
        // turn off the stop button
        midiOut.send([0x80, 7, 1]);
    }
}

function handleSave(event) {
    toggleSaveContainer();
    var elTextarea = document.getElementById('save_textarea');
    elTextarea.value = JSON.stringify(theBeat);
}

function handleSaveOk(event) {
    toggleSaveContainer();
}

function handleLoad(event) {
    toggleLoadContainer();
}

function handleLoadOk(event) {
    var elTextarea = document.getElementById('load_textarea');
    theBeat = JSON.parse(elTextarea.value);

    // Set drumkit
    currentKit = kits[theBeat.kitIndex];
    document.getElementById('kitname').innerHTML = kitNamePretty[theBeat.kitIndex];



    sliderSetValue('kick_thumb', theBeat.kickPitchVal);
    sliderSetValue('snare_thumb', theBeat.snarePitchVal);
    sliderSetValue('hihat_thumb', theBeat.hihatPitchVal);
    sliderSetValue('tom1_thumb', theBeat.tom1PitchVal);
    sliderSetValue('tom2_thumb', theBeat.tom2PitchVal);
    sliderSetValue('tom3_thumb', theBeat.tom3PitchVal);
    sliderSetValue('swing_thumb', theBeat.swingFactor);

    // Clear out the text area post-processing
    elTextarea.value = '';

    toggleLoadContainer();
    updateControls();
}

function handleLoadCancel(event) {
    toggleLoadContainer();
}

function toggleSaveContainer() {
    document.getElementById('pad').classList.toggle('active');
    document.getElementById('params').classList.toggle('active');
    document.getElementById('tools').classList.toggle('active');
    document.getElementById('save_container').classList.toggle('active');
}

function toggleLoadContainer() {
    document.getElementById('pad').classList.toggle('active');
    document.getElementById('params').classList.toggle('active');
    document.getElementById('tools').classList.toggle('active');
    document.getElementById('load_container').classList.toggle('active');
}

function handleReset(event) {
    handleStop();
    loadBeat(beatReset);
}

function loadBeat(beat) {
    // Check that assets are loaded.
    if (beat != beatReset && !beat.isLoaded())
        return false;

    handleStop();

    theBeat = cloneBeat(beat);
    currentKit = kits[theBeat.kitIndex];

    // apply values from sliders
    sliderSetValue('kick_thumb', theBeat.kickPitchVal);
    sliderSetValue('snare_thumb', theBeat.snarePitchVal);
    sliderSetValue('hihat_thumb', theBeat.hihatPitchVal);
    sliderSetValue('tom1_thumb', theBeat.tom1PitchVal);
    sliderSetValue('tom2_thumb', theBeat.tom2PitchVal);
    sliderSetValue('tom3_thumb', theBeat.tom3PitchVal);
    sliderSetValue('swing_thumb', theBeat.swingFactor);

    updateControls();
    setActiveInstrument(0);

    return true;
}

function updateControls() {
    for (var i = 0; i < this.params.loopLength; ++i) {
        for (var j = 0; j < this.params.kNumInstruments; j++) {
            switch (j) {
                case 0: this.params.notes = this.params.theBeat.rhythm1; break;
                case 1: this.params.notes = this.params.theBeat.rhythm2; break;
                case 2: this.params.notes = this.params.theBeat.rhythm3; break;
                case 3: this.params.notes = this.params.theBeat.rhythm4; break;
                case 4: this.params.notes = this.params.theBeat.rhythm5; break;
                case 5: this.params.notes = this.params.theBeat.rhythm6; break;
            }

            this.gui._root.drawNote(this.params.notes[i], i, j);
        }
    }

    this.gui._root.getElementById('kitname').innerHTML = this.params.kitNamePretty[this.params.theBeat.kitIndex];

    this.gui._root.getElementById('tempo').innerHTML = this.params.theBeat.tempo;
}


function drawNote(draw, xindex, yindex) {
    var elButton = document.getElementById(instruments[yindex] + '_' + xindex);
    switch (draw) {
        case 0: elButton.src = 'mididrum/images/button_off.png'; break;
        case 1: elButton.src = 'mididrum/images/button_half.png'; break;
        case 2: elButton.src = 'mididrum/images/button_on.png'; break;
    }
}

function drawPlayhead(xindex) {
    var lastIndex = (xindex + 15) % 16;

    var elNew = document.getElementById('LED_' + xindex);
    var elOld = document.getElementById('LED_' + lastIndex);

    elNew.src = 'mididrum/images/LED_on.png';
    elOld.src = 'mididrum/images/LED_off.png';

    hideBeat(lastIndex);
    showBeat(xindex);
}

function filterFrequencyFromCutoff(cutoff) {
    var nyquist = 0.5 * context.sampleRate;

    // spreads over a ~ten-octave range, from 20Hz - 20kHz.
    var filterFrequency = Math.pow(2, (11 * cutoff)) * 40;

    if (filterFrequency > nyquist)
        filterFrequency = nyquist;
    return filterFrequency;
}

function setFilterCutoff(cutoff) {
    if (filterNode)
        filterNode.frequency.value = filterFrequencyFromCutoff(cutoff);
}

function setFilterQ(Q) {
    if (filterNode)
        filterNode.Q.value = Q;
}
