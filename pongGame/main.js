// redefining checkBorder to count points
// 
updateResEvent = function(canvas) {
          window.addEventListener('resize', function(event) {

            //--- Para alterar a resolução mantendo a res. do jogo (buga a mira)
            //$(canvas).css('width', window.innerWidth-3)
            //$(canvas).css('height', window.innerHeight-3)
            //-------------------------
            
            canvas.width = window.innerWidth-20;
            canvas.height = window.innerHeight-20;
		  });
}
updateResEvent(c);
c.width = window.innerWidth-20;
c.height = window.innerHeight-20;
function checkBorder(polygon){
	yAxis = new Vector(0, 1);
	xAxis = new Vector(1, 0);

	projX = projection(polygon.vertices, xAxis);
	projY = projection(polygon.vertices, yAxis);

	if (projX.max > c.width){
		polygon.versor.x *= -1;
		diff = new Vector(-(projX.max - c.width), 0);
		polygon.applyVector(diff);
		score.player +=1;
	}
	else if (projX.min < 0){
		polygon.versor.x *= -1;
		diff = new Vector(-projX.min, 0);
		polygon.applyVector(diff);
		score.enemy += 1;
	}
	if (projY.max > c.height){
		polygon.versor.y *= -1;
		diff = new Vector(0, -(projY.max - c.height));
		polygon.applyVector(diff);
;
	}
	if (projY.min < 0){
		polygon.versor.y *= -1;
		diff = new Vector(0, -projY.min);
		polygon.applyVector(diff);
	}
}
var Score = function(){
	this.player = 0;
	this.enemy = 0;
}

function drawScore(score){
	ctx.beginPath();
	ctx.fillStyle="#000FFF";
	ctx.font="14px Arial";
	string = "Player: " + score.player;
	ctx.fillText(string, 10, 40);
	ctx.stroke();
	string = "Computer: " + score.enemy;
	ctx.fillText(string, c.width - 100, 40);
	ctx.stroke();
}

function resetBall(){
	ball.velocity = 0;
	ball.spin = 0;
	ball.center.x = c.width/2;
	ball.center.y = c.height/2;
}

function endGame(score){
	resetBall();
	if (score.enemy > score.player)
		winner = "Computer";
	else
		winner = "Player";
	string = winner + " wins!";
	ctx.fillText(string, c.width/2 - 100, c.height/2);
	ctx.fillText("Refresh webpage to restart", c.width/2 -100, c.height/2 + 100);
}
var j = 0;
var maxSize = c.width/10;
var minSize = c.width/100;
var maxSpeed = 6;
var maxSpin = 4;
var numberRectangles = 4;
var numberTriangles = 4;
var objects = [];

var axis_length = 20;
var lastDate = new Date();
var fps = new Fps();
var maxFPS = 40;
var interval = 1000/maxFPS;

var score = new Score();
maxScore = 5;

var player = new Rect(30, c.height/2 - 80, 20, 80);
player.versor.x = 0;
player.versor.y = 0;
player.velocity = 8;
var enemy = new Rect(c.width - 50, c.height/2 - 80, 20, 80);
enemy.versor.x = 0;
enemy.versor.y = 1;
enemy.velocity = 8;
var ball = new Rect(c.width/2, c.height/2, 10, 10);
ball.versor.x = -1;
ball.versor.y = Math.random();
ball.spin=60;
ball.velocity=12;
ball.mass = 1;
objects = [];
objects.push(player, enemy, ball);
function mainLoop(){
	newDate = new Date();
	elapsedTime = newDate - lastDate;
	lastDate = new Date();
	fps.add(elapsedTime);

	ctx.fillStyle="#FFFF00";
	ctx.fillRect(0,0,c.width,c.height);

	if (player.center.y - 5 > coord.y){
		player.versor.y = -1;
	}
	else if (player.center.y + 5 < coord.y){
		player.versor.y = 1;
	}
	else
		player.versor.y = 0;
	
	
	if (enemy.center.y - 5 > ball.center.y){
		enemy.versor.y = -1;
	}
	else if (enemy.center.y + 5  < ball.center.y){
		enemy.versor.y = 1;
	}
	else
		enemy.versor.y = 0;
	if (ball.center.x > enemy.position.x){ // gone through, go away
		if (enemy.center.y > ball.center.y){
		enemy.versor.y = 1;
	}
		else if (enemy.center.y  < ball.center.y){
		enemy.versor.y = -1;
		}
	}
	player.update();
	enemy.update();
	ball.update();
	
	checkBorder(player);
	checkBorder(enemy);
	checkBorder(ball);
	
	drawPolygon(player);
	drawPolygon(enemy);
	drawPolygon(ball);
	
	for (var i = 0; i < objects.length; i++){
		objects[i].update;
		checkBorder(objects[i]);
		calculateAxes(objects[i]);
		drawPolygon(objects[i]);
		
	}
	drawScore(score);
	console.log(score);
	if (score.player >= maxScore || score.enemy >= maxScore){
		endGame(score);
	}	
	rotatePolygon(ball, ball.spin);
	checkColisionsNaive(objects);
	drawFPS(fps.mean());
	setTimeout(function(){
		requestAnimationFrame(mainLoop)
	}, interval);
}

mainLoop();
