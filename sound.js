var Sound = function(){
    this.timeOutArray = [];
    this.timeOutId = 0;
    this.timeOutSound = function(){
        if (this.sound != null){
            this.timeOutArray[this.timeOutId].currentTime = 1;
            this.timeOutArray[this.timeOutId].play();
            this.timeOutId++;
            this.timeOutId %= this.timeOutLimit;
        }
    }
    this.timeOutLimit = 20;
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
