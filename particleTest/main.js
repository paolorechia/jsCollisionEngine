/*
var ParticleSystem = function(limit = 30,
                        spread = 5,
                        duration=10,
                        speed=1,
                        color = "#0000FF",
                        versor = vector, // new Versor(x, y)
                        position = point // new Point(x, y)){
*/

trail= new ParticleSystem(100, 0, 100, 5, "#FFFFFF", new Vector(-1, 0), new Point(300, 100), "CONTINUOUS");
explosion= new ParticleSystem(100, 2, 100, 100, "#AA9900", new Vector(0, 0), new Point(300, 100), "BURST");
fires = [];
for (var i = 0; i < 2; i++){
    fire = new ParticleSystem(100, Math.random(), Math.random()*300, Math.random(), "#0000FF", new Vector(Math.random(), Math.random()), new Point(Math.random()*600, Math.random()*800));
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
    trail.position.x+= 1;
    trail.position.x%= 600;
    trail.update();
    trail.draw(ctx);
    trail.formParticles();
    explosion.update();
    explosion.draw(ctx);
    explosion.formParticles();
    requestAnimationFrame(myLoop);
}
requestAnimationFrame(myLoop);
