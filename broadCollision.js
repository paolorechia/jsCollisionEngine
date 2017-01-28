// broad collision algorithms, pretty naive at this point
// depends on collision, shipBase and weapon
function collideHitboxes(hitboxes){
		for (var i = 0; i < hitboxes.length - 1; i++){
            for (var j = i + 1; j < hitboxes.length; j++){
            hit = elasticCollision(hitboxes[i],
                                   hitboxes[j],
                                   undefined, undefined, 0.1);
            }
        }
}
function collideShipHitboxes(ship, objects, damage){
        if (objects.length == 0){
            return;
        }
		for (var i = 0; i < objects.length; i++){
                var bindA = [];
                bindA.push(ship.auxHitbox);
				hit = elasticCollision(ship.hitbox, objects[i], bindA, undefined, 0.1);
                if (hit){
                    ship.sufferDamage(damage);	// fixed amount of damage on Collision
                    objects[i].sufferDamage(damage);
                }
			}
}
function collideShipShips(ship, enemies, damage){
        var bindA = [];
        bindA.push(ship.auxHitbox);
		for (var i = 0; i < enemies.length; i++){
                bindB = [];
                bindB.push(enemies[i].auxHitbox);
				hit = elasticCollision(ship.hitbox, enemies[i].hitbox,
                                       bindA, bindB, 0.1);
                if (hit){
                    ship.sufferDamage(damage);	// fixed amount of damage on Collision
                    enemies[i].sufferDamage(damage);			
                }
	    }
}

function collideWeaponsHitboxes(shooter, hitboxes){
		for (var u = 0; u < shooter.weapons.length; u++){
			for (var i = 0; i < shooter.weapons[u].projectiles.length; i++){
				for (var j = 0; j < hitboxes.length; j++){
                    smartCollision(
                         shooter.weapons[u].projectiles[i],
                         hitboxes[j],
                         function(){shooter.weapons[u].onHit(hitboxes[j])});
    
                }
            }
        }
}

function collideWeaponsShips(shooter, ships){
		for (var u = 0; u < shooter.weapons.length; u++){
            for (var i = 0; i < shooter.weapons[u].projectiles.length; i++){
                for (var k = 0; k < ships.length; k++){
                    shipBind = [];
                    shipBind.push(ships[k].auxHitbox);
                    smartCollision(
                         shooter.weapons[u].projectiles[i],
                         ships[k].hitbox,
                         function(){shooter.weapons[u].onHit(ships[k])});
                }
            }
        }
}
