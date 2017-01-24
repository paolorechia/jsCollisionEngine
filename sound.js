var SoundArray = function(){
    this.timeOutArray = [];
    this.timeOutId = 0;
    this.timeOutSound = function(){
        if (this.sound != null){
            this.timeOutArray[this.timeOutId].currentTime = 0;
            this.timeOutArray[this.timeOutId].play();
            this.timeOutId++;
            this.timeOutId %= this.timeOutLimit;
        }
    }
    this.timeOutLimit = 3;
    this.loadSounds = function(sound){
        for (var i  = 0; i < this.timeOutLimit; i++){
            var newSound = document.createElement("audio");
            newSound.src = sound.src;
            newSound.volume = sound.volume
            this.timeOutArray[i] =  newSound;
        }
    }
    this.updateVolume = function(volume){
        if (this.sound != null){
            for (var i = 0; i < this.timeOutLimit; i++){
                this.timeOutArray[i].volume = volume;
            }
        }
    }
}
var BufferedSound = function(sound, buffer){
    this.sound=sound;
    this.buffer=buffer;
    this.playSound2 = function(overlapTime = 200){
        if (this.sound.currentTime == 0 && this.buffer.currentTime == 0){
            this.sound.play();
            return; 
        }
        var timeToEnd = this.sound.length - overlapTime;
        timeToEnd /= 1000;
        console.log(this.sound.currentTime);
        if (this.sound.currentTime != 0){
            this.sound.play();
            if (this.sound.currentTime > timeToEnd){
                this.buffer.play();
            }             
        }
        else{
            this.buffer.play();
            if (this.buffer.currentTime > overlapTime){
                this.sound.currentTime = 0;
            }
            if (this.buffer.currentTime > timeToEnd){
                this.sound.play();
            }             
        }
    }
    this.playSound = function(){
        if (this.sound != null && this.buffer != null){ 
            this.sound.play();
            this.buffer.play();
        }
    }
    this.stopSound = function(){
        if (this.sound != null && this.buffer != null){
            this.sound.pause();
            this.sound.currentTime = 0;
            this.buffer.pause();
            this.buffer.currentTime = 0;
        }
    }
    this.pauseSound = function(){
        if (this.sound != null && this.buffer != null){
            this.sound.pause();
            this.buffer.pause();
        }
    }
}
