var coord = new Point(0, 0);

    function pegaCoordenadas(event){
        coord.x = event.clientX;
        coord.y = event.clientY;
 //       console.log(coord);
    }

    keyboard = function (event){
        if (event.key == 'w'){
//			console.log('w');
            objects[0].startingMagnitude=30;
        }
        if (event.key == 's'){
        }
        if (event.key == 'd'){
            rotatePolygon(objects[0], 1);
        }
        if (event.key == 'a'){
            rotatePolygon(objects[0], -1);
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
    window.addEventListener("keydown", keyboard, false);
