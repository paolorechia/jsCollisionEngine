// Ship presets
// Depends on: collision.js; ship.js; weapons;js

// Global Variables for Scaling
// Game size and pace
var BASE_SIZE = 15;
var BASE_ACCEL = 0.05;
var BASE_TURNRATE = 2;
var BASE_MAXSPEED = 1;
// HULL
var BASE_HULL_MAX = 100;
// RESISTANCE DISABLED - TOO OP
var BASE_HULL_RESISTANCE = 0;
// SHIELD
// = function(max = 100, resistance=0, drainRate=10, rechargeEfficiency = 0.5, drainSpeed = 250)
var BASE_SHLD_MAX  = 50;
// RESISTANCE DISABLED
var BASE_SHLD_RESISTANCE = 0;
var BASE_SHLD_DRAINRATE = 10;
var BASE_SHLD_EFFICIENCY= 0.5;
var BASE_SHLD_DRAINSPEED = 250;
// Energy Source
// = function(max = 100, rechargeRate = 10, rechargeSpeed=500){ //rechargeSpeed in microseconds; rechargeRate in points per second (? or per ticks?)
var BASE_SOURCE_MAX = 100;
var BASE_SOURCE_RECHARGERATE = 10;
var BASE_SOURCE_RECHARGESPEED= 500;

// MODIFIERS
var TIER0  = 0.9;
var TIER1  = 1.1;
var TIER2  = 1.2;
var TIER3  = 1.4;
var TIER4  = 1.8;
var TIER5  = 2.6;
var TIER6  = 4.2;
var TIER7  = 7.4;
var TIER8  = 12.8;
var TIER9  = 25.6;
var TIER10 = 51.2;


function loadDefaultSounds(ship){
    ship.hull.sound= new Howl({
            src: ['Hit_Hurt5.mp3']});

    ship.shield.sound = ship.hull.sound;
    ship.deadSound = new Howl({
            src: ["Explosion4.mp3"]});
    return ship;
}

/* ZERO-ENERGY SHIPS */
var CannonFolder = function(primaryColor="#000FFF", secondaryColor = "#0FF0FF", 
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, BASE_SIZE * 0.75, primaryColor, secondaryColor);
    ship.name="CannonFolder";
	ship.updateDirection();
	ship.hull        =         new Hull(BASE_HULL_MAX * TIER2,
                                        BASE_HULL_RESISTANCE * TIER1);

	ship.shield      =       new Shield(0,
                                        0, 
                                        0, 
                                        0,
                                        0);

	ship.powerSupply = new EnergySource(0,
                                        0,
                                        0);

	ship.acceleration =                 BASE_ACCEL * TIER2;
	ship.maxSpeed =                     BASE_MAXSPEED * TIER1;
	ship.turnRate =                     BASE_TURNRATE * TIER2;

	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);

	
	ship.addWeapon(heavyCannon());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);
	ship.weapon.enabled=true;

	ship.addWeapon(heavyCannon());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[1]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[1]);
	ship.weapon.enabled=true;

	ship.addWeapon(lightCannon());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
    ship.weapon.setCenter(ship.hitbox.vertices[2]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[2]);
    ship.weapon.enabled=true;

    ship=loadDefaultSounds(ship);
	return ship;
}

var Shark = function(primaryColor="#000FFF", secondaryColor = "#0FF0FF", 
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, BASE_SIZE * 0.75, primaryColor, secondaryColor);
    ship.name="Shark";
	ship.updateDirection();
	ship.hull        =         new Hull(BASE_HULL_MAX * TIER3,
                                        BASE_HULL_RESISTANCE * TIER5);

	ship.shield      =       new Shield(0,
                                        0, 
                                        0, 
                                        0,
                                        0);

	ship.powerSupply = new EnergySource(0,
                                        0,
                                        0);

	ship.acceleration =                 BASE_ACCEL * TIER2;
	ship.maxSpeed =                     BASE_MAXSPEED * TIER1;
	ship.turnRate =                     BASE_TURNRATE * TIER3;

	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);

	
	ship.addWeapon(dumbMissile());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);
	ship.weapon.enabled=true;

	ship.addWeapon(dumbMissile());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[1]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[1]);
	ship.weapon.enabled=true;

	ship.addWeapon(lightCannon());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
    ship.weapon.setCenter(ship.hitbox.vertices[2]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[2]);
    ship.weapon.enabled=true;

    ship=loadDefaultSounds(ship);
	return ship;
}
var Bomber = function(primaryColor="#000FFF", secondaryColor = "#0FF0FF", 
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, BASE_SIZE * 1.5, primaryColor, secondaryColor);
    ship.name="Bomber";
	ship.updateDirection();
	ship.hull        =         new Hull(BASE_HULL_MAX * TIER8,
                                        BASE_HULL_RESISTANCE);

	ship.shield      =       new Shield(0,
                                        0, 
                                        0, 
                                        0,
                                        0);

	ship.powerSupply = new EnergySource(0,
                                        0,
                                        0);

	ship.acceleration =                 BASE_ACCEL * TIER1;
	ship.maxSpeed =                     BASE_MAXSPEED * TIER2;
	ship.turnRate =                     BASE_TURNRATE * TIER1;

	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);

	
	ship.addWeapon(dumbMissile());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);
	ship.weapon.enabled=true;

	ship.addWeapon(dumbMissile());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[1]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[1]);
	ship.weapon.enabled=true;

	ship.addWeapon(megaBomb());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[1]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[1]);
	ship.weapon.enabled=true;

	ship.addWeapon(megaBomb());

	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);
	ship.weapon.enabled=true;


	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.addWeapon(machineGun());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setPosition(ship.hitbox.center);
    ship.weapon.setCenter(coord);
    ship.weapon.setTurretMode(true);
    ship.weapon.enabled=true;

    ship=loadDefaultSounds(ship);
	return ship;
}
var Armageddon= function(primaryColor="#000FFF", secondaryColor = "#0FF0FF", 
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, BASE_SIZE * 2, primaryColor, secondaryColor);
    ship.name="Armageddon";
	ship.updateDirection();

	ship.hull        =         new Hull(BASE_HULL_MAX * TIER10,
                                        BASE_HULL_RESISTANCE * TIER2);

	ship.shield      =       new Shield(0,
                                        0, 
                                        0, 
                                        0,
                                        0);

	ship.powerSupply = new EnergySource(0,
                                        0,
                                        0);

    ship.acceleration =                 BASE_ACCEL * TIER2;
    ship.maxSpeed=                      BASE_MAXSPEED * TIER1;
    ship.turnRate =                     BASE_TURNRATE * TIER3;

	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);

	ship.addWeapon(machineGun());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setPosition(ship.hitbox.center);
    ship.weapon.setCenter(coord);
    ship.weapon.setTurretMode(true);
    ship.weapon.enabled=true;

	
	ship.addWeapon(nukeBomb());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);
	ship.weapon.enabled=true;

	ship.addWeapon(nukeBomb());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[1]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[1]);
	ship.weapon.enabled=false;

	ship.addWeapon(nukeBomb());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[1]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[1]);
	ship.weapon.enabled=false;

	ship.addWeapon(nukeBomb());

	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);
	ship.weapon.enabled=false;


    ship=loadDefaultSounds(ship);
	return ship;
}
/* ENERGY-BASED SHIPS */
var Stellar = function(primaryColor="#000FFF", secondaryColor = "#0FF0FF", 
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, BASE_SIZE, primaryColor, secondaryColor);
    ship.name="Stellar";
	ship.updateDirection();
	ship.hull        =         new Hull(BASE_HULL_MAX,
                                        BASE_HULL_RESISTANCE);

	ship.shield      =       new Shield(BASE_SHLD_MAX,
                                        BASE_SHLD_RESISTANCE, 
                                        BASE_SHLD_DRAINRATE, 
                                        BASE_SHLD_EFFICIENCY,
                                        BASE_SHLD_DRAINSPEED);

	ship.powerSupply = new EnergySource(BASE_SOURCE_MAX,
                                        BASE_SOURCE_RECHARGERATE,
                                        BASE_SOURCE_RECHARGESPEED);

	ship.acceleration =                 BASE_ACCEL;
	ship.maxSpeed =                     BASE_MAXSPEED;
	ship.turnRate =                     BASE_TURNRATE;

	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);

	
	ship.addWeapon(machineGun());
    
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);
	ship.weapon.enabled=true;

	ship.addWeapon(machineGun());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[1]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[1]);
	ship.weapon.enabled=true;

	ship.addWeapon(dumbMissile());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.center);
	ship.weapon.setPosition(ship.auxHitbox.center);
	ship.weapon.enabled=true;

    ship=loadDefaultSounds(ship);
/*  engineSound is too lame right now
    engineSound=document.createElement("audio");
    engineSound.src="g/engine.mp3";
    buffer=document.createElement("audio");
    buffer.src="g/engine.mp3";
    ship.engineSound = new BufferedSound(engineSound, buffer);
    ship.engineSound.sound.volume=0.5;
    ship.engineSound.buffer.volume=0.5;
*/
	
	return ship;
}
var StellarII = function(primaryColor="#000FFF", secondaryColor = "#0FF0FF", 
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, BASE_SIZE, primaryColor, secondaryColor);
    ship.name="StellarII";
	ship.updateDirection();

	ship.hull        =         new Hull(BASE_HULL_MAX,
                                        BASE_HULL_RESISTANCE);

	ship.shield      =       new Shield(BASE_SHLD_MAX * TIER2,
                                        BASE_SHLD_RESISTANCE, 
                                        BASE_SHLD_DRAINRATE *TIER2, 
                                        BASE_SHLD_EFFICIENCY,
                                        BASE_SHLD_DRAINSPEED);

	ship.powerSupply = new EnergySource(BASE_SOURCE_MAX * TIER2,
                                        BASE_SOURCE_RECHARGERATE,
                                        BASE_SOURCE_RECHARGESPEED / TIER2);

	ship.acceleration =                 BASE_ACCEL *TIER2;
	ship.maxSpeed =                     BASE_MAXSPEED *TIER2;
	ship.turnRate =                     BASE_TURNRATE *TIER2;

	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);

	
	ship.addWeapon(lightLaserBlaster());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.enabled=true;
	ship.addWeapon(lightLaserBlaster());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.enabled=true;

	ship.addWeapon(lightLaserBlaster());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[1]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[1]);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.enabled=true;
	ship.addWeapon(lightLaserBlaster());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.enabled=true;



	ship.addWeapon(dumbMissile());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.center);
	ship.weapon.setPosition(ship.auxHitbox.center);
	ship.weapon.enabled=true;

    ship=loadDefaultSounds(ship);
/*  engineSound is too lame right now
    engineSound=document.createElement("audio");
    engineSound.src="g/engine.mp3";
    buffer=document.createElement("audio");
    buffer.src="g/engine.mp3";
    ship.engineSound = new BufferedSound(engineSound, buffer);
    ship.engineSound.sound.volume=0.5;
    ship.engineSound.buffer.volume=0.5;
*/
	
	return ship;
}
var Beamer = function(primaryColor="#000FFF", secondaryColor = "#0FF0FF", 
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, BASE_SIZE, primaryColor, secondaryColor);
    ship.name="Beamer";
	ship.updateDirection();

	ship.hull        =         new Hull(BASE_HULL_MAX,
                                        BASE_HULL_RESISTANCE);

	ship.shield      =       new Shield(BASE_SHLD_MAX *TIER3,
                                        BASE_SHLD_RESISTANCE, 
                                        BASE_SHLD_DRAINRATE *TIER3, 
                                        BASE_SHLD_EFFICIENCY,
                                        BASE_SHLD_DRAINSPEED);

	ship.powerSupply = new EnergySource(BASE_SOURCE_MAX *TIER3,
                                        BASE_SOURCE_RECHARGERATE,
                                        BASE_SOURCE_RECHARGESPEED /TIER3);

	ship.acceleration =                 BASE_ACCEL *TIER2;
	ship.maxSpeed =                     BASE_MAXSPEED *TIER2;
	ship.turnRate =                     BASE_TURNRATE *TIER2;

	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);

	
	ship.addWeapon(lightLaserBeam());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.enabled=true;
	ship.addWeapon(lightLaserBeam());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[1]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[1]);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.enabled=true;
    ship=loadDefaultSounds(ship);
/*  engineSound is too lame right now
    engineSound=document.createElement("audio");
    engineSound.src="g/engine.mp3";
    buffer=document.createElement("audio");
    buffer.src="g/engine.mp3";
    ship.engineSound = new BufferedSound(engineSound, buffer);
    ship.engineSound.sound.volume=0.5;
    ship.engineSound.buffer.volume=0.5;
*/
	
	return ship;
}
var Turret = function(primaryColor="#0000FF", secondaryColor = "#0FF0FF", cannons = 1, x = c.width/2, y = c.height/2, size = BASE_SIZE * 0.75, weapon=machineGun){
	var ship = new Ship(x, y, size, primaryColor, secondaryColor);
    ship.name = "Turret";
	ship.updateDirection();

	ship.hull        =         new Hull(BASE_HULL_MAX,
                                        BASE_HULL_RESISTANCE);

	ship.shield      =       new Shield(BASE_SHLD_MAX *TIER4,
                                        BASE_SHLD_RESISTANCE, 
                                        BASE_SHLD_DRAINRATE *TIER4, 
                                        BASE_SHLD_EFFICIENCY,
                                        BASE_SHLD_DRAINSPEED);

	ship.powerSupply = new EnergySource(BASE_SOURCE_MAX *TIER4,
                                        BASE_SOURCE_RECHARGERATE,
                                        BASE_SOURCE_RECHARGESPEED /TIER4);

	ship.acceleration =                 BASE_ACCEL *TIER2;
	ship.maxSpeed =                     BASE_MAXSPEED *TIER2;
	ship.turnRate =                     BASE_TURNRATE *TIER2;

	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);

    if (cannons == 1){
        ship.addWeapon(weapon());
        ship.changeWeapon();
        ship.weapon.setOwner(ship);
        ship.weapon.setPowerSupply(ship.powerSupply);
        ship.weapon.setCenter(coord);
        ship.weapon.setPosition(ship.hitbox.center);
        ship.weapon.setTurretMode(true);
        ship.weapon.enabled=true;
    }
    else{
        for (var i = 0; i < cannons; i++){
            ship.addWeapon(weapon());
            ship.changeWeapon();
            ship.weapon.setOwner(ship);
            ship.weapon.setPowerSupply(ship.powerSupply);
            ship.weapon.setCenter(coord);
            ship.weapon.setPosition(ship.hitbox.vertices[i % 3]);
            ship.weapon.setTurretMode(true);
            ship.weapon.enabled=true;
        }
    }
	ship.draw = function(polygon = this.hitbox){
		ctx.save();
		ctx.lineWidth=3;
		ctx.beginPath();
		if (polygon.hit == true && this.shield.current == 0){
			ctx.strokeStyle="#FF0000";
			ctx.fillStyle="#FF0000";
		}
		else{
			ctx.strokeStyle=this.primaryColor;
			ctx.fillStyle=this.primaryColor;
		}
		for (var i = 0; i < polygon.vertices.length; i++){
			ctx.beginPath();
			ctx.moveTo(polygon.center.x, polygon.center.y);
			ctx.lineTo(polygon.vertices[i].x, polygon.vertices[i].y);
			ctx.stroke();
		}
		
		for (var i = 0; i < polygon.vertices.length; i++){
			ctx.beginPath();
			ctx.arc(polygon.vertices[i].x,
			polygon.vertices[i].y,
			3, 0, 2*Math.PI);
			if (i == 2){
				ctx.fillStyle=this.secondaryColor;
			}
			ctx.fill();
		}
		if (polygon.center != undefined){
			ctx.fillStyle=this.secondaryColor;
			ctx.beginPath();
			ctx.arc(polygon.center.x,
					polygon.center.y,
					3, 0, 2*Math.PI);
			ctx.fill();
		}
		if (this.immunity == true){
			ctx.strokeStyle=this.secondaryColor;
			ctx.beginPath();
			ctx.arc(polygon.center.x,
					polygon.center.y,
					polygon.side + 2, 0, 2*Math.PI);
			ctx.stroke();
		}
		if (this.shield.enabled && this.shield.current > 0){
            if (polygon.hit == true){
			    ctx.save();
                ctx.strokeStyle=this.primaryColor;
                ctx.beginPath();
                ctx.arc(polygon.center.x,
                        polygon.center.y,
                        polygon.side + 2, 0, 2*Math.PI);
                ctx.stroke();	
			    ctx.restore();
            }
		}
		ctx.restore();
	}
    ship=loadDefaultSounds(ship);
	return ship;
}
var StarGazer = function(primaryColor="#0000FF", secondaryColor = "#0FF0FF",
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, BASE_SIZE * 1.25, primaryColor, secondaryColor);
    ship.name="StarGazer";
	ship.updateDirection();
	ship.hull        =         new Hull(BASE_HULL_MAX,
                                        BASE_HULL_RESISTANCE);

	ship.shield      =       new Shield(BASE_SHLD_MAX * TIER5,
                                        BASE_SHLD_RESISTANCE, 
                                        BASE_SHLD_DRAINRATE * TIER5, 
                                        BASE_SHLD_EFFICIENCY,
                                        BASE_SHLD_DRAINSPEED);

	ship.powerSupply = new EnergySource(BASE_SOURCE_MAX *TIER5,
                                        BASE_SOURCE_RECHARGERATE,
                                        BASE_SOURCE_RECHARGESPEED /TIER5);

	ship.acceleration =                 BASE_ACCEL *TIER4;
	ship.maxSpeed =                     BASE_MAXSPEED *TIER3;
	ship.turnRate =                     BASE_TURNRATE *TIER3;


	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);

	ship.addWeapon(lightCannon());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);
	ship.weapon.enabled=true;

	ship.addWeapon(lightCannon());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[1]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[1]);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.enabled=true;
	
	ship.addWeapon(heavyLaserBlaster());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.setPosition(ship.auxHitbox.center);
	ship.weapon.setCenter(ship.hitbox.center);
	ship.weapon.enabled=true;

    ship=loadDefaultSounds(ship);
	return ship;
}
var StarGazerII = function(primaryColor="#0000FF", secondaryColor = "#0FF0FF",
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, BASE_SIZE * 1.25, primaryColor, secondaryColor);
    ship.name="StarGazerII";
	ship.updateDirection();
	ship.hull        =         new Hull(BASE_HULL_MAX,
                                        BASE_HULL_RESISTANCE);

	ship.shield      =       new Shield(BASE_SHLD_MAX *TIER6,
                                        BASE_SHLD_RESISTANCE, 
                                        BASE_SHLD_DRAINRATE *TIER6, 
                                        BASE_SHLD_EFFICIENCY,
                                        BASE_SHLD_DRAINSPEED);

	ship.powerSupply = new EnergySource(BASE_SOURCE_MAX *TIER6,
                                        BASE_SOURCE_RECHARGERATE,
                                        BASE_SOURCE_RECHARGESPEED /TIER6);

	ship.acceleration =                 BASE_ACCEL *TIER4;
	ship.maxSpeed =                     BASE_MAXSPEED *TIER3;
	ship.turnRate =                     BASE_TURNRATE *TIER4;

	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);
	
	ship.addWeapon(heavyCannon());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);
	ship.weapon.enabled=true;

	ship.addWeapon(heavyCannon());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[1]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[1]);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.enabled=true;
	
	ship.addWeapon(heavyLaserBlaster());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.setPosition(ship.auxHitbox.center);
	ship.weapon.setCenter(ship.hitbox.center);
	ship.weapon.enabled=true;

    ship=loadDefaultSounds(ship);
	return ship;
}
var Duster = function(primaryColor="#0000FF", secondaryColor = "#0FF0FF",
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, BASE_SIZE * 1.75, primaryColor, secondaryColor);
    ship.name="Duster";
	ship.updateDirection();
	ship.hull        =         new Hull(BASE_HULL_MAX,
                                        BASE_HULL_RESISTANCE);

	ship.shield      =       new Shield(BASE_SHLD_MAX *TIER7,
                                        BASE_SHLD_RESISTANCE, 
                                        BASE_SHLD_DRAINRATE *TIER7, 
                                        BASE_SHLD_EFFICIENCY,
                                        BASE_SHLD_DRAINSPEED);

	ship.powerSupply = new EnergySource(BASE_SOURCE_MAX *TIER7,
                                        BASE_SOURCE_RECHARGERATE,
                                        BASE_SOURCE_RECHARGESPEED /TIER7);

	ship.acceleration =                 BASE_ACCEL *TIER5;
	ship.maxSpeed =                     BASE_MAXSPEED *TIER2;
	ship.turnRate =                     BASE_TURNRATE *TIER5;

	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);
	
	ship.addWeapon(dumbMissile());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);
	ship.weapon.enabled=true;

	ship.addWeapon(dumbMissile());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[1]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[1]);
	ship.weapon.enabled=true;

	ship.addWeapon(heavyLaserBlaster());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);
	ship.weapon.enabled=true;


	ship.addWeapon(heavyLaserBlaster());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[1]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[1]);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.enabled=true;

    ship=loadDefaultSounds(ship);
	return ship;
}
var Gargatuan = function(primaryColor="#0000FF", secondaryColor = "#0FF0FF",
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, BASE_SIZE * 1.5, primaryColor, secondaryColor);
    ship.name="Gargantuan";
	ship.updateDirection();
	ship.hull        =         new Hull(BASE_HULL_MAX,
                                        BASE_HULL_RESISTANCE);

	ship.shield      =       new Shield(BASE_SHLD_MAX *TIER7,
                                        BASE_SHLD_RESISTANCE, 
                                        BASE_SHLD_DRAINRATE *TIER7, 
                                        BASE_SHLD_EFFICIENCY,
                                        BASE_SHLD_DRAINSPEED);

	ship.powerSupply = new EnergySource(BASE_SOURCE_MAX *TIER7,
                                        BASE_SOURCE_RECHARGERATE,
                                        BASE_SOURCE_RECHARGESPEED /TIER7);

	ship.acceleration =                 BASE_ACCEL *TIER4;
	ship.maxSpeed =                     BASE_MAXSPEED *TIER2;
	ship.turnRate =                     BASE_TURNRATE *TIER4;

	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);
	
	ship.addWeapon(heavyLaserBlaster());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);

	ship.weapon.enabled=true;

	ship.addWeapon(heavyLaserBlaster());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[1]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[1]);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.enabled=true;

	
	ship.addWeapon(heavyLaserBeam());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.setPosition(ship.front);
	ship.weapon.setCenter(ship.hitbox.center);
	ship.weapon.enabled=true;

    ship=loadDefaultSounds(ship);
	return ship;
}
var GargantuanII = function(primaryColor="#0000FF", secondaryColor = "#0FF0FF",
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, BASE_SIZE * 1.5, primaryColor, secondaryColor);
    ship.name="GargantuanII";
	ship.updateDirection();

	ship.hull        =         new Hull(BASE_HULL_MAX,
                                        BASE_HULL_RESISTANCE);

	ship.shield      =       new Shield(BASE_SHLD_MAX *TIER8,
                                        BASE_SHLD_RESISTANCE, 
                                        BASE_SHLD_DRAINRATE *TIER8, 
                                        BASE_SHLD_EFFICIENCY,
                                        BASE_SHLD_DRAINSPEED);

	ship.powerSupply = new EnergySource(BASE_SOURCE_MAX *TIER8,
                                        BASE_SOURCE_RECHARGERATE,
                                        BASE_SOURCE_RECHARGESPEED /TIER8);

	ship.acceleration =                 BASE_ACCEL *TIER3;
	ship.maxSpeed =                     BASE_MAXSPEED *TIER2;
	ship.turnRate =                     BASE_TURNRATE *TIER2;

	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);
	
	ship.addWeapon(heavyLaserBeam());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[0]);

	ship.weapon.enabled=true;

	ship.addWeapon(heavyLaserBeam());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[1]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[1]);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.enabled=true;

	
	ship.addWeapon(heavyLaserBlaster());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.setCenter(ship.hitbox.center);
	ship.weapon.setPosition(ship.auxHitbox.center);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.enabled=true;

    ship=loadDefaultSounds(ship);
	return ship;
}
var Colossal = function(primaryColor="#0000FF", secondaryColor = "#0FF0FF",
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, BASE_SIZE * 2.5, primaryColor, secondaryColor);
    ship.name = "Colossal";
	ship.updateDirection();
	ship.hull        =         new Hull(BASE_HULL_MAX,
                                        BASE_HULL_RESISTANCE);

	ship.shield      =       new Shield(BASE_SHLD_MAX *TIER9,
                                        BASE_SHLD_RESISTANCE *TIER9, 
                                        BASE_SHLD_DRAINRATE *TIER9, 
                                        BASE_SHLD_EFFICIENCY,
                                        BASE_SHLD_DRAINSPEED);

	ship.powerSupply = new EnergySource(BASE_SOURCE_MAX *TIER9,
                                        BASE_SOURCE_RECHARGERATE,
                                        BASE_SOURCE_RECHARGESPEED /TIER9);

	ship.acceleration =                 BASE_ACCEL *TIER2;
	ship.maxSpeed =                     BASE_MAXSPEED *TIER2;
	ship.turnRate =                     BASE_TURNRATE *TIER2;

	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);
    
    for (var i = 2; i < ship.hitbox.vertices.length; i++){
        ship.addWeapon(heavyLaserBlaster());
        ship.changeWeapon();
        ship.weapon.setOwner(ship);
        ship.weapon.setPowerSupply(ship.powerSupply);
        ship.weapon.setCenter(ship.hitbox.vertices[i]);
        ship.weapon.setPosition(ship.auxHitbox.vertices[i]);
        ship.weapon.enabled=true;
    }

    for (var i = 0; i < ship.hitbox.vertices.length - 1; i++){
        ship.addWeapon(lightLaserBlaster());
        ship.changeWeapon();
        ship.weapon.setOwner(ship);
        ship.weapon.setPowerSupply(ship.powerSupply);
        ship.weapon.setCenter(coord);
        ship.weapon.setPosition(ship.hitbox.vertices[i % 3]);
        ship.weapon.setTurretMode(true);
        ship.weapon.enabled=true;
    }
    ship=loadDefaultSounds(ship);

	return ship;
}

function fetchShipByName(name, position){
    primaryColor = "#000FFF";
    secondaryColor= "#00F0FF";
    if (name == "Stellar"){
        var ship = new Stellar(primaryColor, secondaryColor, 
                               position.x, position.y);
    }
    else if (name == "Gargantuan"){
        var ship = new Gargatuan(primaryColor, secondaryColor, 
                               position.x, position.y);

    }
    else if (name == "Colossal"){
        var ship = new Colossal(primaryColor, secondaryColor, 
                               position.x, position.y);
    }
    else if (name == "Turret"){
	    var ship = new Turret(primaryColor, secondaryColor, 3,
                        position.x, position.y, 20, lightLaserBlaster);
    }
    else if (name == "Bomber"){
        var ship = new Bomber(primaryColor, secondaryColor, 
                               position.x, position.y);

    }
    else if (name == "Shark"){
        var ship = new Shark(primaryColor, secondaryColor, 
                               position.x, position.y);
;
    }
    else if (name == "StellarII"){
        var ship = new StellarII(primaryColor, secondaryColor, 
                               position.x, position.y);
;
    }
    else if (name == "CannonFolder"){
        var ship = new CannonFolder(primaryColor, secondaryColor, 
                               position.x, position.y);
;
    }
    else if (name == "Beamer"){
        var ship = new Beamer(primaryColor, secondaryColor, 
                               position.x, position.y);
;
    }
    else if (name == "GargantuanII"){
        var ship = new GargantuanII(primaryColor, secondaryColor, 
                               position.x, position.y);
;
    }
    else if (name == "StarGazer"){
        var ship = new StarGazer(primaryColor, secondaryColor, 
                               position.x, position.y);
;
    }
    else if (name == "StarGazerII"){
        var ship = new StarGazerII(primaryColor, secondaryColor, 
                               position.x, position.y);
;
    }
    else if (name == "Duster"){
        var ship = new Duster(primaryColor, secondaryColor, 
                               position.x, position.y);
;
    }
    else if (name == "Armageddon"){
        var ship = new Armageddon(primaryColor, secondaryColor, 
                               position.x, position.y);
;
    }
    return ship;
}

