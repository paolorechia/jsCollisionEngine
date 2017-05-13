// updater
function updateTargetSystem(ship, targets){
    ship.targetSystem.updateRefresh();
    if (ship.targetSystem.refreshIndex > 0){
        return;
    }
    ship.targetSystem.setPossibleTargets(targets);
    ship.targetSystem.clearAimAssist();
    ship.targetSystem.analyseTarget(ship.hitbox.center);
    ship.targetSystem.aimAssist(ship.weapons, ship.hitbox.velocity);
    ship.targetSystem.autoAim(ship.weapons);
    ship.targetSystem.autoFire(ship.weapons);
}


function updateShip(player){
		player.updateDirection();
		player.updateStrafe();
		player.updatePosition();
        player.updateMouseRotate();
		player.updateTurn();
		player.powerSupply.recharge(player.powerSupply);
		player.shield.drainEnergy(player.shield);
		calculateAxes(player.hitbox);
}

function updateHitbox(hitbox){
		hitbox.update();
		checkBorder(hitbox);
		calculateAxes(hitbox);
		rotatePolygon(hitbox, hitbox.spin);
}

function updateEnemy(ship){

		ship.updateDirection();
		ship.updateStrafe();
		ship.updatePosition();
		ship.updateTurn();
		ship.powerSupply.recharge(ship.powerSupply);
		ship.shield.drainEnergy(ship.shield);
		calculateAxes(ship.hitbox);

		checkProjectilesBorder(ship);
		updateWeapons(ship);
		checkBorder(ship.hitbox, function(){ship.auxHitbox.applyVector(diff);
                                            if (ship.engineOn){
                                               ship.engineOn = false;
                                               ship.reverseEngineOn = true;
                                            }
                                            else{
                                               ship.engineOn = true;
                                               ship.reverseEngineOn = false; 
                                            }});
		collideShipHitboxes(ship, objects);
		updateShipProjectiles(ship);
}
function updateWeaponsAxes(ship){
		for (var u = 0; u < ship.weapons.length; u++){
			for (var i = 0; i < ship.weapons[u].projectiles.length; i++){
			    calculateAxes(ship.weapons[u].projectiles[i]);
			}
		}
}
function updateShipProjectiles(player){
		for (var i = 0; i < player.weapons.length; i++){		
			player.weapons[i].updateDuration();		
			player.weapons[i].removeProjectiles();
		}
}

function updateWeaponsShooting(ship){
		for (var i = 0; i < ship.weapons.length; i++){
		    ship.weapons[i].updateDirection();
			if (ship.weapons[i].enabled){
				ship.weapons[i].updateFiring(ship.hitbox.velocity);
			}
		}
}
function updateWeapons(ship){
		updateWeaponsShooting(ship);
		updateWeaponsAxes(ship);
}

// not really a good place for the display function, but where else?
function displayShip(ship){
			ship.updateDirection();
			ship.updateStrafe();
			ship.updatePosition();
            ship.updateMouseRotate();
			ship.updateTurn();

			ship.powerSupply.recharge(ship.powerSupply);
			ship.shield.drainEnergy(ship.shield);

		for (var i = 0; i < ship.weapons.length; i++){
		   // ship.weapons[i].updateVolume(0.1);
		    ship.weapons[i].firing=true;
    	    ship.weapons[i].updateDirection();
			if (ship.weapons[i].enabled){
				ship.weapons[i].updateFiring(ship.hitbox.velocity);
			}
		}
		for (var i = 0; i < ship.weapons.length; i++){		
			ship.weapons[i].updateDuration();		
			ship.weapons[i].removeProjectiles();
		}
		for (u = 0; u < ship.weapons.length; u++){
				for (var k = 0; k < ship.weapons[u].projectiles.length; k++){
                    ship.weapons[u].projectiles[k].update();
				    projectile = ship.weapons[u].projectiles[k];
					var hit = checkBorder(projectile);
				    if (hit) {killProjectile(projectile)};
					rotatePolygon(ship.weapons[u].projectiles[k], ship.weapons[u].projectiles[k].spin);	
			    }
			}
		for (var u = 0; u < ship.weapons.length; u++){
			for (var i = 0; i < ship.weapons[u].projectiles.length; i++){
			    calculateAxes(ship.weapons[u].projectiles[i])
                ship.weapons[u].draw();
		    }	
		}
        ship.draw();
}
