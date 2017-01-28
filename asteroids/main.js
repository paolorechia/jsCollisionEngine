updateResEvent = function(canvas) {
          window.addEventListener('resize', function(event) {
            canvas.width = window.innerWidth-20;
            canvas.height = window.innerHeight-20;
		  });
}

var Score = function(color){
    if (color == undefined){
       color = "#000FFF";
    }
	this.player = 0;
    this.max = 0;
    this.coins = 0;
    this.getMax = function(){
        this.max = getCookie("maxScore");
        if (this.max.length == 0){
            setCookie("maxScore", 0, 365);
            this.max = getCookie("maxScore");
        }
        this.max = Number(this.max);
    }
    this.getCoins = function(){
        this.coins = getCookie("coins");
        if (this.coins.length == 0){
            setCookie("coins", 0, 365);
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
				triangle.dead = false;		
				triangle.sufferDamage = asteroidSufferDamage;				
                triangle.value = Math.round(triangle.hp/40);
				objects.push(triangle);
			}	
}
function generateTurrets(n, cannons, moving=false, rateOfFire=1){
    for (var i = 0; i < n; i++){
        var x = Math.random() * c.width;
        var y = Math.random() * c.height;
        var size = 20;

        myRandom = Math.random();
        if (myRandom > 0.9){
            turret = new Turret("#FFFFFF", "#FF0000", cannons, x, y, size, heavyLaserBlaster);
            turret.hitbox.spin = 20;
        }
        else if (myRandom > 0.8){
            turret = Turret("#FFFFFF", "#FF0000", cannons, x, y, size, asteroidShooter);
        }
        else if (myRandom > 0.7){
            turret = Turret("#FFFFFF", "#FF0000", cannons, x, y, size, heavyCannon);
        }
        else if (myRandom > 0.6){
            turret = new Turret("#FFFFFF", "#FF0000", cannons, x, y, size, lightLaserBlaster);
            turret.hitbox.spin = 20;
        }
        else if (myRandom > 0.5){
            turret = Turret("#FFFFFF", "#FF0000", cannons, x, y, size, lightCannon);
        }
        else{
            turret = Turret("#FFFFFF", "#FF0000", cannons, x, y, size, machineGun);
        }
        for (var j =0; j < cannons; j++){
            turret.weapons[j].rateOfFire *= rateOfFire;
            turret.weapons[j].setCenter(player.hitbox.center);
            turret.weapons[j].setPosition(turret.hitbox.vertices[j]);
            turret.weapons[j].firing=true;
//            turret.weapons[j].sound=null;
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

function buildInstructions(){
	var instructions = [];
	
	var string;
	string = "W/UpArrow: Main Engine Throttle";
	instructions.push(string);
	string = "X: Reverse Engine Throttle";
	instructions.push(string);
	string = "A/LeftArrow: Left turning";
	instructions.push(string);
	string = "D/RightArrow: Right turning";
	instructions.push(string);
	string = "Q: Left strafe";
	instructions.push(string);
	string = "E: Right strafe";
	instructions.push(string);
	string = "S/DownArrow: Brake";
	instructions.push(string);
	string = "V/Mouse Click: Shoot";
	instructions.push(string);
	string = "C: Always Fire";
	instructions.push(string);
	string = "H: Weapons mode";
	instructions.push(string);
	string = "R: Cycle Weapons";
	instructions.push(string);
	string = "F: Enable Shield";
	instructions.push(string);
	string = "T: Change Target";
	instructions.push(string);
	string = "U: Auto-pilot";
	instructions.push(string);	
	string = "Esc: Cancel auto-pilot";
	instructions.push(string);	
	string = ",: Decrease volume";
	instructions.push(string);	
	string = ".: Increase volume";
	instructions.push(string);	
	return instructions;
}

function drawInstructions(instructions, color="#000FFF"){
    ctx.save();
	ctx.beginPath();
    ctx.fillStyle="#000000";
    ctx.fillRect(0, 0, c.width, c.height/4);
	ctx.fillStyle=color;
	ctx.font="14px Arial";
	var offSet = 0;
	var xStart = 230;
	var colSize = 6;    // or lines per column
	for (var i = 0; i < instructions.length; i++){
		if (i % colSize == 0){
			offSet += 240;
		}
		ctx.fillText(instructions[i], offSet - xStart, 40 + (i % colSize) * 20);
	}
    ctx.restore();
}

function drawEndGame(win, color="#000FFF", loseColor="#FF0000"){
	if (win){
		ctx.beginPath();
		ctx.fillStyle=color;
		ctx.font="28px Arial";
		ctx.fillText("Congratulations! You've survived!", c.width/6, c.height/2);		
	}
	else{
		ctx.beginPath();
		ctx.fillStyle=loseColor;
		ctx.font="28px Arial";
		ctx.fillText("You've died! Press ESC to restart.", c.width/3, c.height/2);
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

}
function asteroidSufferDamage(damage){
	this.hp -= damage;
	if (this.hp < 0){
		this.dead = true;
	}
}




function drawLobbyBackground(){
	ctx.fillStyle="#000000";
	ctx.fillRect(0,0,c.width,c.height);
	ctx.fillStyle="#FFFFFF";
	ctx.font="28px arial";
	ctx.fillText("Select your ship", 20, 40);
}


function buildLobbyButtons(array){

    myButton = (new Button(20, 200, 150, 50, "Stellar"));
    myButton.onClick = function(){
        player = new Stellar(primaryColor, secondaryColor, c.width/2, c.height/2 + 150);
        selected = true;
        //describeShipConsole(player);
    }
    array.push(myButton);

    myButton = (new Button(20, 260, 150, 50, "Gargantuan"));
    myButton.onClick = function(){
        player = new Gargatuan(primaryColor, secondaryColor, c.width/2, c.height/2 + 150);
        selected = true;
        //describeShipConsole(player);
    }
    array.push(myButton);



    //Turret = function(primaryColor="#0000FF", secondaryColor = "#0FF0FF", cannons = 1, x = c.width/2, y = c.height/2, size = 15, weapon=machineGun)

    myButton = (new Button(20, 320, 150, 50, "Turret"));
    myButton.onClick = function(){
        player = new Turret("#000FFF", "#00F0FF", 3,
                            c.width/2, c.height/2 + 150, 20, lightLaserBlaster);
        selected = true;
        //describeShipConsole(player);
    }
    array.push(myButton);

    myButton = (new Button(20, 380, 150, 50, "Colossal"));
    myButton.onClick = function(){
        player = new Colossal(primaryColor, secondaryColor, c.width/2, c.height/2 + 150);
        selected = true;
//        describeShipConsole(player);
    }
    array.push(myButton);
    /*
    myButton = new CircularButton(50, 360, 20, "#FF0000" ,"B");
    array.push(myButton);
    */

    myButton = (new Button(20, 100, 200, 50, "Coins: " + score.coins));
    myButton.onHover= function(){}
    array.push(myButton);

    var coord = new Point(c.width/2, c.height/2);

    var values = [];
    values.push(new Stellar()); values.push(new Gargatuan()); values.push(new Turret("#000FFF", "#00F0FF", 3, c.width/2, c.height/2, 20, lightLaserBlaster));
    values.push(new Colossal());

    for (var i = 1; i < values.length; i++){
        array[i].string += ": " + values[i].getValue();
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
}

function selectShipLoop(){
	drawLobbyBackground();
    if (window.selected){
        if (!window.displaying){
            window.buttons.push(confirmButton);
            window.displaying = true;
        }
        displayShip(player);
        drawStats(player);
    }
	for (var i = 0; i < buttons.length; i++){
		window.buttons[i].draw();
	}
    cursor.setPoint(coord);
    cursor.draw();
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
        window.buttons = [];
        //displayValueConsole(player);
        c.width = 780;
        c.height = 580;
        //console.log(fetchShipByName("Stellar"));
        player = fetchShipByName(player.name);
        window.playing = true;
        window.rewarded = false;
        selectMusic.pause();
        music.play();

		requestAnimationFrame(mainLoop);
	}
}


function mainLoop(){
	newDate = new Date();
	elapsedTime = newDate - lastDate;
	lastDate = new Date();
	fps.add(elapsedTime);

	ctx.fillStyle="#000000";
	ctx.fillRect(0,0,c.width,c.height);
//    ctx.scale(0.5, 0.5);

	if (objects.length == 0 && enemies.length == 0 && level.current <= level.max){
		level.next();
		if (level.current <= level.max){
			level.start();
		}
	}


	for (var i = 0; i < objects.length; i++){
		updateHitbox(objects[i]);
	}
	if (player.dead){
		drawEndGame(false);
        if (score.max < score.player){
            setCookie("maxScore", score.player, 365);
        }
        if (!window.rewarded){
            score.coins += score.player * 30;
            setCookie("coins", score.coins, 365);
            window.rewarded=true;
        }
   	}
	else{
		updateShip(player);	
		updateWeapons(player);
		var players = [];
		players.push(player);
		for (var i =0; i < enemies.length; i++){
		    updateEnemy(enemies[i]);
		    collideWeaponsShips(enemies[i], players);
		}
		collideWeaponsHitboxes(player, objects);
		collideWeaponsShips(player, enemies);
		checkBorder(player.hitbox, function(){player.auxHitbox.applyVector(diff)});
	
	}
	if (level.current > level.max){
		drawEndGame(true);
        if (score.max < score.player){
            setCookie("maxScore", score.player, 365);
        }
        if (!window.rewarded){
            score.coins += score.player * 30;
            setCookie("coins", score.coins, 365);
            window.rewarded=true;
        }
	}
	collideShipHitboxes(player, objects, COLLISION_DAMAGE);
	collideShipShips(player, enemies, COLLISION_DAMAGE);
	updateShipProjectiles(player);
	checkProjectilesBorder(player);

    updateTargetSystem(player, enemies);
/*
    player.targetSystem.setPossibleTargets(enemies);
    player.targetSystem.clearAimAssist();
    player.targetSystem.analyseTarget(player.hitbox.center);
    player.targetSystem.aimAssist(player.weapons, player.hitbox.velocity);
    player.targetSystem.autoAim(player.weapons);
    player.targetSystem.autoFire(player.weapons);
*/

    player.autoPilot();
    player.drawStatus();
    player.targetSystem.displayInfo();
    player.targetSystem.drawAid(player.weapons);
	if (instruct){
		drawInstructions(instructions, player.secondaryColor);
	}
	else{
		weaponStatus = buildWeaponsStatus(player.weapons);
		drawWeaponsStatus(weaponStatus, player.secondaryColor);
	}
    for (var i = 0; i < objects.length; i++){
        drawAsteroid(objects[i]);
    }
    for (var i =0; i < enemies.length; i++){
        enemies[i].draw();
	drawShipWeapons(enemies[i]);
    }
	
    if (player.dead == false){
	drawShipWeapons(player);
        player.drawAutoPath();
        player.draw();
    }

	killObjects(objects);
	killObjects(enemies);
    collideHitboxes(objects);
	score.draw(player.secondaryColor);
	level.draw(player.secondaryColor);

	
	fps.calculateMean();
	drawFPS(fps.mean, player.secondaryColor);
    soundPool.playQueue();
    if (window.soundDisplay){
        soundPool.display(player.secondaryColor, new Point(c.width/2 - 20, 100));
    }
//    console.log(player.hitbox.colliding, player.auxHitbox.colliding);
/*
    if (player.hitbox.colliding || player.auxHitbox.colliding){
        console.log(player.hitbox.colliding, player.auxHitbox.colliding);
        console.log(player.hitbox.gradualVector, player.auxHitbox.gradualVector);

*/
/*
    console.log(player.hitbox.center.x - player.auxHitbox.center.x,
                player.hitbox.center.y - player.auxHitbox.center.y);
*/
        
    cursor.setPoint(coord);
    cursor.draw();
    if (window.playing){
    	setTimeout(function(){requestAnimationFrame(mainLoop)}, interval);
    }
    else{
        window.buttons = [];
        buildLobbyButtons(window.buttons);
        window.instruct = false;
        window.selected = false;
        window.displaying = false;
        window.confirmed = false;
        window.playing = false;
        level.current = 0;
        score.player = 0;
        objects = [];
        enemies = [];
        music.pause();
        selectMusic.play();
        requestAnimationFrame(selectShipLoop);
    }
}

// actual start of program
ctx.lineWidth=3;
var j = 0;

var primaryColor = "#000FFF";
var secondaryColor = "#00F0FF";
var lastDate = new Date();
var fps = new Fps();
var maxFPS = 1000;
var interval = 1000/maxFPS;
var COLLISION_DAMAGE = 10;
var camera = undefined;

var score = new Score();
score.getMax();
score.getCoins();
var level = new Level();
var instructions = buildInstructions();

var objects = [];
var enemies = [];
var maxSounds= 1;
var startingVolume=5;
soundPool = new SoundPool(maxSounds, startingVolume);
selectMusic = document.getElementById("selectLoop");
selectMusic.play();
selectMusic.addEventListener('ended', function(){
        this.currentTime = 0;
        this.play();
    }, false);
selectMusic.volume = 0.5;
music = document.getElementById("loopA");
music.addEventListener('ended', function(){
        this.currentTime = 0;
        this.play();
}, false);
music.volume = 0.5;
console.log(selectMusic);


window.buttons = [];
buildLobbyButtons(window.buttons);

window.instruct = false;
window.selected = false;
window.displaying = false;
window.confirmed = false;
window.playing = false;
window.soundDisplay = false;
var coord = new Point(c.width/2, c.height/2);
player = undefined;
cursor = new Cursor("#00FF00");
cursor.setPoint(coord);
selectShipLoop();
