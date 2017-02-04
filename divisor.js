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
            vertices[0] = new Point(polygon.position.x - polygon.radius, 
                                    polygon.position.y);
            vertices[1] = new Point(polygon.position.x + polygon.radius, 
                                    polygon.position.y);
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
            vertices[0] = new Point(polygon.position.x, 
                                    polygon.position.y - polygon.radius);
            vertices[1] = new Point(polygon.position.x,
                                    polygon.position.y+ polygon.radius);
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
function drawArray(array, color){
	for (k = 0; k < array.length; k++){
        if (array[k].sides == 1){
            drawCircle(array[k], color, "#FF0000", true, "#00F0FF");
        }
        else{
            drawPolygon(array[k], color);
        }
    }
}
function twoQuadrants(divisor, drawing){
    lines=[];
	for (k = 0; k < objects.length; k++){
            divisor.testPolygon(objects[k]);
    }
    checkElasticCollisionsNaive(divisor.left, bounce);
    checkElasticCollisionsNaive(divisor.right, bounce);
    divisor.resetLeft();
    divisor.resetRight();
    lines.push(divisor);
}
function fourQuadrants(divisor, divisorH, drawing){
	for (k = 0; k < objects.length; k++){
            divisor.testPolygon(objects[k]);
    }
	for (k = 0; k < divisor.left.length; k++){
            divisorH.testPolygon(divisor.left[k]); 
    }
    checkElasticCollisionsNaive(divisorH.up, bounce);
    checkElasticCollisionsNaive(divisorH.down, bounce);
    divisorH.resetUp();
    divisorH.resetDown();
	for (k = 0; k < divisor.right.length; k++){
            divisorH.testPolygon(divisor.right[k]); 
    }
    checkElasticCollisionsNaive(divisorH.up, bounce);
    checkElasticCollisionsNaive(divisorH.down, bounce);
    divisor.resetLeft();
    divisor.resetRight();
    divisorH.resetUp();
    divisorH.resetDown();
    lines.push(divisor);
    lines.push(divisorH);
}
function verticalSplitSingle(leftLine, columnSize, n){
    upSideLines=[];
    downSideLines=[];
    var rowSize = c.height/n;
    var nCopy = n;
    hLines = [];
    var middleLine = new hLine(c.height/2, leftLine.x, leftLine.x + columnSize);
	for (k = 0; k < leftLine.right.length; k++){
            middleLine.testPolygon(leftLine.right[k]);
    }
    lines.push(middleLine);
    checkElasticCollisionsNaive(middleLine.up, bounce);
    checkElasticCollisionsNaive(middleLine.down, bounce);
}
function verticalSplitLeft(leftLine, columnSize, n){
    upSideLines=[];
    downSideLines=[];
    var rowSize = c.height/n;
    var nCopy = n;
    hLines = [];
    n = n / 2;
    var middleLine= new hLine(c.height/2, leftLine.x, leftLine.x + columnSize); 
    for (k = 0; k < leftLine.right.length; k++){
            middleLine.testPolygon(leftLine.right[k]);
    }
    upSideLines.push(middleLine);
    currentMid = middleLine;
    n--;
//    lines.push(currentMid);
    while (n > 0){
        var upLine= new hLine(currentMid.y - rowSize, currentMid.x1,
                              currentMid.x2);
        for (k = 0; k < currentMid.up.length; k++){
                upLine.testPolygon(currentMid.up[k]);
        }
        upSideLines.push(upLine);
        currentMid = upLine;
        n--;
    }
    n = nCopy / 2;
    currentMid = middleLine;
    downSideLines.push(middleLine);
    while (n > 0){
        var downLine= new hLine(currentMid.y + rowSize, currentMid.x1,
                              currentMid.x2);
        for (k = 0; k < currentMid.down.length; k++){
                downLine.testPolygon(currentMid.down[k]);
        }
        downSideLines.push(downLine);
        currentMid = downLine;
        n--;
    }
    for (var i = 0; i < upSideLines.length; i++){
        lines.push(upSideLines[i]);
        lines.push(downSideLines[i]);
    }
    for (var i = 0; i< upSideLines.length; i++){
        checkElasticCollisionsNaive(upSideLines[i].up, bounce);
        checkElasticCollisionsNaive(downSideLines[i].down, bounce);
    }
}
function verticalSplitRight(rightLine, columnSize, n){
    upSideLines=[];
    downSideLines=[];
    var rowSize = c.height/n;
    var nCopy = n;
    hLines = [];
    n = n / 2;
    var middleLine= new hLine(c.height/2, rightLine.x, rightLine.x - columnSize); 
    for (k = 0; k < rightLine.left.length; k++){
            middleLine.testPolygon(rightLine.left[k]);
    }
    upSideLines.push(middleLine);
    currentMid = middleLine;
    n--;
//    lines.push(currentMid);
    while (n > 0){
        var upLine= new hLine(currentMid.y - rowSize, currentMid.x1,
                              currentMid.x2);
        for (k = 0; k < currentMid.up.length; k++){
                upLine.testPolygon(currentMid.up[k]);
        }
        upSideLines.push(upLine);
        currentMid = upLine;
        n--;
    }
    n = nCopy / 2;
    currentMid = middleLine;
    downSideLines.push(middleLine);
    while (n > 0){
        var downLine= new hLine(currentMid.y + rowSize, currentMid.x1,
                              currentMid.x2);
        for (k = 0; k < currentMid.down.length; k++){
                downLine.testPolygon(currentMid.down[k]);
        }
        downSideLines.push(downLine);
        currentMid = downLine;
        n--;
    }
    for (var i = 0; i < upSideLines.length; i++){
        lines.push(upSideLines[i]);
        lines.push(downSideLines[i]);
    }
    for (var i = 0; i< upSideLines.length; i++){
        checkElasticCollisionsNaive(upSideLines[i].up, bounce);
        checkElasticCollisionsNaive(downSideLines[i].down, bounce);
    }
}
function horizontalSplit(array, n, collisionCheck){
    var nCopy = n;
    lines=[];
    leftSideLines=[];
    rightSideLines=[];
    var columnSize = c.width/n;
    var rowSize = c.height/n;
    vLines = [];
    var middleLine = new vLine(c.width/2, 0, c.height); 
	for (k = 0; k < objects.length; k++){
            middleLine.testPolygon(objects[k]);
    }
    currentMid = middleLine;
    n = n / 2;
    while (n > 0){
        var leftLine = new vLine(currentMid.x - columnSize, 0, c.height);
        for (k = 0; k < currentMid.left.length; k++){
                leftLine.testPolygon(currentMid.left[k]);
        }
        n--;
        leftSideLines.push(leftLine);
        currentMid = leftLine;
    }
    currentMid = middleLine;
    n = nCopy;
    n = n / 2;
    while (n > 0){
        var rightLine=new vLine(currentMid.x + columnSize, 0, c.height);
        for (k = 0; k < currentMid.right.length; k++){
                rightLine.testPolygon(currentMid.right[k]);
        }
        n--;
        rightSideLines.push(rightLine);
        currentMid = rightLine;
    }
    for (var i = 0; i< leftSideLines.length; i++){
        collisionCheck(leftSideLines[i].right);
        collisionCheck(rightSideLines[i].left);
    }
    lines.push(middleLine);
    for (var i = 0; i< leftSideLines.length; i++){
        lines.push(leftSideLines[i]);
    }
    for (var i = 0; i< rightSideLines.length; i++){
        lines.push(rightSideLines[i]);
    }
}
function dumbSearch(cell, element){
    for (var i = 0; i < cell.length; i++){
        if (cell[i].id == element.id){
            return false;
        }
    }
    return true;
}
function joinXY(xList, yList){
    cellList = [];
    for (var i = 0; i < xList.length; i++){
        // point here actually represents a cell (i/j indexes)
        cell = new Point(xList[i], yList[i]);
        cellList.push(cell);
    }
    return cellList; 
}
var Grid = function(rows, columns, canvasW, canvasH){
    this.rows = rows;
    this.columns = columns;
    this.width = canvasW/this.columns;
    this.height = canvasH/this.rows;
    this.cells = [];
    this.build = function(){
        for (var i = -1; i <= this.rows; i++){
            this.cells[i]= new Array(this.columns + 1); 
        }
        for (var i = -1; i <= this.rows; i++){
            for (var j = -1; j <= this.columns; j++){
                this.cells[i][j]= [];
            }
        }
    }
    this.fill= function(objects){
        for (var i = 0; i < objects.length; i++){
            xList = [];
            yList = [];
            for (var j = 0; j < objects[i].vertices.length; j++){
                xList.push(Math.floor(objects[i].vertices[j].x
                        / this.width));
                yList.push(Math.floor(objects[i].vertices[j].y
                        / this.height));
            }
            cellList = joinXY(xList, yList);
            for (var j  = 0; j < cellList.length; j++){
                u=cellList[j].x;
                v=cellList[j].y;
                currentCell = this.cells[u][v];
                if (dumbSearch(currentCell, objects[i])){
                    currentCell.push(objects[i]);
                }
            }
        }
    }
    this.collideCells=function(){
        for (var i = 0; i < this.rows; i++){
            for (var j = 0; j < this.columns; j++){
                if (this.cells[i][j] != undefined){
                    dumbCollide(this.cells[i][j]);
                }
            }
        }
    }
    this.draw = function(){
        canvasW = this.width * this.columns;
        canvasH = this.height * this.rows;
        ctx.beginPath();
        for (var i = 0; i < this.rows; i++){
            x = (i * this.width) % canvasW;
            for (var j = 0; j < this.columns; j++){
                y = (j * this.height) % canvasH;
                if (this.cells[i][j].length > 0){
                    ctx.fillStyle="#00FF00";
                }
                else{
                    ctx.fillStyle="#FFFFFF";
                }
                ctx.fillRect(x, y, this.width, this.height);
            }
        }
    }

    this.drawBG = function(){
        canvasW = this.width * this.columns;
        canvasH = this.height * this.rows;
        ctx.beginPath();
        for (var i = 0; i < this.columns; i++){
            ctx.moveTo(i * this.width, 0);
            ctx.lineTo(i * this.width, canvasH);
        }
        for (var i = 0; i < this.rows; i++){
            ctx.moveTo(0, i * this.height);
            ctx.lineTo(canvasW, i * this.height);
        }
        ctx.stroke();
    }

}
function noQuadrants(drawing){
    lines=[];
    checkElasticCollisionsNaive(objects, bounce);
    if (drawing){
        drawArray(objects, "#0000FF");
    }
}

