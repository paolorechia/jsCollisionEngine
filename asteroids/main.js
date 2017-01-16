updateResEvent = function(canvas) {
          window.addEventListener('resize', function(event) {
            canvas.width = window.innerWidth-20;
            canvas.height = window.innerHeight-20;
		  });
}

var Score = function(color = "#000FFF"){
	this.player = 0;
    this.max = 0;
    this.coins = 0;
    this.getMax = function(){
        this.max = getCookie("maxScore");
        if (this.max.length == 0){
            document.cookie = "maxScore = 0";
            this.max = getCookie("maxScore");
        }
        this.max = Number(this.max);
    }
    this.getCoins = function(){
        this.coins = getCookie("coins");
        if (this.coins.length == 0){
            document.cookie = "coins= 0";
            this.coins = getCookie("coins");
        }
        this.coins = Number(this.coins);
    }
	this.draw = function(color){
		ctx.beginPath();
		ctx.fillStyle=color;
		ctx.font="14px Arial";
		string = "Score: " + this.player;
		ctx.fillText(string, c.width/2 - 40, c.height - 20);
		string = "Max Score: " + this.max;
		ctx.fillText(string, c.width/2 - 160, c.height - 20);
	}
}
function generateAsteroids(maxSize, minSize, maxSpeed, maxSpin, numberRectangles, numberTriangles){
			for (i = 0; i < numberRectangles; i++){
				rect = new randomRect(maxSize, minSize, maxSpeed, maxSpin);
				rect.hp= Math.round(Math.sqrt(rect.mass));
				rect.dead = false;
				rect.sufferDamage = asteroidSufferDamage;
                rect.value = Math.round(rect.hp/40);
				objects.push(rect);
			}
			for (i = 0; i < numberTriangles; i++){
				triangle = new randomTriangle(maxSize, minSize, maxSpeed, maxSpin);
				triangle.hp = Math.round(Math.sqrt(triangle.mass));
				triangle.dead == false;		
				triangle.sufferDamage = asteroidSufferDamage;				
                triangle.value = Math.round(triangle.hp/40);
				objects.push(triangle);
			}	
}
function generateTurrets(n, cannons, moving=false, rateOfFire=1){
    for (var i = 0; i < n; i++){
        var x = Math.random() * c.width;
        var y = Math.random() * c.height;

        myRandom = Math.random();
        if (myRandom > 0.9){
            turret = new Turret("#FFFFFF", "#FF0000", cannons, x, y, 40, heavyLaserBlaster);
            turret.hitbox.spin = 20;
        }
        else if (myRandom > 0.8){
            turret = Turret("#FFFFFF", "#FF0000", cannons, x, y, 40, asteroidShooter);
        }
        else if (myRandom > 0.7){
            turret = Turret("#FFFFFF", "#FF0000", cannons, x, y, 40, heavyCannon);
        }
        else if (myRandom > 0.6){
            turret = new Turret("#FFFFFF", "#FF0000", cannons, x, y, 40, lightLaserBlaster);
            turret.hitbox.spin = 20;
        }
        else if (myRandom > 0.5){
            turret = Turret("#FFFFFF", "#FF0000", cannons, x, y, 40, lightCannon);
        }
        else{
            turret = Turret("#FFFFFF", "#FF0000", cannons, x, y, 40, machineGun);
        }
        for (var j =0; j < cannons; j++){
            turret.weapons[j].rateOfFire *= rateOfFire;
            turret.weapons[j].setCenter(player.hitbox.center);
            turret.weapons[j].setPosition(turret.hitbox.vertices[j]);
            turret.weapons[j].firing=true;
        }
        turret.weapon.setOwner(turret);
        if (moving){
            turret.engineOn=true;
            rotatePolygon(turret.hitbox, 360 * Math.random());
        }
        turret.value = Math.round(myRandom * 10);
        turret.value *= cannons;
        enemies.push(turret);
    }
}
var Level = function(color="#000FFF"){
	this.current = 0;
	this.max = 20;
	this.draw = function(color){
            ctx.beginPath();
		ctx.fillStyle=color;
		ctx.font="14px Arial";
		string = "Level: " + this.current;
		ctx.fillText(string, c.width/2 + 40, c.height - 20);
	}
	this.start = function(){

		player.setImmunity(3);

		if (this.current <= 12){
			player.hull.recover(10);
            if (this.current % 2 != 0){
                var maxSize = c.width/20 + (this.current * 2);
                var minSize = c.width/100 + (this.current * 2);
                var maxSpeed = Math.round(this.current * 0.7);
                var maxSpin = Math.floor(this.current *0.2);
                var numberRectangles = Math.round(this.current * 0.6);
                var numberTriangles = Math.round(this.current * 0.4);
                generateAsteroids(maxSize, minSize, maxSpeed, maxSpin, numberRectangles, numberTriangles);
            }
            else generateTurrets(Math.floor(this.current/2), 1, true, 0.25);
		}
		else if (this.current >= 13 && this.current <= 15){
            generateTurrets(Math.floor(this.current/3), 2, true, 0.5);
		}
		else{
            generateTurrets(Math.floor(this.current/4), 3, true, 0.75);
		}
	}
	this.next = function(){
		this.current++;
	}
}
var Game = function(){
	this.over = false;
}


function buildInstructions(){
	var instructions = [];
	
	var string;
	string = "W: Main Engine Throttle";
	instructions.push(string);
	string = "Q: Reverse Engine Throttle";
	instructions.push(string);
	string = "A: Left turning";
	instructions.push(string);
	string = "D: Right turning";
	instructions.push(string);
	string = "Q: Left strafe";
	instructions.push(string);
	string = "E: Right strafe";
	instructions.push(string);
	string = "S: Advanced Braking System";
	instructions.push(string);
	string = "Space: Shoot";
	instructions.push(string);
	string = "X: Auto-Fire";
	instructions.push(string);
	string = "R: Cycle Weapons";
	instructions.push(string);
	string = "F: Enable Shield";
	instructions.push(string);
	string = "Click: Auto-pilot to given point (locks down the ship)";
	instructions.push(string);	
	return instructions;
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
function drawInstructions(instructions, color="#000FFF"){
	ctx.beginPath();
	ctx.fillStyle=color;
	ctx.font="14px Arial";
	var offSet = 0;
	var xStart = 230;
	var colSize = 3;
	for (var i = 0; i < instructions.length; i++){
		if (i % colSize == 0){
			offSet += 240;
		}
		ctx.fillText(instructions[i], offSet - xStart, 40 + (i % colSize) * 20);
	}
}

function drawEndGame(win, color="#000FFF", lose="#FF0000"){
	if (win){
		ctx.beginPath();
		ctx.fillStyle=color;
		ctx.font="28px Arial";
		ctx.fillText("Congratulations! You've won! Press F5 to restart.", c.width/3, c.height/2);		
		
	}
	else{
		ctx.beginPath();
		ctx.fillStyle=lose;
		ctx.font="28px Arial";
		ctx.fillText("You've died! Press F5 to restart.", c.width/3, c.height/2);
	}
}


var Phases = function(){
		this.phase1 = false;
		this.phase2 = false;
		this.phase3 = false;
		this.phase4 = false;
		this.phase5 = false;
		this.phase6 = false;
		this.current = 0;
}

var EnergySource = function(max = 100, rechargeRate = 10, rechargeSpeed=500){ //rechargeSpeed in microseconds; rechargeRate in points per second
	this.max = max;
	this.current = this.max;
	this.rechargeRate = rechargeRate;
	this.rechargeSpeed = rechargeSpeed;
	this.rechargeEvent = undefined;
	this.recharging = true;
    this.getValue = function(){
        var value = this.max * this.rechargeRate;
        value /= 1000;
        value *= 1000 - rechargeSpeed;
        value = Math.round(value);
        return value;
    }
	this.recharge = function(source){
		if (this.recharging){
			if (this.current < this.max){
				this.current += this.rechargeRate;
				if (this.current > this.max){
					this.current = this.max;
				}
				this.recharging = false;
				this.rechargeEvent = undefined;
			}
			if (this.rechargeEvent == undefined){
				this.rechargeEvent = setTimeout(function(){source.recharging = true;}, source.rechargeSpeed);
			}
		}
	}
	this.drain = function(n){
		this.current -= n;
		if (this.current < 0){
			this.current = 0;
		}
	}
}

var Shield = function(max = 100, resistance=0, drainRate=10, rechargeEfficiency = 0.5, drainSpeed = 250){
	this.enabled = false;
	this.max = max;
	this.current = 0;
	this.drainRate = drainRate;
	this.rechargeEfficiency = rechargeEfficiency; // transforms 1 energy point into 'k' shield points
	this.drainSpeed = drainSpeed;
	this.draining = true;
	this.drainEvent = undefined;
	this.powerSupply = new EnergySource(0, 0);
	this.resistance = 0;
	this.resistanceType = 'f'; // defense type can be either 'f' (flat) or 'p' (porcentual)
							// The first case will simply subtract a constant from the received damage; the second will multiply the damage by the constant
	
    this.getValue = function(){
        value = this.max * (this.resistance + 1); //assumes a flat resistance
        value *= this.rechargeEfficiency;
        value *= 1000 - this.drainSpeed;
        value = Math.round(value/100);
        return value;
    }
	this.setPowerSupply = function(powerSupply){
		this.powerSupply = powerSupply;
	}
	this.setEnabled = function(enabled){
		this.enabled = enabled;
	}
	this.drainEnergy = function(shield){	// drains energy from power supply to recharge shield points
		if (this.draining && this.enabled){
				this.draining = false;
				this.drainingEvent = undefined;
				if (this.drainingEvent === undefined){
					this.drainingEvent = setTimeout(function(){shield.draining = true;}, shield.drainSpeed);
				}
			if (this.current < this.max){
				
				if (this.powerSupply.current > this.drainRate){
					this.current += this.drainRate * this.rechargeEfficiency;
					this.powerSupply.current -= this.drainRate;
				}
				else{
					this.current += this.powerSupply.current * this.rechargeEfficiency;
					this.powerSupply.current = 0;
				}
				if (this.current > this.max){
					this.current = this.max;
				}
			
			}
			
		}
	}
	this.sufferDamage = function(damage){
		if (this.resistanceType == 'f'){
			var actualDamage = damage - this.resistance;
			if (actualDamage > 0){
					this.current -= actualDamage;
			}
		}
		else{
			var actualDamage = damage * this.resistance;
			if (actualDamage > 0){
					this.current -= actualDamage;
			}			
		}
		if (this.current < 0){
			var exceedingDamage = this.current * -1;
			this.current = 0;
		}
		else{
			exceedingDamage = 0;
		}
		return exceedingDamage;
	}
}
var Hull = function(max = 100, resistance = 0){
	this.max = max;
	this.current = this.max;
	this.resistance = resistance;
	this.resistanceType = 'f'; // same as shield defense type -- 'f' for flat resistance; 'p' for porcentual

    this.getValue = function(){
        value = this.max * (this.resistance + 1); //assumes a flat resistance
        return value;
    }
	this.sufferDamage = function(damage){
		if (this.resistanceType == 'f'){
			var actualDamage = damage - resistance;
			if (actualDamage > 0){
					this.current -= actualDamage;
			}
		}
		else{
			var actualDamage = damage * resistance;
			if (actualDamage > 0){
					this.current -= actualDamage;
			}			
		}
	}
	this.recover = function(heal){
		this.current += heal;
		if (this.current > this.max){
			this.current = this.max;
		}
	}
}

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


var Ship = function(x, y, l1, primaryColor = "#0000FF", secondaryColor = "#00F0FF"){
	this.hitbox = new Triangle(x, y, l1,
						0, 0,			// vx, vy
						0, 0);			// velocity, spin
	
	this.primaryColor = primaryColor;
	this.secondaryColor = secondaryColor;	
	this.auxHitbox = new Triangle(x, y - l1, l1, 0, 0, 0, 0);
	this.powerSupply = new EnergySource(100, 10);
	this.hull = new Hull();
	this.shield = new Shield();
	this.immunity = false;
	this.dead = false;
	this.weapons = [];

	this.currentWeapon = 0;
	this.lock = false;
	this.engineOn = false;
	this.reverseEngine = false;
	this.braking = false;
	this.isTurning = false;
	this.isStrafing = false;
	this.strafingSide = 0; // 0 for left; -1 for right
	this.acceleration = 0.125;
	this.maxSpeed = 4;
	this.turnRate = 3.5;
	this.turning = false;
	this.rotate = 0;
	this.front = new Point(this.hitbox.vertices[2].x,
						   this.hitbox.vertices[2].y);
	this.inertiaVector = new Vector(0, 0);
	this.engineVersor = new Vector(0, 0);
	this.engineVector = new Vector(0, 0);
	this.strafingVector = new Vector(0, 0);
	
	this.autoPath = new Point(0, 0);

    this.getEngineValue = function(){
        var value = this.maxSpeed * 10;
        value += this.acceleration * 1000;
        value += this.turnRate * 100;
        return Math.round(value);
    }
    this.getValue = function(){
        var value = this.getEngineValue();
        value += this.hull.getValue();
        value += this.shield.getValue();
        value += this.powerSupply.getValue();
        for (var i =0; i < this.weapons.length; i++){
            value += this.weapons[i].getValue();
        }
        return value; 
    }	
	this.updateDirection = function(){

		if (!this.engineOn && !this.reverseEngineOn && this.braking == false){
			return;
		}
		
		this.inertiaVector.x = this.hitbox.versor.x * this.hitbox.velocity;
		this.inertiaVector.y = this.hitbox.versor.y * this.hitbox.velocity;
		
		if (this.engineOn){
			calculateVector(this.front, this.hitbox.center, this.engineVersor);
			unitVector(this.engineVersor, this.engineVersor);
			this.engineVector.x = this.engineVersor.x * this.acceleration;
			this.engineVector.y = this.engineVersor.y * this.acceleration;
		}
		else{
			if (this.braking){ //Advanced Braking System
				unitVector(this.inertiaVector, this.engineVersor);
				this.engineVersor.x *= -1;
				this.engineVersor.y *= -1;
				if (this.acceleration > this.hitbox.velocity){
					this.engineVector.x = this.engineVersor.x * this.hitbox.velocity;
					this.engineVector.y = this.engineVersor.y * this.hitbox.velocity;
				}
				else{
					this.engineVector.x = this.engineVersor.x * this.acceleration;
					this.engineVector.y = this.engineVersor.y * this.acceleration;	
				}
			}
			else { // reverseEngine
				calculateVector(this.front, this.hitbox.center, this.engineVersor);
				unitVector(this.engineVersor, this.engineVersor);
				if (this.reverseEngineOn){
					this.engineVersor.x *= -1;
					this.engineVersor.y *= -1;
				this.engineVector.x = this.engineVersor.x * this.acceleration;
				this.engineVector.y = this.engineVersor.y * this.acceleration;
				}
			}
		}

		var aux = new Vector(this.engineVector.x + this.inertiaVector.x,
							 this.engineVector.y + this.inertiaVector.y);
		var calculatedSpeed = norm(aux);
		if (calculatedSpeed <= this.maxSpeed){
			if (calculatedSpeed == 0){
				this.hitbox.velocity = calculatedSpeed;
				this.hitbox.versor.x = 0;
				this.hitbox.versor.y = 0;
				this.auxHitbox.velocity = this.hitbox.velocity;
				this.auxHitbox.versor = this.hitbox.versor;
			}
			else{
				unitVector(aux, aux);
				this.hitbox.velocity = calculatedSpeed;
				this.hitbox.versor.x = aux.x;
				this.hitbox.versor.y = aux.y;
				this.auxHitbox.velocity = this.hitbox.velocity;
				this.auxHitbox.versor = this.hitbox.versor;
			}				
		}
        else{
            unitVector(aux, aux);
            this.hitbox.versor.x = aux.x;
            this.hitbox.versor.y = aux.y;
            this.auxHitbox.velocity = this.hitbox.velocity;
            this.auxHitbox.versor = this.hitbox.versor;
        }
	}
	this.updatePosition = function(){
		this.hitbox.update(); 
		this.auxHitbox.update();
		this.front.x = this.hitbox.vertices[2].x
		this.front.y = this.hitbox.vertices[2].y
	}
	
	this.updateTurn = function(){
		if (this.isTurning){
			rotatePolygon(this.hitbox, this.rotate);
			theta = degreesToRadians(this.rotate);
			for (var i = 0; i < this.auxHitbox.vertices.length; i++){

				this.auxHitbox.vertices[i].x -= this.hitbox.center.x;
				this.auxHitbox.vertices[i].y -= this.hitbox.center.y;
				x = this.auxHitbox.vertices[i].x * Math.cos(theta) - this.auxHitbox.vertices[i].y * Math.sin(theta);
				y = this.auxHitbox.vertices[i].x * Math.sin(theta) + this.auxHitbox.vertices[i].y * Math.cos(theta);
				this.auxHitbox.vertices[i].x = x + this.hitbox.center.x;
				this.auxHitbox.vertices[i].y = y + this.hitbox.center.y;
			}
		}
	}
	this.turn = function(side, isTurning){
		this.isTurning = isTurning;
		if (side == 'l'){
			this.rotate = -this.turnRate;
		}
		else{
			this.rotate = this.turnRate;
		}
	}
	this.updateStrafe = function(){
		if (!this.isStrafing){
			return;
		}
		this.inertiaVector.x = this.hitbox.versor.x * this.hitbox.velocity;
		this.inertiaVector.y = this.hitbox.versor.y * this.hitbox.velocity;

		var mid = new midPoint(this.hitbox.vertices[0], this.hitbox.vertices[1]);
		if (this.strafingSide == -1){
			calculateVector(mid, this.hitbox.vertices[0], this.strafingVector);
		}
		else{
			calculateVector(mid, this.hitbox.vertices[1], this.strafingVector);
		}
		
		unitVector(this.strafingVector, this.strafingVector);
		this.strafingVector.x = this.strafingVector.x * this.acceleration/3;
		this.strafingVector.y = this.strafingVector.y * this.acceleration/3;

		var aux = new Vector(this.strafingVector.x + this.inertiaVector.x,
							 this.strafingVector.y + this.inertiaVector.y);
		var calculatedSpeed = norm(aux);
		if (calculatedSpeed <= this.maxSpeed){
			if (calculatedSpeed == 0){
				this.hitbox.velocity = calculatedSpeed;
				this.hitbox.versor.x = 0;
				this.hitbox.versor.y = 0;
			}
			else{
				unitVector(aux, aux);
				this.hitbox.velocity = calculatedSpeed;
				this.hitbox.versor.x = aux.x;
				this.hitbox.versor.y = aux.y;
			}				
		}
        else{
            unitVector(aux, aux);
            this.hitbox.versor.x = aux.x;
            this.hitbox.versor.y = aux.y;
        }
		this.auxHitbox.velocity = this.hitbox.velocity;
		this.auxHitbox.versor = this.hitbox.versor;
	}
	this.strafe = function(side, isStrafing){
		this.isStrafing = isStrafing;
		if (side == 'l'){
			this.strafingSide = 1;	// left side
		}
		else{
			this.strafingSide = -1; // right side
		}
	}
	this.throttle = function(pressed){
		this.engineOn = pressed;
	}
	this.brake = function(pressed){
		this.braking = pressed;
	}
	this.reverseThrottle = function(pressed){
		this.reverseEngineOn = pressed;
	}
	this.calculateAngle = function(autoPath){		//autoPath is a given (x,y) point
		pathVector = new Vector(0, 0);
		frontVector = new Vector(0, 0);
		calculateVector(autoPath, this.hitbox.center, pathVector);
		if (this.hitbox.velocity == 0){
			calculateVector(this.front, this.hitbox.center, frontVector);
			unitVector(frontVector, frontVector);
			
		}
		else{
			frontVector.x = this.engineVersor.x;
			frontVector.y = this.engineVersor.y;
		}
		translatedPoint = new Point(this.hitbox.center.x - autoPath.x, this.hitbox.center.y - autoPath.y);
		list = [];
		list.push(translatedPoint);
		rotatedVector = new Vector(0, 0);
		var theta = degreesToRadians(90);
		rotatedVector.x = frontVector.x * Math.cos(theta) - frontVector.y * Math.sin(theta);
		rotatedVector.y = frontVector.x * Math.sin(theta) + frontVector.y * Math.cos(theta);
		myProjection = projection(list, rotatedVector);
		this.pathAngle = angleVectors(frontVector, pathVector);
		this.pathAngle = radiansToDegrees(this.pathAngle);
			if (myProjection.min > 0){
				this.pathAngle *= -1;
			}

	}
	this.drawAutoPath = function(){
		if (!this.lock){
			return;
		}
		ctx.setLineDash([4]);
		ctx.strokeStyle=this.primaryColor;
		ctx.beginPath();
		ctx.moveTo(this.hitbox.center.x, this.hitbox.center.y);
		ctx.lineTo(this.autoPath.x, this.autoPath.y);
		ctx.stroke();
		ctx.setLineDash([0]);
	}
	this.autoRotate = function(){
		if (this.pathAngle == 0){
			return;
		}
		if (this.pathAngle > 0){
			if (this.pathAngle >= this.turnRate){
				this.pathAngle -= this.turnRate;
				this.turn('r', true);
			}
			else{
				this.turn('r', true);
				this.updateTurn();
				this.turn('l', false);
				this.pathAngle = 0;
			}
		}
		else{
			if (this.pathAngle < this.turnRate){
				this.pathAngle += this.turnRate;
				this.turn('l', true);
			}
			else{
				this.turn('l', true);
				this.updateTurn();
				this.turn('l', false);
				this.pathAngle = 0;
			}
		}
	}
	this.autoPilot = function(){ 	// auto-pilot function to move to coordinates
		if (!this.lock){
			return;
		}
		if (this.autoStatus.phase1){
			this.calculateAngle(this.autoPath);
			this.autoStatus.phase1 = false;
			this.autoStatus.current++;
			return;
		}


		if (this.autoStatus.phase2){
			this.throttle(false);
			this.brake(true);
			if (this.hitbox.velocity == 0){
				this.autoStatus.phase2 = false;
				this.brake(false);
				this.autoStatus.current++;
			}
			return;

		}
		
		if (this.autoStatus.phase3){
			this.calculateAngle(this.autoPath);
			this.autoStatus.phase3 = false;
			return;

		}
		
		if (this.autoStatus.phase4){
			this.autoRotate();
			if (this.pathAngle == 0){
				this.autoStatus.phase4 = false;
			}
			return;
			
		}
		if (this.autoStatus.phase5){
			var dist = distance(this.hitbox.center, this.autoPath);
			var timeToStop = this.hitbox.velocity / this.acceleration;
			var ETA = dist / this.hitbox.velocity;
			if (ETA > timeToStop){
				this.throttle(true);
			}
			else{
				this.autoStatus.phase5 = false;
				this.throttle(false);
			}
			return;
		}
		
		if (this.autoStatus.phase6){
			this.brake(true);
			if (this.hitbox.velocity == 0){
				this.autoStatus.phase6 = false;
				this.brake(false);
				this.lock = false;
			}
			//console.log("System unlocked!");
			return;
		}
	}
	this.autoStatus = new Phases();
	this.setupAutoPilot = function(coord){
		this.autoPath = new Point(coord.x, coord.y);
		this.autoStatus.phase1 = true;
		this.autoStatus.phase2 = true;		
		this.autoStatus.phase3 = true;
		this.autoStatus.phase4 = true;
		this.autoStatus.phase5 = true;
		this.autoStatus.phase6 = true;
		this.autoStatus.current = 0;
	}
	this.drawStatus = function(){
		ctx.beginPath();
		ctx.font="14px Arial";
		ctx.fillStyle=this.secondaryColor;
		string = "Hull: " + this.hull.current;
		ctx.fillText(string, c.width - 200, 30);
		string = "Immunity: " + this.immunity;
		ctx.fillText(string, c.width - 200, 60);
		string = "Energy: " + this.powerSupply.current;
		ctx.fillText(string, c.width - 200, 90);		
		if (this.shield != undefined){
			if (this.shield.enabled){
				string = "Shield enabled: " + this.shield.current;
			}
			else{
				string = "Shield disabled: " + this.shield.current;	
			}
			ctx.fillText(string, c.width - 200, 120);					
		}
	}
	this.draw = function(polygon = this.hitbox){
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
			ctx.arc(polygon.vertices[i].x,
			polygon.vertices[i].y,
			3, 0, 2*Math.PI);
			if (i == 2){
				ctx.fillStyle=this.secondaryColor;
			}
			ctx.fill();
		}
		for (var i = 0; i < polygon.vertices.length - 1; i++){
			ctx.beginPath();
			ctx.moveTo(polygon.center.x, polygon.center.y);
			ctx.lineTo(polygon.vertices[i].x, polygon.vertices[i].y);
			ctx.stroke();
		}
		for (var i = 0; i < polygon.vertices.length - 1; i++){
			ctx.beginPath();
			ctx.moveTo(polygon.vertices[2].x, polygon.vertices[2].y);
			ctx.lineTo(polygon.vertices[i].x, polygon.vertices[i].y);
			ctx.stroke();
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
	this.setImmunity = function(seconds){
		this.immunity = true;
		setTimeout(function(	){this.player.immunity = false;}, seconds * 1000);
	}
	this.addWeapon = function(weapon){
		this.weapons.push(weapon);
	}
	this.changeWeapon = function(){
		this.weapons[this.currentWeapon].firing = false;
		this.currentWeapon++;
		this.currentWeapon = this.currentWeapon % this.weapons.length;
		this.weapon = this.weapons[this.currentWeapon];
	}
	this.cycleEnabledWeapons = function(){
		this.currentWeapon++;
		this.currentWeapon = this.currentWeapon % this.weapons.length;
		if (this.weapons[this.currentWeapon].enabled){
			this.weapons[this.currentWeapon].enabled = false;
		}
		else{
			this.weapons[this.currentWeapon].enabled = true;			
		}
	}
	this.sufferDamage = function(damage){
		if (this.immunity == true){
			return;
		}
		if (this.shield != undefined && this.shield.enabled && this.shield.current > 0){
			var exceedingDamage = this.shield.sufferDamage(damage); // subtract shield points
			if (exceedingDamage){
				this.hull.sufferDamage(exceedingDamage);
			}
		}		
		else{
			this.hull.sufferDamage(damage);
		}
	    if (this.hull.current < 0){
		    this.dead=true;
	    }
	}
}

function killObjects(array){
	for (i = 0; i < array.length; i++){
		if (array[i].dead == true){
            score.player += array[i].value; 
			array.splice(i, 1);
		}
	}
}
function drawAsteroid(polygon, color="#FFFFFF", hitcolor="#FF0000"){
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth=3;
	if (polygon.hit == true){
		ctx.strokeStyle=hitcolor;
	}
	else{
		ctx.strokeStyle=color;
	}
	ctx.moveTo(polygon.vertices[0].x,
			   polygon.vertices[0].y);

	for (var i =0; i < polygon.vertices.length; i++){
		ctx.lineTo(polygon.vertices[i].x,
				   polygon.vertices[i].y);		
	}
	ctx.lineTo(polygon.vertices[0].x,
			   polygon.vertices[0].y);
			   
	ctx.stroke();
	ctx.restore();
//	ctx.fillStyle=color;
}
function asteroidSufferDamage(damage){
	this.hp -= damage;
	if (this.hp < 0){
		this.dead = true;
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
	cannon = new Weapon(velocity = 8, width = 1, range = 500, limit = 12, damage = 6, mass = 100, rateOfFire = 16, spin=0, hasAmmo=true, ammo=2000);
	cannon.type = 'p'; // projectile type
	cannon.name="Machine Gun";
	return cannon;
}
	
function lightCannon(){
	cannon = new Weapon(velocity = 2, width = 4, range = 500, limit = 10, damage = 10, mass = 100, rateOfFire = 8, spin = 120, hasAmmo=true, ammo=1000);
	cannon.projectileVelocity = 10;
	cannon.type = 'p'; // projectile type
	cannon.name="Light Cannon";
	return cannon;
}
function heavyCannon(){
	cannon = new Weapon(velocity = 4, width = 8, range = 500, limit = 10, damage = 20, mass = 1000, rateOfFire = 4, spin = 120, hasAmmo=true, ammo=500);
	cannon.projectileVelocity=10;
	cannon.type = 'p'; // projectile type
	cannon.name="Heavy Cannon";
	return cannon;
}
function asteroidShooter(){
	cannon = new Weapon(velocity = 10, width = 20, range = 500, limit = 1, damage = 50, mass = 10000, rateOfFire = 1, spin = 120, hasAmmo=true, ammo=50);
	cannon.projectileVelocity=10;
	cannon.type = 'p'; // projectile type
	cannon.name="Asteroid Shooter";
	return cannon;
}

function lightLaserBlaster(){
	blaster = new Weapon(velocity = 30, width = 1, range = 1000, limit = 12, damage = 5, mass=1, rateOfFire = 12,  spin=0, hasAmmo=false, ammo=1,
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
	return blaster;
}
function heavyLaserBlaster(){
	blaster = new Weapon(velocity = 30, width = 12, range = 1000, limit = 8, damage = 20, mass=1, rateOfFire = 6, spin=0, hasAmmo=false, ammo=1,
						 energyUsage = 20);
    blaster.type = 'p';
	blaster.draw = function(){
            if (this.owner != undefined){
                color = this.owner.secondaryColor;
            ctx.beginPath();
            ctx.lineWidth=this.projectileWidth;
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
	return blaster;
}
function lightLaserBeam(){
	beam = new Weapon(velocity = 100, width = 2, range = 2000, limit = 1, damage = 1, mass=1, rateOfFire = 1000, spin=0, hasAmmo=false, ammo=1,
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
	beam = new Weapon(velocity = 100, width = 8, range = 2000, limit = 1, damage = 5, mass=1, rateOfFire = 60, spin=0, hasAmmo=false, ammo=1,
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
	return beam;
}
function killProjectile(projectile){
	projectile.duration = 0;
	
}
//var Shield = function(max = 100, resistance=0, drainRate=10, rechargeEfficiency = 0.5, drainSpeed = 250){
var Stellar = function(primaryColor="#000FFF", secondaryColor = "#0FF0FF"){
	var ship = new Ship(c.width/2, c.height/2, 20, primaryColor, secondaryColor);
    ship.name="Stellar";
	ship.updateDirection();
	ship.hull = new Hull(100, 0);
	ship.shield = new Shield(50, 0, 5, 1, 300);
    ship.acceleration = 0.21;
    ship.turnRate = 5;

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

	ship.addWeapon(lightLaserBlaster());
	ship.changeWeapon();
	ship.weapon.setOwner(ship);
	ship.weapon.setPowerSupply(ship.powerSupply);
	ship.weapon.setPosition(ship.hitbox.center);
    ship.weapon.setCenter(coord);
    ship.weapon.setTurretMode(true);
    ship.weapon.enabled=true;
	
	return ship;
}
var Gargatuan = function(primaryColor="#0000FF", secondaryColor = "#0FF0FF"){
	var ship = new Ship(c.width/2, c.height/2, 50, primaryColor, secondaryColor);
    ship.name="Gargatuan";
	ship.updateDirection();
	ship.hull = new Hull(200, 1);
	ship.shield = new Shield(300, 0, 20, 0.5, 300);
	ship.powerSupply = new EnergySource(1000, 20, 100);
	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);
	ship.acceleration = 0.08;
	ship.maxSpeed = 7;
	ship.turnRate = 2;
	
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


	return ship;
}
var Colossal = function(primaryColor="#0000FF", secondaryColor = "#0FF0FF"){
	var ship = new Ship(c.width/2, c.height/2, 100, primaryColor, secondaryColor);
    ship.name = "Colossal";
	ship.updateDirection();
	ship.hull = new Hull(1000, 1);
	ship.shield = new Shield(2000, 0, 50, 1, 150);
	ship.powerSupply = new EnergySource(2000, 20, 100);
	ship.shield.setPowerSupply(ship.powerSupply);
	ship.shield.setEnabled(true);
	ship.acceleration = 0.04;
	ship.maxSpeed = 9;
	ship.turnRate = 1;
	
    
    for (var i = 0; i < ship.hitbox.vertices.length; i++){
        ship.addWeapon(heavyLaserBlaster());
        ship.changeWeapon();
        ship.weapon.setOwner(ship);
        ship.weapon.setPowerSupply(ship.powerSupply);
        ship.weapon.setCenter(ship.hitbox.vertices[i]);
        ship.weapon.setPosition(ship.auxHitbox.vertices[i]);
        ship.weapon.enabled=true;
    }

    for (var i = 0; i < ship.hitbox.vertices.length; i++){
        ship.addWeapon(lightLaserBlaster());
        ship.changeWeapon();
        ship.weapon.setOwner(ship);
        ship.weapon.setPowerSupply(ship.powerSupply);
        ship.weapon.setCenter(coord);
        ship.weapon.setPosition(ship.hitbox.vertices[i % 3]);
        ship.weapon.setTurretMode(true);
        ship.weapon.enabled=true;
    }

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
	ship.turnRate = 0.5;

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
	return ship;
}

function fetchShipByName(name){
    if (name == "Stellar"){
        var ship = new Stellar();
    }
    else if (name == "Gargatuan"){
        var ship = new Gargatuan();
    }
    else if (name == "Colossal"){
        var ship = new Colossal();
    }
    else if (name == "Turret"){
	    var ship = new Turret("#000FFF", "#00F0FF", 3,
                        c.width/2, c.height/2, 20, lightLaserBlaster);
    }
    return ship;
}

ctx.lineWidth=3;
var j = 0;


var lastDate = new Date();
var fps = new Fps();
var maxFPS = 1000;
var interval = 1000/maxFPS;
var COLLISION_DAMAGE = 10;

var score = new Score();
score.getMax();
score.getCoins();
var level = new Level();
var instructions = buildInstructions();

var objects = [];
var enemies = [];

//player = new Stellar("#F0F0F0", "#FF00FF"); // pink
//player = new Gargatuan("#666666", "#FF0000");
//player = new Stellar();
//player = new Gargatuan();

var Button = function(x, y, width, height, string=" "){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.string = string;
    this.bgColor = "#FFFFFF";
    this.fontColor = "#000000";
	this.onClick = function(){
			console.log(this.string);
	}
    this.onHover = function(){
        this.bgColor = "#666666";
    }
	this.draw = function(){
		ctx.fillStyle=this.bgColor;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fillStyle=this.fontColor;
		ctx.font="14px arial";
		ctx.fillText(this.string, this.x + this.width/10, this.y + this.height/2);
	}
    this.reset = function(){
        this.bgColor= "#FFFFFF";
    }
}

var CircularButton = function(x, y, radius, color, string){
	this.x = x;
	this.y = y;
	this.radius = radius;
    this.color = color;
	this.string = string;
	this.onClick = function(){
			console.log(this.string);
	}
	this.draw = function(){
		ctx.fillStyle=this.color;
        ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
		ctx.fillStyle="#000000";
		ctx.font="14px arial";
		ctx.fillText(string, this.x - this.radius/6, this.y + this.radius/10);
	}
}



function drawLobbyBackground(){
	ctx.fillStyle="#000000";
	ctx.fillRect(0,0,c.width,c.height);
	ctx.fillStyle="#FFFFFF";
	ctx.font="28px arial";
	ctx.fillText("Select your ship", 20, 40);
}

var buttons = [];
myButton = (new Button(20, 200, 150, 50, "Stellar"));
myButton.onClick = function(){
	player = new Stellar();
	selected = true;
}
buttons.push(myButton);

myButton = (new Button(20, 260, 150, 50, "Gargatuan"));
myButton.onClick = function(){
	player = new Gargatuan();
    selected = true;
}
buttons.push(myButton);



//Turret = function(primaryColor="#0000FF", secondaryColor = "#0FF0FF", cannons = 1, x = c.width/2, y = c.height/2, size = 15, weapon=machineGun){

myButton = (new Button(20, 320, 150, 50, "Turret"));
myButton.onClick = function(){
	player = new Turret("#000FFF", "#00F0FF", 3,
                        c.width/2, c.height/2, 20, lightLaserBlaster);
    selected = true;
}
buttons.push(myButton);

myButton = (new Button(20, 380, 150, 50, "Colossal"));
myButton.onClick = function(){
	player = new Colossal();
    selected = true;
}
buttons.push(myButton);
/*
myButton = new CircularButton(50, 360, 20, "#FF0000" ,"B");
buttons.push(myButton);
*/

myButton = (new Button(20, 100, 200, 50, "Coins: " + score.coins));
myButton.onHover= function(){}
buttons.push(myButton);

var coord = new Point(c.width/2, c.height/2);

var values = [];
values.push(new Stellar());
values.push(new Gargatuan());
values.push(new Turret("#000FFF", "#00F0FF", 3,
                        c.width/2, c.height/2, 20, lightLaserBlaster));
values.push(new Colossal());

for (var i = 1; i < values.length; i++){
    buttons[i].string += ": " + values[i].getValue();
}
values = [];

confirmButton = new Button(c.width/2 - 100, c.height - 100,
                           200, 50, "Confirm");
confirmButton.onClick = function(){
    if (player.name == "Stellar"){
        confirmed=true;
    }
    if (score.coins > player.getValue()){
        confirmed=true;
    }
    else{

    }
}

var instruct = false;
var game = new Game();
var selected = false;
var displaying = false;
var confirmed = false;
function selectShipLoop(){
	drawLobbyBackground();
	for (var i = 0; i < buttons.length; i++){
		buttons[i].draw();
	}
    if (selected){
        if (!displaying){
            buttons.push(confirmButton);
            displaying = true;
        }
        displayShip(player);
    }
    if (!confirmed){
		requestAnimationFrame(selectShipLoop);
	}
	else{
		c.removeEventListener("touchstart", buttonModeClick, false);
		c.removeEventListener("click", function(event){ buttonModeClick(event);
                                                },
                                                false);					
		c.addEventListener("click", function(event){ mouseClick(event);
                                                },
                                                false);
 
		c.addEventListener("touchstart", pegaCoordenadasMobile, false);
        buttons = [];
        displayValueConsole(player);
        c.width = window.innerWidth-20;
        c.height = window.innerHeight-20;
        updateResEvent(c);
        console.log(fetchShipByName("Stellar"));
        player = fetchShipByName(player.name);
		requestAnimationFrame(mainLoop);
	}
}

function displayValueConsole(ship){
        console.log("engine: " + ship.getEngineValue());
        console.log("hull:" + ship.hull.getValue());
        console.log("shield:" + ship.shield.getValue());
        console.log("power source:" + ship.powerSupply.getValue());
        console.log("Weapons");
        for (var i =0; i < ship.weapons.length; i++){
            console.log(ship.weapons[i].name + ": " + ship.weapons[i].getValue());
        }
        console.log("ship total: " + ship.getValue());

}

function displayShip(ship){
        ship.draw();
		ship.updateDirection();
		ship.updateStrafe();
		ship.updatePosition();

		ship.updateTurn();

		ship.powerSupply.recharge(ship.powerSupply);
		ship.shield.drainEnergy(ship.shield);

		for (var i = 0; i < ship.weapons.length; i++){
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
}

function updateEnemy(ship){
        var players = [];
        players.push(player);
		ship.updateDirection();
		ship.updateStrafe();
		ship.updatePosition();
		ship.updateTurn();
		ship.powerSupply.recharge(ship.powerSupply);
		ship.shield.drainEnergy(ship.shield);

		for (var i = 0; i < ship.weapons.length; i++){
		    ship.weapons[i].updateDirection();
			if (ship.weapons[i].enabled){
				ship.weapons[i].updateFiring(ship.hitbox.velocity);
			}
		}
		for (var u = 0; u < ship.weapons.length; u++){
			for (var i = 0; i < ship.weapons[u].projectiles.length; i++){
			    calculateAxes(ship.weapons[u].projectiles[i])
				for (var j = 0; j < objects.length; j++){
					smartCollision(ship.weapons[u].projectiles[i], objects[j], function(){ship.weapons[u].onHit(objects[j])});
				}
	            smartCollision(ship.weapons[u].projectiles[i], players[0].hitbox, function(){ship.weapons[u].onHit(players[0])});
			}
		}
		checkBorder(ship.hitbox, function(){ship.auxHitbox.applyVector(diff);
                                            if (ship.engineOn){
                                               ship.engineOn = false;
                                               ship.reverseEngineOn = true;
                                            }
                                            else{
                                               ship.engineOn = true;
                                               ship.reverseEngineOn = false; 
                                            }});
                                            
		calculateAxes(ship.hitbox);
		rotatePolygon(ship.hitbox, ship.hitbox.spin);	
		for (var i = 0; i < objects.length; i++){
			mtv = collisionSTA(ship.hitbox, objects[i]);
			if (mtv){
				
				elasticCollision(ship.hitbox, mtv, objects[i]);
				elasticCollision(ship.auxHitbox, mtv, objects[i]);
				ship.sufferDamage(COLLISION_DAMAGE);	// fixed amount of damage on Collision
			}
		}
		for (var u = 0; u < ship.weapons.length; u++){
			ship.weapons[u].draw();
		}
		for (var i = 0; i < ship.weapons.length; i++){		
			ship.weapons[i].updateDuration();		
			ship.weapons[i].removeProjectiles();
		}
		for (u = 0; u < ship.weapons.length; u++){
				for (var k = 0; k < ship.weapons[u].projectiles.length; k++){
					ship.weapons[u].projectiles[k].update();
					if (ship.weapons[u].type == 'p'){
						checkBorder(ship.weapons[u].projectiles[k], function(){ship.weapons[u].rotateAtBorder(axis, ship.weapons[u].projectiles[k])});
					}
					else if (ship.weapons[u].type =='l'){
						projectile = ship.weapons[u].projectiles[k];
						var hit = checkBorder(projectile);
						if (hit) {killProjectile(projectile)};
					}
					rotatePolygon(ship.weapons[u].projectiles[k], ship.weapons[u].projectiles[k].spin);	
			}
		}
}

function mainLoop(){
	newDate = new Date();
	elapsedTime = newDate - lastDate;
	lastDate = new Date();
	fps.add(elapsedTime);

	ctx.fillStyle="#000000";
	ctx.fillRect(0,0,c.width,c.height);

	if (instruct){
		drawInstructions(instructions, player.secondaryColor);
	}
	else{
		weaponStatus = buildWeaponsStatus(player.weapons);
		drawWeaponsStatus(weaponStatus, player.secondaryColor);
	}
	if (objects.length == 0 && enemies.length == 0 && level.current <= level.max){
		level.next();
		if (level.current <= level.max){
			level.start();
		}
	}

	for (var i = 0; i < objects.length; i++){
		objects[i].update();
		checkBorder(objects[i]);
		calculateAxes(objects[i]);
		rotatePolygon(objects[i], objects[i].spin);
	}
	if (player.dead){
		drawEndGame(false);
        if (score.max < score.player){
            document.cookie="maxScore = " + score.player;
        }
        document.cookie="coins = " + score.player * 50;
	}
	else{
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

        for (var i =0; i < enemies.length; i++){
            updateEnemy(enemies[i]);
        }
		
		for (var u = 0; u < player.weapons.length; u++){
			for (var i = 0; i < player.weapons[u].projectiles.length; i++){
			    calculateAxes(player.weapons[u].projectiles[i])
				for (var j = 0; j < objects.length; j++){
					smartCollision(player.weapons[u].projectiles[i], objects[j], function(){player.weapons[u].onHit(objects[j])});
				}
                for (var k = 0; k < enemies.length; k++){
                    smartCollision(player.weapons[u].projectiles[i], enemies[k].hitbox, function(){player.weapons[u].onHit(enemies[k])});
                }
			}
		}
		checkBorder(player.hitbox, function(){player.auxHitbox.applyVector(diff)});
		calculateAxes(player.hitbox);
		rotatePolygon(player.hitbox, player.hitbox.spin);	
	}
	if (level.current > level.max){
		drawEndGame(true);
	}
		for (var i = 0; i < objects.length; i++){
			mtv = collisionSTA(player.hitbox, objects[i]);
			if (mtv){
				
				elasticCollision(player.hitbox, mtv, objects[i]);
				elasticCollision(player.auxHitbox, mtv, objects[i]);
				player.sufferDamage(COLLISION_DAMAGE);	// fixed amount of damage on Collision
			}
		}
		for (var i = 0; i < enemies.length; i++){
			mtv = collisionSTA(player.hitbox, enemies[i].hitbox);
			if (mtv){
				
				elasticCollision(player.hitbox, mtv, enemies[i].hitbox);
				elasticCollision(player.auxHitbox, mtv, enemies[i].hitbox);
				player.sufferDamage(COLLISION_DAMAGE);	// fixed amount of damage on Collision
			}
		}
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
    for (var i = 0; i < objects.length; i++){
        drawAsteroid(objects[i]);
    }
    for (var i =0; i < enemies.length; i++){
        enemies[i].draw();
    }
    if (player.dead == false){
        player.drawAutoPath();
        player.draw();
    }
	killObjects(objects);
	killObjects(enemies);
	checkColisionsNaive(objects);
	score.draw(player.secondaryColor);
	level.draw(player.secondaryColor);

	
	fps.calculateMean();
	drawFPS(fps.mean, player.secondaryColor);
	setTimeout(function(){requestAnimationFrame(mainLoop)}, interval);
}

/// cookies!!
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
} 
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
var deleteCookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

console.log(document.cookie);



// actual start of program
selectShipLoop();
//mainLoop();
