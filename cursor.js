c.style.cursor = "none";
var Cursor = function(color){
    this.color = color;
    this.angle=0;
    this.point= new Point(0, 0);

    this.setPoint = function(point){
        this.point=point;
    }
    this.draw=function(){
        this.angle += 2;
        this.angle %= 360;
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.point.x, this.point.y);
        ctx.rotate(degreesToRadians(this.angle));
        ctx.setLineDash([4]);
        ctx.strokeStyle=this.color;
        ctx.arc(0, 0,
                5, 0, 2 *Math.PI);
        ctx.stroke();        
        ctx.setLineDash([0]);
        ctx.restore();
    }
}
