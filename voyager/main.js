var map = document.getElementById("umCanvas");
var camera = document.getElementById("camera");

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
function enemyShoot(enemy){
    for (var i = 0; i < enemy.weapons.length; i++){
        enemy.weapons[i].firing = true;
    }
}


function generateStars (ctx, num, c){
        var i;
        for (i=0; i<num; i++){
            var color1 = Math.floor(Math.random() * 254 + 1);
            var color2 = Math.floor(Math.random() * 254 + 1);
            var color3 = Math.floor(Math.random() * 254 + 1);
            var alpha = 0.1;
            var x = Math.floor((Math.random() * c.width) + 1);
            var y = Math.floor((Math.random() * c.height) + 1);
            var width = Math.floor(Math.random() * 2 + 1);

            ctx.beginPath();
            ctx.fillStyle = "rgba(" + color1 + "," + color2 + "," + color3 + "," + alpha+ ")";
            ctx.arc(x, y, width * 5, 0, 2*Math.PI);

            ctx.fill();


            ctx.beginPath();
            ctx.fillStyle = "rgba(" + color1 + "," + color2 + "," + color3 + "," + alpha * 2+ ")";
            ctx.arc(x, y, width * 3, 0, 2*Math.PI);

            ctx.fill();

            ctx.beginPath(); 
            ctx.fillStyle = "rgba(" + color1 + "," + color2 + "," + color3 + +"," + 1 + ")";
            ctx.arc(x, y, width/2, 0, 2*Math.PI);
            ctx.fill();
        }
}
var bg = document.getElementById("background");
bg.width = c.width;
bg.height = c.height;

background = new Image();
ctx = bg.getContext("2d");
bg.color = "#222222";
ctx.fillStyle=bg.color;
ctx.fillRect(0, 0, bg.width, bg.height);
ctx.fillStyle="#000000";
ctx.fillRect(camera.width/2, camera.height/2,
             c.width - camera.width, c.height - camera.height);
//ctx.fillRect(camera.width/2, camera.height/2, 
//            bg.width - camera.width/2, bg.height - camera.height/2);
ctx = bg.getContext("2d");
generateStars(ctx, c.width/20, bg);
background.src = ctx.canvas.toDataURL("image/png");

ctx = camera.getContext("2d");
//ctx.drawImage(background.imagem, ship.x - camera.width/2, ship.y - camera.height/2, camera.width, camera.height,0, 0, camera.width, camera.height);

camera.addEventListener("mousemove", mouseMoveCamera, false);

coord = new Point(c.width/2, c.height/2);
player = new Stellar("#999999", "#000FFF", 300, 200); // arctic
enemies = [];
objects = [];
var players = [];
players.push(player);
enemies.push(new Gargatuan("#009900", "#FFFFFF"));
enemies[0].engineOn=true;
enemyShoot(enemies[0]);

cursor = new Cursor();
var statusColor = "#00F0FF";
function mainLoop(){

	newDate = new Date();
	elapsedTime = newDate - lastDate;
	lastDate = new Date();
	fps.add(elapsedTime);


	ctx.fillStyle="#444444";
	ctx.fillRect(0,0,camera.width,camera.height);
    ctx.drawImage(background, player.hitbox.center.x - camera.width/2, player.hitbox.center.y - camera.height/2, camera.width, camera.height, 0, 0, camera.width, camera.height);

    cursor.update(player, camera, coord);
    weaponStatus = buildWeaponsStatus(player.weapons);
    drawWeaponsStatus(weaponStatus, statusColor);
    player.drawStatus(statusColor);
    ctx.save();
    var x = player.hitbox.center.x;
    var y = player.hitbox.center.y;
    
    x *= -1;
    y *= -1;
    ctx.translate(x + camera.width/2 , y + camera.height/2);
    
    updateShip(player);
    updateWeapons(player);

    checkBorder(player.hitbox, function(){player.auxHitbox.applyVector(diff)});
    updateEnemy(enemies[0]);
    updateShipProjectiles(enemies[0]);

    checkProjectilesBorder(enemies[0]);
    collideWeaponsShips(enemies[0], players);

    updateShipProjectiles(player);
    checkProjectilesBorder(player);

    collideShipShips(player, enemies, 5);
    collideWeaponsShips(player, enemies);
      
    drawShipWeapons(enemies[0]);
    enemies[0].draw();
    player.autoPilot();
    player.drawAutoPath();
    player.draw();
    drawShipWeapons(player);
    ctx.restore();


	fps.calculateMean();
	drawFPS(fps.mean, statusColor);
    soundPool.playQueue();
    if (window.soundDisplay){
        soundPool.display(player.secondaryColor, new Point(c.width/2 - 20, 100));
    }
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
