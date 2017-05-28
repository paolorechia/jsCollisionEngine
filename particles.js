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
                        position = point, // new Point(x, y)
                        mode = "CONTINUOUS"
                        ){
    this.limit=limit;
    this.spread=spread;
    this.speed = speed;
    this.duration=duration;
    this.color=color;
    this.versor = versor;
    this.position = position;
    this.mode=mode;

    this.particles = [];

    this.makeParticle = function(){
        particle = new Particle(this.position, 
                                this.duration,
                                new Vector(this.versor.x, this.versor.y));
        var sign = Math.random() > 0.5 ? 1 : - 1
        particle.vector.x += Math.random() * spread * sign;
        particle.vector.y += Math.random() * spread * sign;
        unitVector(particle.vector, particle.vector);
        // reverse
        if (this.mode != "TRAIL"){
            particle.vector.x *= -1;
            particle.vector.y *= -1;
        }
        var randomSpeed = this.speed * Math.random();
        particle.vector.x *= randomSpeed;
        particle.vector.y *= randomSpeed;
        this.particles.push(particle);
    }
    this.formParticles = function(){
        if (this.mode == "BURST"){
            while (this.particles.length < this.limit){
               this.makeParticle();
            }
        }
        else{
            if (this.particles.length < this.limit){
               this.makeParticle();
            }
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

