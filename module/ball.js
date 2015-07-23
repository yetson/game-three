var config = require("../config"),
	_ = require("../bower_components/underscore/underscore-min"),
	Triangle = require("./triangle");
	Score = require("./score");
	
var can = document.getElementById("canvas"),
	wra = document.getElementById("wrapper"),
	bw = can.width / 8,
	cw = document.body.clientWidth;


var Ball = {
	store: [],
	cnt: 0,
	t: null, 
	create: function(){
		var color = config.color[_.random(0, 2)],
			css = {
				"position": "absolute", 
				"background-color": color, 
				//"top": 0 - bw + "px",
				"left": cw/2 - bw/2 + "px",
				"width": bw + "px",
				"height": bw + "px",
				"border-radius": "50%"
			},
			cssStr = "",
			ball, id, speed;
		_.each(css, function(v, k){
			cssStr += k + ":" + v + ";";
		});
		if(this.cnt < 3){
			speed = _.random(config.degree.easy[0], config.degree.easy[1]);
		}else if(this.cnt < 6){
			speed = _.random(config.degree.normal[0], config.degree.normal[1]);
		}else if(this.cnt < 9){
			speed = _.random(config.degree.difficult[0], config.degree.difficult[1]);
		}else if(this.cnt < 12){
			speed = _.random(config.degree.crazy[0], config.degree.crazy[1]);
		}else{
            speed = _.random(config.degree.holyshit[0], config.degree.holyshit[1]);
        }
        speed = _.random(config.degree.holyshit[0], config.degree.holyshit[1]);
		id = _.now();
		ball = document.createElement("span");
		wra.appendChild(ball);	
		ball.setAttribute("id", id);
		ball.setAttribute("style", cssStr);
		this.store.push({id: id, dom: ball, color: color});
		this.fall(id, speed);
		return id;
	},
	fall:function(id, speed){
		var ball = _.where(this.store, {id: id})[0].dom, 
			self = this;
		if(!ball) return;
		speed = speed ? speed : 3;
        if(speed < 1 && speed > 0){
            ball.setAttribute("class", "ball ball-speed-0-" + Math.ceil(speed*10));  
        }else{
		    ball.setAttribute("class", "ball ball-speed-" + speed);  
        }
		this.t = setTimeout(function(){
			self.count(id);
		}, speed * 1000);
	},
	count: function(id){
		var color = _.where(this.store, {id: id})[0].color, 
			topc = Triangle.topColor().color;
		if(color === topc){
			this.cnt ++;
			this.destroy(id);
			Score.display(this.cnt);
		}else{
			this.stop();
		}
		return this.cnt;
	},
	statics: function(){
		return this.cnt;
	},
	destroy: function(id){
		var ballDom = document.getElementById(id);
		ballDom.parentNode.removeChild(ballDom);
		if(this.t){
			clearTimeout(this.t);	
			this.create();
		}
	},
	reset: function(){
		[].forEach.call(document.getElementsByClassName("ball"), function(b){
			b.parentNode.removeChild(b);
		});
		document.getElementById("history").style.display = "none";
		Triangle.reset();
		this.cnt = 0;
		this.store = [];
	},
	run: function(){
		this.reset();
		this.create();
	},
	stop: function(){
		clearTimeout(this.t);
		Score.result(this.cnt);
		Score.store({score: this.cnt});
	}
};

module.exports = Ball;