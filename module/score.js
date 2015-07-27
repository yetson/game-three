var _ = require("../bower_components/underscore/underscore-min"),
	Velocity = require("../bower_components/velocity/velocity.min"),
	config = require("../config");
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

function display(score){
	var s = document.getElementById("score");
	s.innerHTML = score;	
}

function result(cnt){
	var r = document.getElementById("result"),
		h = document.getElementById("history"),
		s = document.getElementById("start");
	r.innerHTML = "Congratulations! Your score is <strong>" + cnt + "</strong>";
	s.innerHTML = "<a href='javascript:void(0);'>Restart</a>";
	h.innerHTML = "<a href='javascript:void(0);'>History</a>";
	r.style.display = "block";
	s.style.display = "block";
	h.style.display = "block";
}

function initBoard(){
	var s = document.getElementById("score");
	if(s) {
		s.innerHTML = 0;
		return;
	};
	s = document.createElement("strong");
	s.setAttribute("id", "score");
	s.setAttribute("style", "position: absolute;top: 1em; right: 1em; font-size: 2em;color: #feab34;");
	s.innerHTML = 0;
	document.body.appendChild(s);
}

function store(opt){
	var moment = require("../bower_components/moment/moment");
	var max = localStorage.getItem("maxScore") || 0,
		ss = localStorage.getItem("scores") || "",
		score = opt.score || 0;
		name = localStorage.getItem("name") || config.defaultName;
	if(_.isEmpty(max)){ //first insert
		localStorage.setItem("maxScore", score);
		if(parseInt(score, 10) > 0){
        	_rank(name, score);
		}
	}else{
		if(score > max){
			_rank(name, score);
			localStorage.setItem("maxScore", score);
		} 
	}
	if(_.isString(opt.name)){
		localStorage.setItem("name", name);
	}
	ss = ss.split(";")[0] == "" ? [] : ss.split(";");
	ss.push(JSON.stringify({score: score, date: _.now()}));
	if(ss.length > 10){
		ss = ss.slice(-10);
	}
	localStorage.setItem("scores", ss.join(";"));
};

function history(){
	var moment = require("../bower_components/moment/moment"),
		lc = require("../bower_components/moment/locale/zh-cn"),
		scores = localStorage.getItem("scores"),
		name = localStorage.getItem("name") || config.defaultName,
		con, tpl, table, h;
	scores = scores.split(";")[0] == "" ? [] : scores.split(";");
	if(scores.length > 0){
		table = '<table class="pure-table pure-table-horizontal" style="text-align:center;">\
				    <thead>\
				        <tr>\
				            <th>name</th>\
				            <th width="50%">&nbsp;&nbsp;date&nbsp;&nbsp;</th>\
				            <th>score</th>\
				        </tr>\
				    </thead><tbody>';
		tpl = _.template("<tr><td>{{name}}</td><td>{{date}}</td><td>{{score}}</td></tr>");
		_.each(scores.reverse(), function(s, i){
			var obj = JSON.parse(s),
				d = {name: name, date: moment(obj.date).startOf('minute').fromNow(), score: obj.score};
			h = tpl(d);
			table +=  h;
		});
		table += "</tbody></table>";
	}
	_dialog({innerHTML:table});
}

function _dialog(opt){
	var dialog_pannel = document.createElement("div"),
		panStyle = "position: absolute;overflow:hidden;top: 0;left: 0;right:0;bottom:0;z-index: 100;",
		diaStyle = "position: absolute;left: 50%;top: -100%;",
		dialog;
	dialog_pannel.setAttribute("id", "dialog_pannel");
	dialog_pannel.setAttribute("style", panStyle);
	dialog_pannel.innerHTML = "<span id='dialog_close' style='position:absolute;left:0.5em;top:1em;color:#fff;'>&lt;&nbsp;back</span><div id='dialog' style='top: -100%;'><div class='dialog_content' style='padding: 1em;background-color:#fff;color:#000;border-radius:0.3em;max-height: 100%;overflow: hidden;'>"+opt.innerHTML+"</div></div>";
	document.body.appendChild(dialog_pannel);
	dialog = document.getElementById("dialog");
	dialog.setAttribute("style", diaStyle);

	if(opt.width){
		dialog.style.width = opt.width;
	}else{
		var mw = 0;
		[].forEach.call(dialog.children, function(c){
			mw = c.scrollWidth > mw ? c.scrollWidth : mw;
		});
		dialog.style.width = mw + "px";
	}

	setTimeout(function(){
		dialog.style.marginLeft = (0 - dialog.scrollWidth / 2) + "px";
		Velocity(dialog_pannel, {backgroundColor: "#000", backgroundColorAlpha: 0.5}, {
			duration: 100, 
			complete: function(){
				Velocity(dialog, {top: "3em"}, {easing: "[0,-0.27,1,1.34]", duration: 500});
			}
		});
	}, 10);

	document.getElementById("dialog_close").onclick = function(){
		dialog_pannel.parentNode.removeChild(dialog_pannel);
	}
	return dialog;
}

function _rank(name, score){
	var form = 	'<p>you got an amazing score <strong>'+score+'</strong>, input your nickname to be famous!</p>\
				<form class="pure-form pure-form-aligned" method="post" action="/game-three/rank">\
				    <fieldset>\
				        <div class="pure-control-group">\
				            <label for="name">Nickname</label>\
				            <input id="name" type="text" name="name" placeholder="Nickname" value="'+name+'">\
				            <input type="hidden" name="score" value="'+score+'">\
				        </div>\
				        <div class="pure-controls">\
				            <button type="submit" onclick=javascript:window.disableFormButton(this) class="pure-button pure-button-primary">Submit</button>\
				        </div>\
				    </fieldset>\
				</form>',
		dialog = _dialog({innerHTML:form, width: "80%"}),
		name = document.getElementById("name", dialog);
	name.select();
	name.focus();
}

window.disableFormButton = function(obj){
	setTimeout(function(){
		obj.setAttribute('disabled', 'disabled');
	}, 100);
}

module.exports = {
	result: result,
	display: display,
	initBoard: initBoard,
	store: store, 
	history: history 
};
