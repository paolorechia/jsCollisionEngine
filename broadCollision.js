// broad collision algorithms, pretty naive at this point
// depends on collision, shipBase and weapon

function dumbCollide(array){   // or maybe dumbCollide
    for (var i = 0; i < array.length - 1; i++){
        for (var j = i + 1; j < array.length; j++){
            if (array[i].type =='h' && array[j].type =='h'){
                collideHitboxes(array[i], array[j]);
            }
            else if(array[i].type =='s' && array[j].type=='h'){



            }
            else if(array[i].type =='s' && array[j].type=='w'){
            

            }
            else if(array[i].type =='w' && array[j].type=='s'){
            

            }
            else if(array[i].type =='w' && array[j].type=='h'){
            

            }
            else if(array[i].type =='h' && array[j].type=='w'){
            

            }
            else if(array[i].type =='e' && array[j].type=='h'){
            

            }
            else if(array[i].type =='e' && array[j].type=='h'){
            

            }

        }
    }
}

function collideHitboxes(hitboxA, hitboxB){
            hit = elasticCollision(hitboxA,
                                   hitboxB,
                                   undefined, undefined, 0.1);
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

function collideShipsExplosions(ships, explosions){
    for (var i=0; i<explosions.length; i++){
        for (var j = 0;j < ships.length; j++){ 
            smartCollision(
            explosions[i].hitbox,
            ships[j].hitbox,
            function(){ships[j].sufferDamage(
                                explosions[i].fetchDamage(ships[j].hitbox));}
                          ); 
        }
    }
}
function collideHitboxesExplosions(hitboxes, explosions){
    for (var i=0; i < explosions.length; i++){
        for (var j = 0;j < hitboxes.length; j++){ 
            smartCollision(
            explosions[i].hitbox,
            hitboxes[j],
            function(){hitboxes[j].sufferDamage(
                                   explosions[i].fetchDamage(hitboxes[j]));}
                          ); 
        }
    }

}
