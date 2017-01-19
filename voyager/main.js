var map = document.getElementById("umCanvas");

var camera = document.getElementById("camera");
ctx = camera.getContext("2d");




coord = new Point(c.width/2, c.height/2);
player = new Stellar();
function mainLoop(){
	newDate = new Date();
	elapsedTime = newDate - lastDate;
	lastDate = new Date();
	fps.add(elapsedTime);

	ctx.fillStyle="#000000";
	ctx.fillRect(0,0,c.width,c.height);

    player.updateDirection();
    player.updateStrafe();
    player.updatePosition();
    player.updateTurn();
    player.powerSupply.recharge(player.powerSupply);
    player.shield.drainEnergy(player.shield);

    for (var i = 0; i < player.weapons.length; i++){
        player.weapons[i].updateDirection();
        if (player.weapons[i].enabled){
            player.weapons[i].updateFiring(player.hitbox.velocity);
        }
    }
		
		for (var u = 0; u < player.weapons.length; u++){
			for (var i = 0; i < player.weapons[u].projectiles.length; i++){
			    calculateAxes(player.weapons[u].projectiles[i])
            }
        }
		checkBorder(player.hitbox, function(){player.auxHitbox.applyVector(diff)});
		for (var u = 0; u < player.weapons.length; u++){
			player.weapons[u].draw();
		}
		for (var i = 0; i < player.weapons.length; i++){		
			player.weapons[i].updateDuration();		
			player.weapons[i].removeProjectiles();
		}
		for (u = 0; u < player.weapons.length; u++){
		    for (var k = 0; k < player.weapons[u].projectiles.length; k++){
                player.weapons[u].projectiles[k].update();
                if (player.weapons[u].type == 'p'){
                    checkBorder(player.weapons[u].projectiles[k], function(){player.weapons[u].rotateAtBorder(axis, player.weapons[u].projectiles[k])});
                }
                else if (player.weapons[u].type =='l'){
                    projectile = player.weapons[u].projectiles[k];
                    var hit = checkBorder(projectile);
                    if (hit) {killProjectile(projectile)};
                }
                rotatePolygon(player.weapons[u].projectiles[k], player.weapons[u].projectiles[k].spin);	
        }
    }
    player.autoPilot();
    player.drawStatus();
    weaponStatus = buildWeaponsStatus(player.weapons);
    drawWeaponsStatus(weaponStatus, player.secondaryColor);
    player.drawAutoPath();
    player.draw();

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
