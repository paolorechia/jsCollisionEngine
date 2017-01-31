var c = document.getElementById("umCanvas");
var ctx = c.getContext("2d");
var globalID = 0;
var gradualRate = 1;
var STAchecks = 0;

Intersecction = function(overlap, contains){
    this.overlap = overlap;
    this.contains = contains;
}

MTV = function(axis, magnitude, contains){
    this.axis = axis;
    this.magnitude = magnitude;
    this.contains=contains;
}

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
	return Math.sqrt(x + y);
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

function projectionCircle(circle, axis){
	var product;
    product = dotProduct(circle.position, axis);
    min = product - circle.radius;
    max = product + circle.radius;
	var projection = new Projection(min, max);
	return projection;
}

function collisionCircles(circleA, circleB){
    var dist = distance(circleA.position, circleB.position);
    var diff = dist - (circleA.radius + circleB.radius);
    var contains = false;
    if (diff < 0){
        var biggerRadius = circleA.radius;
        if (circleB.radius > biggerRadius){
            biggerRadius = circleB.radius;
        } 
        if (biggerRadius > dist){
            contains = true;
        }
        circleA.findAxis(circleB.position);
        unitVector(circleA.axis, circleA.axis);
	    var mtv = new MTV(new Vector(circleA.axis.x, circleA.axis.y), -diff, contains);
        return mtv;
    }
    return false;
}

function circleSTA(circle, polygon){
    var count = 0;
    dist = 10000;
    closest = - 1;
    for (var i = 0; i < polygon.vertices.length; i++){
        aux = distance(circle.position, polygon.vertices[i]);
        if (aux < dist){
            dist=aux;
            closest = i;
        }
    }
    circle.findAxis(polygon.vertices[closest]);
    unitVector(circle.axis, circle.axis);

    var projCircle = projectionCircle(circle, circle.axis);
    var projPolygon = projection(polygon.vertices, circle.axis);

	var smallestOverlap = 999999;
    var contains = false;
    intersect = (overlap(projCircle, projPolygon));
    if (intersect.overlap== 0){
        return false;
    }
    if (intersect.overlap< smallestOverlap){
        smallestOverlap = intersect.overlap;
        smallestAxis = circle.axis;
        contains=intersect.contains;
    }
    for (var i = 0 ; i < polygon.axes.length; i++){
        var projCircle = projectionCircle(circle, polygon.axes[i]);
        var projPolygon = projection(polygon.vertices, polygon.axes[i]);

		intersect = (overlap(projCircle, projPolygon));
		if (intersect.overlap== 0){
			return false;
		}
		if (intersect.overlap< smallestOverlap){
			smallestOverlap = intersect.overlap;
			smallestAxis = polygon.axes[i];
            contains=intersect.contains;
		}
    }
    // when circle and polygon dimensions are close enough, 
    // one of the shapes must be pushed out as if if contained, even
    // when the projection overlap algorithm does not flag a containment
    if (distance(circle.position, polygon.center) < circle.radius){
        contains=true;
    }
    polygon.hit = true;
    circle.hit = true;
	var mtv = new MTV(new Vector(circle.axis.x, circle.axis.y),
                      smallestOverlap, contains);
    return mtv;
}
function collisionSTA(polygonA, polygonB){
    STAchecks++;
    if (polygonA.sides == 1 && polygonB.sides == 1){
        return collisionCircles(polygonA, polygonB);
    }
    else if (polygonA.sides == 1){
        return circleSTA(polygonA, polygonB);
    }
    else if (polygonB.sides == 1){
        return circleSTA(polygonB, polygonA);
    }
	var smallestOverlap = 999999;
	var smallestAxis = null;
    var contains = false;
	for (var i = 0; i < polygonA.axes.length; i++){
		projA = projection(polygonA.vertices, polygonA.axes[i]);
		projB = projection(polygonB.vertices, polygonA.axes[i]);
		intersect = (overlap(projA, projB));
		if (intersect.overlap == 0){
			return false;
		}
		if (intersect.overlap < smallestOverlap){
			smallestOverlap = intersect.overlap;
			smallestAxis = polygonA.axes[i];
            contains=intersect.contains;
		}
	}
	for (var i = 0; i < polygonB.axes.length; i++){
		projA = projection(polygonA.vertices, polygonB.axes[i]);
		projB = projection(polygonB.vertices, polygonB.axes[i]);
		intersect = (overlap(projA, projB));
		if (intersect.overlap == 0){
			return false;
		}
		if (intersect.overlap < smallestOverlap){
			smallestOverlap=intersect.overlap;
			smallestAxis = polygonB.axes[i];
            contains=intersect.contains;
		}
	}
	polygonA.hit=true;
	polygonB.hit=true;
	var x = smallestAxis.x;
	var y = smallestAxis.y;
	var mtv = new MTV(new Vector(x, y), smallestOverlap, contains);
	return mtv;
}

function debugSTA(polygonA, polygonB){
    if (polygonA.sides == 1 && polygonB.sides == 1){
        return collisionCircles(polygonA, polygonB);
    }
    else if (polygonA.sides == 1){
        return circleSTA(polygonA, polygonB);
    }
    else if (polygonB.sides == 1){
        return circleSTA(polygonB, polygonA);
    }
	var smallestOverlap = 999999;
	var smallestAxis = null;
    var contains = false;
    colorA="#FF0000";
    colorB="#0000FF";
    overlaps = [];
    var intersect = new Intersecction();
	for (var i = 0; i < polygonA.axes.length; i++){
		projA = projection(polygonA.vertices, polygonA.axes[i]);
		projB = projection(polygonB.vertices, polygonA.axes[i]);
        drawProjection(projA, polygonA.axes[i], colorA);
        drawProjection(projB, polygonA.axes[i], colorB);
		intersect = (overlap(projA, projB));
        overlaps.push(intersect.overlap);
		if (intersect.overlap == 0){
            console.log(overlaps);
			return false;
		}
		if (intersect.overlap < smallestOverlap){
			smallestOverlap = intersect.overlap;
			smallestAxis = polygonA.axes[i];
            contains=intersect.contains;
		}
	}
	for (var i = 0; i < polygonB.axes.length; i++){
		projA = projection(polygonA.vertices, polygonB.axes[i]);
		projB = projection(polygonB.vertices, polygonB.axes[i]);
        drawProjection(projA, polygonB.axes[i], colorA);
        drawProjection(projB, polygonB.axes[i], colorB);
		intersect = (overlap(projA, projB));
        overlaps.push(intersect.overlap);
		if (intersect.overlap == 0){
            console.log(overlaps);
			return false;
		}
		if (intersect.overlap < smallestOverlap){
			smallestOverlap=intersect.overlap;
			smallestAxis = polygonB.axes[i];
            contains=intersect.contains;
		}
	}
    console.log(overlaps);
	polygonA.hit=true;
	polygonB.hit=true;
	var x = smallestAxis.x;
	var y = smallestAxis.y;
	var mtv = new MTV(new Vector(x, y), smallestOverlap, contains);
	return mtv;
}

function overlap(projA, projB){
    var intersect = new Intersecction(0, false);
    if (projB.min < projA.max && projB.max > projA.max){
            intersect.overlap = projB.min - projA.max;
        }
    else if(projB.max > projA.min && projB.min < projA.min){
        intersect.overlap = projA.min - projB.max;
    }
    // containment case
    else if (projB.min > projA.min && projB.max < projA.max){
        intersect.overlap = projA.max - projB.max;
        var min = Math.abs(projA.min - projB.min);
        var max = Math.abs(projA.max - projB.max);
        if (min < max){
            intersect.overlap += min;
        }
            else{
            intersect.overlap += max; 
        }
        intersect.contains=true;
    }
	return intersect;
}
function rotatePolygon(polygon, theta){
		theta = degreesToRadians(theta);
		if (polygon.sides == 1){ // special case: circle;
            return;
/*
			cos = Math.cos(degreesToRadians(polygon.angle));
			sin = Math.sin(degreesToRadians(polygon.angle));
			polygon.front.x = polygon.center.x + cos * polygon.radius;
			polygon.front.y = polygon.center.y + sin * polygon.radius;
			return;
*/
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

function drawProjection(proj, axis, color="#000000"){
    ctx.save();
    ctx.beginPath();
    if (axis.x < 0 && axis.y < 0){
        ctx.translate(c.width, c.height);
    }
    else if (axis.x < 0){
        ctx.translate(c.width, 0);
    }
    else if (axis.y < 0){
        ctx.translate(0, c.height);
    }
    ctx.lineWidth=12;
    ctx.strokeStyle=color;
    var start = new Point(proj.min * axis.x, proj.min * axis.y);
    var end = new Point(proj.max * axis.x, proj.max* axis.y);
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.restore();
}
function drawCircle(circle, strokeColor="#0000FF", hitColor="#FF0000", center=false, centerColor="#00F0FF"){
        ctx.save();
        ctx.beginPath();
		if (circle.hit == true){
			ctx.strokeStyle=hitColor;
		}
		else{
			ctx.strokeStyle=strokeColor;
		}
        var point = new Point(0, 0);
        point.x = Math.round(circle.position.x);
        point.y = Math.round(circle.position.y);
        ctx.arc(point.x, point.y,
                circle.radius, 0, 2*Math.PI);
        ctx.stroke()
/*
		if(center){
				ctx.fillStyle=centerColor;
				ctx.beginPath();
				ctx.arc(point.x, point.y,
						3, 0, 2*Math.PI);
				ctx.fill();
	    }
*/
        ctx.restore();
}

function drawPolygon(polygon, strokeColor="#0000FF", hitColor="#FF0000", joints=true, center=true, centerColor="#00F0FF", jointColor="#0000FF"){
		ctx.save();
		ctx.beginPath();
		if (polygon.hit == true){
			ctx.strokeStyle=hitColor;
		}
		else{
			ctx.strokeStyle=strokeColor;
		}
        var point = new Point(0, 0);
        point.x = Math.round(polygon.vertices[0].x);
        point.y = Math.round(polygon.vertices[0].y);

		ctx.moveTo(point.x, point.y);

		for (var i =1; i < polygon.vertices.length; i++){
            point.x = Math.round(polygon.vertices[i].x);
            point.y = Math.round(polygon.vertices[i].y);
		    ctx.lineTo(point.x, point.y);
		}
        point.x = Math.round(polygon.vertices[0].x);
        point.y = Math.round(polygon.vertices[0].y);
		ctx.lineTo(point.x, point.y);
				   
		ctx.stroke();
/*
		ctx.fillStyle=jointColor;
		if (joints){
			for (var i = 0; i < polygon.vertices.length; i++){
                point.x = Math.round(polygon.vertices[i].x);
                point.y = Math.round(polygon.vertices[i].y);
				ctx.beginPath();
				ctx.arc(point.x, point.y,
				3, 0, 2*Math.PI);
				ctx.fill();
			}
		}
		if(center){
			if (polygon.center != undefined){
                point.x = Math.round(polygon.center.x);
                point.y = Math.round(polygon.center.y);
				ctx.fillStyle=centerColor;
				ctx.beginPath();
				ctx.arc(point.x, point.y,
						3, 0, 2*Math.PI);
				ctx.fill();
			}
		}
*/
		ctx.restore();
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
    var point = new Point(Math.round(origin.x), Math.round(origin.y))
    var point2 = new Point(Math.round(vector.x), Math.round(vector.y))
	ctx.moveTo(point.x, point.y);
	ctx.lineTo(point.x + point2.x, point.y + point2.y);
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

function drawFPS(number, color="#000FFF"){
	ctx.beginPath();
	ctx.fillStyle=color;
	ctx.font="14px Arial";
	string = "FPS: " + number;
	ctx.fillText(string, 10, 20);
	ctx.stroke();
}

function applyGradualVector(hitbox, threshold){
        if (hitbox.gradualVector.x == 0 && hitbox.gradualVector.y == 0){
            hitbox.colliding=false;
            return;
        }
        var magnitude = norm(hitbox.gradualVector);
        if (magnitude <= threshold){
            hitbox.applyVector(hitbox.gradualVector);
            hitbox.gradualVector.x = 0;
            hitbox.gradualVector.y = 0;
            hitbox.colliding=false;
        }
        else{
            var appliedVector = new Vector(0,0);
            unitVector(hitbox.gradualVector, appliedVector);
            appliedVector.x *= threshold;
            appliedVector.y *= threshold;
            hitbox.gradualVector.x -= appliedVector.x;
            hitbox.gradualVector.y -= appliedVector.y;
            hitbox.applyVector(appliedVector);
        }
}
var Rect = function(x, y, width, height, vx, vy, velocity, spin){
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
	this.colliding=false;
	this.versor = new Versor(vx, vy);
	this.velocity = velocity;
	this.spin = spin;
	this.sides = 4;
	this.axes = [];
	this.projections = [];
    this.gradualVector = new Vector(0, 0);
    this.gradualID = 0;
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
        this.applyGradualVector(gradualRate);
		xIncrement = this.versor.x * this.velocity;
		yIncrement = this.versor.y * this.velocity;

		incrementVertices(this.vertices, xIncrement, yIncrement);
		incrementRect(this, xIncrement, yIncrement);
		this.hit=false;
	}
    this.moveTo = function(point){
        var vector = new Vector(0, 0);
        calculateVector(point, this.center, vector);
        this.applyVector(vector);
    }
    this.applyGradualVector = function(){
        applyGradualVector(this, gradualRate);
    }
}

var Triangle = function(x, y, l1, vx, vy, velocity, spin){
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
    this.colliding=false;
	this.versor = new Versor(vx, vy);
	this.velocity = velocity;
	this.spin = spin;
	this.sides = 3;
    this.gradualVector = new Vector(0, 0);
    this.gradualID = 0;
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
		}
	}
	this.update = function(){
        this.applyGradualVector(gradualRate);
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
    this.moveTo = function(point){
        var vector = new Vector(0, 0);
        calculateVector(point, this.center, vector);
        this.applyVector(vector);
    }
    this.applyGradualVector = function(){
        applyGradualVector(this, gradualRate);
    }
}

/*
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
*/

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
var Circle = function(x, y, radius, vx, vy, velocity, spin){
	var list = [];
	// ponto1
	list.push(x);
	list.push(y);
	this.position = new Point(x, y);
	this.radius= radius;
	this.mass = radius*radius;
	this.hit=false;
    this.colliding=false;
	this.versor = new Versor(vx, vy);
	this.velocity = velocity;
	this.spin = spin;
	this.sides = 1;
	this.axis = new Vector(0, 0);
	this.projections = [];
    this.gradualVector = new Vector(0, 0);
    this.gradualID = 0;
	this.applyVector = function(vector){
			this.position.x += vector.x;
			this.position.y += vector.y;
    }
	this.update = function(){
        this.applyGradualVector(gradualRate);
		xIncrement = this.versor.x * this.velocity;
		yIncrement = this.versor.y * this.velocity;
	    this.position.x += xIncrement;
	    this.position.y += yIncrement;
		this.hit = false;
	}
    this.findAxis = function(point){
        calculateVector(this.position, point, this.axis);    
    }
    this.moveTo = function(point){
        var vector = new Vector(0, 0);
        calculateVector(point, this.position, vector);
        this.applyVector(vector);
    }
    this.applyGradualVector = function(){
        applyGradualVector(this, gradualRate);
    }
}

function checkBorderCircle(circle, action){
    rightBound = circle.position.x + circle.radius;
    leftBound  = circle.position.x - circle.radius;
    lowerBound = circle.position.y + circle.radius;
    upperBound = circle.position.y - circle.radius;
    var hit = false;
	if (rightBound > c.width){ 
		diff = new Vector(-(rightBound - c.width), 0);
		circle.applyVector(diff);
		circle.versor.x *= -1;
		if (action != undefined){
			action(axis = 'x');
		}
		hit = true;
	}
    else if( leftBound < 0){
		diff = new Vector(-(leftBound), 0);
		circle.applyVector(diff);
		circle.versor.x *= -1;
		if (action != undefined){
			action(axis = 'x');
		}
		hit = true;

    }
	else if (lowerBound > c.height){
		diff = new Vector(0, -(lowerBound - c.height));
		circle.applyVector(diff);
		circle.versor.y *= -1;
		if (action != undefined){
			action(axis = 'y');
		}
		hit = true;
	}
    else if(upperBound < 0){
		diff = new Vector(0, -upperBound);
		circle.applyVector(diff);
		circle.versor.y *= -1;
		if (action != undefined){
			action(axis = 'y');
		}
		hit = true;
	}
	return hit;
}
function checkBorder(polygon, action){
    if (polygon.sides == 1){
        checkBorderCircle(polygon, action);
        return;
    }
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
    if (polygonA == undefined || polygonB == undefined){
        return;
    }
	var massDiff = polygonA.mass - polygonB.mass;
	massDiff = Math.abs(massDiff);
	smaller = Math.min(polygonA.mass, polygonB.mass);
	if (massDiff <  smaller * 4){
        hit = nullForceCollision(polygonA, polygonB);
    }
    else{
		hit = unilateralElasticCollision(polygonA, polygonB);
    }
	if (action != undefined && hit){
		action();
	}
}

function nullForceCollision(polygonA, polygonB){
	var mtv = collisionSTA(polygonA, polygonB);
	if (mtv == false){
		return false;
	}
    return true;
}

function unilateralElasticCollision(polygonA, polygonB){
	var mtv = collisionSTA(polygonA, polygonB);
	if (mtv == false){
		return false;
	}
	if (polygonA.mass > polygonB.mass){
		mtv.axis.x = - mtv.axis.x;
		mtv.axis.y = - mtv.axis.y;
		changeDirection(polygonB, mtv.axis);
	}
	else{
		changeDirection(polygonA, mtv.axis);
	}
    return true;
}
function elasticCollision(polygonA, polygonB, 
                          bindedA, bindedB, bounce){
    // check whether the polygons just collided
    // if so, prevent new collision
    if (polygonA.colliding == true && polygonB.colliding == true){
        if (polygonA.gradualID == polygonB.gradualID){
            return;
        }
    }
	var mtv = collisionSTA(polygonA, polygonB);
	if (mtv== false){
		return false;
	}
    var bounce = 10;
    globalID++;
    polygonA.colliding=true;
    polygonB.colliding=true;
    polygonA.gradualID=globalID;
    polygonB.gradualID=globalID;
    var vector = new Vector(0, 0);
    vector.x = mtv.axis.x * mtv.magnitude;
    vector.y = mtv.axis.y * mtv.magnitude;
    polygonB.gradualVector=vector; 
    applyGradualVector(polygonB, bounce);
//    console.log(vector);


    if (bindedB != undefined){
        for (var i = 0; i < bindedB.length; i++){
//            vect = new Vector(0, 0);
            bindedB[i].gradualVector=vector;
            applyGradualVector(bindedB[i], bounce);
            bindedB[i].colliding=true;
        }
    }
 //   console.log(vector);


    vect = new Vector(0, 0);
    vect.x = vector.x * -1;
    vect.y = vector.y * -1;

 //  console.log(vect);

    polygonA.gradualVector=vect; 
    applyGradualVector(polygonA, bounce);


  //  console.log(vect);
    if (bindedA != undefined){
        for (var i = 0; i < bindedA.length; i++){

            vect = new Vector(0, 0);
            vect.x = vector.x * -1;
            vect.y = vector.y * -1;

            bindedA[i].gradualVector=vect;
            applyGradualVector(bindedA[i], bounce);
            bindedA[i].colliding=true;
        }
    }


    changeDirection(polygonA, mtv.axis);
    mtv.axis.x = - mtv.axis.x;
    mtv.axis.y = - mtv.axis.y;
    changeDirection(polygonB, mtv.axis);
    return true;
}

function checkElasticCollisionsNaive(array, bounce){
	var i, j;
	for (i = 0; i < array.length; i++){
		for (j=i+1; j < array.length; j++){
            elasticCollision(array[j], array[i],
                                undefined, undefined, bounce);
        }
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
function randomCircle(maxSize, minSize, maxSpeed, maxSpin){
	var xpos = Math.ceil(Math.random() * c.width/2) + maxSize;
	var ypos = Math.ceil(Math.random() * c.height/2) + maxSize;
	var radius = Math.ceil(Math.random() * maxSize) + minSize;
	var direction = Math.round(Math.random() + 1);
	direction = Math.pow(-1, direction);
	var spin = Math.ceil(Math.random() * maxSpin * direction);
	circle = new Circle(xpos, ypos, radius,
							Math.random(), Math.random(),
							maxSpeed, spin);
	return circle;
}

function drawSTACount(x, y){
    ctx.beginPath();
    var string = "STA Count: " + STAchecks;
    ctx.fillText(string, x, y);
}
