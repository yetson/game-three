var Triangle = require("./triangle");
var Ball = require("./ball");
var Score = require("./score");
var Fit = require('./fit');

if(document.addEventListener){
		document.addEventListener('DOMContentLoaded', init, false);	
}

function init(){
	var can = document.getElementById("canvas"),
		wra = document.getElementById("wrapper"),
		ctx = document.getElementById("canvas").getContext("2d"),
		start = document.getElementById("start"),
		result = document.getElementById("result"),
		history = document.getElementById("history"),
		ch  = document.body.clientHeight,
		cw  = document.body.clientWidth,
		tapEvent = 'ontouchstart' in window ? 'touchstart' : 'mousedown',
		words;

	can.setAttribute("width", ch / 3);
	can.setAttribute("height", ch / 3);
	can.style.marginTop = 0 - ch / (3*2*2) + "px";
	can.style.marginLeft = 0 - ch / (3*2) + "px";

	Triangle.drawTriangle();
	
	start.addEventListener(tapEvent, function(e){
		e.stopPropagation();
		if(/restart/ig.test(start.innerHTML) && result){
			result.style.display = "none";
			Ball.reset();
		}
		Score.initBoard();
		start.style.display = "none";
		Ball.run();
	});
	history.addEventListener(tapEvent, function(e){
		e.stopPropagation();
		Score.history();
	});
	wra.addEventListener(tapEvent, function(e){
		var reverse = false, 
			x = e.touches ? e.touches[0].pageX : e.x || e.pageX;
		if(start.style.display === "none"){
			if(x < cw / 2){
				reverse = true;
			}
			Triangle.rotate(reverse);
		}
	});
}