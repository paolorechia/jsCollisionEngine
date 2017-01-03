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
	this.acceleration = 0.01;
	this.maxSpeed = 3;
	
	this.front = new Point(this.hitbox.vertices[2].x,
						   this.hitbox.vertices[2].y);
	
	this.inertiaVersor = new Vector(0, 0);
	this.inertiaVector = new Vector(0, 0);
	this.engineVersor = new Vector(0, 0);
	this.engineVector = new Vector(0, 0);
	this.directionVersor = new Vector(0, 0);
	this.directionVector = new Vector(0, 0);
	
	this.updateDirection = function(){

		if (!this.engineOn){
			return;
		}
		calculateVector(this.front, this.hitbox.center, this.engineVersor);
		unitVector(this.engineVersor, this.engineVersor);
		this.engineVector.x += this.engineVersor.x * this.acceleration;
		this.engineVector.y += this.engineVersor.y * this.acceleration;

		var aux = new Vector(this.engineVector.x + this.inertiaVector.x,
							 this.engineVector.y + this.inertiaVector.y);
		var calculatedSpeed = norm(aux);
		if (calculatedSpeed <= this.maxSpeed){
			this.velocity = calculatedSpeed;
			this.directionVector.x = aux.x;
			this.directionVector.y = aux.y;
			unitVector(this.directionVector, this.directionVersor);
			this.engineOn = false;
		}
	}
	
	this.updatePosition = function(){
		this.hitbox.applyVector(this.directionVector);
		this.hitbox.update();
		this.inertiaVector.x = this.directionVector.x;
		this.inertiaVector.y = this.directionVector.y;
		this.front.x = this.hitbox.vertices[2].x
		this.front.y = this.hitbox.vertices[2].y
		
	}
	this.rotate = function(){
		
		
	}
	this.throttle = function(pressed){
		if (pressed){
				this.engineOn = true;
		}
	}
}

var player = new ship(c.width/2, c.height/2, 20);
objects.push(player);
player.updateDirection();

function mainLoop(){
	newDate = new Date();
	elapsedTime = newDate - lastDate;
	lastDate = new Date();
	fps.add(elapsedTime);

	ctx.fillStyle="#FFFF00";
	ctx.fillRect(0,0,c.width,c.height);

	
	player.updateDirection();
	player.updatePosition();
	
	for (var i = 0; i < objects.length; i++){
//		objects[i].hitbox.update;

		checkBorder(objects[i].hitbox);
		calculateAxes(objects[i].hitbox);
		drawPolygon(objects[i].hitbox);
		
	}
	console.log(player.velocity);
	console.log(player.engineOn);
//	checkColisionsNaive(objects);
	drawFPS(fps.mean());
	setTimeout(function(){
		requestAnimationFrame(mainLoop)
	}, interval);
}

mainLoop();
