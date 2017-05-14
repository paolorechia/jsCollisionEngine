// Weapon module //
// Depends on: collision.js
// Explosive weapons depend on: explosion.js
// Recommended to use with ship.js

// global variables
// projectiles velocity scaling

var BASE_LIMIT = 100;
var BASE_VEL = 1;
var PROJ_VEL = 1;
var MISSILE_VEL = 1;
var LASER_VEL = 1.5;
var BEAM_VEL = 2;

var Weapon = function(velocity = 10, width = 1, range = 1000, limit = 10, damage = 10, 
					  mass = 1, rateOfFire = 8, spin=0, hasAmmo=false, ammo=100, energyUsage=0){
	
    this.mode = 'm'; // manual mode; 'a' for automatic
    this.turret = false;
	this.enabled = false;
	this.firing=false;
	this.rateOfFire = rateOfFire;		// shots per second
	this.lockDown = false;
	this.position = new Point(0, 0);
	this.center = new Point(0, 0);
	this.direction = new Vector(0, 0);
	this.projectileVelocity = velocity;
	this.projectileWidth = width;
	this.range = range; // range in pixels
	this.limit = limit;
	this.mass = mass;
	this.damage = damage;
	this.hasAmmo = hasAmmo;
	this.energyUsage = energyUsage;
    this.sound = null;
    this.timeOutArray = [];
    this.timeOutId = 0;
    this.timeOutSound = function(){
        if (this.sound != null){
            this.timeOutArray[this.timeOutId].currentTime = 0;
            this.timeOutArray[this.timeOutId].play();
            this.timeOutId++;
            this.timeOutId %= this.timeOutLimit;
        }
    }
    this.timeOutLimit = 3;
    this.loadSounds = function(sound){
        for (var i  = 0; i < this.timeOutLimit; i++){
            var newSound = document.createElement("audio");
            newSound.src = sound.src;
            newSound.volume = sound.volume
            this.timeOutArray[i] =  newSound;
        }
    }
/*
    this.updateVolume = function(volume){
        if (this.sound != null){
            for (var i = 0; i < this.timeOutLimit; i++){
                this.timeOutArray[i].volume = volume;
            }
        }
    }
*/
    this.buffer = null;
    this.playSound = function(){
        if (this.sound != null){ 
           this.sound.currentTime = 0.00;
            this.sound.play();
        }
    }
    this.stopSound = function(){
        if (this.sound != null){
            this.sound.stop();
        }
    }
    this.loopSound = function(){
        if (this.sound.currentTime == 0){
            this.sound.play();
        }
        var timeToEnd = this.sound.length;
        timeToEnd/=1000;
        if (this.sound.currentTime > timeToEnd){
                setTimeout(this.playSound(), timeToEnd);
        }             
    }
	if (hasAmmo){
		this.ammo=ammo;
	}
	else{
		this.ammo=1;
	}
	if (energyUsage > 0){
		this.powerSupply = new EnergySource(0, 0);
	}
    this.turnRate = 0;
	this.projectileHeight = this.projectileVelocity * 2;
	this.projectiles = [];

    this.describe = function(){
        var list = [];
        var name = "Name: " + this.name;
        var damage = "Damage: " + this.damage;
        if (this.hasAmmo){
            var usage = "Ammo: " + this.ammo;
        }
        else{
            var usage = "Energy Usage: " + this.energyUsage;
        }
        var range = "Range: " + this.range;
        if (this.turret){
            var turret = "Turret: " + "yes"
        }
        else{
            var turret = "Turret: " + "no"
        }
        var rateOfFire = "Rate Of Fire: " + this.rateOfFire;
        
        list.push(name, damage, rateOfFire, range, usage, turret);
        return list;
    }
    this.setMode = function(mode){
        this.mode = mode;       //'m' for manual or 'a' for automatic
    }
    this.setTurnRate= function(turnRate){
        this.turnRate = turnRate;
    }
    this.setTurretMode = function(isTurret){
        this.turret = isTurret;
    }
	this.setOwner = function(owner){
		this.owner = owner;
	}
	this.setPosition = function(point){
		this.position = point; // creates a reference to the variable, not a copy (usually the ship's location)
	}
	this.setCenter = function(point){
		this.center = point;
	}
	this.setPowerSupply = function(powerSupply){
		this.powerSupply = powerSupply;
	}
    this.getValue = function(){
        var value = 0;
        if (this.type == 'l'){
            value = this.damage * 60;
        }
        else{
            value = this.range/100 + this.projectileVelocity;
            value += this.damage * this.rateOfFire;
        }
        if (this.type == 'm'){
            value = this.damage * 50 * (this.maxRadius/this.expansionRate);
        }
        if (this.hasAmmo){
            if (this.type == 'm'){
                value -= 100/this.ammo
            }
            else{
                value-= 10.000/this.ammo
            }
        }
        else{
            value -= this.energyUsage;
        } 
        value -= this.limit;
        if (this.turret){
            value *= 4;
        }
        return Math.round(value);
    }
	this.updateDirection = function(){
        calculateVector(this.position, this.center, this.direction);
        unitVector(this.direction, this.direction);
        if (this.turret){
            this.direction.x *=-1;
            this.direction.y *=-1;
        }
	}
	
	this.updateFiring = function(shipSpeed){
		if (this.projectiles.length >= this.limit || this.firing == false || this.lockDown == true || this.ammo <= 0){
//            this.pauseSound();
			return;
		}
		if (this.energyUsage > 0){
			if (this.powerSupply.current < this.energyUsage){
				return;
			}
			else{
				this.powerSupply.drain(energyUsage);
			}
		}

        if (this.sound != null){
            soundPool.addSound(this.sound);
        }
		this.lockDown = true;
		var projectile = new Rect(this.position.x, this.position.y - this.projectileHeight/2, this.projectileWidth, this.projectileHeight,
									   this.direction.x, this.direction.y,
									   this.projectileVelocity + shipSpeed, 0);
		projectile.hit = false;
        projectile.type = 'w'; // weapon-type (for collision checking)
        projectile.onHit = this.onHit;
        projectile.damage= this.damage;
		projectile.mass = this.mass;
		projectile.duration = this.range/this.velocity;
        /* use this rotation to fire projectiles sideways
            xAxis = new Vector(1, 0);
            var angle = angleVectors(this.direction, xAxis);
            if (this.position.y > this.center.y){
                angle *= -1;
            }
            rotatePolygon(projectile,radiansToDegrees(angle));
        */
        yAxis = new Vector(0, 1);
        var angle = angleVectors(this.direction, yAxis);
            
        if (this.turret){
            if (this.position.x < this.center.x){
                angle *= -1;
            }
        }
        else{
            if (this.position.x > this.center.x){
                angle *= -1;
            }
        }
        rotatePolygon(projectile,radiansToDegrees(angle));
        projectile.spin = spin;
        projectile.duration = this.range/this.projectileVelocity;
        projectile.owner=this.owner;
/* self friendly-fire -- idea did not turn out well, because each weapon
   behaves differently and each ship has a different size -- it is hard to
   to create a generic model
        var tick = this.projectileVelocity * this.projectileWidth;
        projectile.leaving=100/tick;
        if (projectile.leaving < 1){
            projectile.leaving=2;
        }
        // 100 pixels / tick -- expected number of game frames for projectile to leave ship's hitbox
*/
		this.projectiles.push(projectile);
		if (this.hasAmmo){
			this.ammo--;
		}
		this.resetLockDown(this);
	}
	this.fire = function(pressed){
		this.firing = pressed;
	}
	this.updateDuration = function(){
		for (var i = 0; i < this.projectiles.length; i++){
			this.projectiles[i].duration--;
			if (this.projectiles[i].duration <= 0){
                if (this.type == 'm'){
                    explosions.push(
                        new Explosion(this.projectiles[i].position.x,
                                      this.projectiles[i].position.y,
                                      this.damage,
                                      this.expansionRate,
                                      this.maxRadius));
                }
				this.projectiles.splice(i, 1);
			}
		}
	}
	this.autoFire = function(){
		if (this.firing == true){
			this.firing = false;
		}
		else this.firing = true;
	}
	this.resetLockDown = function(weapon){
		setTimeout(function(){weapon.lockDown = false;}, 1000/this.rateOfFire);
	}
	this.rotateAtBorder = function(axis, projectile){
//		console.log(axis);
		if (axis == 'x'){
			rotatingVersor = new Vector(-projectile.versor.x, projectile.versor.y)
			var theta = angleVectors(projectile.versor, rotatingVersor);
			theta = radiansToDegrees(theta);
			if (rotatingVersor.y > 0){
				theta *= -1;
			}
			if (rotatingVersor.x > 0){
				theta *= -1;
			}
		}
		else if (axis == 'y'){
			rotatingVersor = new Vector(projectile.versor.x, -projectile.versor.y)
			var theta = angleVectors(projectile.versor, rotatingVersor);
			theta = radiansToDegrees(theta);
			if (rotatingVersor.x < 0){
				theta *= -1;
			}
			
			if (rotatingVersor.y > 0){
				theta *= -1;
			}
		}	
		rotatePolygon(projectile, theta);		
	//	console.log(theta);
	}
	this.onHit = function(target){
		target.sufferDamage(this.damage);
	}
	this.removeProjectiles = function(){
		for (var i = 0; i < this.projectiles.length; i++){
			if (this.projectiles[i].hit == true){
				this.projectiles.splice(i, 1);
				i--;
			}
		}
	}
	this.draw = function(){
        this.drawCannon(); 
		if (this.owner != undefined){
			for (var i =0; i < this.projectiles.length; i++){
				drawPolygon(this.projectiles[i], strokeColor=this.owner.primaryColor, 
							hitColor=this.owner.secondaryColor, joints=true, center=false,
							fillColor=this.owner.secondaryColor, centerColor=this.owner.secondaryColor,
							jointColor=this.owner.secondaryColor);
			}
		}
		else{
			for (var i =0; i < this.projectiles.length; i++){
				drawPolygon(this.projectiles[i]);
			}
		}
	}
    this.drawCannon = function(color = "#000FFF"){
        if (this.owner != undefined){
            color = this.owner.secondaryColor;
        }
        ctx.beginPath();
        ctx.lineWidth=2;
        ctx.strokeStyle=color;
        var size = 20;
        if (this.turret ==false){
            ctx.moveTo(this.center.x, this.center.y);
            ctx.lineTo(this.center.x + this.direction.x * size, this.center.y + this.direction.y * size);
        }
        else{
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(this.position.x + this.direction.x * size, this.position.y + this.direction.y * size);
        }
        ctx.stroke();
    }
}

function drawHeavyBlaster(polygon, strokeColor="#0000FF", hitColor="#FF0000", joints=true, center=true, centerColor="#00F0FF", jointColor="#0000FF"){
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth=4;
		if (polygon.hit == true){
			ctx.strokeStyle=hitColor;
		}
		else{
			ctx.strokeStyle=strokeColor;
		}
		ctx.moveTo(polygon.vertices[0].x,
				   polygon.vertices[0].y);
		ctx.lineTo(polygon.vertices[3].x,
					   polygon.vertices[3].y);		
		ctx.moveTo(polygon.vertices[1].x,
				   polygon.vertices[1].y);
		ctx.lineTo(polygon.vertices[2].x,
				   polygon.vertices[2].y);
				   
		ctx.stroke();
		ctx.fillStyle=jointColor;
		if (joints){
			for (var i = 0; i < polygon.vertices.length; i++){
				ctx.beginPath();
				ctx.arc(polygon.vertices[i].x,
				polygon.vertices[i].y,
				3, 0, 2*Math.PI);
				ctx.fill();
			}
		}
		if(center){
			if (polygon.center != undefined){
				ctx.fillStyle=centerColor;
				ctx.beginPath();
				ctx.arc(polygon.center.x,
						polygon.center.y,
						3, 0, 2*Math.PI);
				ctx.fill();
				}
		}
		ctx.restore();
}
/*
var Weapon = function(velocity = 10, width = 1, range = 1000, limit = 10, damage = 10, 
					  mass = 1, rateOfFire = 8, spin=0, hasAmmo=false, ammo=100, energyUsage=0){
						  */
function machineGun(){
	cannon = new Weapon(BASE_VEL * PROJ_VEL * 2, width = 1, range = 200, BASE_LIMIT, damage = 6, mass = 100, rateOfFire = 16, spin=0, hasAmmo=true, ammo=2000);
	cannon.type = 'p'; // projectile type
	cannon.name="Machine Gun";
    cannon.sound = new Howl({src : ["machine_gun.mp3"]});
    cannon.sound.volumeFilter=0.2;
	return cannon;
}
	
function lightCannon(){
	cannon = new Weapon(BASE_VEL * PROJ_VEL, width = 4, range = 250, BASE_LIMIT, damage = 10, mass = 100, rateOfFire = 8, spin = 120, hasAmmo=true, ammo=1000);
	cannon.type = 'p'; // projectile type
	cannon.name="Light Cannon";
    cannon.sound = new Howl({src : ["heavycannon.mp3"]});
    cannon.sound.volumeFilter=0.1;
	return cannon;
}
function heavyCannon(){
	cannon = new Weapon(BASE_VEL * PROJ_VEL, width = 8, range = 280, BASE_LIMIT, damage = 20, mass = 1000, rateOfFire = 4, spin = 120, hasAmmo=true, ammo=500);
	cannon.type = 'p'; // projectile type
	cannon.name="Heavy Cannon";
    cannon.sound = new Howl({src : ["heavycannon.mp3"]});
    cannon.sound.volumeFilter=0.5;
	return cannon;
}
function asteroidShooter(){
	cannon = new Weapon(BASE_VEL * PROJ_VEL, width = 20, range = 280, BASE_LIMIT, damage = 50, mass = 10000, rateOfFire = 1, spin = 120, hasAmmo=true, ammo=50);
	cannon.type = 'p'; // projectile type
	cannon.name="Asteroid Shooter";
    cannon.sound = new Howl({src : ["heavycannon.mp3"]});
	return cannon;
}
function dumbMissile(){
	missile = new Weapon(BASE_VEL * MISSILE_VEL, width = 1, range = 1000, BASE_LIMIT, damage = 1, mass = 100, rateOfFire = 1, spin = 0, hasAmmo=true, ammo=100);
    missile.expansionRate = 4;
    missile.maxRadius=40;
	missile.type = 'm'; // type
	missile.name="Dumb Missile";
    missile.onHit= function(target){
        if (target.hitbox == undefined){
            target.hitbox=target;
        } 
        if (target.hitbox.sides == 1){
            center = target.hitbox.position;
        }
        else{
            center = target.hitbox.center;
        }
        explosions.push(
                        new Explosion(center.x, center.y, this.damage,
                        this.expansionRate, this.maxRadius)
                       );

    }
    missile.onBorder = function(point){
        explosions.push(
                        new Explosion(point.x, point.y, this.damage,
                        this.expansionRate, this.maxRadius)
                       );
    
    }
	return missile;
}
var megaBomb = function(){
    bomb = new dumbMissile();
    bomb.name = "Mega Bomb";
    bomb.ammo=20;
    bomb.maxRadius=98;
    bomb.expansionRate=7;
    return bomb;
}
var nukeBomb = function(){
    bomb = new megaBomb();
    bomb.name= "Nuclear Bomb";
    bomb.ammo=10;
    bomb.maxRadius=300;
    bomb.expansionRate=10;
    return bomb;
}

function lightLaserBlaster(){
	blaster = new Weapon(BASE_VEL * LASER_VEL, width = 1, range = 400, BASE_LIMIT, damage = 5, mass=1, rateOfFire = 12,  spin=0, hasAmmo=false, ammo=1,
						 energyUsage = 5);
    blaster.type = 'p';
	blaster.draw = function(){
            if (this.owner != undefined){
                color = this.owner.secondaryColor;
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle=color;
            var size = 20;
            if (this.turret ==false){
                ctx.moveTo(this.center.x, this.center.y);
                ctx.lineTo(this.center.x + this.direction.x * size, this.center.y + this.direction.y * size);
            }
            else{
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(this.position.x + this.direction.x * size, this.position.y + this.direction.y * size);
            }
            ctx.stroke();
        }
		if (blaster.owner == undefined){
			for (var i = 0; i < this.projectiles.length; i++){
				drawPolygon(this.projectiles[i], strokeColor="#0000FF", hitColor="#0FF0FF", joints=false, center=false, fillColor="#0F00FF");
			}
		}
		else{
			for (var i = 0; i < this.projectiles.length; i++){
				drawPolygon(this.projectiles[i], strokeColor=this.owner.primaryColor,
							hitColor=this.owner.secondaryColor, joints=false, center=false, fillColor="#0F00FF");
			}
		}
	}
	blaster.name = "Light Laser Blaster";
    blaster.sound = new Howl({src : ["Laser_Shoot.mp3"]});
    blaster.sound.volumeFilter=0.5;
	return blaster;
}
function heavyLaserBlaster(){
	blaster = new Weapon(BASE_VEL * LASER_VEL, width = 8, range = 400, BASE_LIMIT, damage = 20, mass=1, rateOfFire = 6, spin=0, hasAmmo=false, ammo=1,
						 energyUsage = 20);
    blaster.type = 'p';
	blaster.draw = function(){
            if (this.owner != undefined){
                color = this.owner.secondaryColor;
            ctx.beginPath();
            ctx.lineWidth=this.projectileWidth;
            ctx.strokeStyle=color;
            var size = 10;
            if (this.turret ==false){
                ctx.moveTo(this.center.x, this.center.y);
                ctx.lineTo(this.center.x + this.direction.x * size, this.center.y + this.direction.y * size);
            }
            else{
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(this.position.x + this.direction.x * size, this.position.y + this.direction.y * size);
            }
            ctx.stroke();
        }
		if (blaster.owner == undefined){
			for (var i = 0; i < this.projectiles.length; i++){
				drawHeavyBlaster(this.projectiles[i], strokeColor="#0000FF", hitColor="#0FF0FF", joints=false, center=false, fillColor="#0F00FF");
			}
		}
		else{
			for (var i = 0; i < this.projectiles.length; i++){
				drawHeavyBlaster(this.projectiles[i], strokeColor=this.owner.primaryColor,
								 hitColor=this.owner.secondaryColor, joints=false, center=false, fillColor="#0F00FF");
			}
		}
	}
	blaster.name = "Heavy Laser Blaster";
    blaster.sound = new Howl({src : ["Laser_Shoot2.mp3"]});
    blaster.sound.volumeFilter=0.5;
	return blaster;
}
function lightLaserBeam(){
	beam = new Weapon(BASE_VEL * BEAM_VEL, width = 2, range = 800, BASE_LIMIT, damage = 5, mass=1, rateOfFire = 12, spin=0, hasAmmo=false, ammo=1,
					  energyUsage=4);
	beam.type = 'l'; // laser type
    /*
	beam.draw = function(){
		ctx.beginPath();
		if (this.owner == undefined){
			ctx.strokeStyle="#009099";
		}
		else{
			ctx.strokeStyle=this.owner.secondaryColor;
		}
		oldWidth = ctx.lineWidth;
		ctx.lineWidth=this.projectileWidth;
		for (var i = 0; i < this.projectiles.length; i++){
			ctx.moveTo(this.position.x, this.position.y);
			ctx.lineTo(this.projectiles[i].vertices[3].x, this.projectiles[i].vertices[3].y);
		}
		ctx.stroke();	
		ctx.lineWidth = oldWidth;
	}
    */
	beam.name = "Light Laser Beam";
    beam.sound = new Howl({src : ["laser-reapeated.mp3"]});
    beam.sound.volumeFilter=0.3;
	return beam;
}
function heavyLaserBeam(){
	beam = new Weapon(BASE_VEL * BEAM_VEL, width = 8, range = 800, BASE_LIMIT, damage = 10, mass=1, rateOfFire = 12, spin=0, hasAmmo=false, ammo=1,
					  energyUsage=9);
	beam.type = 'l'; // laser type

    /*
	beam.draw = function(){
		if (blaster.owner == undefined){
			ctx.strokeStyle="#009099";
		}
		else{
			ctx.strokeStyle=this.owner.secondaryColor;
		}
		ctx.beginPath();
		oldWidth = ctx.lineWidth;
		ctx.lineWidth=beam.projectileWidth;
		for (var i = 0; i < this.projectiles.length; i++){
			ctx.moveTo(this.position.x, this.position.y);
			ctx.lineTo(this.projectiles[i].vertices[3].x, this.projectiles[i].vertices[3].y);
		}
		ctx.stroke();	
		ctx.lineWidth = oldWidth;
	}
    */
	beam.name = "Heavy Laser Beam";
    beam.sound = new Howl({src : ["laser-reapeated.mp3"]});
    beam.sound.volumeFilter=0.5;
	return beam;
}
function killProjectile(projectile){
	projectile.duration = 0;
	
}
function buildWeaponsStatus(weapons){
	var list = [];
	for (var i = 0; i < weapons.length; i++){
		if (weapons[i].enabled){
			string = weapons[i].name + ": enabled";
		}
		else{
			string = weapons[i].name + ": disabled";
		}
		if (weapons[i].hasAmmo){
			string += " --- Ammo: " + weapons[i].ammo;
		}
		list.push(string);
    if (weapons[i].turret){
        if (weapons[i].mode=='a'){
            string = "Turret : automatic";
        }
        if (weapons[i].mode=='m'){
            string = "Turret : manual";
        }
        list.push(string);
    }
	}
	return list;
}

function drawWeaponsStatus(list, color="#00F0FF"){
	ctx.beginPath();
	ctx.fillStyle=color;
	ctx.font="14px Arial";
	var offSet = 0;
	var xStart = 230;
	var colSize = 6;
	for (var i = 0; i < list.length; i++){
		if (i % colSize == 0){
			offSet += 240;
		}
		ctx.fillText(list[i], offSet - xStart, 40 + (i % colSize) * 20);
	}
}
function drawShipWeapons(player){
		for (var u = 0; u < player.weapons.length; u++){
			player.weapons[u].draw();
		}
}

function checkProjectilesBorder(player){
		for (u = 0; u < player.weapons.length; u++){
                var limit = player.weapons[u].projectiles.length;
				for (var k = 0; k < limit ; k++){
					player.weapons[u].projectiles[k].update();
					if (player.weapons[u].type == 'p'){
						hit = checkBorder(player.weapons[u].projectiles[k], function(){player.weapons[u].rotateAtBorder(axis, player.weapons[u].projectiles[k])});
                        if (hit){
                            player.weapons[u].projectiles[k].owner=null;
                        }
					}
					else if (player.weapons[u].type =='l'){
						projectile = player.weapons[u].projectiles[k];
						var hit = checkBorder(projectile);
						if (hit) {
                            killProjectile(projectile);
/*
                            player.weapons[u].projectiles.splice(k, 1);
                            limit--;
*/
                        };
					}
                    else if(player.weapons[u].type =='m'){
						projectile = player.weapons[u].projectiles[k];
						var hit = checkBorder(projectile);
						if (hit){
                                  player.weapons[u].onBorder(projectile.center);
                                  killProjectile(projectile)};
                        }
//					rotatePolygon(player.weapons[u].projectiles[k], player.weapons[u].projectiles[k].spin);	
			}
		}
}
