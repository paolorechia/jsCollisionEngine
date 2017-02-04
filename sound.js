// volume should range from 0 to 1
var SoundPool = function(limit = 10, volume = 5, clearRate=0){
    this.queue = [];
    this.limit = limit;
    this.volume = volume;
    this.clearRate = clearRate;
    this.framesToClear = 0;
    this.addSound = function(sound){
        if (this.queue.length >= this.limit){
            return;
        }
        this.queue.push(sound);
    }
    this.playQueue = function(){

        if (this.framesToClear > 0){
            this.framesToClear--;
            return;
        }

        while (this.queue.length > 0){
            if (this.queue[0].volumeFilter != undefined){
                vol = (this.volume * this.queue[0].volumeFilter)/10;
            }
            else{
                vol = this.volume /10;
            }
            this.queue[0].volume(vol);
            this.queue[0].play();
            this.queue.splice(0,1);
            this.framesToClear=this.clearRate;
        }
    }
    this.setVolume = function(volume){
        this.volume=volume;
    }
    this.decreaseVolume = function(){
        if (this.volume > 0){
            this.volume -= 1;
            this.volume = Math.round(this.volume * 100) / 100
        }
    }
    this.increaseVolume = function(){
        if(this.volume < 10){
            this.volume += 1;
            this.volume = Math.round(this.volume * 100) / 100
        }
    }
    this.ignoreQueue = function (sound){
            vol = this.volume /10;
            sound.volume(vol);
            sound.play();
    }
    this.display= function(color, point, font = "14px Arial"){
        ctx.beginPath();
        ctx.font=font;
        ctx.fillStyle=color;
        var string = "Volume: " + this.volume;
        ctx.fillText(string, point.x, point.y);
    }
}
function increaseMusicVolume(music){
        if (music.volume < 1){
            vol = music.volume * 10;
            vol += 1;
            vol = Math.round(vol)/10;
            music.volume = vol;
        }
    }
function decreaseMusicVolume(music){
        if (music.volume > 0){
            vol = music.volume * 10;
            vol -= 1;
            vol = Math.round(vol)/10;
            music.volume = vol
        }
    }
function increaseHowlerVolume(music){
        if (music.volume() < 1){
            vol = music.volume() * 10;
            vol += 1;
            vol = Math.round(vol)/10;
            music.volume(vol);
        }
    }
function decreaseHowlerVolume(music){
        if (music.volume() > 0){
            vol = music.volume() * 10;
            vol -= 1;
            vol = Math.round(vol)/10;
            music.volume(vol);
        }
    }


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
var maxSounds = 1;
var startingVolume=5;
soundPool = new SoundPool(maxSounds, startingVolume);
