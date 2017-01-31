var j = 0;
var bounce = 0.1;
var maxSize = c.width/120;
var minSize = c.width/150;
var maxSpeed = 6;
var maxSpin = 4;
var numberRectangles = 20;
var numberTriangles = 20;
var numberCircles= 0;
var objects = [];
var counter=0;
var counter2=0;
var maxObjects = 400;
colliding=true;
drawing=true;
cycleDrawing=false;

function generateShapes(){
    for (i = 0; i < numberRectangles; i++){
        objects.push(new randomRect(maxSize, minSize, maxSpeed, maxSpin));

    }
    for (i = 0; i < numberTriangles; i++){
        objects.push(new randomTriangle(maxSize, minSize, maxSpeed, maxSpin));
    }
    for (i = 0; i < numberCircles; i++){
        objects.push(new randomCircle(maxSize/2, minSize/2, maxSpeed, maxSpin));
    }
}

var axis_length = 20;
var lastDate = new Date();
var fps = new Fps();
var maxFPS = 1000;
var interval = 1000/maxFPS;
tickTime=30;
generateShapes();
lines=[];

function physicsLoop(){
    STAchecks=0;
	for (i = 0; i < objects.length; i++){
		objects[i].update();
		checkBorder(objects[i]);
	}
	for (j = 0; j < objects.length; j++){
		rotatePolygon(objects[j], objects[j].spin);
		calculateAxes(objects[j]);
	}

  if (colliding){
            horizontalSplit(objects, 8);
/*
        if (counter < 50){
            horizontalSplit(objects, 8);
        }
        else if(counter < 100){
            horizontalSplit(objects, 16);
        }
        else if (counter < 150){
            horizontalSplit(objects, 32);
        }
        else{
            horizontalSplit(objects, 64);
        }
/*
        if (counter < 50){
            noQuadrants(drawing);
        }
        else if(counter < 100){
            twoQuadrants(divisor,drawing);
        }
        else if (counter < 150){
            fourQuadrants(divisor, divisorH, drawing);
        }
        else{
            horizontalSplit(objects, 8);
        }
        if (counter== 199){
            if (cycleDrawing){
                drawing=!drawing;
            }
            if (objects.length < maxObjects){
                generateShapes();
            }
        }
*/
    }
  counter++;
    counter %= 200;
	setTimeout(function(){physicsLoop();}, tickTime);
}


function mainLoop(){
	newDate = new Date();
	elapsedTime = newDate - lastDate;
	lastDate = new Date();
	fps.add(elapsedTime);
	ctx.fillStyle="#FFFFFF";
    ctx.lineWidth=3;
	ctx.fillRect(0,0,c.width,c.height);
    for (var i = 0; i < lines.length; i++){
        lines[i].draw();
    }
    if (drawing){
        drawArray(objects, "#0000FF");
    }

	fps.calculateMean();
	drawFPS(fps.mean);
    drawSTACount(200, 20);
    ctx.fillText("Objects: " + objects.length, 400, 20);
	setTimeout(function(){
		requestAnimationFrame(mainLoop)
	}, interval);
}
physicsLoop();
mainLoop();
