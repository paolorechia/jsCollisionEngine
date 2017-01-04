updateResEvent = function(canvas) {
          window.addEventListener('resize', function(event) {
            canvas.width = window.innerWidth-20;
            canvas.height = window.innerHeight-20;
		  });
}
updateResEvent(c);
c.width = window.innerWidth-20;
c.height = window.innerHeight-20;

var Score = function(){
	this.player = 0;
	this.enemy = 0;
}

function drawScore(score){
	ctx.beginPath();
	ctx.fillStyle="#000FFF";
	ctx.font="14px Arial";
	string = "Player: " + score.player;
	ctx.fillText(string, 10, 40);
	ctx.stroke();
	string = "Computer: " + score.enemy;
	ctx.fillText(string, c.width - 100, 40);
	ctx.stroke();
}


var j = 0;
var maxSize = c.width/10;
var minSize = c.width/100;
var maxSpeed = 6;
var maxSpin = 4;
var numberRectangles = 4;
var numberTriangles = 4;
var objects = [];

var axis_length = 20;
var lastDate = new Date();
var fps = new Fps();
var maxFPS = 40;
var interval = 1000/maxFPS;

var score = new Score();
maxScore = 5;

var ship = function(x, y, l1){
	this.hitbox = new Triangle(x, y, l1,
						0, 0,			// vx, vy
						0, 0);			// velocity, spin
	

		
	this.engineOn = false;
	this.acceleration = 2.5;
	this.maxSpeed = 10;
	this.turnRate = 15;
	this.turning = false;
	this.rotate = 0;
	this.front = new Point(this.hitbox.vertices[2].x,
						   this.hitbox.vertices[2].y);
	
	this.inertiaVector = new Vector(0, 0);
	this.engineVersor = new Vector(0, 0);
	this.engineVector = new Vector(0, 0);
	
	this.updateDirection = function(){

		if (!this.engineOn){
			return;
		}
		calculateVector(this.front, this.hitbox.center, this.engineVersor);
		unitVector(this.engineVersor, this.engineVersor);
		this.engineVector.x = this.engineVersor.x * this.acceleration;
		this.engineVector.y = this.engineVersor.y * this.acceleration;

		this.inertiaVector.x = this.hitbox.versor.x * this.hitbox.velocity;
		this.inertiaVector.y = this.hitbox.versor.y * this.hitbox.velocity;

		var aux = new Vector(this.engineVector.x + this.inertiaVector.x,
							 this.engineVector.y + this.inertiaVector.y);
		var calculatedSpeed = norm(aux);
		if (calculatedSpeed <= this.maxSpeed){
			if (calculatedSpeed == 0){
				this.engineOn = false;
				this.hitbox.velocity = calculatedSpeed;
				this.hitbox.versor.x = 0;
				this.hitbox.versor.y = 0;
			}
			else{
				unitVector(aux, aux);
				this.hitbox.velocity = calculatedSpeed;
				this.hitbox.versor.x = aux.x;
				this.hitbox.versor.y = aux.y;
			}				
		}
		this.engineOn = false;
	}
	this.updatePosition = function(){
		this.hitbox.update(); 
		this.front.x = this.hitbox.vertices[2].x
		this.front.y = this.hitbox.vertices[2].y
		
	}
	this.updateTurn = function(){
		this.hitbox.spin = 0;
		if (!this.turning){
			return;
		}
		rotatePolygon(this.hitbox, this.rotate);
		this.turning = false;
	}
	this.turn = function(side){
		this.turning = true;
		if (side == 'l'){
			this.rotate = - this.turnRate;
		}
		else{
			this.rotate = this.turnRate;
		}
	}
	this.throttle = function(pressed){
		if (pressed){
				this.engineOn = true;
		}
	}
}

var player = new ship(c.width/2, c.height/2, 20);

player.updateDirection();

var maxSize = c.width/10;
var minSize = c.width/300;
var maxSpeed = 6;
var maxSpin = 4;
var numberRectangles = 4;
var numberTriangles = 4;
var objects = [];
objects.push(player.hitbox);
for (i = 0; i < numberRectangles; i++){
	objects.push(new randomRect(maxSize, minSize, maxSpeed, maxSpin));

}
for (i = 0; i < numberTriangles; i++){
	objects.push(new randomTriangle(maxSize, minSize, maxSpeed, maxSpin));
}
var axis_length = 20;
function mainLoop(){
	newDate = new Date();
	elapsedTime = newDate - lastDate;
	lastDate = new Date();
	fps.add(elapsedTime);

	ctx.fillStyle="#FFFF00";
	ctx.fillRect(0,0,c.width,c.height);

	
	player.updateDirection();
	player.updatePosition();
	player.updateTurn();
	for (var i = 0; i < objects.length; i++){

		objects[i].update();
		checkBorder(objects[i]);
		calculateAxes(objects[i]);
		rotatePolygon(objects[i], objects[i].spin);

	}
	checkColisionsNaive(objects);
	for (var j = 0; j < objects.length; j++){
		drawPolygon(objects[j]);
	}

	/*
	console.log(player.hitbox.velocity);
	console.log(player.hitbox.versor);
	console.log(player.inertiaVector);
	console.log(player.engineVector);
	*/
//	checkColisionsNaive(objects);
	drawFPS(fps.mean());
	setTimeout(function(){
		requestAnimationFrame(mainLoop)
	}, interval);
}

mainLoop();
