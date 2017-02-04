// broad collision algorithms, pretty naive at this point
// depends on collision, shipBase and weapon

function dumbCollide(array){  
    if (array.length > 1){
    }
    for (var i = 0; i < array.length - 1; i++){
        for (var j = i + 1; j < array.length; j++){
            if (array[i].type =='h'){
                collideHitbox(array[i], array[j]);
            }
            if (array[i].type =='s'){
                collideShip(array[i], array[j]);
            }
            if (array[i].type =='w'){
                collideProjectile(array[i], array[j]);
            }
        }
    }
}
var damage = 10;
function collideHitbox(hitbox, object){
    if (object.type =='h'){
            hit = elasticCollision(hitbox,
                                   object,
                                   undefined, undefined, 0.1);
            return;
    }
    if(object.type=='s'){
            var bindA = [];
            bindA.push(object.auxHitbox);
            hit = elasticCollision(object.hitbox, hitbox, bindA, undefined, 0.1);
            if (hit){
                object.sufferDamage(damage);	// fixed amount of damage on Collision
                hitbox.sufferDamage(damage);
            }
            return;
    }
    if(object.type=='w'){
            smartCollision(
                 object,
                 hitbox,
                 object.onHit(hitbox));
//            killProjectile(object);
            return;
    }
}

function collideShip(ship, object){

/*
    if (object.type =='h'){
        var bindA = [];
        bindA.push(ship.auxHitbox);
        hit = elasticCollision(ship.hitbox, object, bindA, undefined, 0.1);
        if (hit){
            ship.sufferDamage(damage);	// fixed amount of damage on Collision
            objects.sufferDamage(damage);
        }
        return;
    }
*/
    if(object.type=='s'){
        var bindA = [];
        bindA.push(ship.auxHitbox);
        bindB = [];
        bindB.push(object.auxHitbox);
        hit = elasticCollision(object.hitbox, ship.hitbox,
                               bindB, bindA, 0.1);
        if (hit){
            ship.sufferDamage(damage);	// fixed amount of damage on Collision
            object.sufferDamage(damage);			
        }
        return;
    }
    if(object.type=='w'){
                    if (object.owner == ship){
                        return;
                    }
                    shipBind = [];
                    shipBind.push(ship.auxHitbox);
                    smartCollision(
                         object,
                         ship.hitbox,
                         function(){object.onHit(ship),
                                    object.duration-=100;});
            return;
    }
}
function collideProjectile(){

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
