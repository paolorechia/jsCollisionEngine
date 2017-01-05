var coord = new Point(c.width/2, c.height/2);

    function pegaCoordenadas(event){
        coord.x = event.clientX;
        coord.y = event.clientY;
 //       console.log(coord);
    }
   function pegaCoordenadasMobile(event){
        coord.x = event.touches[0].clientX;
        coord.y = event.touches[0].clientY;
   }
	keyboardDown = function(event){
        if (event.key == 'w'){
			player.throttle(true);
        }
        if (event.key == 's'){
			player.reverseThrottle(true);
        }
        if (event.key == 'd'){
			player.turn('r', true);
        }
        if (event.key == 'a'){
			player.turn('l', true);
        }
        if (event.key == ' '){
			player.brake(true);
        }
        if (event.key == 'Escape'){
        }
    }
	keyboardUp = function(event){
        if (event.key == 'w'){
			player.throttle(false);
        }
        if (event.key == 's'){
			player.reverseThrottle(false);

        }
        if (event.key == 'd'){
			player.turn('r', false);
        }
        if (event.key == 'a'){
			player.turn('l', false);
        }
        if (event.key == ' '){
			player.brake(false);
        }
        if (event.key == 'Escape'){
        }
    }
    mousePress = function(state){
 // //      console.log(state);
    };

    window.addEventListener("keydown", function(event){ keyboardDown(event)}, false);
    window.addEventListener("keyup", function(event){ keyboardUp(event)}, false);

	c.addEventListener("mousemove", pegaCoordenadas, false);
//	c.addEventListener("touchstart", pegaCoordenadasMobile, false);
    c.addEventListener("mousedown", function(){ mousePress(1); 
                                                     },
                                                     false);
    c.addEventListener("mouseup", function(){ mousePress(0);
                                                   }, 
                                                   false);
    c.addEventListener("click", function(){
                                                console.log("click!");},
                                                false);
 
