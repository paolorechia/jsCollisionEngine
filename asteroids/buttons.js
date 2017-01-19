
var Button = function(x, y, width, height, string=" "){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.string = string;
    this.bgColor = "#FFFFFF";
    this.fontColor = "#000000";
	this.onClick = function(){
			//console.log(this.string);
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
			//console.log(this.string);
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


