var ButtonScroller = function(x, y, buttons, size){
    this.x = x;
    this.y = y;
    this.buttons=buttons;
    this.displaying=[];
    this.index = 0;
    this.size = size;
    this.upButton = new Button(x, y - 30, 
                               buttons[0].width, 
                               buttons[0].height/2);
    this.downButton = new Button(x, y + (buttons[0].height * size) + 30,
                                 buttons[0].width, buttons[0].height/2);
    this.init = function(buttons){
        this.resetButtons(this.buttons); 
        this.resetButtons(buttons); 
        for (var i = 0; i < this.size; i++){
            this.displaying[i]=this.buttons[i];
        }
    }
    this.scrollUp = function(){
        if (this.index > 0){
            this.index--;
        }
    }
    this.scrollDown = function(){
        if (this.index < this.buttons.length){
            this.index++;
        }
    }
    this.setupDisplayingButtons = function(){
        window.buttons.push(this.upButton);
        window.buttons.push(this.downButton);
        for (var i = 0; i < this.size; i++){
            var height = this.displaying[i].height;
            this.displaying[i].x=x;
            this.displaying[i].y=y + (height * i);
//            window.buttons.push(this.displaying[i]);
        }
    }
    this.resetButtons= function(buttons){
        for (var i = 0; i <  buttons.length; i++){
             buttons[i].x=-200;
             buttons[i].y=-200;
        }
    }
    this.draw = function(){
        this.upButton.draw();
        for (var i = 0; i < this.size; i++){
            this.displaying[i].draw();
        }
        this.downButton.draw();
    }
}

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
	this.draw = function(x = this.x, y = this.y){
		ctx.fillStyle=this.bgColor;
		ctx.fillRect(x, y, this.width, this.height);
		ctx.fillStyle=this.fontColor;
		ctx.font="14px arial";
		ctx.fillText(this.string, x + this.width/10, y + this.height/2);
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


