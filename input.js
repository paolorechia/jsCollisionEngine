var coord = new Point(0, 0);

    function pegaCoordenadas(event){
        coord.x = event.clientX;
        coord.y = event.clientY;
 //       console.log(coord);
    }

    keyboard = function (event){
        if (event.key == 'w'){
//			console.log('w');
        }
        if (event.key == 's'){

        }
        if (event.key == 'd'){
 
        }
        if (event.key == 'a'){

        }
        if (event.key == ' '){

        }
        if (event.key == 'Escape'){
        }
    };

    mousePress = function(state){
 //       console.log(state);
    };

	
	c.addEventListener("mousemove", pegaCoordenadas, false);
    c.addEventListener("mousedown", function(){ mousePress(1); 
                                                     },
                                                     false);
    c.addEventListener("mouseup", function(){ mousePress(0);
                                                   }, 
                                                   false);
    c.addEventListener("click", function(){
                                                console.log("click!");},
                                                false);
    c.addEventListener("keydown", function(event){ keyboard(event)}, false);