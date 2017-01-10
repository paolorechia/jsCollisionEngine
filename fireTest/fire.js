var c = document.getElementById("umCanvas");
var ctx = c.getContext("2d");
var width = 20;
var height = 20;
var red = new Array(height);
var green = new Array(height);
var blue = new Array(height);

for (var i = 0; i < red.length; i++){
	red[i] = new Array(width);
}
for (var i = 0; i < green.length; i++){
	green[i] = new Array(width);
}
for (var i = 0; i < blue.length; i++){
	blue[i] = new Array(width);
}

var x = 200;
var y = 200;



function generateRed(){
	var i = 0;
		for (var j = 0; j < width; j++){
			var random = Math.random();		
			if (random > 0.5){
				red[i][j]=255;
			}
			else{
				red[i][j]=0;	
			}
		}
	for (var i = 1; i < height; i++){
		red[i][0] = (red[i-1][0] + red[i-1][1]) / 2;

		if (i% 4 == 0){
			for (var j = 0; j < width; j++){
				var random = Math.random();		
				if (random > 0.5){
					red[i][j]=255;
				}
				else{
					red[i][j]=0;	
				}
			}
		}
		else{
					if (i % 2 != 0){
			for (var j = 1; j < width - 1; j++){
				red[i][j] = (red[i-1][j] + red[i-1][j-1] + red[i-1][j+1]) / 3;
			}
		}
		}
		/*
		else{
			for (var j = 1; j < width - 1; j++){
				red[i][j] = (red[i-1][j] + red[i-1][j] + red[i-2][j]) / 3;
			}
		}
		*/
	}
}
function generateGreen(){
	var i = 0;
		for (var j = 0; j < width; j++){
			var random = Math.random();
			if (random > 0.5){
				green[i][j]=255;
			}
			else{
				green[i][j]=0;	
			}
			//green[i][j]=Math.round(random);
		//	console.log(green[i][j]);
		}
	for (var i = 1; i < height; i++){
		green[i][0] = (green[i-1][0] + green[i-1][1]) / 2;
		for (var j = 1; j < width - 1; j++){
			green[i][j] = (green[i-1][j] + green[i-1][j-1]) + green[i-1][j+1] / 3;
		}
	}
}
function generateBlue(){
	var i = 0;
		for (var j = 0; j < width; j++){
			//var random = Math.random() * 40;
			var random = Math.random();
			if (random > 0.5){
				blue[i][j]=255;
			}
			else{
				blue[i][j]=0;	
			
			//blue[i][j]=Math.round(random);
		//	console.log(blue[i][j]);
			}
		}
	for (var i = 1; i < height; i++){
		blue[i][0] = (blue[i-1][0] + blue[i-1][1]) / 2;
		for (var j = 1; j < width - 1; j++){
			blue[i][j] = (blue[i-1][j] + blue[i-1][j-1]) + blue[i-1][j+1] / 3;
		}
	}
}
function drawRed(){
	for (var i = 0; i < height; i++){
		for (var j = 0; j < width; j++){
			ctx.beginPath();
			if (red[j][i] > 0){
				ctx.fillStyle="rgb(" + red[j][i] + ", 0, 0)";
				ctx.fillRect(y + j, i + x, 1, 1);
			}
			else{
				ctx.fillStyle="rgb(" + red[j][i] + ", " + red[j][i] + ", " + "0)";
			}
		}
	}
}
/*
function drawColored(){
	for (var i = 0; i < height; i++){
		for (var j = 0; j < width; j++){
			ctx.beginPath();
			if (red[i][j] > 0){
				ctx.fillStyle="rgb(" + red[i][j] + ", " + green[i][j] + ", " + blue[i][j] + ")";
				ctx.fillRect(y + j, i + x, 1, 1);			
			}
			else{
				ctx.fillStyle="rgb(" + red[i][j] + ", " + red[i][j]
			}
		}
	}
}
*/
generateRed();
//generateGreen();
//generateBlue();

function mainLoop(){

	ctx.fillStyle="rgb(0, 0, 0)";
	ctx.fillRect(0,0,c.width,c.height);

	/*

generateGreen();
generateBlue();
*/
generateRed();
	drawRed();


    requestAnimationFrame(mainLoop)
}


mainLoop();