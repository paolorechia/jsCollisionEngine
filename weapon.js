// Weapon module //
// Depends on: collision.js
// Recommended to use with ship.js
var Weapon = function(velocity = 10, width = 1, range = 1000, limit = 10, damage = 10, 
					  mass = 1, rateOfFire = 8, spin=0, hasAmmo=false, ammo=100, energyUsage=0){
	
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
    this.updateVolume = function(volume){
        if (this.sound != null){
            for (var i = 0; i < this.timeOutLimit; i++){
                this.timeOutArray[i].volume = volume;
            }
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
        if (this.type = 'l'){
            value = this.damage * 20;
        }
        else{
            value = this.range/100 + this.projectileVelocity;
            value += this.damage * this.rateOfFire;
        }
        if (this.hasAmmo){
            value-= this.ammo/500;
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
            this.timeOutSound();
        }
		this.lockDown = true;
		var projectile = new Rect(this.position.x, this.position.y - this.projectileHeight/2, this.projectileWidth, this.projectileHeight,
									   this.direction.x, this.direction.y,
									   this.projectileVelocity + shipSpeed, 0);
		projectile.hit = false;
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
	cannon = new Weapon(velocity = 8, width = 1, range = 200, limit = 12, damage = 6, mass = 100, rateOfFire = 16, spin=0, hasAmmo=true, ammo=2000);
	cannon.type = 'p'; // projectile type
	cannon.name="Machine Gun";
    cannon.sound  = document.createElement("audio");
    cannon.sound.src = "machine_gun.mp3"
    cannon.sound.volume = 0.1;
    cannon.loadSounds(cannon.sound);
	return cannon;
}
	
function lightCannon(){
	cannon = new Weapon(velocity = 2, width = 4, range = 250, limit = 10, damage = 10, mass = 100, rateOfFire = 8, spin = 120, hasAmmo=true, ammo=1000);
	cannon.projectileVelocity = 10;
	cannon.type = 'p'; // projectile type
	cannon.name="Light Cannon";
	return cannon;
}
function heavyCannon(){
	cannon = new Weapon(velocity = 4, width = 8, range = 280, limit = 10, damage = 20, mass = 1000, rateOfFire = 4, spin = 120, hasAmmo=true, ammo=500);
	cannon.projectileVelocity=10;
	cannon.type = 'p'; // projectile type
	cannon.name="Heavy Cannon";
	return cannon;
}
function asteroidShooter(){
	cannon = new Weapon(velocity = 10, width = 20, range = 280, limit = 1, damage = 50, mass = 10000, rateOfFire = 1, spin = 120, hasAmmo=true, ammo=50);
	cannon.projectileVelocity=10;
	cannon.type = 'p'; // projectile type
	cannon.name="Asteroid Shooter";
	return cannon;
}

function lightLaserBlaster(){
	blaster = new Weapon(velocity = 30, width = 1, range = 400, limit = 12, damage = 5, mass=1, rateOfFire = 12,  spin=0, hasAmmo=false, ammo=1,
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
    blaster.sound  = document.createElement("audio");
    blaster.sound.src = "Laser_Shoot.mp3"
    blaster.sound.volume = 0.5;
    blaster.loadSounds(blaster.sound);
	return blaster;
}
function heavyLaserBlaster(){
	blaster = new Weapon(velocity = 30, width = 8, range = 400, limit = 8, damage = 20, mass=1, rateOfFire = 6, spin=0, hasAmmo=false, ammo=1,
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
    blaster.sound  = document.createElement("audio");
    blaster.sound.src = "Laser_Shoot2.mp3"
    blaster.sound.volume = 0.5;
    blaster.loadSounds(blaster.sound);
	return blaster;
}
function lightLaserBeam(){
	beam = new Weapon(velocity = 100, width = 2, range = 800, limit = 1, damage = 1, mass=1, rateOfFire = 1000, spin=0, hasAmmo=false, ammo=1,
					  energyUsage=4);
	beam.type = 'l'; // laser type
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
	beam.name = "Light Laser Beam";
	return beam;
}
function heavyLaserBeam(){
	beam = new Weapon(velocity = 100, width = 8, range = 800, limit = 1, damage = 5, mass=1, rateOfFire = 60, spin=0, hasAmmo=false, ammo=1,
					  energyUsage=9);
	beam.type = 'l'; // laser type

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
	beam.name = "Heavy Laser Beam";
    beam.sound  = document.createElement("audio");
    beam.sound.src = "laser-reapeated.mp3"
    beam.sound.volume = 0.5;
    beam.loadSounds(beam.sound);
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
	}
	return list;
}

function drawWeaponsStatus(list, color="#00F0FF"){
	ctx.beginPath();
	ctx.fillStyle=color;
	ctx.font="14px Arial";
	var offSet = 0;
	var xStart = 230;
	var colSize = 3;
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
}

