var ButtonScroller = function(x, y, buttons, size){
    this.x = x;
    this.y = y;
    this.buttons=buttons;
    this.index = 0;
    this.size = size;
    this.upButton = new BoxButton(x, y - 30, 
                               buttons[0].width, 
                               buttons[0].height/2,
                               "Previous");
    this.upButton.onClick = function(){
        window.buttonScroller.scrollUp();
    }
    this.downButton = new BoxButton(x, y + (buttons[0].height * size) + 30,
                                 buttons[0].width, buttons[0].height/2,
                               "Next");
    this.downButton.onClick = function(){
        window.buttonScroller.scrollDown();
    }
    this.init = function(buttons){
        this.resetButtons(this.buttons); 
        this.resetButtons(buttons); 
        window.buttons.push(this.upButton);
        window.buttons.push(this.downButton);
    }
    this.scrollUp = function(){
        if (this.index > 0){
            this.index--;
        }
        var removedButtons = [];
        for (var i  = this.index; i < this.size; i++){
            removedButtons.push(this.buttons[i]);
        }
        this.resetButtons(removedButtons);
        this.setupDisplayingButtons();
    }
    this.scrollDown = function(){
        if (this.index < (this.buttons.length - this.size)){
            this.index++;
        }
        var removedButtons = [];
        for (var i  = 0; i < this.index; i++){
            removedButtons.push(this.buttons[i]);
        }
        this.resetButtons(removedButtons);
        this.setupDisplayingButtons();
    }
    this.setupDisplayingButtons = function(){
        var bound = this.size + this.index;
        if (bound > this.buttons.length){
            bound=this.buttons.length;
        }
        for (var i = this.index; i < bound; i++){
            var height = this.buttons[i].height;
            this.buttons[i].x=this.x;
            this.buttons[i].y=this.y + 10 + (height * (i - this.index));
            this.buttons[i].id=this.buttons[i];
            window.buttons.push(this.buttons[i]);
        }
    }
    this.resetButtons= function(buttons){
        for (var i = 0; i <  buttons.length; i++){
            buttons[i].x=-200;
            buttons[i].y=-200;
            for (var j = 0; j < window.buttons.length; j++){
                if (buttons[i].id == window.buttons[j].id){
                    window.buttons.splice(j, 1);
                }
            }
        }
    }
    this.draw = function(){
        this.upButton.draw();
        var bound = this.size;
        if (this.size > this.buttons.length){
            bound = this.buttons.length;
        }
        for (var i = 0; i < bound; i++){
            this.buttons[i].draw();
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
    this.bgColor = "#000000";
    this.fontColor = "#FFFFFF";
    this.font="14px arial";
	this.onClick = function(){
			//console.log(this.string);
	}
    this.onHover = function(){
        this.fontColor = "#00F0FF";
    }
	this.draw = function(x = this.x, y = this.y){
		ctx.fillStyle=this.bgColor;
		ctx.fillRect(x, y, this.width, this.height);
		ctx.fillStyle=this.fontColor;
		ctx.font=this.font;
		ctx.fillText(this.string, x + this.width/10, y + this.height/1.5);
	}
    this.reset = function(){
        this.fontColor= "#FFFFFF";
    }
}
var BoxButton = function(x, y, width, height, string=" "){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.string = string;
    this.bgColor = "#FFFFFF";
    this.fontColor = "#000000";
    this.font="14px arial";
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
		ctx.font=this.font;
		ctx.fillText(this.string, x + this.width/10, y + this.height/1.5);
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

var shipButton = function(name, position){
    button = new Button(0,0,150,50,name);
    button.onClick = function(){
        player = fetchShipByName(name, position);
        selected = true;
        bleep.play();
    }
    return button;
} 
bleep = document.getElementById("bleep");
bleep.volume=0.2;
