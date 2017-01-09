var c = document.getElementById("umCanvas");
var ctx = c.getContext("2d");
var width = 40;
var height = 40;
var fire = new Array(height);
for (var i = 0; fire.length; i++){
	fire[i] = new Array(width);
}
var x = 200;
var y = 200;


/*
function generateFire(){
	var i = 0;
		for (var j = 0; j < width; j++){
			var random = Math.random();
			if (random > 0.5){
				fire[i][j]="(255;
			}
			else{
				fire[i][j];	
			}
		}
	for (var i = 1; i < height; i++){
		for (var j = 0; j < width; j++){
			
		}
	}
}
/*
function drawFire(){
	for (var i = 0; i < height; i++){
		for (var j = 0; j < width; j++){
			ctx.beginPath();
			ctx.fillStyle=
			ctx.fillRect(y + j, i + x, 1, 1);
		}
	}
}
*/

function mainLoop(){

	ctx.fillStyle="rgb(100, 100, 100)";
	ctx.fillRect(0,0,c.width,c.height);


	setTimeout(function(){
		requestAnimationFrame(mainLoop)
	}, 1);
}

mainLoop();