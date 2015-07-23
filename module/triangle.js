var config = require("../config"),
	Fit = require("./fit");
var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d");

function drawTriangle(){
	var R = ctx.canvas.width / 2,
		L = R * 2,
		sq = Math.sqrt(3);

	ctx.beginPath();  //top
	ctx.moveTo(R, R);
	ctx.lineTo(R*(1 - sq/2), R/2);
	ctx.lineTo(R*(1 + sq/2), R/2);
	ctx.closePath();
	ctx.fillStyle = config.color[0];
	ctx.fill();
	
	ctx.beginPath();  //left, 
	ctx.moveTo(R, R);
	ctx.lineTo(R, L);
	ctx.lineTo(R*(1 - sq/2), R/2);
	ctx.lineTo(R,R);
	ctx.closePath();
	ctx.fillStyle = config.color[1];
	ctx.fill();

	ctx.beginPath();  //right
	ctx.moveTo(R, R);
	ctx.lineTo(R, L);
	ctx.lineTo(R*(1 + sq/2), R/2);
	ctx.lineTo(R, R);
	ctx.closePath();
	ctx.fillStyle = config.color[2];
	ctx.fill();
}

module.exports.drawTriangle = drawTriangle;

module.exports.reset = function(){
	canvas.style[Fit.prefix + 'transform'] = 'rotateZ(0)';
};

module.exports.topColor = function(){
	var transform = Fit.prefix + "transform",
		deg = canvas.style[transform] ? parseInt(canvas.style[transform].match(/rotateZ\(([-]?\d+)deg\)/)[1], 10) : 0,
		res = deg / 120 % 3 < 0 ? deg / 120 % 3 + 3 : deg / 120 % 3;
	res = res <=2 && res >=0 ? res : 0;
	return {color: config.color[res], colorName: config.colorName[res]};
}

module.exports.rotate = function(reverse){
	var transform = Fit.prefix + 'transform',
		obj = canvas,
		deg = obj.style[transform] ? parseInt(obj.style[transform].match(/rotateZ\(([-]?\d+)deg\)/)[1], 10) : 0,
		to = reverse ? deg - 120 : deg + 120;
	console.log(to);
	obj.style[transform] = "rotateZ("+to+"deg)";
}