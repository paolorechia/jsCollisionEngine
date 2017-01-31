// vertical line
var vLine = function(x, y1, y2){
    this.x = x;
    this.y1 = y1;
    this.y2 = y2;
    this.draw = function(){
        ctx.beginPath();
        ctx.moveTo(this.x, this.y1);
        ctx.lineTo(this.x, this.y2);
        ctx.stroke();
    }
    this.left = [];
    this.right = [];
    this.resetLeft = function(){
        this.left = []; 
    }
    this.resetRight = function(){
        this.right= []; 
    }
    this.testPolygon = function(polygon){
        if (polygon.sides == 1){
            vertices = [];
            vertices[0] = polygon.position - polygon.radius;
            vertices[1] = polygon.position + polygon.radius;
        }
        else{
            vertices = polygon.vertices;
        }
        left=0; right=0;
        for (var i = 0; i < vertices.length; i++){
            if (vertices[i].x < this.x){
                left++;
            }
            else{
                right++;
            }
        }
        if (left == 0){
            this.right.push(polygon);
            return;
        }
        else if (right ==0){
            this.left.push(polygon);
            return;
        }
        this.right.push(polygon);
        this.left.push(polygon);
    }
}

divisor = new vLine(c.width/2, 0, c.height);

var j = 0;
var bounce = 0.1;
var maxSize = c.width/20;
var minSize = c.width/30;
var maxSpeed = 6;
var maxSpin = 4;
var numberRectangles = 4;
var numberTriangles = 4;
var numberCircles= 0;
var objects = [];

for (i = 0; i < numberRectangles; i++){
	objects.push(new randomRect(maxSize, minSize, maxSpeed, maxSpin));

}
for (i = 0; i < numberTriangles; i++){
	objects.push(new randomTriangle(maxSize, minSize, maxSpeed, maxSpin));
}
for (i = 0; i < numberCircles; i++){
	objects.push(new randomCircle(maxSize/2, minSize/2, maxSpeed, maxSpin));
}
var axis_length = 20;
var lastDate = new Date();
var fps = new Fps();
var maxFPS = 1000;
var interval = 1000/maxFPS;

function mainLoop(){
	newDate = new Date();
	elapsedTime = newDate - lastDate;
	lastDate = new Date();
	fps.add(elapsedTime);
	ctx.fillStyle="#FFFFFF";
    ctx.lineWidth=3;
	ctx.fillRect(0,0,c.width,c.height);

	for (i = 0; i < objects.length; i++){
		objects[i].update();
		checkBorder(objects[i]);
	}
	for (j = 0; j < objects.length; j++){
		rotatePolygon(objects[j], objects[j].spin);
		calculateAxes(objects[j]);
		drawAxes(objects[j], axis_length);

	}
	for (k = 0; k < objects.length; k++){
            divisor.testPolygon(objects[k]);
    }
	for (k = 0; k < divisor.left.length; k++){
        if (divisor.left[k].sides == 1){
            drawCircle(divisor.left[k], "#0000FF", "#FF0000", true, "#00F0FF");
        }
        else{
            drawPolygon(divisor.left[k]);
        }
    }
	for (k = 0; k < divisor.right.length; k++){
        if (divisor.right[k].sides == 1){
            drawCircle(divisor.right[k], "#0000FF", "#FF0000", true, "#00F0FF");
        }
        else{
            drawPolygon(divisor.right[k], "#FFFF00");
        }
    }
    checkElasticCollisionsNaive(divisor.left, bounce);
    checkElasticCollisionsNaive(divisor.right, bounce);
    divisor.draw();
    divisor.resetLeft();
    divisor.resetRight();
	fps.calculateMean();
	drawFPS(fps.mean);
	setTimeout(function(){
		requestAnimationFrame(mainLoop)
	}, interval);
}

mainLoop();
