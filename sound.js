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
    this.playSound2 = function(overlapTime = 200, startTime=200){
        if (this.sound.currentTime == 0 && this.buffer.currentTime == 0){
            this.sound.play();
            return; 
        }
        var upperBound = 1.8;
        var lowerBound = 1.0; 
        var resetTime = lowerBound - 0.1;
        
        if (this.sound.currentTime > upperBound){
            this.buffer.play(); 
        }
        if (this.buffer.currentTime > lowerBound && this.buffer.currentTime < upperBound){
            this.sound.pause();
            this.sound.currentTime = resetTime;
        }
        if (this.buffer.currentTime > upperBound){
            this.sound.play();
        }
        if (this.sound.currentTime > lowerBound && this.sound.currentTime < upperBound){
            this.buffer.pause();
            this.buffer.currentTime = resetTime;
        }
        console.log(this.sound.currentTime, this.buffer.currentTime);
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
