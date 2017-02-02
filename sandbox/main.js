c.width=800;
c.height=600;
var j = 0;
var bounce = 0.1;
var maxSize = c.width/80;
var minSize = c.width/100;
var maxSpeed = 6;
var maxSpin = 0;
var numberRectangles = 10;
var numberTriangles = 0;
var numberCircles= 0;
var objects = [];
var counter=0;
var sections=1;
var maxSections=256;
maxSections *= 2;
var maxObjects = 1000;
colliding=true;
drawing=true;
cycleDrawing=false;
horizontal=true;
grid=false;
testGrid = new Grid(20, 20, c.width, c.height);
testGrid.build();

idealSections = Math.round(maxSize * 1.4);
console.log(idealSections);

divisor = new vLine(c.width/2, 0, c.height);
divisorH = new hLine(c.height/2, 0, c.width);


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
    testGrid.build();
    STAchecks=0;
	for (i = 0; i < objects.length; i++){
		objects[i].update();
		checkBorder(objects[i]);
	}
	for (j = 0; j < objects.length; j++){
		rotatePolygon(objects[j], objects[j].spin);
		calculateAxes(objects[j]);
	}

/*
  if (colliding){
        if (horizontal){
            horizontalSplit(objects, sections, checkElasticCollisionsNaive);
        }
        if (grid){
            gridify(objects, sections);
        }
        if ((counter % 50) == 0){
            sections*=2;
            sections%=maxSections;
            if (sections == 0){
                sections++;
                generateShapes();
/*
                horizontal=!horizontal;
                grid=!grid;
*/
/*
            }
        }
        if (counter== 699){
            if (cycleDrawing){
                drawing=!drawing;
            }
            if (objects.length < maxObjects){
                generateShapes();
            }
        }
    }

    console.log(sections);
*/
    testGrid.fill(objects);
    testGrid.collideCells();
    counter++;
    counter %= 1000;
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
    testGrid.draw();
    for (var i = 0; i < lines.length; i++){
        lines[i].draw();
    }
    if (drawing){
        drawArray(objects, "#0000FF");
    }

	fps.calculateMean();
	drawFPS(fps.mean, "#0000FF");
    drawSTACount(200, 20);
    ctx.fillText("Objects: " + objects.length, 400, 20);
	setTimeout(function(){
		requestAnimationFrame(mainLoop)
	}, interval);
}

physicsLoop();
mainLoop();

