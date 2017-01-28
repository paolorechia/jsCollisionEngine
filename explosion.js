var Explosion = function(x, y, damageMultipler=1, expansionRate = 1, 
                         maxRadius = 10, startRadius = 1,
                         duration=maxRadius, 
                         color="#FF0000"){
    this.color = color;
    this.hitbox = new Circle(x, y, startRadius,
                             0, 0, 0, 0); //radius starts at 1 typically
    console.log(this.hitbox.position);
    this.hitbox.mass=100000;
    this.expansionRate = expansionRate;
    this.maxRadius = maxRadius;
    this.duration= duration; // in game frames
    this.finished = false;
    this.expandRadius = function(){
        if (this.hitbox.radius < this.maxRadius){
            this.hitbox.radius += this.expansionRate;
        }
    }
    this.draw = function(){
        ctx.beginPath();
        ctx.fillStyle=this.color;
        ctx.arc(this.hitbox.position.x, this.hitbox.position.y,
                this.hitbox.radius, 0, 2 *Math.PI);
        ctx.fill();
    }
    this.fetchDamage = function(affectedShip){
        var damage = this.hitbox.radius - distance(affectedShip, this.hitbox.position);
        damage *= this.damageMultipler;
        return damage;
    }
}
