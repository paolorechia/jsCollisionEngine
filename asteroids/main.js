updateResEvent = function(canvas) {
          window.addEventListener('resize', function(event) {
            canvas.width = window.innerWidth-20;
            canvas.height = window.innerHeight-20;
		  });
}

var Score = function(){
	this.player = 0;
	this.draw = function(){
		ctx.beginPath();
		ctx.fillStyle="#000FFF";
		ctx.font="14px Arial";
		string = "Score: " + this.player;
		ctx.fillText(string, c.width/2 - 40, c.height - 20);
	}
}
var Level = function(){
	this.current = 0;
	this.max = 20;
	this.draw = function(){
		ctx.beginPath();
		ctx.fillStyle="#000FFF";
		ctx.font="14px Arial";
		string = "Level: " + this.current;
		ctx.fillText(string, c.width/2 + 40, c.height - 20);
	}
	this.start = function(){

		player.setImmunity(3);
		player.hp += 10;
		if (this.current <= 12){
			var maxSize = c.width/20 + (this.current * 2);
			var minSize = c.width/100 + (this.current * 2);
			var maxSpeed = Math.round(this.current * 0.7);
			var maxSpin = Math.floor(this.current *0.2);
			var numberRectangles = Math.round(this.current * 0.6);
			var numberTriangles = Math.round(this.current * 0.4);
			for (i = 0; i < numberRectangles; i++){
			objects.push(new randomRect(maxSize, minSize, maxSpeed, maxSpin));
			objects[i].hp = Math.round(Math.sqrt(objects[i].mass));
			objects[i].dead == false;
			}
			for (i = 0; i < numberTriangles; i++){
			objects.push(new randomTriangle(maxSize, minSize, maxSpeed, maxSpin));
			objects[numberRectangles + i].hp = Math.round(Math.sqrt(objects[i].mass));
			objects[numberRectangles + i].dead == false;
			}
		}
		else if (this.current >= 13 && this.current <= 15){
			var maxSize = c.width/400;
			var minSize = c.width/500;
			var maxSpeed = Math.round(this.current * 0.5);
			var maxSpin = Math.floor(this.current * 0.2);
			var numberRectangles = Math.round(this.current * 2);
			var numberTriangles = Math.round(this.current);
			for (i = 0; i < numberRectangles; i++){
			objects.push(new randomRect(maxSize, minSize, maxSpeed, maxSpin));
			objects[i].hp = Math.round(Math.sqrt(objects[i].mass));
			objects[i].dead == false;
			}
			for (i = 0; i < numberTriangles; i++){
			objects.push(new randomTriangle(maxSize, minSize, maxSpeed, maxSpin));
			objects[numberRectangles + i].hp = Math.round(Math.sqrt(objects[i].mass));
			objects[numberRectangles + i].dead == false;			
			}
		}
		else{
			var maxSize = c.width/20 + (this.current * 2);
			var minSize = c.width/100 + (this.current * 2);
			var maxSpeed = Math.round(this.current * 0.7);
			var maxSpin = Math.floor(this.current *0.2);
			var numberRectangles = Math.round(this.current * 0.1);
			var numberTriangles = Math.round(this.current * 0.1);
			for (i = 0; i < numberRectangles; i++){
			objects.push(new randomRect(maxSize, minSize, maxSpeed, maxSpin));
			objects[i].hp = Math.round(Math.sqrt(objects[i].mass));
			objects[i].dead == false;
			}
			for (i = 0; i < numberTriangles; i++){
			objects.push(new randomTriangle(maxSize, minSize, maxSpeed, maxSpin));
			objects[numberRectangles + i].hp = Math.round(Math.sqrt(objects[i].mass));
			objects[numberRectangles + i].dead == false;
			}			
			var maxSize = c.width/400;
			var minSize = c.width/500;
			var maxSpeed = Math.round(this.current * 0.5);
			var maxSpin = Math.floor(this.current * 0.2);
			var numberRectangles = Math.round(this.current * 2);
			var numberTriangles = Math.round(this.current);
			for (i = 0; i < numberRectangles; i++){
			objects.push(new randomRect(maxSize, minSize, maxSpeed, maxSpin));
			objects[i].hp = Math.round(Math.sqrt(objects[i].mass));
			objects[i].dead == false;
			}
			for (i = 0; i < numberTriangles; i++){
			objects.push(new randomTriangle(maxSize, minSize, maxSpeed, maxSpin));
			objects[numberRectangles + i].hp = Math.round(Math.sqrt(objects[i].mass));
			objects[numberRectangles + i].dead == false;			
			}			
		}
	}
	this.next = function(){
		this.current++;
	}
}
var Game = function(){
	this.over = false;
}


function buildInstructions(){
	var instructions = [];
	
	var string;
	string = "W: Main Engine Throttle";
	instructions.push(string);
	string = "Q: Reverse Engine Throttle";
	instructions.push(string);
	string = "A: Left turning";
	instructions.push(string);
	string = "D: Right turning";
	instructions.push(string);
	string = "Q: Left strafe";
	instructions.push(string);
	string = "E: Right strafe";
	instructions.push(string);
	string = "S: Advanced Braking System";
	instructions.push(string);
	string = "Space: Shoot";
	instructions.push(string);
	string = "X: Auto-Fire";
	instructions.push(string);
	string = "Click: Auto-pilot to given point (locks down the ship)";
	instructions.push(string);	
	return instructions;
}
function drawInstructions(instructions){
	ctx.beginPath();
	ctx.fillStyle="#000FFF";
	ctx.font="14px Arial";
	var offSet = 0;
	var xStart = 230;
	var colSize = 3;
	for (var i = 0; i < instructions.length; i++){
		if (i % colSize == 0){
			offSet += 240;
		}
		ctx.fillText(instructions[i], offSet - xStart, 40 + (i % colSize) * 20);
	}
}

function drawEndGame(win){
	if (win){
		ctx.beginPath();
		ctx.fillStyle="#000FFF";
		ctx.font="28px Arial";
		ctx.fillText("Congratulations! You've won! Press F5 to restart.", c.width/3, c.height/2);		
		
	}
	else{
		ctx.beginPath();
		ctx.fillStyle="#000FFF";
		ctx.font="28px Arial";
		ctx.fillText("You've died! Press F5 to restart.", c.width/3, c.height/2);
	}
}


var Phases = function(){
		this.phase1 = false;
		this.phase2 = false;
		this.phase3 = false;
		this.phase4 = false;
		this.phase5 = false;
		this.phase6 = false;
		this.current = 0;
}

var Weapon = function(){

	this.firing=false;
	this.rateOfFire = 8;		// shots per second
	this.lockDown = false;
	this.position = new Point(0, 0);
	this.center = new Point(0, 0);
	this.direction = new Vector(0, 0);
	this.projectileVelocity = 10;
	this.projectileWidth = 1;
	this.range = 1000; // range in pixels
	this.limit = 10;
	this.damage = 10;
	this.projectileHeight = this.projectileVelocity * 2;
	this.projectiles = [];
	
	this.setPosition = function(point){
		this.position = point; // creates a reference to the variable, not a copy (usually the ship's location)
	}
	this.setCenter = function(point){
		this.center = point;
	}
	this.updateDirection = function(){
		calculateVector(this.position, this.center, this.direction);
		unitVector(this.direction, this.direction);
	}
	
	this.updateFiring = function(shipSpeed){
		if (this.projectiles.length > this.limit || this.firing == false || this.lockDown == true){
			return;
		}
//		console.log("fire!");
		this.lockDown = true;
		var projectile = new Rect(this.position.x, this.position.y, this.projectileWidth, this.projectileHeight,
									   this.direction.x, this.direction.y,
									   this.projectileVelocity + shipSpeed, 0);
		projectile.hit = false;
		projectile.duration = 120;
		yAxis = new Vector(0, 1);
		var angle = angleVectors(this.direction, yAxis);
		if (this.position.x > this.center.x){
			angle *= -1;
		}
		projectile.duration = this.range/this.projectileVelocity;
		rotatePolygon(projectile,radiansToDegrees(angle));
		this.projectiles.push(projectile);
		this.resetLockDown(this);
	}
	this.fire = function(pressed){
		this.firing = pressed;
	}
	this.updateDuration = function(){
		for (var i = 0; i < this.projectiles.length; i++){
			this.projectiles[i].duration--;
			if (this.projectiles[i].duration <= 0){
				this.projectiles.splice(i, 1);
			}
		}
	}
	this.autoFire = function(){
		if (this.firing == true){
			this.firing = false;
		}
		else this.firing = true;
	}
	this.resetLockDown = function(weapon){
		setTimeout(function(){weapon.lockDown = false;}, 1000/this.rateOfFire);
	}
	this.rotateAtBorder = function(axis, projectile){
//		console.log(axis);
		if (axis == 'x'){
			rotatingVersor = new Vector(-projectile.versor.x, projectile.versor.y)
			var theta = angleVectors(projectile.versor, rotatingVersor);
			theta = radiansToDegrees(theta);
			if (rotatingVersor.y > 0){
				theta *= -1;
			}
			if (rotatingVersor.x > 0){
				theta *= -1;
			}
		}
		else if (axis == 'y'){
			rotatingVersor = new Vector(projectile.versor.x, -projectile.versor.y)
			var theta = angleVectors(projectile.versor, rotatingVersor);
			theta = radiansToDegrees(theta);
			if (rotatingVersor.x < 0){
				theta *= -1;
			}
			
			if (rotatingVersor.y > 0){
				theta *= -1;
			}
		}	
		rotatePolygon(projectile, theta);		
	//	console.log(theta);
	}
	this.onHit = function(target){
		target.hp -= this.damage;
		if (target.hp <= 0){
			target.dead=true;
		}
	}
	this.removeProjectiles = function(){
		for (var i = 0; i < this.projectiles.length; i++){
			if (this.projectiles[i].hit == true){
				this.projectiles.splice(i, 1);
				i--;
			}
		}
	}
}


var Ship = function(x, y, l1){
	this.hitbox = new Triangle(x, y, l1,
						0, 0,			// vx, vy
						0, 0);			// velocity, spin
	

	this.hp = 100;
	this.immunity = false;
	this.weapon = new Weapon();
	this.lock = false;
	this.engineOn = false;
	this.reverseEngine = false;
	this.braking = false;
	this.isTurning = false;
	this.isStrafing = false;
	this.strafingSide = 0; // 0 for left; -1 for right
	this.acceleration = 0.25;
	this.maxSpeed = 6;
	this.turnRate = 5;
	this.turning = false;
	this.rotate = 0;
	this.front = new Point(this.hitbox.vertices[2].x,
						   this.hitbox.vertices[2].y);
	
	this.inertiaVector = new Vector(0, 0);
	this.engineVersor = new Vector(0, 0);
	this.engineVector = new Vector(0, 0);
	this.strafingVector = new Vector(0, 0);
	
	this.autoPath = new Point(0, 0);
	
	this.updateDirection = function(){

		if (!this.engineOn && !this.reverseEngineOn && this.braking == false){
			return;
		}
		
		this.inertiaVector.x = this.hitbox.versor.x * this.hitbox.velocity;
		this.inertiaVector.y = this.hitbox.versor.y * this.hitbox.velocity;
		
		if (this.engineOn){
			calculateVector(this.front, this.hitbox.center, this.engineVersor);
			unitVector(this.engineVersor, this.engineVersor);
			this.engineVector.x = this.engineVersor.x * this.acceleration;
			this.engineVector.y = this.engineVersor.y * this.acceleration;
		}
		else{
			if (this.braking){ //Advanced Braking System
				unitVector(this.inertiaVector, this.engineVersor);
				this.engineVersor.x *= -1;
				this.engineVersor.y *= -1;
				if (this.acceleration > this.hitbox.velocity){
					this.engineVector.x = this.engineVersor.x * this.hitbox.velocity;
					this.engineVector.y = this.engineVersor.y * this.hitbox.velocity;
				}
				else{
					this.engineVector.x = this.engineVersor.x * this.acceleration;
					this.engineVector.y = this.engineVersor.y * this.acceleration;	
				}
			}
			else { // reverseEngine
				calculateVector(this.front, this.hitbox.center, this.engineVersor);
				unitVector(this.engineVersor, this.engineVersor);
				if (this.reverseEngineOn){
					this.engineVersor.x *= -1;
					this.engineVersor.y *= -1;
				this.engineVector.x = this.engineVersor.x * this.acceleration;
				this.engineVector.y = this.engineVersor.y * this.acceleration;
				}
			}
		}

		var aux = new Vector(this.engineVector.x + this.inertiaVector.x,
							 this.engineVector.y + this.inertiaVector.y);
		var calculatedSpeed = norm(aux);
		if (calculatedSpeed <= this.maxSpeed){
			if (calculatedSpeed == 0){
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

	}
	this.updatePosition = function(){
		this.hitbox.update(); 
		this.front.x = this.hitbox.vertices[2].x
		this.front.y = this.hitbox.vertices[2].y
		
	}
	this.updateTurn = function(){
		if (this.isTurning){
			rotatePolygon(this.hitbox, this.rotate);
		}
	}
	this.turn = function(side, isTurning){
		this.isTurning = isTurning;
		if (side == 'l'){
			this.rotate = -this.turnRate;
		}
		else{
			this.rotate = this.turnRate;
		}
	}
	this.updateStrafe = function(){
		if (!this.isStrafing){
			return;
		}
		this.inertiaVector.x = this.hitbox.versor.x * this.hitbox.velocity;
		this.inertiaVector.y = this.hitbox.versor.y * this.hitbox.velocity;

		var mid = new midPoint(this.hitbox.vertices[0], this.hitbox.vertices[1]);
		if (this.strafingSide == -1){
			calculateVector(mid, this.hitbox.vertices[0], this.strafingVector);
		}
		else{
			calculateVector(mid, this.hitbox.vertices[1], this.strafingVector);
		}
		
		unitVector(this.strafingVector, this.strafingVector);
		this.strafingVector.x = this.strafingVector.x * this.acceleration/3;
		this.strafingVector.y = this.strafingVector.y * this.acceleration/3;

		var aux = new Vector(this.strafingVector.x + this.inertiaVector.x,
							 this.strafingVector.y + this.inertiaVector.y);
		var calculatedSpeed = norm(aux);
		if (calculatedSpeed <= this.maxSpeed){
			if (calculatedSpeed == 0){
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
		
	}
	this.strafe = function(side, isStrafing){
		this.isStrafing = isStrafing;
		if (side == 'l'){
			this.strafingSide = 1;	// left side
		}
		else{
			this.strafingSide = -1; // right side
		}
	}
	this.throttle = function(pressed){
		this.engineOn = pressed;
	}
	this.brake = function(pressed){
		this.braking = pressed;
	}
	this.reverseThrottle = function(pressed){
		this.reverseEngineOn = pressed;
	}
	this.calculateAngle = function(autoPath){		//autoPath is a given (x,y) point
		pathVector = new Vector(0, 0);
		frontVector = new Vector(0, 0);
		calculateVector(autoPath, this.hitbox.center, pathVector);
		if (this.hitbox.velocity == 0){
			calculateVector(this.front, this.hitbox.center, frontVector);
			unitVector(frontVector, frontVector);
			
		}
		else{
			frontVector.x = this.engineVersor.x;
			frontVector.y = this.engineVersor.y;
		}
		translatedPoint = new Point(this.hitbox.center.x - autoPath.x, this.hitbox.center.y - autoPath.y);
		list = [];
		list.push(translatedPoint);
		rotatedVector = new Vector(0, 0);
		var theta = degreesToRadians(90);
		rotatedVector.x = frontVector.x * Math.cos(theta) - frontVector.y * Math.sin(theta);
		rotatedVector.y = frontVector.x * Math.sin(theta) + frontVector.y * Math.cos(theta);
		myProjection = projection(list, rotatedVector);
		this.pathAngle = angleVectors(frontVector, pathVector);
		this.pathAngle = radiansToDegrees(this.pathAngle);
			if (myProjection.min > 0){
				this.pathAngle *= -1;
			}

	}
	this.drawAutoPath = function(){
		if (!this.lock){
			return;
		}
		ctx.setLineDash([4]);
		ctx.strokeStyle="#0000FF";
		ctx.beginPath();
		ctx.moveTo(this.hitbox.center.x, this.hitbox.center.y);
		ctx.lineTo(this.autoPath.x, this.autoPath.y);
		ctx.stroke();
		ctx.setLineDash([0]);
	}
	this.autoRotate = function(){
		if (this.pathAngle == 0){
			return;
		}
		if (this.pathAngle > 0){
			if (this.pathAngle >= this.turnRate){
				this.pathAngle -= this.turnRate;
				rotatePolygon(this.hitbox, this.turnRate);
			}
			else{
				rotatePolygon(this.hitbox, this.pathAngle);
				this.pathAngle = 0;				
			}
		}
		else{
			if (this.pathAngle < this.turnRate){
				this.pathAngle += this.turnRate;
				rotatePolygon(this.hitbox, -this.turnRate);
			}
			else{
				rotatePolygon(this.hitbox, this.pathAngle);
				this.pathAngle = 0;
			}
		}
	}
	this.autoPilot = function(){ 	// auto-pilot function to move to coordinates
		if (!this.lock){
			return;
		}
		if (this.autoStatus.phase1){
			this.calculateAngle(this.autoPath);
			this.autoStatus.phase1 = false;
			this.autoStatus.current++;
			return;
		}


		if (this.autoStatus.phase2){
			this.throttle(false);
			this.brake(true);
			if (this.hitbox.velocity == 0){
				this.autoStatus.phase2 = false;
				this.brake(false);
				this.autoStatus.current++;
			}
			return;

		}
		
		if (this.autoStatus.phase3){
			this.calculateAngle(this.autoPath);
			this.autoStatus.phase3 = false;
			return;

		}
		
		if (this.autoStatus.phase4){
			this.autoRotate();
			if (this.pathAngle == 0){
				this.autoStatus.phase4 = false;
			}
			return;
			
		}
		if (this.autoStatus.phase5){
			var dist = distance(this.hitbox.center, this.autoPath);
//			console.log(this.hitbox.center);
//			console.log(this.autoPath);
//			console.log(dist);
			var timeToStop = this.hitbox.velocity / this.acceleration;
			var ETA = dist / this.hitbox.velocity;
			if (ETA > timeToStop){
				this.throttle(true);
			}
			else{
				this.autoStatus.phase5 = false;
				this.throttle(false);
			}
			return;
		}
		
		if (this.autoStatus.phase6){
			this.brake(true);
			if (this.hitbox.velocity == 0){
				this.autoStatus.phase6 = false;
				this.brake(false);
			}
			this.lock = false;
			//console.log("System unlocked!");
			return;
		}
	}
	this.autoStatus = new Phases();
	this.setupAutoPilot = function(coord){
		this.autoPath = new Point(coord.x, coord.y);
		this.autoStatus.phase1 = true;
		this.autoStatus.phase2 = true;		
		this.autoStatus.phase3 = true;
		this.autoStatus.phase4 = true;
		this.autoStatus.phase5 = true;
		this.autoStatus.phase6 = true;
		this.autoStatus.current = 0;
	}
	this.drawStatus = function(){
		ctx.beginPath();
		ctx.font="14px Arial";
		ctx.fillStyle="#FF0000";
		string = "HP: " + this.hp;
		ctx.fillText(string, c.width - 200, 30);
		string = "Immunity: " + this.immunity;
		ctx.fillText(string, c.width - 200, 60);
	}
	this.draw = function(polygon = this.hitbox){
		ctx.beginPath();
		if (polygon.hit == true){
			ctx.strokeStyle="#FF0000";
			ctx.fillStyle="#FF0000";
		}
		else{
			ctx.strokeStyle="#0000FF";
			ctx.fillStyle="#0000FF";
		}
		
		for (var i = 0; i < polygon.vertices.length; i++){
			ctx.beginPath();
			ctx.arc(polygon.vertices[i].x,
			polygon.vertices[i].y,
			3, 0, 2*Math.PI);
			if (i == 2){
				ctx.fillStyle="#00F0FF";
			}
			ctx.fill();
		}
		for (var i = 0; i < polygon.vertices.length - 1; i++){
			ctx.beginPath();
//			ctx.strokeStyle="#0000FF";
			ctx.moveTo(polygon.center.x, polygon.center.y);
			ctx.lineTo(polygon.vertices[i].x, polygon.vertices[i].y);
			ctx.stroke();
		}
		for (var i = 0; i < polygon.vertices.length - 1; i++){
			ctx.beginPath();
//			ctx.strokeStyle="#0000FF";
			ctx.moveTo(polygon.vertices[2].x, polygon.vertices[2].y);
			ctx.lineTo(polygon.vertices[i].x, polygon.vertices[i].y);
			ctx.stroke();
		}
			
		if (polygon.center != undefined){
			ctx.fillStyle="#00F0FF";
			ctx.beginPath();
			ctx.arc(polygon.center.x,
					polygon.center.y,
					3, 0, 2*Math.PI);
			ctx.fill();
		}
		if (this.immunity == true){
			ctx.strokeStyle="#008088";
			ctx.beginPath();
			ctx.arc(polygon.center.x,
					polygon.center.y,
					polygon.side + 2, 0, 2*Math.PI);
			ctx.stroke();	
		}
	}
	this.setImmunity = function(seconds){
		this.immunity = true;
		setTimeout(function(){this.player.immunity = false;}, seconds * 1000);
	}
}

function killObjects(objects){
	for (i = 0; i < objects.length; i++){
		if (objects[i].dead == true){
			objects.splice(i, 1);
			score.player++;
		}
	}
}

function drawAsteroid(polygon){
	ctx.beginPath();
	ctx.lineWidth=3;
	if (polygon.hit == true){
		ctx.strokeStyle="#FF0000";
	}
	else{
		ctx.strokeStyle="#FFFFFF";
	}
	ctx.moveTo(polygon.vertices[0].x,
			   polygon.vertices[0].y);

	for (var i =0; i < polygon.vertices.length; i++){
		ctx.lineTo(polygon.vertices[i].x,
				   polygon.vertices[i].y);		
	}
	ctx.lineTo(polygon.vertices[0].x,
			   polygon.vertices[0].y);
			   
	ctx.stroke();
	ctx.fillStyle="#FFFFFF";
}


	

c.width = window.innerWidth-20;
c.height = window.innerHeight-20;
updateResEvent(c);

var j = 0;


var objects = [];

var lastDate = new Date();
var fps = new Fps();
var maxFPS = 1000;
var interval = 1000/maxFPS;

var score = new Score();
var level = new Level();
var instructions = buildInstructions();

var objects = [];

var player = new Ship(c.width/2, c.height/2, 20);
player.updateDirection();
player.weapon.setPosition(player.front);
player.weapon.setCenter(player.hitbox.center);

var game = new Game();
function mainLoop(){
	newDate = new Date();
	elapsedTime = newDate - lastDate;
	lastDate = new Date();
	fps.add(elapsedTime);

	ctx.fillStyle="#000000";
	ctx.fillRect(0,0,c.width,c.height);

	drawInstructions(instructions);

	if (objects.length == 0 && level.current <= level.max){
		level.next();
		if (level.current <= level.max){
			level.start();
		}
	}

	for (var i = 0; i < objects.length; i++){
		objects[i].update();
		checkBorder(objects[i]);
		calculateAxes(objects[i]);
		rotatePolygon(objects[i], objects[i].spin);
	}
	if (player.hp <= 0){
		drawEndGame(false);
	}
	else{
		player.updateDirection();
		player.updateStrafe();
		player.updatePosition();
		player.updateTurn();
		player.weapon.updateDirection(player.hitbox.center);
		player.hitbox.update();
		player.weapon.updateFiring(player.hitbox.velocity);
		for (var i = 0; i < player.weapon.projectiles.length; i++){
			for (var j = 0; j < objects.length; j++){
				calculateAxes(player.weapon.projectiles[i])
				smartCollision(player.weapon.projectiles[i], objects[j], function(){player.weapon.onHit(objects[j])});
			}
		}
		checkBorder(player.hitbox);
		calculateAxes(player.hitbox);
		rotatePolygon(player.hitbox, player.hitbox.spin);	
	}
	if (level.current > level.max){
		drawEndGame(true);
	}
	player.weapon.updateDuration();
		for (var i = 0; i < objects.length; i++){
			mtv = collisionSTA(player.hitbox, objects[i]);
			if (mtv){
				elasticCollision(player.hitbox, mtv, objects[i]);
				if (player.immunity == false){
					player.hp -=10;
				}
			}
		}

		
		player.weapon.removeProjectiles();
		for (var k = 0; k < player.weapon.projectiles.length; k++){
			player.weapon.projectiles[k].update();
			checkBorder(player.weapon.projectiles[k], function(){player.weapon.rotateAtBorder(axis, player.weapon.projectiles[k])});
			drawPolygon(player.weapon.projectiles[k]);
		}

		player.autoPilot();
		if (player.hp >= 0){
			player.drawAutoPath();
			player.draw();
		}
		player.drawStatus();
		for (var i = 0; i < objects.length; i++){
			drawAsteroid(objects[i]);
		}

	killObjects(objects);
	checkColisionsNaive(objects);
	score.draw();
	level.draw();
	
	fps.calculateMean();
	drawFPS(fps.mean);
	setTimeout(function(){
		requestAnimationFrame(mainLoop)
	}, interval);
}

mainLoop();
