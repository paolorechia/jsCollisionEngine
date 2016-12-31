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

Vector = function(x, y){
	this.x=x;
	this.y=y;
}

Projection = function(min, max){
	this.min = min;
	this.max = max;
}

function distance(pointA, pointB){
	var x =  pointA.x - pointB.x;
	x = x * x;
	var y = pointA.y - pointB.y;
	y = y * y;
	return Math.sqrt(x - y);
}

function calculateVector(pointA, pointB, vector){
	vector.x = pointA.x - pointB.x;
	vector.y = pointA.y - pointB.y;
}

function norm(vector){
	var x1 = vector.x * vector.x;
	var y1 = vector.y * vector.y;
	return Math.sqrt(x1 + y1);
}

function normalVector1(pointA, pointB, vector){
	x = pointA.x - pointB.x;
	y = pointA.y - pointB.y;
	vector.x = -y
	vector.y =  x;
}
function normalVector2(pointA, pointB, vector){
	x = pointA.x - pointB.x;
	y = pointA.y - pointB.y;
	vector.x =  y
	vector.y = -x;
}

function unitVector(vector, unit){;
	var denom = norm(vector);
	unit.x = vector.x / denom;
	unit.y = vector.y / denom;
}

function dotProduct(vectorA, vectorB){
	return vectorA.x*vectorB.x + vectorA.y*vectorB.y;
}

function projection(vertices, axis){
	min = 99999;
	max = -99999; 
	var product;
	for (var i = 0; i < vertices.length; i++){
		product = dotProduct(vertices[i], axis);
		if (product > max){
			max = product;
		}
		if (product < min){
			min = product;
		}
	}
	var projection = new Projection(min, max);
	return projection;
}

function collisionSTA(polygonA, polygonB){
	var smallestOverlap = 999999;
	var smallestAxis = null;
	for (var i = 0; i < polygonA.axes.length; i++){
		projA = projection(polygonA.vertices, polygonA.axes[i]);
		projB = projection(polygonB.vertices, polygonA.axes[i]);
		over = (overlap(projA, projB));
		if (over == 0){
			return false;
		}
		if (over < smallestOverlap){
			smallestOverlap = over;
			smallestAxis = polygonA.axes[i];
		}
		
	}
	for (var i = 0; i < polygonB.axes.length; i++){
		projA = projection(polygonA.vertices, polygonB.axes[i]);
		projB = projection(polygonB.vertices, polygonB.axes[i]);
		if (over == 0){
			return false;
		}
		if (over < smallestOverlap){
			smallestOverlap=over;
			smallestAxis = polygonB.axes[i];
		}
	}
	polygonA.hit=true;
	polygonB.hit=true;
	var x = smallestAxis.x;
	var y = smallestAxis.y;
	var mtv = new Vector(x, y);
	return mtv;
}

function overlap(projA, projB){
	var overlap = 0;
	if (projB.min < projA.max){
		overlap = projB.min - projA.max;
	}
	else if(projA.min > projB.max){
		overlap = projA.min - projB.max;
	}
	return overlap;
}

// theta should be in degrees
function rotatePolygon(polygon, theta){
		theta *= theta * Math.PI / 180;
		for (i = 0; i < polygon.vertices.length; i++){
			polygon.vertices[i].x -= polygon.center.x;
			polygon.vertices[i].y -= polygon.center.y;
			x = polygon.vertices[i].x * Math.cos(theta) - polygon.vertices[i].y * Math.sin(theta);
			y = polygon.vertices[i].x * Math.sin(theta) + polygon.vertices[i].y * Math.cos(theta);
			polygon.vertices[i].x = x + polygon.center.x;
			polygon.vertices[i].y = y + polygon.center.y;
		}
}

var angle = 1 * Math.PI / 180;
var cos = Math.cos(angle);
var sin = Math.sin(angle);

function simpleRotate(polygon){
		for (i = 0; i < polygon.vertices.length; i++){
			polygon.vertices[i].x -= polygon.center.x;
			polygon.vertices[i].y -= polygon.center.y;
			x = polygon.vertices[i].x * cos - polygon.vertices[i].y * sin;
			y = polygon.vertices[i].x * sin + polygon.vertices[i].y * cos;
			polygon.vertices[i].x = x + polygon.center.x;
			polygon.vertices[i].y = y + polygon.center.y;
		}
}

function listToVertices(list){
	vertices = [];
	if (list.length % 2 != 0){
		console.log("Error: list is not a valid set of coordinates.");
	}
	for (var i = 0; i < list.length; i+=2){
		this.vertices[i/2]= new Point(list[i], list[i+1]);
	}
	return vertices;
}

function times2(a){
	return a * 2;
}

function drawPolygon(polygon){
	ctx.beginPath();
	if (polygon.hit == true){
		ctx.strokeStyle="#FF0000";
	}
	else{
		ctx.strokeStyle="#000000";
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
	ctx.fillStyle="#0000FF";
	for (var i = 0; i < polygon.vertices.length; i++){
		ctx.beginPath();
		ctx.arc(polygon.vertices[i].x,
		polygon.vertices[i].y,
		3, 0, 2*Math.PI);
		ctx.fill();
	}
	if (polygon.center != undefined){
		ctx.fillStyle="#00F0FF";
		ctx.beginPath();
		ctx.arc(polygon.center.x,
				polygon.center.y,
				3, 0, 2*Math.PI);
		ctx.fill();
	}
}

midPoint = function(pointA, pointB){
	vector = new Vector(0, 0);
	calculateVector(pointA, pointB, vector);
	vector.x = vector.x * 0.5;
	vector.y = vector.y * 0.5;
	this.x = pointA.x - vector.x;
	this.y = pointA.y - vector.y;
}	

function drawVector(origin, vector){
	ctx.beginPath();
	ctx.strokeStyle="#00FF00"
	ctx.moveTo(origin.x, origin.y);
	ctx.lineTo(origin.x + vector.x, origin.y + vector.y);
	ctx.stroke();
}

function calculateAxes(polygon){
	for (var i = 0; i < polygon.vertices.length-1; i++){
		normalVector1(polygon.vertices[i], polygon.vertices[i+1], polygon.axes[i]);
		unitVector(polygon.axes[i], polygon.axes[i]);
		
	}
	normalVector1(polygon.vertices[i], polygon.vertices[0], polygon.axes[i]);
	unitVector(polygon.axes[i], polygon.axes[i]);
}
function drawAxes(polygon, length){
	
	var axis = new Vector(0, 0);
	for (var i = 0; i < polygon.vertices.length-1; i++){
		var midpoint = new midPoint(polygon.vertices[i], polygon.vertices[i+1]);
		axis.x = polygon.axes[i].x * length;
		axis.y = polygon.axes[i].y * length;
		drawVector(midpoint, axis);
	}
	var midpoint = new midPoint(polygon.vertices[i], polygon.vertices[0]);
		axis.x = polygon.axes[i].x * length;
		axis.y = polygon.axes[i].y * length;
		drawVector(midpoint, axis); 
}

function drawFPS(number){
	ctx.beginPath();
	ctx.fillStyle="#000FFF";
	ctx.font="14px Arial";
	string = "FPS: " + number;
	ctx.fillText(string, 10, 20);
	ctx.stroke();
}

Rect = function(x, y, width, height, vx, vy, velocity, spin){
	var list = [];
	// ponto1
	list.push(x);
	list.push(y);
	
	//ponto2
	list.push(x + width);
	list.push(y);
	
	//ponto3
	list.push(x + width);
	list.push(y + height);
	
	//ponto4
	list.push(x);
	list.push(y + height);

	this.vertices = listToVertices(list);
	this.position = new Point(x, y);
	this.width = width;
	this.height = height;
	this.mass = width * height;
	this.center = new Point(x + width/2, y + height/2);
	this.hit=false;
	this.versor = new Versor(vx, vy);
	this.velocity = velocity;
	this.spin = spin;
	this.sides = 4;
	this.axes = [];
	this.projections = [];
	for (var i = 0; i < this.sides; i ++){
		this.axes[i] = new Vector(0, 0);
		this.projections[i] = new Projection(0, 0);
	}
}

Triangle = function(x, y, alfa, beta, l1){
	var list = [];
	// ponto1
	list.push(x);
	list.push(y);
}

function applyVectorToRect(rect, vector){
	for (var i = 0; i < rect.vertices.length; i++){
			rect.vertices[i].x += vector.x;
			rect.vertices[i].y += vector.y;
		}
	rect.position.x += vector.x;
	rect.position.y += vector.y;
	rect.center.x = rect.position.x + rect.width * 0.5;
	rect.center.y = rect.position.y + rect.height * 0.5;
}

function incrementVertices(vertices, xIncrement, yIncrement){
		for (var i = 0; i < vertices.length; i++){
			vertices[i].x += xIncrement;
			vertices[i].y += yIncrement;
		}
}
function incrementRect(rect, xIncrement, yIncrement){
	rect.position.x += xIncrement
	rect.position.y += yIncrement;
	rect.center.x = rect.position.x + rect.width * 0.5;
	rect.center.y = rect.position.y + rect.height * 0.5;
}
function updateRect(rect){
	xIncrement = rect.versor.x * rect.velocity;
	yIncrement = rect.versor.y * rect.velocity;

	incrementVertices(rect.vertices, xIncrement, yIncrement);
	incrementRect(rect, xIncrement, yIncrement);
	rect.hit=false;
}
function checkBorder(polygon){
	yAxis = new Vector(0, 1);
	xAxis = new Vector(1, 0);
	
	for (var i = 0; i < polygon.axes.length; i++){
		projX = projection(polygon.vertices, xAxis);
	}
	for (var i = 0; i < polygon.axes.length; i++){
		projY = projection(polygon.vertices, yAxis);
	}
	if (projX.max > c.width){
		polygon.versor.x *= -1;
		diff = new Vector(-(projX.max - c.width), 0);
		applyVectorToRect(polygon, diff);
	}
	else if (projX.min < 0){
		polygon.versor.x *= -1;
		diff = new Vector(-projX.min, 0);
		applyVectorToRect(polygon, diff);
	}
	if (projY.max > c.height){
		polygon.versor.y *= -1;
		diff = new Vector(0, -(projY.max - c.height));
		applyVectorToRect(polygon, diff);
	}
	if (projY.min < 0){
		polygon.versor.y *= -1;
		diff = new Vector(0, -projY.min);
		applyVectorToRect(polygon, diff);
	}
}

function changeDirection(polygon, mtv){
	polygon.versor.x = mtv.x;
	polygon.versor.y = mtv.y;
}

function elasticCollision(polygonA, mtv, polygonB){
	changeDirection(polygonA, mtv);
	mtv.x = - mtv.x;
	mtv.y = - mtv.y;
	changeDirection(polygonB, mtv);
}

function inelasticCollision(polygonA, mtv, polygonB){
	inertiaA = new Vector(0, 0);
	inertiaB = new Vector(0, 0);
	result = new Vector(0, 0);

	partialA = polygonA.mass * polygonA.velocity 
	inertiaA.x = partialA * polygonA.versor.x;
	inertiaA.y = partialA * polygonA.versor.y;

	partialB = polygonA.mass * polygonA.velocity 
	inertiaB.x = partialB * polygonB.versor.x;
	inertiaB.y = partialB * polygonB.versor.y ;

	result.x = inertiaA.x + inertiaB.x;
	result.y = inertiaA.y + inertiaA.y;
	
	unitVector(result, result);
	polygonA.versor = result;
	polygonB.versor = result;
	
	polygonA.spin = 0;
	polygonB.spin = 0;
	if (polygonA.velocity > 2){
		polygonA.velocity -= 1;
	}
	if (polygonB.velocity > 2){
		polygonB.velocity -= 1;
	}
}


function partiallyElasticCollision(polygonA, mtv, polygonB){
	var direction = new Vector(0, 0);
	if (polygonB.mass > polygonA.mass){
		bigger = polygonB;
		smaller = polygonA;
		sign = -1;
	}
	else{
		bigger = polygonA;
		smaller = polygonB;
		sign = 1;
	}
		direction.x = smaller.versor.x * smaller.velocity;
		direction.y = smaller.versor.y * smaller.velocity;
		var massDiff = bigger.mass - smaller.mass;
		direction.x -= sign * (mtv.x * massDiff);
		direction.y -= sign * (mtv.y * massDiff);
		unitVector(direction, direction);
		smaller.versor = direction;
		/*
		direction.x = bigger.versor.x * bigger.velocity;
		direction.y = bigger.versor.y * bigger.velocity;
		direction.x -= sign * (mtv.x)
		direction.y -= sign * (mtv.y);
		unitVector(direction, direction);
		bigger.versor = direction;
		*/
}

function checkColisionsNaive(array){
	var i, j, mtv;
	for (i = 0; i < array.length; i++){
		for (j=i+1; j < array.length; j++){
			mtv = collisionSTA(array[i], array[j]);
			if (mtv != false){
					inelasticCollision(array[i], mtv, array[j]);
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

Fps = function(){
	this.index = 0;
	this.array = [];
	this.maxSize = 24;
	this.add = function(n){
		n = 1000 / n;
		this.array[this.index] = n;
		this.index = (this.index  + 1) % this.maxSize;
	}
	this.mean = function(){
		var sum = 0;
		for (var i = 0; i < this.array.length; i++){
			sum += this.array[i];

		}
		return Math.round(sum/this.array.length);
	}
};


function randomRect(maxSize, minSize, maxSpeed, maxSpin){

	var xpos = Math.ceil(Math.random() * c.width/2) + maxSize;
	var ypos = Math.ceil(Math.random() * c.height/2) + maxSize;
	var width = Math.ceil(Math.random() * maxSize) + minSize;
	var height = Math.ceil(Math.random() * maxSize) + minSize;
	var direction = Math.round(Math.random() + 1);
	direction = Math.pow(-1, direction);
	var spin = Math.ceil(Math.random() * maxSpin * direction);
	rect = new Rect(xpos, ypos, 	// x, y
			width, height,	
			Math.random(), Math.random(),	// vx, vy 
			maxSpeed, spin);
	return rect;
}
var j = 0;
var maxSize = c.width/10;
var minSize = c.width/100;
var maxSpeed = 6;
var maxSpin = 4;
var numberObjects = 10;
var objects = [];

for (i = 0; i < numberObjects; i++){
	objects.push(new randomRect(maxSize, minSize, maxSpeed, maxSpin));
	
}
var axis_length = 20;
var lastDate = new Date();
var fps = new Fps();
var maxFPS = 40;
var interval = 1000/maxFPS;

function mainLoop(){
	newDate = new Date();
	elapsedTime = newDate - lastDate;
	lastDate = new Date();
	fps.add(elapsedTime);

	ctx.fillStyle="#FFFF00";
	ctx.fillRect(0,0,c.width,c.height);

	for (i = 0; i < objects.length; i++){
		updateRect(objects[i]);
		checkBorder(objects[i]);
	}
	for (j = 0; j < objects.length; j++){
		rotatePolygon(objects[j], objects[j].spin);
		calculateAxes(objects[j]);
		drawAxes(objects[j], axis_length);

	}
	checkColisionsNaive(objects);
	for (k = 0; k < objects.length; k++){
			drawPolygon(objects[k]);
	}
	drawFPS(fps.mean());
	setTimeout(function(){
		requestAnimationFrame(mainLoop)
	}, interval);
}

mainLoop();