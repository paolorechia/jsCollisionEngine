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
	return Math.sqrt(Math.abs(x - y));
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
function radiansToDegrees(theta){
	return theta = theta* 180 / Math.PI;
}
function degreesToRadians(theta){
	return theta = theta * Math.PI / 180;
}
function angleVectors(vectorA, vectorB){
	unitA = new Vector(0, 0);
	unitB = new Vector(0, 0);
	unitVector(vectorA, unitA);
	unitVector(vectorB, unitB);
	var cosTheta = dotProduct(unitA, unitB);
	/*
	var cosTheta = dotProduct(vectorA, vectorB);
	cosTheta = cosTheta / norm(vectorA) * norm(vectorB);
	*/
	return Math.acos(cosTheta);
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
	if (denom != 0){
		unit.x = vector.x / denom;
		unit.y = vector.y / denom;
	}
	else{
		unit.x = 0;
		unit.y = 0;
	}
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

function rotatePolygon(polygon, theta){
		theta = degreesToRadians(theta);
		if (polygon.sides == 1){ // special case: circle;
			cos = Math.cos(degreesToRadians(polygon.angle));
			sin = Math.sin(degreesToRadians(polygon.angle));
			polygon.front.x = polygon.center.x + cos * polygon.radius;
			polygon.front.y = polygon.center.y + sin * polygon.radius;
			return
		}
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

function drawPolygon(polygon, strokeColor="#0000FF", hitColor="#FF0000", joints=true, center=true, centerColor="#00F0FF", jointColor="#0000FF"){
		ctx.beginPath();
		if (polygon.hit == true){
			ctx.strokeStyle=hitColor;
		}
		else{
			ctx.strokeStyle=strokeColor;
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
		ctx.fillStyle=jointColor;
		if (joints){
			for (var i = 0; i < polygon.vertices.length; i++){
				ctx.beginPath();
				ctx.arc(polygon.vertices[i].x,
				polygon.vertices[i].y,
				3, 0, 2*Math.PI);
				ctx.fill();
			}
		}
		if(center){
			if (polygon.center != undefined){
				ctx.fillStyle=centerColor;
				ctx.beginPath();
				ctx.arc(polygon.center.x,
						polygon.center.y,
						3, 0, 2*Math.PI);
				ctx.fill();
			}
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
	if (polygon.sides == 1){
		return;
	}
	else if (polygon.sides == 4){
		for (var i = 0; i < polygon.vertices.length-1; i++){
			normalVector1(polygon.vertices[i], polygon.vertices[i+1], polygon.axes[i]);
			unitVector(polygon.axes[i], polygon.axes[i]);
			
		}
		normalVector1(polygon.vertices[i], polygon.vertices[0], polygon.axes[i]);
		unitVector(polygon.axes[i], polygon.axes[i]);
	}
	else{
	for (var i = 0; i < polygon.vertices.length-1; i++){
			normalVector2(polygon.vertices[i], polygon.vertices[i+1], polygon.axes[i]);
			unitVector(polygon.axes[i], polygon.axes[i]);
			
		}
		normalVector2(polygon.vertices[i], polygon.vertices[0], polygon.axes[i]);
		unitVector(polygon.axes[i], polygon.axes[i]);
	}
}
function drawAxes(polygon, length){
	var axis = new Vector(0, 0);
	if (polygon.sides == 1){ //circle
		for (var i = 0; i < polygon.vertices.length; i++){
			axis.x = polygon.axes[i].x * polygon.radius;
			axis.y = polygon.axes[i].y * polygon.radius;
			drawVector(polygon.center, axis);
		}	
		return;
	}
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
	
	this.applyVector = function(vector){
		for (var i = 0; i < this.vertices.length; i++){
				this.vertices[i].x += vector.x;
				this.vertices[i].y += vector.y;
			}
		this.position.x += vector.x;
		this.position.y += vector.y;
		this.center.x = this.position.x + this.width * 0.5;
		this.center.y = this.position.y + this.height * 0.5;
	}
	this.update = function(){
		xIncrement = this.versor.x * this.velocity;
		yIncrement = this.versor.y * this.velocity;

		incrementVertices(this.vertices, xIncrement, yIncrement);
		incrementRect(this, xIncrement, yIncrement);
		this.hit=false;
	}

}

Triangle = function(x, y, l1, vx, vy, velocity, spin){
	var list = [];
	// ponto1
	list.push(x);
	list.push(y);
	list.push(x + l1);
	list.push(y);
	list.push(x + (l1 * 0.5));
	list.push(y - l1);
	this.vertices = listToVertices(list);
	this.position = new Point(x, y);
	this.side = l1;
	this.mass = l1*l1*0.5;
	var x = x + l1/2;
	var y = y -l1/3;
	this.center = new Point(x, y);
	this.hit=false;
	this.versor = new Versor(vx, vy);
	this.velocity = velocity;
	this.spin = spin;
	this.sides = 3;
	this.axes = [];
	this.projections = [];
	for (var i = 0; i < this.sides; i ++){
		this.axes[i] = new Vector(0, 0);
		this.projections[i] = new Projection(0, 0);
	}
	this.applyVector = function(vector){
		var x = 0;
		var y = 0;
		for (var i = 0; i < this.vertices.length; i++){
			this.vertices[i].x += vector.x;
			this.vertices[i].y += vector.y;
			x += vertices[i].x;
			y += vertices[i].y;
		}
	}
	this.update = function(){
		xIncrement = this.versor.x * this.velocity;
		yIncrement = this.versor.y * this.velocity;
		incrementVertices(this.vertices, xIncrement, yIncrement);
		var x = 0;
		var y = 0;
		for (var i = 0; i < this.vertices.length; i++){
			x += this.vertices[i].x;
			y += this.vertices[i].y;
		}
		this.center.x = x/3;
		this.center.y = y/3;
		this.hit = false;
	}
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


function checkBorder(polygon, action){
	yAxis = new Vector(0, 1);
	xAxis = new Vector(1, 0);

	projX = projection(polygon.vertices, xAxis);
	projY = projection(polygon.vertices, yAxis);
	hit = false;
	if (projX.max > c.width){
		polygon.versor.x *= -1;
		diff = new Vector(-(projX.max - c.width), 0);
		polygon.applyVector(diff);
		if (action != undefined){
			action(axis = 'x');
		}
		hit = true;
	}
	else if (projX.min < 0){
		polygon.versor.x *= -1;
		diff = new Vector(-projX.min, 0);
		polygon.applyVector(diff);
		if (action != undefined){
			action(axis = 'x');
		}
		hit = true;
	}
	if (projY.max > c.height){
		polygon.versor.y *= -1;
		diff = new Vector(0, -(projY.max - c.height));
		polygon.applyVector(diff);
		if (action != undefined){
			action(axis = 'y');	
		}
		hit = true;
	}
	if (projY.min < 0){
		polygon.versor.y *= -1;
		diff = new Vector(0, -projY.min);
		polygon.applyVector(diff);
		if (action != undefined){
			action(axis = 'y');			
		}
		hit = true;
	}
	return hit;
}

function changeDirection(polygon, mtv){
	polygon.versor.x = mtv.x;
	polygon.versor.y = mtv.y;
}

function smartCollision(polygonA, polygonB, action){
	var mtv = collisionSTA(polygonA, polygonB);
	if (mtv == false){
		return;
	}
	var massDiff = polygonA.mass - polygonB.mass;
	massDiff = Math.abs(massDiff);
	smaller = Math.min(polygonA.mass, polygonB.mass);
	if (massDiff <  smaller){
		elasticCollision(polygonA, mtv, polygonB);
//		console.log("Elastic colision");
	}
	if (massDiff < smaller*4){
		partiallyElasticCollision(polygonA, mtv, polygonB);
//		console.log("Partial");

	}
	else{
		unilateralElasticCollision(polygonA, mtv, polygonB);
//		console.log("unilateral colision");
	}
	if (action != undefined){
		action();
	}
}

function unilateralElasticCollision(polygonA, mtv, polygonB){
	if (polygonA.mass > polygonB.mass){
		mtv.x = - mtv.x;
		mtv.y = - mtv.y;
		changeDirection(polygonB, mtv);
	}
	else{
		changeDirection(polygonA, mtv);
	}
}
function elasticCollision(polygonA, mtv, polygonB){
	var mtv = collisionSTA(polygonA, polygonB);
	if (mtv == false){
		return;
	}
	changeDirection(polygonA, mtv);
	mtv.x = - mtv.x;
	mtv.y = - mtv.y;
	changeDirection(polygonB, mtv);
}

function getInertiaNorm(polygon){
	return polygon.mass * polygon.velocity;
}
function inelasticCollision(polygonA, polygonB){
	inertiaA = new Vector(0, 0);
	inertiaB = new Vector(0, 0);
	result = new Vector(0, 0);

	partialA = getInertiaNorm(polygonA);
	inertiaA.x = partialA * polygonA.versor.x;
	inertiaA.y = partialA * polygonA.versor.y;

	partialB = getInertiaNorm(polygonB);
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
	var mtv = collisionSTA(polygonA, polygonB);
	if (mtv == false){
		return;
	}
	var direction = new Vector(0, 0);
	if (polygonB.mass > polygonA.mass){
		bigger = polygonB;
		smaller = polygonA;
		sign = -1;
		changeDirection(polygonA, mtv);
	}
	else{
		bigger = polygonA;
		smaller = polygonB;
		sign = 1;
		mtv.x = - mtv.x;
		mtv.y = - mtv.y;
		changeDirection(polygonB, mtv);
	}
	inertiaBig = new Vector(0, 0);
	inertiaSmaller = new Vector(0, 0);
	result = new Vector(0, 0);

	partialBig = getInertiaNorm(bigger); 
	inertiaBig.x = partialBig * polygonA.versor.x;
	inertiaBig.y = partialBig * polygonA.versor.y;

	partialSmaller = getInertiaNorm(smaller); 
	inertiaSmaller.x = partialSmaller * polygonB.versor.x;
	inertiaSmaller.y = partialSmaller * polygonB.versor.y ;

	result.x = inertiaBig.x + inertiaSmaller.x;
	result.y = inertiaBig.y + inertiaSmaller.y;
	bigger.x = result.x;
	bigger.y = result.y;
	/*
	if (smaller.velocity > 2){
		smaller.velocity -= 1;
	}
	*/
	if (smaller.spin < 0){
		smaller.spin += 1;
	}
	else{
		smaller.spin -=1;
	}
}


function checkColisionsNaive(array){
	var i, j, mtv;
	for (i = 0; i < array.length; i++){
		for (j=i+1; j < array.length; j++){
			smartCollision(array[j], array[i]);
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
	this.mean = 0;
	this.calculateMean = function(){
		var sum = 0;
		for (var i = 0; i < this.array.length; i++){
			sum += this.array[i];

		}
		this.mean=Math.round(sum/this.array.length);
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
function randomTriangle(maxSize, minSize, maxSpeed, maxSpin){
	var xpos = Math.ceil(Math.random() * c.width/2) + maxSize;
	var ypos = Math.ceil(Math.random() * c.height/2) + maxSize;
	var sideSize = Math.ceil(Math.random() * maxSize) + minSize;
	var direction = Math.round(Math.random() + 1);
	direction = Math.pow(-1, direction);
	var spin = Math.ceil(Math.random() * maxSpin * direction);
	triangle = new Triangle(xpos, ypos, sideSize,
							Math.random(), Math.random(),
							maxSpeed, spin);
	return triangle;
}
