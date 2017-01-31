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
var hLine = function(y, x1, x2){
    this.y = y;
    this.x1 = x1;
    this.x2 = x2;
    this.draw = function(){
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y);
        ctx.lineTo(this.x2, this.y);
        ctx.stroke();
    }
    this.up = [];
    this.down = [];
    this.resetUp= function(){
        this.up = []; 
    }
    this.resetDown= function(){
        this.down= []; 
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
        up=0; down=0;
        for (var i = 0; i < vertices.length; i++){
            if (vertices[i].y < this.y){
                up++;
            }
            else{
                down++;
            }
        }
        if (up == 0){
            this.down.push(polygon);
            return;
        }
        else if (down ==0){
            this.up.push(polygon);
            return;
        }
        this.down.push(polygon);
        this.up.push(polygon);
    }
}

divisor = new vLine(c.width/2, 0, c.height);
divisorH = new hLine(c.height/2, 0, c.width);
function twoQuadrants(divisor){
    divisor.draw();
	for (k = 0; k < objects.length; k++){
            divisor.testPolygon(objects[k]);
    }
    checkElasticCollisionsNaive(divisor.left, bounce);
    checkElasticCollisionsNaive(divisor.right, bounce);
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
    divisor.resetLeft();
    divisor.resetRight();
}
function fourQuadrants(divisor, divisorH){
    divisor.draw();
    divisorH.draw();
	for (k = 0; k < objects.length; k++){
            divisor.testPolygon(objects[k]);
    }
	for (k = 0; k < divisor.left.length; k++){
            divisorH.testPolygon(divisor.left[k]); 
    }
    checkElasticCollisionsNaive(divisorH.up, bounce);
    checkElasticCollisionsNaive(divisorH.down, bounce);
	for (k = 0; k < divisorH.up.length; k++){
        if (divisorH.up[k].sides == 1){
            drawCircle(divisorH.up[k], "#0000FF", "#FF0000", true, "#00F0FF");
        }
        else{
            drawPolygon(divisorH.up[k]);
        }
    }
	for (k = 0; k < divisorH.down.length; k++){
        if (divisorH.down[k].sides == 1){
            drawCircle(divisorH.down[k], "#0000FF", "#FF0000", true, "#00F0FF");
        }
        else{
            drawPolygon(divisorH.down[k], "#FFFF00");
        }
    }
    divisorH.resetUp();
    divisorH.resetDown();
	for (k = 0; k < divisor.right.length; k++){
            divisorH.testPolygon(divisor.right[k]); 
    }
    checkElasticCollisionsNaive(divisorH.up, bounce);
    checkElasticCollisionsNaive(divisorH.down, bounce);
	for (k = 0; k < divisorH.up.length; k++){
        if (divisorH.up[k].sides == 1){
            drawCircle(divisorH.up[k], "#0000FF", "#FF0000", true, "#00F0FF");
        }
        else{
            drawPolygon(divisorH.up[k]);
        }
    }
	for (k = 0; k < divisorH.down.length; k++){
        if (divisorH.down[k].sides == 1){
            drawCircle(divisorH.down[k], "#0000FF", "#FF0000", true, "#00F0FF");
        }
        else{
            drawPolygon(divisorH.down[k], "#FFFF00");
        }
    }
    divisor.resetLeft();
    divisor.resetRight();
}

function noQuadrants(){
	for (k = 0; k < objects.length; k++){
        if (objects[k].sides == 1){
            drawCircle(objects[k], "#0000FF", "#FF0000", true, "#00F0FF");
        }
        else{
            drawPolygon(objects[k], "#FFFF00");
        }
    }
    checkElasticCollisionsNaive(objects, bounce);
}

var j = 0;
var bounce = 0.1;
var maxSize = c.width/40;
var minSize = c.width/70;
var maxSpeed = 6;
var maxSpin = 4;
var numberRectangles = 40;
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

//    noQuadrants();
      twoQuadrants(divisor);
//    fourQuadrants(divisor, divisorH);
    

	fps.calculateMean();
	drawFPS(fps.mean);
    drawSTACount(200, 20);
    STAchecks=0;
	setTimeout(function(){
		requestAnimationFrame(mainLoop)
	}, interval);
}

mainLoop();
