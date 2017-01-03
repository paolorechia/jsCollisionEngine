// redefining checkBorder to count points
// 
updateResEvent = function(canvas) {
          window.addEventListener('resize', function(event) {

            //--- Para alterar a resolução mantendo a res. do jogo (buga a mira)
            //$(canvas).css('width', window.innerWidth-3)
            //$(canvas).css('height', window.innerHeight-3)
            //-------------------------
            
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
						
	this.acceleration = 0;
	this.maxSpeed = 10;
	this.minSpeed = -4;
	
	
	this.front = new Point(x + l1 *0.5, y + l1);
	
	this.inertiaVersor = new Vector(0, 0);
	this.inertiaVector = new Vector(0, 0);
	this.engineVersor = new Vector(0, 0);
	this.engineVector = new Vector(0, 0);
	this.directionVersor = new Vector(0, 0);
	this.directionVector = new Vector(0, 0);
	
	this.updateDirection = function(){
		calculateVector(this.front, this.hitbox.center, this.engineVersor);
		unitVector(this.engineVersor, this.engineVersor);
		this.engineVector.x += this.engineVersor.x * this.acceleration;
		this.engineVector.y += this.engineVersor.y * this.acceleration;

		this.directionVector.x = this.engineVector.x + this.inertiaVector.x;
		this.directionVector.y = this.engineVector.y + this.inertiaVector.y;
		unitVector(this.directionVector, this.directionVersor);
	}
	
	this.updatePosition = function(){
		this.hitbox.applyVector(this.directionVector);
		this.hitbox.update();
	}
	
	this.rotate = new function(){
		
		
	}
	
	this.throttle = new function(pressed){
		if (pressed){
			if (this.acceleration < this.maxSpeed){
				this.acceleration += 1;
			}
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


	player.updatePosition();
	for (var i = 0; i < objects.length; i++){
//		objects[i].hitbox.update;

		checkBorder(objects[i].hitbox);
		calculateAxes(objects[i].hitbox);
		drawPolygon(objects[i].hitbox);
		
	}


//	checkColisionsNaive(objects);
	drawFPS(fps.mean());
	setTimeout(function(){
		requestAnimationFrame(mainLoop)
	}, interval);
}

mainLoop();
