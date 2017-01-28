var coord = new Point(c.width/2, c.height/2);

    function pegaCoordenadas(event){
        coord.x = event.clientX;
        coord.y = event.clientY;
 //       console.log(coord);
    }
   function pegaCoordenadasMobile(event){
        coord.x = event.touches[0].clientX;
        coord.y = event.touches[0].clientY;
		player.lock = true;
		for (var i= 0; i < player.weapons.length; i++){
				player.weapons[i].fire(true);
			}
		player.setupAutoPilot(coord);
   }
	keyboardDown = function(event){
		if (event.key == '.'){
            window.soundDisplay=true;
            clearTimeout(soundPool.timeoutId);
            soundPool.timeoutId=setTimeout(function(){window.soundDisplay=false}, 2000);
            increaseMusicVolume(selectMusic);
            increaseMusicVolume(music);
            soundPool.increaseVolume();
        }
		if (event.key == ','){
            window.soundDisplay=true;
            clearTimeout(soundPool.timeoutId);
            soundPool.timeoutId=setTimeout(function(){window.soundDisplay=false}, 2000);
            decreaseMusicVolume(selectMusic);
            decreaseMusicVolume(music);
            soundPool.decreaseVolume();
        }
		if (event.key == 'v'){
			for (var i= 0; i < player.weapons.length; i++){
                if (player.weapons[i].mode == 'm'){
                    player.weapons[i].fire(true);
                }
			}
        }
        if (event.key == 'Escape'){
			instruct = true;
            if (player.dead){
                playing=false;
            }
        }
		if (event.key == 'c'){
            for (var i = 0; i < player.weapons.length; i++){
                player.weapons[i].autoFire();
            }
		}
		if (event.key == 'r'){
			player.cycleEnabledWeapons();
		}
		if (event.key == 'f'){
			if (player.shield.enabled){
				player.shield.setEnabled(false);
			}
			else{
				player.shield.setEnabled(true);
			}
		}
		if (player == undefined || player.lock){
			return;
		}
        if (event.key == 'w' || event.key =="ArrowUp"){
			player.throttle(true);
        }
        if (event.key == 'x'){
			player.reverseThrottle(true);
		}
		if (event.key == 'q'){
			player.strafe('l', true);
        }
        if (event.key == 'e'){
			player.strafe('r', true);
		}
        if (event.key == 's' || event.key == "ArrowDown"){
			player.brake(true);
        }
        if (event.key == 'd' || event.key == "ArrowRight"){
			player.turn('r', true);
        }
        if (event.key == 'a' || event.key == "ArrowLeft"){
			player.turn('l', true);
		}
        if (event.key == 't'){
            player.targetSystem.changeTarget();
        }
        if (event.key == 'u'){
		    player.lock = true;
    		player.setupAutoPilot(coord);
		}
        if (event.key == 'h'){
            for (var i = 0; i < player.weapons.length; i++){
                if (player.weapons[i].turret){
                    oldMode = player.weapons[i].mode;
                    if (oldMode=='m'){
                        oldMode='a';
                        player.targetSystem.setAutoAim(true, player.weapons);
                    }
                    else{
                        oldMode='m';
                        player.targetSystem.setAutoAim(false, player.weapons);
                        player.targetSystem.autoFiring=false;
                    }
                    player.weapons[i].mode = oldMode;
                }
            }
		}
    }
	keyboardUp = function(event){
       if (event.key == 'Escape'){
		instruct = false;
		   if (player.lock){
	//			console.log("System unlocked!");
				player.lock = false;
		   }
        }
        if (event.key == 'v'){
			for (var i= 0; i < player.weapons.length; i++){
                if (player.weapons[i].mode == 'm'){
                    player.weapons[i].fire(false);
                }
			}
        }
		if (player == undefined || player.lock){
			return;
		}
        if (event.key == 'w' || event.key == "ArrowUp"){
			player.throttle(false);
        }
        if (event.key == 'x'){
			player.reverseThrottle(false);
		}
		if (event.key == 'q'){
			player.strafe('l', false);
        }
        if (event.key == 'e'){
			player.strafe('r', false);
		}
        if (event.key == 's' || event.key == "ArrowDown"){
			player.brake(false);
        }
        if (event.key == 'd' || event.key == "ArrowRight"){
			player.turn('r', false);
        }
        if (event.key == 'a' || event.key == "ArrowLeft"){
			player.turn('l', false);
		}

    }
	buttonModeClick = function(){
        if (buttons == undefined){
            return;
        }
		for (var i = 0; i < buttons.length; i++){
			var bound = {left: buttons[i].x,
						  right: buttons[i].x + buttons[i].width,
						 up: buttons[i].y,
						down: buttons[i].y + buttons[i].height};
						
			if (coord.x > bound.left && coord.x < bound.right){
				if (coord.y > bound.up && coord.y < bound.down){
					buttons[i].onClick();
				}
			}
		}
	}
    buttonModeHover = function(){
        if (buttons == undefined){
            return;
        }
		for (var i = 0; i < buttons.length; i++){
			var bound = {left: buttons[i].x,
						  right: buttons[i].x + buttons[i].width,
						 up: buttons[i].y,
						down: buttons[i].y + buttons[i].height};
						
			if (coord.x > bound.left && coord.x < bound.right){
				if (coord.y > bound.up && coord.y < bound.down){
					buttons[i].onHover();
                    continue;
				}
			}
            buttons[i].reset();
		}
    }
    function mouseDown(){
        if (player == undefined){
            return;
        }
		for (var i= 0; i < player.weapons.length; i++){
                if (player.weapons[i].mode == 'm'){
                    player.weapons[i].fire(true);
                }
        }
    }
	function mouseUp(){
        if (player == undefined){
            return;
        }
		for (var i= 0; i < player.weapons.length; i++){
                if (player.weapons[i].mode == 'm'){
                    player.weapons[i].fire(false);
                }
    	}
    }
    window.addEventListener("keydown", function(event){ keyboardDown(event)}, false);
    window.addEventListener("keyup", function(event){ keyboardUp(event)}, false);

	c.addEventListener("mousemove", pegaCoordenadas, false);

	c.addEventListener("mousemove", buttonModeHover, false);

	c.addEventListener("touchstart", buttonModeClick, false);
    c.addEventListener("mousedown", mouseDown, false);
    c.addEventListener("mouseup", mouseUp, false);
	c.addEventListener("click", function(event){ buttonModeClick(event);
                                                },
                                                false);											   
