var Particle = function(position, duration, vector){
    this.x = position.x
    this.y = position.y;
    this.duration = duration;
    this.vector = vector;
    this.update = function(){
        this.x += this.vector.x;
        this.y += this.vector.y;
    }
}

var ParticleSystem = function(limit = 30,
                        spread = 5,
                        duration=10,
                        speed = 1,
                        color = "#FFFFFF",
                        versor = vector, // new Versor(x, y)
                        position = point // new Point(x, y)
                        ){
    this.limit=limit;
    this.spread=spread;
    this.speed = speed;
    this.duration=duration;
    this.color=color;
    this.versor = versor;
    this.position = position;

    this.particles = [];

    this.formParticles = function(){
        if (this.particles.length < this.limit){
//        while (this.particles.length < this.limit){
            particle = new Particle(this.position, 
                                    this.duration,
                                    new Vector(this.versor.x, this.versor.y));
            var sign = Math.random() > 0.5 ? 1 : - 1
            particle.vector.x += Math.random() * spread * sign;
            particle.vector.y += Math.random() * spread * sign;
            unitVector(particle.vector, particle.vector);
            particle.vector.x *= this.speed;
            particle.vector.y *= this.speed;
            this.particles.push(particle);
        }
    }
    this.update = function(){
        for (var i = 0; i < this.particles.length; i++){
            this.particles[i].duration--;
            if (this.particles[i].duration < 0){
                this.particles.shift();
            }
            else{
                this.particles[i].update();
            }
        }
    }
    this.draw = function(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle=this.color;
        ctx.fillStyle=this.color;
        for (var i = 0; i < this.particles.length; i++){
//        for (var i = this.particles.length - 1; i >= 0 ; i--){
            /*
            console.log(this.particles[i].x, this.particles[i].y);
            ctx.arc(this.particles[i].x, this.particles[i].y,
                    3, 0, 2*Math.PI);
            ctx.fill();

            
            */
            ctx.moveTo(this.particles[i].x, this.particles[i].y);
            ctx.lineTo(this.particles[i].x + 2, this.particles[i].y + 2);
        }
        ctx.stroke();
        ctx.restore();
    }
}
/*
var ParticleSystem = function(limit = 30,
                        spread = 5,
                        duration=10,
                        speed=1,
                        color = "#0000FF",
                        versor = vector, // new Versor(x, y)
                        position = point // new Point(x, y)){
*/
explosion= new ParticleSystem(30, 5, 100, 5, "#FFFFFF", new Vector(-1, 0), new Point(300, 100));
fires = [];
for (var i = 0; i < 2; i++){
    fire = new ParticleSystem(100, Math.random(), Math.random()*300, Math.random(), "#FFFFFF", new Vector(Math.random(), Math.random()), new Point(Math.random()*600, Math.random()*800));
    fires.push(fire);
}
var c = document.getElementById("umCanvas");
var ctx = c.getContext("2d");
function myLoop(){
    ctx.fillStyle="#000000";
    ctx.lineWidth=3;
    ctx.fillRect(0,0,c.width,c.height);
    for (var i = 0; i< fires.length; i++){
        fires[i].formParticles();
        fires[i].update();
        fires[i].draw(ctx);
    }
    explosion.update();
//    explosion.draw(ctx);
    explosion.formParticles();
    requestAnimationFrame(myLoop);
}
requestAnimationFrame(myLoop);
