var map = document.getElementById("umCanvas");

var camera = document.getElementById("camera");
ctx = camera.getContext("2d");

var Cursor = function(){
    this.x;
    this.y;
    this.update = function(player, camera, coord){
        coord.x = player.hitbox.center.x + this.x - camera.width/2;
        coord.y = player.hitbox.center.y + this.y - camera.height/2;
    }
}

function mouseMoveCamera(event){
    player.weapon.setCenter(coord);
    cursor.x = event.clientX;
    cursor.y = event.clientY;
    coord.x = player.hitbox.center.x + event.clientX - camera.width/2;
    coord.y = player.hitbox.center.y + event.clientY - camera.height/2;
}

camera.addEventListener("mousemove", mouseMoveCamera, false);

coord = new Point(c.width/2, c.height/2);
player = new Stellar("#999999", "#00F0FF", 300, 200); // arctic
enemies = [];
objects = [];
var players = [];
players.push(player);
enemies.push(new Gargatuan("#F0000F", "#FFFFFF"));
enemies.engineOn=true;
cursor = new Cursor();
function mainLoop(){
	newDate = new Date();
	elapsedTime = newDate - lastDate;
	lastDate = new Date();
	fps.add(elapsedTime);

	ctx.fillStyle="#000000";
	ctx.fillRect(0,0,camera.width,camera.height);

    cursor.update(player, camera, coord);
    weaponStatus = buildWeaponsStatus(player.weapons);
    drawWeaponsStatus(weaponStatus, player.secondaryColor);
    player.drawStatus();
    ctx.save();
    var x = player.hitbox.center.x;
    var y = player.hitbox.center.y;
    
    x *= -1;
    y *= -1;
    ctx.translate(x + camera.width/2 , y + camera.height/2);
    
    updateShip(player);
    updateWeapons(player);
    updateShipProjectiles(player);
    checkProjectilesBorder(player);
    collideShipShips(player, enemies, 5);

    checkBorder(player.hitbox, function(){player.auxHitbox.applyVector(diff)});
    updateEnemy(enemies[0]);
    enemies[0].draw();
    drawShipWeapons(enemies[0]);
    updateShipProjectiles(enemies[0]);
    checkProjectilesBorder(enemies[0]);
      
    player.autoPilot();
    player.drawAutoPath();
    player.draw();
    drawShipWeapons(player);
    ctx.restore();



	fps.calculateMean();
	drawFPS(fps.mean, player.secondaryColor);
   	setTimeout(function(){requestAnimationFrame(mainLoop)}, interval);
}

ctx.lineWidth=3;
var j = 0;

var primaryColor = "#000FFF";
var secondaryColor = "#00F0FF";
var lastDate = new Date();
var fps = new Fps();
var maxFPS = 1000;
var interval = 1000/maxFPS;
var COLLISION_DAMAGE = 10;

mainLoop();
