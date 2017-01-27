c.style.cursor = "none";
var Cursor = function(color){
    this.color = color;

    this.draw=function(){
        ctx.beginPath();
        ctx.strokeStyle=this.color;
        ctx.arc(coord.x, coord.y,
                5, 0, 2 *Math.PI);
        ctx.stroke();        
    }
}
