var nav_hide =true;

function nav_show_hide() {
	var nav_top = nav_hide ? 0 : -240;
	$('.main_page-nav').animate({
		top: nav_top
	});
	nav_hide = !nav_hide;
}

var Scroll = {
	points: null,
	step: 200,
	element: null,
	pos: 0,
	x: 0,
	y: 0,
	auto_sroll_time: 1000
};

Scroll.distance = function(x1, y1, x2, y2) {
	return Math.sqrt( Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) );
}

Scroll.init = function(params) {
	for(k in params) {
		this[k] = params[k]; 
	}
	
	var p = this.points;
	p.s = 0;
	for(var i = 0; i< p.length; i++) {
		if(i < p.length - 1) {
			p[i].s = this.distance(p[i].x, p[i].y, p[i+1].x, p[i+1].y);
			this.s += p[i].s;
			p[i].dx = (p[i+1].x - p[i].x) / p[i].s * this.step;
			p[i].dy = (p[i+1].y - p[i].y) / p[i].s * this.step;		
		}
	}
	
	for(var i = 0; i < p.length; i++) {
		p[i].auto_sroll_time = p[i].s / this.s * this.auto_sroll_time;
	}

	this.x = p[0].x;
	this.y = p[0].y;	
	
	function resize() {
		Scroll.window_height = parseInt($(window).height());
		Scroll.window_width = parseInt($(window).width());
		$('.hide_container').css('height', Scroll.window_height);   
		Scroll.element.css('left', (-Scroll.x + Scroll.window_width / 2) + 'px');
		Scroll.element.css('top', -Scroll.y + 'px');
	}	

	resize();

	$(window).bind('resize', function() {
	  resize();
	});
	
	this.element.mousewheel(function(event, delta) {
		if(delta > 0) {
			Scroll.up();
		} else {
			Scroll.down();
		}
	});
}

Scroll.up = function() {
	var p = this.points;	
		if(this.pos == p.length - 1) {
			this.pos--;
		}
		var s = p[this.pos].s;
		if(this.distance(this.x, this.y, p[this.pos + 1].x, p[this.pos + 1].y) + this.step < s) {
			this.x -= p[this.pos].dx;
			this.y -= p[this.pos].dy;
		} else {
			this.x = p[this.pos].x;
			this.y = p[this.pos].y
			if(this.pos) {
				this.pos --;
			}
		}
		this.element.stop();
		this.element.animate({
			left: -this.x + Scroll.window_width / 2,
			top: -this.y
		},{
			easing: "easeOutCirc",
			delay: 500
		});
}

Scroll.down = function() {
	var p = this.points;	
	if(this.pos != p.length - 1) {
		var s = p[this.pos].s;
		if( s > this.distance(this.x, this.y, p[this.pos].x, p[this.pos].y) + this.step) {
			this.x += p[this.pos].dx;
			this.y += p[this.pos].dy;
		} else {
			this.x = p[this.pos + 1].x;
			this.y = p[this.pos + 1].y;
			this.pos++;
		}
		this.element.stop();
		this.element.animate({
			left: -this.x + Scroll.window_width / 2,
			top: -this.y
		},{
			easing: "easeOutCirc",
			delay: 500
		});
	}
}

Scroll.move_at = function(pos) {
	var p = this.points;
	var way = pos - this.pos > 0 ? 1 : -1;
	var type = this.pos + way != pos ? "linear" : "easeOutCirc";
	if(this.pos != pos) {
		this.element.animate({
			left: -p[Scroll.pos + way].x + Scroll.window_width / 2,
			top: -p[Scroll.pos + way].y
		}, {
			easing: type,
			delay: p[Scroll.pos + way].auto_sroll_time,
			complete: function() {
				Scroll.pos += way;
				Scroll.move_at(pos);
			}
		});
	}
}

