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
   function keyboard(event){
	   console.log("ahh");
        if (event.key == 'w'){
			console.log('w');
//			player.throttle(true);
        }
        if (event.key == 's'){
			console.log('s');
        }
        if (event.key == 'd'){
 
        }
        if (event.key == 'a'){

        }
        if (event.key == ' '){

        }
        if (event.key == 'Escape'){
        }
    }

    mousePress = function(state){
 // //      console.log(state);
    };

    c.addEventListener("keydown", function(event){ keyboard(event)}, false);
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
 
