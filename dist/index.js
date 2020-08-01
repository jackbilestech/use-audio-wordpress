var Microphone = (function () {
    function Microphone(opts) {
        if (opts === void 0) { opts = {}; }
        this.isMuted = opts.muted || true;
        this.source;
        this.context = opts.context;
        this.gainNode;
    }
    Microphone.prototype.getStream = function () {
        var self = this;
        return navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
            self.isActive = true;
            !self.context ? self.context = new (window.AudioContext || window.webkitAudioContext)() : self.context;
            self.gainNode = self.context.createGain();
            self.gainNode.gain.value = 0.75;
            self.source = self.context.createMediaStreamSource(stream);
            self.source.connect(self.gainNode);
            return { stream: stream, context: self.context, node: self.gainNode };
        });
    };
    Microphone.prototype.getListOfMicrophones = function () {
        return [];
    };
    Microphone.prototype.toggleMute = function () {
        if (!this.isMuted) {
            this.gainNode.setValueAtTime(0, 0);
            this.isMuted = !this.isMuted;
            return this.isMuted;
        }
        else {
            this.gainNode.setValueAtTime(0, 0.75);
            this.isMuted = !this.isMuted;
            return this.isMuted;
        }
    };
    Microphone.prototype.stop = function () {
        this.stream.getTracks().forEach(function (track) {
            track.stop();
        });
        this.isActive = false;
    };
    return Microphone;
}());
var AudioAnalyser = (function () {
    function AudioAnalyser(opts) {
        if (!opts.context) {
            throw new Error('No Audio Context Given');
        }
        if (!opts.canvas) {
            throw new Error('No Canvas Given');
        }
        this.animation = opts.draw;
        this.analyserNode = opts.context.createAnalyser();
        this.analyserNode.fftSize = 1024;
        this.bufferLength = this.analyserNode.frequencyBinCount;
        this.fData = new Uint8Array(this.bufferLength);
        this.tData = new Uint8Array(this.bufferLength);
        this.inputNode = opts.inputNode;
        this.inputNode.connect(this.analyserNode);
    }
    AudioAnalyser.prototype.start = function () {
        this.isAnimating = true;
        this.draw();
    };
    AudioAnalyser.prototype.draw = function () {
        var _this = this;
        if (this.isAnimating)
            requestAnimationFrame(function () { _this.draw(); });
        this.analyserNode.getByteTimeDomainData(this.tData);
        this.analyserNode.getByteFrequencyData(this.fData);
        try {
            this.animation(this.tData, this.fData);
        }
        catch (error) {
            this.stop();
            console.log(error);
        }
    };
    AudioAnalyser.prototype.stop = function () {
        this.isAnimating = false;
    };
    AudioAnalyser.prototype.pause = function () {
        this.isAnimating = false;
    };
    return AudioAnalyser;
}());
//# sourceMappingURL=index.js.map