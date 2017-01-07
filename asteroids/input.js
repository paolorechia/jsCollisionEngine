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
		player.setupAutoPilot(coord);
   }
	keyboardDown = function(event){
		if (event.key == ' '){
			player.weapon.fire(true);
        }
        if (event.key == 'Escape'){
        }
		if (event.key == 'x'){
			player.weapon.autoFire();
		}
		if (player.lock){
			return;
		}
        if (event.key == 'w'){
			player.throttle(true);
        }
        if (event.key == 'q'){
			player.reverseThrottle(true);
		}
        if (event.key == 's'){
			player.brake(true);
        }
        if (event.key == 'd'){
			player.turn('r', true);
        }
        if (event.key == 'a'){
			player.turn('l', true);
		}
 
    }
	keyboardUp = function(event){
       if (event.key == 'Escape'){
		   if (player.lock){
	//			console.log("System unlocked!");
				player.lock = false;
		   }
        }
        if (event.key == ' '){
			player.weapon.fire(false);
        }
		if (player.lock){
			return;
		}
        if (event.key == 'w'){
			player.throttle(false);
        }
        if (event.key == 'q'){
			player.reverseThrottle(false);
		}
        if (event.key == 's'){
			player.brake(false);
        }
        if (event.key == 'd'){
			player.turn('r', false);
        }
        if (event.key == 'a'){
			player.turn('l', false);
        }

    }
	mouseClick = function(){
	//	console.log("System locked!");
		player.lock = true;
		player.setupAutoPilot(coord);
	}
    mouseDown = function(state){
//		console.log(state);
    };
	mouseUp = function(state){
//		console.log(state);
    };
    window.addEventListener("keydown", function(event){ keyboardDown(event)}, false);
    window.addEventListener("keyup", function(event){ keyboardUp(event)}, false);

	c.addEventListener("mousemove", pegaCoordenadas, false);
	c.addEventListener("touchstart", pegaCoordenadasMobile, false);
/*
    c.addEventListener("mousedown", function(){ mouseDown(true); 
                                                     },
                                                     false);
    c.addEventListener("mouseup", function(){ mouseUp(false);
                                                   }, 
                                                   false);
*/
												   
    c.addEventListener("click", function(event){ mouseClick(event);
                                                },
                                                false);
 
