c.width=800;
c.height=600;
var j = 0;
var bounce = 0.1;
var maxSize = c.width/30;
var minSize = c.width/100;
var maxSpeed = 6;
var maxSpin = 6;
var numberRectangles = 2;
var numberTriangles = 2;
var numberCircles= 2;
var objects = [];
var counter=0;
var sections=32;
var maxSections=256;
maxSections *= 2;
var maxObjects = 2000;
colliding=true;
drawing=true;
cycleDrawing=false;
horizontal=true;
grid=false;
gridSize=Math.floor(maxSize * 1.7);
numberCells=Math.round(c.width/gridSize);
console.log("Cells: " + numberCells*numberCells);
testGrid = new Grid(numberCells,numberCells, c.width, c.height);
testGrid.build();

idealSections = Math.round(maxSize * 1.4);
console.log(idealSections);

divisor = new vLine(c.width/2, 0, c.height);
divisorH = new hLine(c.height/2, 0, c.width);


    for (i = 0; i < numberCircles; i++){
        objects.push(new randomCircle(300, minSize/2, maxSpeed, maxSpin));
    }
function generateShapes(){
    for (i = 0; i < numberRectangles; i++){
        objects.push(new randomRect(maxSize, minSize, maxSpeed, maxSpin));

    }
    for (i = 0; i < numberTriangles; i++){
        objects.push(new randomTriangle(maxSize, minSize, maxSpeed, maxSpin));
    }
/*
    for (i = 0; i < numberCircles; i++){
        objects.push(new randomCircle(300, minSize/2, maxSpeed, maxSpin));
    }
*/
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

            testGrid.build();
            testGrid.fill(objects);
            testGrid.collideCells();
  if (colliding){
        if (horizontal){
            horizontalSplit(objects, sections, checkElasticCollisionsNaive);
        }
        if (grid){
        }
        if ((counter % 50) == 0){
            horizontal=!horizontal;
            grid=!grid;
            }
        if (counter==99){
            if (objects.length < maxObjects){
                generateShapes();
            }
        }
/*
        if ((counter % 50) == 0){
            sections*=2;
            sections%=maxSections;
            if (sections == 0){
                sections++;
                generateShapes();
                horizontal=!horizontal;
                grid=!grid;
            }
        }
*/
    }
    counter++;
    counter %= 100;
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

// grid is even faster when neither of the algorithms are using illustrative drawings
/*
    if (grid){
       testGrid.drawBG(); //line drawing slows down the performance too much
        testGrid.draw();
    }
/*
    if (horizontal){
        for (var i = 0; i < lines.length; i++){
            lines[i].draw();
        }
    }
*/
       testGrid.drawBG(); //line drawing slows down the performance too much
        testGrid.draw();

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

