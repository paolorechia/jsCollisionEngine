c.style.cursor = "none";
var Cursor = function(color, radius = 5){
    this.color = color;
    this.angle=0;
    this.dash=4;
    this.spin=2;
    this.radius = radius; 
    this.point= new Point(0, 0);

    this.setPoint = function(point){
        this.point=point;
    }
    this.draw=function(){
        this.angle += this.spin;
        this.angle %= 360;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth=2;
        ctx.translate(this.point.x, this.point.y);
        ctx.rotate(degreesToRadians(this.angle));
        ctx.setLineDash([this.dash]);
        ctx.strokeStyle=this.color;
        ctx.arc(0, 0,
                this.radius, 0, 2 *Math.PI);
        ctx.stroke();        
        ctx.setLineDash([0]);
        ctx.restore();
    }
}
