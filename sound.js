var SoundArray = function(){
    this.timeOutArray = [];
    this.timeOutId = 0;
    this.play= function(){
            this.timeOutArray[this.timeOutId].currentTime = 0;
            this.timeOutArray[this.timeOutId].play();
            this.timeOutId++;
            this.timeOutId %= this.timeOutLimit;
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
var BufferedSound = function(sound, buffer, upperBound = 3, lowerBound = 0.5){
    this.sound=sound;
    this.buffer=buffer;
    this.upperBound = upperBound;
    this.lowerBound = lowerBound;
    this.playSound2 = function(){
        if (this.sound.currentTime == 0 && this.buffer.currentTime == 0){
            this.sound.play();
            return; 
        }
        var resetTime = this.lowerBound - 0.1;
        
        if (this.sound.currentTime > this.upperBound){
            this.buffer.play(); 
        }
        if (this.buffer.currentTime > this.lowerBound && this.buffer.currentTime < this.upperBound){
            this.sound.pause();
            this.sound.currentTime = resetTime;
        }
        if (this.buffer.currentTime > this.upperBound){
            this.sound.play();
        }
        if (this.sound.currentTime > this.lowerBound && this.sound.currentTime < this.upperBound){
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
