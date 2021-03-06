
/*
Code generated with Faust version 2.5.23
Compilation options: wasm-ib, -scal -ftz 2
*/

function getJSONWeirdPhaser() {
	return "{\"name\":\"Weird Phaser\",\"filename\":\"WeirdPhaser\",\"version\":\"2.5.23\",\"options\":\"wasm-ib, -scal -ftz 2\",\"size\":\"168\",\"inputs\":\"2\",\"outputs\":\"2\",\"meta\":[{\"author\":\"Oli Larkin (contact@olilarkin.co.uk)\"},{\"basics.lib/name\":\"Faust Basic Element Library\"},{\"basics.lib/version\":\"0.0\"},{\"copyright\":\"Oliver Larkin\"},{\"description\":\"Stereo Phaser based on SSB Modulation\"},{\"filename\":\"WeirdPhaser\"},{\"licence\":\"GPL\"},{\"maths.lib/author\":\"GRAME\"},{\"maths.lib/copyright\":\"GRAME\"},{\"maths.lib/license\":\"LGPL with exception\"},{\"maths.lib/name\":\"Faust Math Library\"},{\"maths.lib/version\":\"2.1\"},{\"name\":\"Weird Phaser\"},{\"signals.lib/name\":\"Faust Signal Routing Library\"},{\"signals.lib/version\":\"0.0\"},{\"version\":\"0.1\"}],\"ui\":[{\"type\":\"vgroup\",\"label\":\"Weird Phaser\",\"items\":[{\"type\":\"hslider\",\"label\":\"Feedback\",\"address\":\"/Weird_Phaser/Feedback\",\"index\":\"20\",\"meta\":[{\"OWL\":\"PARAMETER_D\"}],\"init\":\"0\",\"min\":\"0\",\"max\":\"1\",\"step\":\"0.01\"},{\"type\":\"hslider\",\"label\":\"L-R Offset\",\"address\":\"/Weird_Phaser/L-R_Offset\",\"index\":\"132\",\"meta\":[{\"OWL\":\"PARAMETER_C\"}],\"init\":\"0\",\"min\":\"0\",\"max\":\"1\",\"step\":\"0.001\"},{\"type\":\"hslider\",\"label\":\"Rate Scalar\",\"address\":\"/Weird_Phaser/Rate_Scalar\",\"index\":\"64\",\"meta\":[{\"OWL\":\"PARAMETER_B\"}],\"init\":\"1\",\"min\":\"1\",\"max\":\"40\",\"step\":\"0.001\"},{\"type\":\"hslider\",\"label\":\"Rate\",\"address\":\"/Weird_Phaser/Rate\",\"index\":\"60\",\"meta\":[{\"OWL\":\"PARAMETER_A\"},{\"unit\":\"hz\"}],\"init\":\"0\",\"min\":\"0\",\"max\":\"1\",\"step\":\"0.001\"},{\"type\":\"checkbox\",\"label\":\"bypass\",\"address\":\"/Weird_Phaser/bypass\",\"index\":\"0\"}]}]}";
}
function getBase64CodeWeirdPhaser() { return "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ATgCDEEAQzMzMz9DAACAP0EAKgIMk5Q4AhBBAEMAAIA/QQAqAgiVOAI4C5CAgIAAACAAIAEQDCAAEA4gABALC7WAgIAAAEEAQwAAAAA4AgBBAEMAAAAAOAIUQQBDAAAAADgCPEEAQwAAgD84AkBBAEMAAAAAOAKEAQuNgICAAAAgASAAIAAgAUgbDwuNgICAAAAgACABIAAgAUgbDwuMgICAAAAgACABaiACOAIACwv0i4CAAAEAQQAL7Qt7Im5hbWUiOiJXZWlyZCBQaGFzZXIiLCJmaWxlbmFtZSI6IldlaXJkUGhhc2VyIiwidmVyc2lvbiI6IjIuNS4yMyIsIm9wdGlvbnMiOiJ3YXNtLWliLCAtc2NhbCAtZnR6IDIiLCJzaXplIjoiMTY4IiwiaW5wdXRzIjoiMiIsIm91dHB1dHMiOiIyIiwibWV0YSI6W3siYXV0aG9yIjoiT2xpIExhcmtpbiAoY29udGFjdEBvbGlsYXJraW4uY28udWspIn0seyJiYXNpY3MubGliL25hbWUiOiJGYXVzdCBCYXNpYyBFbGVtZW50IExpYnJhcnkifSx7ImJhc2ljcy5saWIvdmVyc2lvbiI6IjAuMCJ9LHsiY29weXJpZ2h0IjoiT2xpdmVyIExhcmtpbiJ9LHsiZGVzY3JpcHRpb24iOiJTdGVyZW8gUGhhc2VyIGJhc2VkIG9uIFNTQiBNb2R1bGF0aW9uIn0seyJmaWxlbmFtZSI6IldlaXJkUGhhc2VyIn0seyJsaWNlbmNlIjoiR1BMIn0seyJtYXRocy5saWIvYXV0aG9yIjoiR1JBTUUifSx7Im1hdGhzLmxpYi9jb3B5cmlnaHQiOiJHUkFNRSJ9LHsibWF0aHMubGliL2xpY2Vuc2UiOiJMR1BMIHdpdGggZXhjZXB0aW9uIn0seyJtYXRocy5saWIvbmFtZSI6IkZhdXN0IE1hdGggTGlicmFyeSJ9LHsibWF0aHMubGliL3ZlcnNpb24iOiIyLjEifSx7Im5hbWUiOiJXZWlyZCBQaGFzZXIifSx7InNpZ25hbHMubGliL25hbWUiOiJGYXVzdCBTaWduYWwgUm91dGluZyBMaWJyYXJ5In0seyJzaWduYWxzLmxpYi92ZXJzaW9uIjoiMC4wIn0seyJ2ZXJzaW9uIjoiMC4xIn1dLCJ1aSI6W3sidHlwZSI6InZncm91cCIsImxhYmVsIjoiV2VpcmQgUGhhc2VyIiwiaXRlbXMiOlt7InR5cGUiOiJoc2xpZGVyIiwibGFiZWwiOiJGZWVkYmFjayIsImFkZHJlc3MiOiIvV2VpcmRfUGhhc2VyL0ZlZWRiYWNrIiwiaW5kZXgiOiIyMCIsIm1ldGEiOlt7Ik9XTCI6IlBBUkFNRVRFUl9EIn1dLCJpbml0IjoiMCIsIm1pbiI6IjAiLCJtYXgiOiIxIiwic3RlcCI6IjAuMDEifSx7InR5cGUiOiJoc2xpZGVyIiwibGFiZWwiOiJMLVIgT2Zmc2V0IiwiYWRkcmVzcyI6Ii9XZWlyZF9QaGFzZXIvTC1SX09mZnNldCIsImluZGV4IjoiMTMyIiwibWV0YSI6W3siT1dMIjoiUEFSQU1FVEVSX0MifV0sImluaXQiOiIwIiwibWluIjoiMCIsIm1heCI6IjEiLCJzdGVwIjoiMC4wMDEifSx7InR5cGUiOiJoc2xpZGVyIiwibGFiZWwiOiJSYXRlIFNjYWxhciIsImFkZHJlc3MiOiIvV2VpcmRfUGhhc2VyL1JhdGVfU2NhbGFyIiwiaW5kZXgiOiI2NCIsIm1ldGEiOlt7Ik9XTCI6IlBBUkFNRVRFUl9CIn1dLCJpbml0IjoiMSIsIm1pbiI6IjEiLCJtYXgiOiI0MCIsInN0ZXAiOiIwLjAwMSJ9LHsidHlwZSI6ImhzbGlkZXIiLCJsYWJlbCI6IlJhdGUiLCJhZGRyZXNzIjoiL1dlaXJkX1BoYXNlci9SYXRlIiwiaW5kZXgiOiI2MCIsIm1ldGEiOlt7Ik9XTCI6IlBBUkFNRVRFUl9BIn0seyJ1bml0IjoiaHoifV0sImluaXQiOiIwIiwibWluIjoiMCIsIm1heCI6IjEiLCJzdGVwIjoiMC4wMDEifSx7InR5cGUiOiJjaGVja2JveCIsImxhYmVsIjoiYnlwYXNzIiwiYWRkcmVzcyI6Ii9XZWlyZF9QaGFzZXIvYnlwYXNzIiwiaW5kZXgiOiIwIn1dfV19MA=="; }

/*
 faust2wasm
 Additional code: GRAME 2017-2018
*/
 
'use strict';

if (typeof (AudioWorkletNode) === "undefined") {
	alert("AudioWorklet is not supported in this browser !")
}

var hosts = hosts || {};
hosts.FaustWeirdPhaser = class WeirdPhaser extends AudioWorkletNode {
    
    constructor(context, options) {
        
        var json_object = JSON.parse(getJSONWeirdPhaser());
        
        // Setting values for the input, the output and the channel count.
        options.numberOfInputs = (parseInt(json_object.inputs) > 0) ? 1 : 0;
        options.numberOfOutputs = (parseInt(json_object.outputs) > 0) ? 1 : 0;
        options.channelCount = Math.max(1, parseInt(json_object.inputs));
        options.outputChannelCount = [parseInt(json_object.outputs)];
        options.channelCountMode = "explicit";
        options.channelInterpretation = "speakers";
       
        super(context, 'WeirdPhaser', options);
        
        // JSON parsing functions
        this.parse_ui = function(ui, obj)
        {
            for (var i = 0; i < ui.length; i++) {
                this.parse_group(ui[i], obj);
            }
        }
        
        this.parse_group = function(group, obj)
        {
            if (group.items) {
                this.parse_items(group.items, obj);
            }
        }
        
        this.parse_items = function(items, obj)
        {
            for (var i = 0; i < items.length; i++) {
            	this.parse_item(items[i], obj);
            }
        }
        
        this.parse_item = function(item, obj)
        {
            if (item.type === "vgroup"
                || item.type === "hgroup"
                || item.type === "tgroup") {
                this.parse_items(item.items, obj);
            } else if (item.type === "hbargraph"
                       || item.type === "vbargraph") {
                // Keep bargraph adresses
                obj.outputs_items.push(item.address);
            } else if (item.type === "vslider"
                       || item.type === "hslider"
                       || item.type === "button"
                       || item.type === "checkbox"
                       || item.type === "nentry") {
                // Keep inputs adresses
                obj.inputs_items.push(item.address);
            }
        }
        
        this.output_handler = null;
   
        this.json_object = json_object;
        
        // input/output items
        this.inputs_items = [];
        this.outputs_items = [];
       
        // Parse UI
        this.parse_ui(this.json_object.ui, this);
        
        // Set message handler
        this.port.onmessage = this.handleMessage.bind(this);
    }
    
    getMetadata()
    {
        return getJSONWeirdPhaser();
    }
    
    setParam(path, val)
    {
        //this.port.postMessage({ type:"param", key:path, value:val });
        
        // Needed for sample accurate control
        this.parameters.get(path).setValueAtTime(val, 0);
    }
    
    getParam(path)
    {
        return this.parameters.get(path).value;
    }
    
    /**
     * Setup a control output handler with a function of type (path, value)
     * to be used on each generated output value. This handler will be called
     * each audio cycle at the end of the 'compute' method.
     *
     * @param handler - a function of type function(path, value)
     */
    setOutputParamHandler(handler)
    {
        this.output_handler = handler;
    }
    
    /**
     * Get the current output handler.
     */
    getOutputParamHandler()
    {
        return this.output_handler;
    }
    
    // TO REMOVE
    inputChannelCount()
    {
        return parseInt(this.json_object.inputs);
    }
    
    outputChannelCount()
    {
        return parseInt(this.json_object.outputs);
    }
    
    getDescriptor()
    {
        return this.inputs_items;
    }
    
    /**
     * Controller
     *
     * @param channel - the MIDI channel (0..15, not used for now)
     * @param ctrl - the MIDI controller number (0..127)
     * @param value - the MIDI controller value (0..127)
     */
    ctrlChange(channel, ctrl, value)
    {
        this.port.postMessage({ type: "ctrlChange", data: [channel, ctrl, value] });
    }
    
    /**
     * PitchWeel
     *
     * @param channel - the MIDI channel (0..15, not used for now)
     * @param value - the MIDI controller value (-1..1)
     */
    pitchWheel(channel, wheel)
    {
        this.port.postMessage({ type: "pitchWheel", data: [channel, wheel] });
    }
    
    onMidi(data)
    {
        this.port.postMessage({ type:"midi", data:data });
    }
    
    handleMessage(event) 
    {
        var msg = event.data;
        if (this.output_handler) {
            this.output_handler(msg.path, msg.value);
        }
    }
    
}

// Faust context
var faust = faust || {};

faust.create = function(context, callback)
{
    // Resume audio context each time...
    context.resume();
    
    // The main global scope
    context.audioWorklet.addModule("WeirdPhaser-processor.js")
    .then(function () {
         callback(new WeirdPhaser(context, {}));
    })
    .catch(function(error) { console.log(error); console.log("Faust WeirdPhaser cannot be loaded or compiled"); });
}

