/**
 *
 *
 * @interface IMicrophone
 */
interface IMicrophone{
    getStream():Promise<{ context:AudioContext, stream:any, node:any}>;
    getListOfMicrophones():any[];
    toggleMute():boolean;
    stop():void;
    gainNode:GainNode;
    stream:MediaStreamAudioSourceNode;
    isMuted:boolean;
    isActive:boolean;
}


interface MicrophoneConfig {
    context?:AudioContext;
    muted?:boolean;
}
/**
 *
 *
 * @class Microphone
 * @implements {IMicrophone}
 */
class Microphone implements IMicrophone{
    gainNode:any;
    stream:any;
    isMuted:boolean;
    context?:AudioContext;
    isActive:boolean;
    protected source:any;
    constructor(opts:MicrophoneConfig = {}){
        this.isMuted = opts.muted || true;
        this.source;
        this.context = opts.context
        this.gainNode;
        
    }
    /**
     *
     *
     * @returns
     * @memberof Microphone
     */
    getStream(){
        let self = this;
        return navigator.mediaDevices.getUserMedia({audio: true})
        .then(function(stream) {
            self.isActive = true;
            !self.context ? self.context = new (window.AudioContext || window.webkitAudioContext)() : self.context;

            self.gainNode = self.context.createGain();
            self.gainNode.gain.value = 0.75;

            self.source = self.context.createMediaStreamSource(stream);
            self.source.connect(self.gainNode)
            return { stream: stream, context: self.context, node: self.gainNode}
        })
        
    }
    /**
     *
     *
     * @memberof Microphone
     */
    getListOfMicrophones(){
        return <any>[];
    }
    /**
     *
     *
     * @memberof Microphone
     */
    toggleMute(){
        if(!this.isMuted){
            this.gainNode.setValueAtTime(0, 0);
            this.isMuted = !this.isMuted;
            return this.isMuted;
        }
        else{ 
            this.gainNode.setValueAtTime(0, 0.75)
            this.isMuted = !this.isMuted;
            return this.isMuted;

        }
    }
    stop(){
        this.stream.getTracks().forEach(function(track:any) {
            track.stop();
          });
        this.isActive = false;
    }
}

/**
 *
 *
 * @class AudioAnalyser
 */

interface AnalyserProps{
    context: AudioContext;
    inputNode: AudioNode | MediaStreamAudioSourceNode;
    canvas: HTMLCanvasElement;
    draw?: Function;

}

interface Analyser{
    canvas: HTMLCanvasElement
    context: AudioContext
    animation: Function
    analyserNode: AnalyserNode
    bufferLength: number
    fData: Uint8Array | Float32Array
    tData: Uint8Array | Float32Array
    isAnimating: boolean
    inputNode: AudioNode | MediaStreamAudioSourceNode

    start(): void
    stop(): void
    pause(): void

    
}
class AudioAnalyser implements Analyser{
    canvas: HTMLCanvasElement
    context: AudioContext
    animation: Function
    analyserNode: AnalyserNode
    bufferLength: number
    fData: Uint8Array | Float32Array
    tData: Uint8Array | Float32Array
    isAnimating: boolean
    inputNode: AudioNode | MediaStreamAudioSourceNode

    constructor(opts:AnalyserProps){

        if(!opts.context){
            throw new Error('No Audio Context Given')
        }
        if(!opts.canvas){
            throw new Error('No Canvas Given')
        }


        this.animation = opts.draw
        this.analyserNode = opts.context.createAnalyser()
        this.analyserNode.fftSize = 1024;
        this.bufferLength = this.analyserNode.frequencyBinCount;
        this.fData = new Uint8Array(this.bufferLength);
        this.tData = new Uint8Array(this.bufferLength);
        this.inputNode = opts.inputNode;
        this.inputNode.connect(this.analyserNode)
    }
    /**
     *
     *
     * @memberof AudioAnalyser
     */
    start(){
        this.isAnimating = true;
        this.draw()
    }
    /**
     *
     *
     * @memberof AudioAnalyser
     */
    draw(){
        if(this.isAnimating)
            requestAnimationFrame(() => { this.draw() });
        this.analyserNode.getByteTimeDomainData(this.tData);
        this.analyserNode.getByteFrequencyData(this.fData);
        try {
            
            this.animation(this.tData, this.fData)
        } catch (error) {
            this.stop();
            console.log(error)
            
        }
    }
    /**
     *
     *
     * @memberof AudioAnalyser
     */
    stop(){
        this.isAnimating = false;
    }

    pause(){
        this.isAnimating = false;
    }
}



