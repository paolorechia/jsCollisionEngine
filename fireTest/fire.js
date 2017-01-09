var c = document.getElementById("umCanvas");
var ctx = c.getContext("2d");
var width = 200;
var height = 200;
var fire = new Array(height);

console.log(fire.length);

for (var i = 0; i < fire.length; i++){
	fire[i] = new Array(width);
}

var x = 200;
var y = 200;



function generateFire(){
	var i = 0;
		for (var j = 0; j < width; j++){
			var random = Math.random();
			if (random > 0.5){
				fire[i][j]=255;
			}
			else{
				fire[i][j]=0;	
			}
		}
	for (var i = 1; i < height; i++){
		for (var j = 0; j < width; j++){
			fire[i][j]=0;
		}
	}
}

function drawFire(){
	for (var i = 0; i < height; i++){
		for (var j = 0; j < width; j++){
			ctx.beginPath();
			ctx.fillStyle="rgb(" + fire[i][j] + ", 0, 0)";
			ctx.fillRect(y + j, i + x, 1, 1);
		}
	}
}

generateFire();
function mainLoop(){

	ctx.fillStyle="rgb(100, 100, 100)";
	ctx.fillRect(0,0,c.width,c.height);
	drawFire();


    requestAnimationFrame(mainLoop)
}


mainLoop();