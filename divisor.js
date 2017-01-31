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
function twoQuadrants(divisor){
    divisor.draw();
	for (k = 0; k < objects.length; k++){
            divisor.testPolygon(objects[k]);
    }
    checkElasticCollisionsNaive(divisor.left, bounce);
    checkElasticCollisionsNaive(divisor.right, bounce);
    drawArray(divisor.left, "#0000FF");
    drawArray(divisor.right, "#FFFF00");
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
    drawArray(divisorH.up, "#0000FF");
    drawArray(divisorH.down, "#FFFF00");
    divisorH.resetUp();
    divisorH.resetDown();
	for (k = 0; k < divisor.right.length; k++){
            divisorH.testPolygon(divisor.right[k]); 
    }
    checkElasticCollisionsNaive(divisorH.up, bounce);
    checkElasticCollisionsNaive(divisorH.down, bounce);
    drawArray(divisorH.up, "#F0000F");
    drawArray(divisorH.down, "#00FFF0");
    divisor.resetLeft();
    divisor.resetRight();
    divisorH.resetUp();
    divisorH.resetDown();
}

function noQuadrants(){
    checkElasticCollisionsNaive(objects, bounce);
    drawArray(objects, "#0000FF");
}

