/*  ################################## PingPongDelay ########################################  */

/* ES6 web audio class following the API standard
* Author : Guillaume Etevenard
*/
window.PingPongDelay = class PingPongDelay extends WebAudioPluginCompositeNode {

  constructor(ctx,options) {
    /*    ################     API PROPERTIES    ###############   */
    super(ctx,options)
    this.state;
    this.inputs = [];
    this.outputs = [];
    
    // P2 : Json metadata
    this._metadata = {
      "name": "wasabi-PingPongDelay",
      "version": 1,
      "category": "Delay",
      "type": "Audio",
      "description": "Audio stereo delay with feedback, time and mix controls",
      "thumbnailImage": "https://...",
      "URLs": "https://.../doc",
      "authorInformation": "Guillaume Etevenard, i3s trainee in Nice - Sophia-Antipolis, France"
    }

    // P3 : Json descriptor
    this._descriptor = {
      "feedback": {
        "key": "feedback",
        "type": "linear",
        "range": {
          "min": 0,
          "max": 1
        },
        "default": 0.5,
        "unit": "",
        "label": "feedback",
        "flag": ""
      },

      "time": {
        "key": "time",
        "type": "linear",
        "range": {
          "min": 0,
          "max": 1
        },
        "default": 0.5,
        "unit": "ms",
        "label": "time",
        "flag": ""
      },

      "mix": {
        "key": "mix",
        "type": "linear",
        "range": {
          "min": 0,
          "max": 1
        },
        "default": 0.5,
        "unit": "",
        "label": "mix",
        "flag": ""
      }


    }
    // params 
    this.params = {
      "feedback": this._descriptor.feedback.default,
      "mix": this._descriptor.mix.default,
      "time": this._descriptor.time.default,
      "status": "disabled"
    }
    // p5 patchnames
    this.patchNames = ["patch1"];

    this.setup();
  }

  /*    ################     API METHODS    ###############   */

  // p9 count inputs
  inputChannelCount(){
    return this.inputs.length;
  }
  outputChannelCount(){
    return this.outputs.length;
  }
  getPatch(index) {
    return this.patchNames[index];
  }
  setPatch(data, index) {
    this.patchNames[index] = data;
  }

  getParam(key) {
    if (key == "time") {
      this.getTime();
    } else if (key == "feedback") {
      this.getFeedback();
    } else if (key == "mix") {
      this.getMix();
    } else {
      console.log("this parameter isn't used in Wasabi-PingpongDelay");
    }
  }

  setParam(key, value) {
    console.log("act");
    if (key == "time") {
      this.setTime(value);
    } else if (key == "feedback") {
      this.setFeedback(value);
    } else if (key == "mix") {
      this.setMix(value);
    } else {
      console.log("this parameter isn't used in Wasabi-PingpongDelay");
    }
  }

  // P7 state
  getState() {
    return this.params.status;

  }

  setState(data) {
    this.params.status = data;
    if (data == "enable") {
      this.connectNodes();
      this._input.disconnect(this._output);
    } else if (data == "disable") {
      this._input.disconnect(this.feedbackGainNode);
      this._input.disconnect(this.dryGainNode);
      this._input.connect(this._output);
    }
  }
  

  onMidi(msg) {
    return msg;
    //web midi api ?
  }

  /*  #########  Personnal code for the web audio graph  #########   */

  setup() {
    console.log("delay setup");
    this.createIO();
    this.createNodes();
    this.connectNodes();
    this.setInitialParamValues();
  }

  createIO(){
    this.inputs.push(this._input);
    this.outputs.push(this._output);
  }

  createNodes() {
     this.delayNodeLeft = this.context.createDelay();
     this.delayNodeRight = this.context.createDelay();
     this.dryGainNode = this.context.createGain();
     this.wetGainNode = this.context.createGain();
     this.feedbackGainNode = this.context.createGain();
    this.channelMerger = this.context.createChannelMerger(2);
  }

  connectNodes() {
    // dry mix
    this._input.connect(this.dryGainNode);
    // dry mix out
    this.dryGainNode.connect(this._output);

    // the feedback loop
     this.delayNodeLeft.connect(this.channelMerger, 0, 0);
     this.delayNodeRight.connect(this.channelMerger, 0, 1);
     
     this.feedbackGainNode.connect(this.delayNodeLeft);
     this.delayNodeRight.connect(this.feedbackGainNode);

     this.delayNodeLeft.connect(this.delayNodeRight);

    // wet mix
     this._input.connect(this.feedbackGainNode);

    // wet out
    this.channelMerger.connect(this.wetGainNode);
    this.wetGainNode.connect(this._output);
  }

  setInitialParamValues() {
    /*
     * set default value for parameters and assign it to the web audio nodes
     */
    this.setTime(this.params.time);
    this.setFeedback(this.params.feedback);
    this.setMix(this.params.mix);
  }

  getTime() {
    return this.params.time;
  }

  getMix() {
    return this.params.mix;
  }
  getFeedback() {
    return this.params.feedback;
  }



  // delay tools


  /*
      *
      *Tools to build sounds 
      */

  isNumber(arg) {
    return toString.call(arg) === '[object Number]' && arg === +arg;
  }

  getDryLevel(mix) {
    if (!this.isNumber(mix) || mix > 1 || mix < 0)
      return 0;

    if (mix <= 0.5)
      return 1;

    return 1 - ((mix - 0.5) * 2);
  }

  getWetLevel(mix) {
    if (!this.isNumber(mix) || mix > 1 || mix < 0)
      return 0;

    if (mix >= 0.5)
      return 1;

    return 1 - ((0.5 - mix) * 2);
  }

  /*
    * Setters for each param
    */
  setTime(_time) {
    if (_time < this._descriptor.time.range.max && _time > this._descriptor.time.range.min) this.params.time = _time;
    this.delayNodeLeft.delayTime.setValueAtTime(_time, this.context.currentTime);
    this.delayNodeRight.delayTime.setValueAtTime(_time, this.context.currentTime);
  }

  setFeedback(_feedback) {
    if (_feedback < this._descriptor.feedback.range.max && _feedback > this._descriptor.feedback.range.min) this.params.feedback = _feedback;
    this.feedbackGainNode.gain.setValueAtTime(parseFloat(this.params.feedback, 10), this.context.currentTime);
  }

  setMix(_mix) {
    if (_mix < this._descriptor.mix.range.max && _mix > this._descriptor.mix.range.min) this.params.mix = _mix;
    this.dryGainNode.gain.setValueAtTime(this.getDryLevel(this.params.mix), this.context.currentTime);
    this.wetGainNode.gain.setValueAtTime(this.getWetLevel(this.params.mix), this.context.currentTime);
  }

}


window.WasabiPingPongDelay = class WasabiPingPongDelay extends WebAudioPluginFactory {

    constructor(context, baseUrl) {
        super(context,baseUrl);
    }

}

AudioContext.prototype.createWasabiDelayCompositeNode =
OfflineAudioContext.prototype.createWasabiDelayCompositeNode = function (options) {
  return new PingPongDelay(this, options);
};