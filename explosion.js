var Explosion = function(x, y, damageMultiplier=10, expansionRate = 5, 
                         maxRadius = 50, startRadius = 1,
                         color="#FF0000"){
    this.color = color;
    this.hitbox = new Circle(x, y, startRadius,
                             0, 0, 0, 0); //radius starts at 1 typically
    this.hitbox.mass=100000;
    this.expansionRate = expansionRate;
    this.maxRadius = maxRadius;
    this.duration= maxRadius / expansionRate; // in game frames
    this.finished = false;
    this.damageMultiplier=damageMultiplier;
    this.expandRadius = function(){
        if (this.hitbox.radius < this.maxRadius){
            this.hitbox.radius += this.expansionRate;
        }
    }
    this.decreaseDuration= function(){
        this.duration--;
        if (this.duration == 0){
            this.finished = true;
        }
    }
    this.draw = function(){
        ctx.beginPath();
        ctx.fillStyle=this.color;
        ctx.arc(this.hitbox.position.x, this.hitbox.position.y,
                this.hitbox.radius, 0, 2 *Math.PI);
        ctx.fill();
    }
    this.fetchDamage = function(affectedHitbox){
        var damage = this.hitbox.radius - distance(affectedHitbox.center,
                                                   this.hitbox.position);
        damage *= this.damageMultiplier;
        damage = Math.round(Math.abs(damage));
//        console.log(damage);
        return damage;
    }
}
function finishExplosions(explosions){
    for (var i = 0; i < explosions.length; i++){
        if (explosions[i].finished){
            explosions.splice(i, 1);
        }
    }
}

function updateExplosions(explosions){
    for (var i = 0; i < explosions.length; i++){
        explosions[i].expandRadius();
        explosions[i].decreaseDuration();
    }
}
