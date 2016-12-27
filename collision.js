var c = document.getElementById("umCanvas");
var ctx = c.getContext("2d");

Versor = function(x, y){
	this.x=x;
	this.y=y;
}

Point = function(x, y){
	this.x=x;
	this.y=y;
}

Vertices = function(n){
	this.list = [];
	for (var i = 0; i < n; i++){
		list.push(new Point(0, 0));
	}
}

Rect = function(x, y, width, height, vx, vy, velocity, spin){
	this.position = new Point(x, y);
	this.width = width;
	this.height = height;
	this.center = new Point(x + width/2, y + height/2);
	this.hit=false;
	this.versor = new Versor(vx, vy);
	this.velocity = velocity;
	this.spin = spin;
}

function updateRect(rect){
	rect.position.x += rect.versor.x * rect.velocity;
	rect.position.y += rect.versor.y * rect.velocity;
	rect.center.x = rect.position.x + rect.width * 0.5;
	rect.center.y = rect.position.y + rect.height * 0.5;
	checkBorder(rect);
}
function checkBorder(rect){
	if (rect.position.x + rect.width >= c.width){
		rect.versor.x *= -1;
	}
	if (rect.position.y + rect.height >= c.height){
		rect.versor.y *= -1;
	}
	if (rect.position.x < 0){
		rect.versor.x *= -1;
	}
	if (rect.position.y < 0){
		rect.versor.y *= -1;
	}
}

function checkColisionsNaive(array){
	var i, j;
	for (i = 0; i < array.length; i++){
		for (j=i+1; j < array.length; j++){
			if (overlap(array[i], array[j])){
				array[i].hit=true;
				array[j].hit=true;
			}
		}
	}
}

function smallest(width, height){
	if (width <= height){
		return width;
	}
	return height;	
}

function overlap(objA, objB){

}

function testSTA(objA, objB){

}

function drawRect(rect){
	ctx.beginPath();
	if (rect.hit == false){
		ctx.fillStyle="#000000";
	}
	else{
		ctx.fillStyle="#FF0000";
	}
	ctx.save();
	ctx.translate(rect.center.x, rect.center.y);
	ctx.rotate(rect.spin * Math.PI/180);
	ctx.fillRect(-rect.width/2,
		     -rect.height/2,
		     rect.width,
		     rect.height);
	ctx.stroke();
	ctx.fillStyle="#00FF00";
	ctx.fill();
	ctx.arc(0, 0, 
		smallest(rect.width, rect.height)/10,
		0, 2*Math.PI);
	ctx.restore();


}

function randomRect(maxSize, minSize, maxSpeed){

	var xpos = Math.ceil(Math.random() * c.width/2) + maxSize;
	var ypos = Math.ceil(Math.random() * c.height/2) + maxSize;
	var width = Math.ceil(Math.random() * maxSize) + minSize;
	var height = Math.ceil(Math.random() * maxSize) + minSize;
	var direction = Math.round(Math.random() + 1);
	direction = Math.pow(-1, direction);
	var spin = Math.ceil(Math.random() * 360 * direction);
	rect = new Rect(xpos, ypos, 	// x, y
			width, height,	
			Math.random(), Math.random(),	// vx, vy 
			maxSpeed, spin);

	return rect;
}

var i = 0;
var maxSize = c.width/10;
var minSize = c.width/100;
var maxSpeed = 2;
var numberObjects = 200;
var objects = [];

for (i = 0; i < numberObjects; i++){
	objects.push(new randomRect(maxSize, minSize, maxSpeed));
	
}
function mainLoop(){

	ctx.fillStyle="#FFFF00";
	ctx.fillRect(0,0,c.width,c.height);

	for (i = 0; i < objects.length; i++){
	updateRect(objects[i]);
	drawRect(objects[i]);


	}

	requestAnimationFrame(mainLoop);
}

mainLoop();