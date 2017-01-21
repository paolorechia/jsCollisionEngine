// broad collision algorithms, pretty naive at this point
// depends on collision, shipBase and weapon
function collideShipHitboxes(ship, objects, damage){
		for (var i = 0; i < objects.length; i++){
			mtv = collisionSTA(ship.hitbox, objects[i]);
			if (mtv){
				elasticCollision(ship.hitbox, mtv, objects[i]);
				elasticCollision(ship.auxHitbox, mtv, objects[i]);
				ship.sufferDamage(damage);	// fixed amount of damage on Collision
				objects[i].sufferDamage(damage);
			}
		}
}
function collideShipShips(ship, enemies, damage){
		for (var i = 0; i < enemies.length; i++){
			mtv = collisionSTA(ship.hitbox, enemies[i].hitbox);
			if (mtv){
				elasticCollision(ship.hitbox, mtv, enemies[i].hitbox);
				elasticCollision(ship.auxHitbox, mtv, enemies[i].hitbox);
				ship.sufferDamage(damage);	// fixed amount of damage on Collision
				enemies[i].sufferDamage(damage);			
			}
		}
}


function collideWeaponsHitboxes(shooter, hitboxes){
		for (var u = 0; u < shooter.weapons.length; u++){
			for (var i = 0; i < shooter.weapons[u].projectiles.length; i++){
				for (var j = 0; j < hitboxes.length; j++){
					smartCollision(shooter.weapons[u].projectiles[i], hitboxes[j], function(){shooter.weapons[u].onHit(hitboxes[j])});
				}
            }
        }
}

function collideWeaponsShips(shooter, ships){
		for (var u = 0; u < shooter.weapons.length; u++){
            for (var i = 0; i < shooter.weapons[u].projectiles.length; i++){
                for (var k = 0; k < ships.length; k++){
                    smartCollision(shooter.weapons[u].projectiles[i], ships[k].hitbox, function(){shooter.weapons[u].onHit(ships[k])});
                    }
            }
        }
}