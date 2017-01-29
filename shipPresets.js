// Ship presets
// Depends on: collision.js; ship.js; weapons;js
// var Shield = function(max = 100, resistance=0, drainRate=10, rechargeEfficiency = 0.5, drainSpeed = 250)

function loadDefaultSounds(ship){
    ship.hull.sound= new Howl({
            src: ['Hit_Hurt5.mp3']});

    ship.shield.sound = ship.hull.sound;
    ship.deadSound = new Howl({
            src: ["Explosion4.mp3"]});
    return ship;
}

var Stellar = function(primaryColor="#000FFF", secondaryColor = "#0FF0FF", 
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, 20, primaryColor, secondaryColor);
    ship.name="Stellar";
	ship.updateDirection();
	ship.hull = new Hull(100, 0);
	ship.shield = new Shield(50, 0, 5, 1, 300);
    ship.acceleration = 0.21;
    ship.turnRate = 4;

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

//	ship.addWeapon(lightLaserBlaster());
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.addWeapon(machineGun());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setPosition(ship.hitbox.center);
    ship.weapon.setCenter(coord);
    ship.weapon.setTurretMode(true);
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
var Shark = function(primaryColor="#000FFF", secondaryColor = "#0FF0FF", 
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, 15, primaryColor, secondaryColor);
    ship.name="Shark";
	ship.updateDirection();
	ship.hull = new Hull(150, 7);
	ship.shield = new Shield(0, 0, 5, 1, 300);
    ship.acceleration = 0.31;
    ship.turnRate = 7;

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

	ship.weapon.setPowerSupply(ship.powerSupply);
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
	var ship = new Ship(x, y, 30, primaryColor, secondaryColor);
    ship.name="Bomber";
	ship.updateDirection();
	ship.hull = new Hull(100, 0);
	ship.shield = new Shield(50, 0, 5, 1, 300);
    ship.acceleration = 0.11;
    ship.turnRate = 4;

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
	ship.addWeapon(dumbMissile());

	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[0]);
	ship.weapon.setPosition(ship.auxHitbox.vertices[1]);
	ship.weapon.enabled=true;

	ship.addWeapon(dumbMissile());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setCenter(ship.hitbox.vertices[1]);
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
var Gargatuan = function(primaryColor="#0000FF", secondaryColor = "#0FF0FF",
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, 30, primaryColor, secondaryColor);
    ship.name="Gargantuan";
	ship.updateDirection();
	ship.hull = new Hull(200, 1);
	ship.shield = new Shield(300, 0, 20, 0.5, 300);
	ship.powerSupply = new EnergySource(1000, 20, 100);
	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);
	ship.acceleration = 0.08;
	ship.maxSpeed = 7;
	ship.turnRate = 4;
	
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
var Colossal = function(primaryColor="#0000FF", secondaryColor = "#0FF0FF",
                       x = c.width/2, y = c.height/2){
	var ship = new Ship(x, y, 50, primaryColor, secondaryColor);
    ship.name = "Colossal";
	ship.updateDirection();
	ship.hull = new Hull(1000, 1);
	ship.shield = new Shield(2000, 0, 50, 1, 150);
	ship.powerSupply = new EnergySource(2000, 20, 100);
	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);
	ship.acceleration = 0.04;
	ship.maxSpeed = 9;
	ship.turnRate = 2;
	
    
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
var Turret = function(primaryColor="#0000FF", secondaryColor = "#0FF0FF", cannons = 1, x = c.width/2, y = c.height/2, size = 15, weapon=machineGun){
	var ship = new Ship(x, y, size, primaryColor, secondaryColor);
    ship.name = "Turret";
	ship.updateDirection();
	ship.hull = new Hull(50, 3);
	ship.shield = new Shield(20, 0, 5, 0.5, 300);
	ship.powerSupply = new EnergySource(500, 10, 100);
	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);
	ship.acceleration = 0.08;
	ship.maxSpeed = 3;
	ship.turnRate = 3;

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
			ctx.save();
            if (polygon.hit == true){
                ctx.strokeStyle=this.primaryColor;
            }
            else{
			    ctx.strokeStyle=this.secondaryColor;
            }
			ctx.beginPath();
			ctx.arc(polygon.center.x,
					polygon.center.y,
					polygon.side + 2, 0, 2*Math.PI);
			ctx.stroke();	
			ctx.restore();
		}
		ctx.restore();
	}
    ship=loadDefaultSounds(ship);
	return ship;
}

function fetchShipByName(name){
    if (name == "Stellar"){
        var ship = new Stellar();
    }
    else if (name == "Gargantuan"){
        var ship = new Gargatuan();
    }
    else if (name == "Colossal"){
        var ship = new Colossal();
    }
    else if (name == "Turret"){
	    var ship = new Turret("#000FFF", "#00F0FF", 3,
                        c.width/2, c.height/2, 20, dumbMissile);
    }
    else if (name == "Bomber"){
        var ship = new Bomber();
    }
    else if (name == "Shark"){
        var ship = new Shark();
    }

    return ship;
}

