let colors = ['#FF324A', '#31FFA6', '#206EFF', '#FFFF99']; // r, g, b, y

let bg = document.getElementById('background');
let bgCtx = bg.getContext('2d');

let overlay = document.getElementById('overlay');
let overlayCtx = overlay.getContext('2d');

let aboutCardCanvas = document.getElementById('aboutCardBgCanvas');
let aboutCardCanvasCtx = aboutCardCanvas.getContext('2d');

let contactCanvas = document.getElementById('contactBgCanvas');
let contactCanvasCtx = contactCanvas.getContext('2d');

let tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';

let animations = [];

const particleCount = 32;
const logoParticleCount = 40;

let logoAnimDone = false;

let lastHash = location.hash;

function logoAnim() {
	let offsetX = 200;
	let offsetY = -50;

	let animations = [
		{ name: '.n1', x: 0 + offsetX, y: 0 + offsetY, stroke: colors[0] },
		{ name: '.n2', x: 0 + offsetX, y: 0 + offsetY, stroke: colors[0] },
		{ name: '.n3', x: 230 + offsetX, y: 0 + offsetY, stroke: colors[1] },
		{ name: '.n4', x: 350 + offsetX, y: 0 + offsetY, fill: colors[0] },
		{ name: '.n5', x: -113 + offsetX, y: 0 + offsetY, fill: colors[0] },
		{ name: '.o1', x: -203.5 + offsetX, y: 55 + offsetY, stroke: colors[1] },
		{ name: '.a1', x: -237 + offsetX, y: 116 + offsetY, stroke: colors[2] },
		{ name: '.a2', x: -115 + offsetX, y: 116 + offsetY, stroke: colors[2] },
		{ name: '.a3', x: -419 + offsetX, y: 150 + offsetY, stroke: colors[0] },
		{ name: '.h1', x: -524 + offsetX, y: 230 + offsetY, stroke: colors[1] },
		{ name: '.h2', x: -285 + offsetX, y: 173 + offsetY, stroke: colors[0] },
		{ name: '.h3', x: -522 + offsetX, y: 230 + offsetY, stroke: colors[1] },
		{ name: '.h4', x: -522 + offsetX, y: 230 + offsetY, fill: colors[0] },
	];

	function setDash(el) {
		el.style.dashArray = anime.setDashoffset(el);
		return [anime.setDashoffset(el) - 1, 0];
	}

	animations.forEach((animation, index) => {
	   if(animation.stroke) {
			anime({
			   targets: animation.name,
				stroke: {
					value: ['#fff', animation. stroke],
					duration: 500,
					delay: 1000 + index * 30,
					easing: 'easeInOutQuad'
				},
				offset: 0
			});
	   } 
		
		if(animation.fill) {
			anime({
				targets: animation.name,
				fill: {
					value: ['#fff', animation.fill],
					duration: 500,
					delay: 1000 + index * 30,
					easing: 'easeInOutQuad'
				},
				offset: 0
			});
		}
		
		anime({
			targets: animation.name,
			translateX: {
				value: [animation.x, 0],
				duration: 500,
				delay: 1000 + index * 30,
				easing: 'easeInOutQuad'
			},
			translateY: {
				value: [animation.y, 0],
				duration: 500,
				delay: 1000 + index * 30,
				easing: 'easeInOutQuad'
			},
			offset: 0
		});
		
		anime({
			targets: animation.name,
			strokeDashoffset: {
				value: setDash,
				duration: 800,
				delay: 1200 + index * 30,
				easing: 'easeInOutQuad',
				complete: () => { logoAnimDone = true; }
			},
			offset: 0
		});
	});
}

function removeAnimation(animation) {
	let index = animations.indexOf(animation);
	if(index > -1) animations.splice(index, 1);
}

let animate = anime({
	duration: Infinity,
	update: () => {
		bgCtx.clearRect(0, 0, bg.width, bg.height);
		overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
		aboutCardCanvasCtx.clearRect(0, 0, aboutCardCanvas.width, aboutCardCanvas.height);
		contactCanvasCtx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);

		animations.forEach(anim => {
			anim.animatables.forEach(animatable => {
				animatable.target.draw();
			});
		});
	}
});

function pageFillAnim(x, y, element, color) {
	function pageFillRadius(x, y) {
		let l = Math.max(x - 0, bg.width - y);
		let h = Math.max(y - 0, bg.height - y);

		return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
	}

	let pageFill = new Circle({
		x: x,
		y: y,
		fill: color,
		radius: 0,
		ctx: overlayCtx
	});
	let fillAnimation = anime({
		targets: pageFill,
		radius: pageFillRadius(x, y),
		duration: Math.max(pageFillRadius(x, y) / 2, 750),
		easing: 'easeOutQuart',
		complete: () => {
			element.style.background = color;
			removeAnimation(fillAnimation);
		}
	});

	animations.push(fillAnimation);
}

function bgClick(e) {
	let rippleSize = Math.min(150, (bg.width * .4));

	let ripple = new Circle({
		x: e.pageX,
		y: e.pageY,
		radius: 0,
		fill: 'transparent',
		stroke: {
			width: 2,
			color: '#FFF'
		},
		opacity: 1
	});
	let rippleAnimation = anime({
		targets: ripple,
		radius: rippleSize * 0.7,
		opacity: 0,
		easing: 'easeOutExpo',
		duration: 900,
		complete: removeAnimation
	});

	let particles = [];
	for(let i = 0; i < particleCount; i++) {
		let particle = new Circle({
			x: e.pageX,
			y: e.pageY,
			fill: colors[anime.random(0, 3)],
			radius: anime.random(12, 24),
			ctx: bgCtx
		});

		particles.push(particle);
	}

	let particlesAnimation = anime({
		targets: particles,
		x: (particle) => { return particle.x + anime.random(rippleSize, -rippleSize); },
		y: (particle) => { return particle.y + anime.random(rippleSize * 1.15, - rippleSize * 1.15); },
		radius: 0,
		easing: 'easeOutExpo',
		duration: anime.random(1000, 1300),
		complete: removeAnimation
	});

	animations.push(rippleAnimation, particlesAnimation);
}

function particleClick(e, target) {
	let particles = [];
	for(let i = 0; i < particleCount; i++) {
		let particle = new Circle({
			x: e.pageX,
			y: e.pageY,
			fill: colors[anime.random(0, 3)],
			radius: anime.random(5, 12),
			ctx: target
		});

		particles.push(particle);
	}

	let particlesAnimation = anime({
		targets: particles,
		x: (particle) => { return particle.x + anime.random(100, -100); },
		y: (particle) => { return particle.y + anime.random(100, -100); },
		radius: 0,
		easing: 'easeOutExpo',
		duration: anime.random(1000, 1300),
		complete: removeAnimation
	});

	animations.push(particlesAnimation);
}

function logoClick(e) {
	if(!logoAnimDone)
		return;

	anime({
		targets: '#logo',
		scale: [
			{ value: 1.1, duration: 130, delay: 0, easing: 'easeInCubic' },
			{ value: 1, duration: 130, delay: 0, easing: 'easeInCubic' },
		]
	});

	let logoRect = document.getElementById('logo').getBoundingClientRect();
	let rectangle = new Rectangle({
		x: logoRect.left + logoRect.width / 2,
		y: logoRect.top + logoRect.height / 2 - 10,
		width: logoRect.width - 80,
		height: logoRect.height - 60,
		stroke: {
			width: 2,
			color: '#fff'
		},
		opacity: 1,
		ctx: bgCtx
	});
	let rectAnimation = anime({
		targets: rectangle,
		width: logoRect.width - 40,
		height: logoRect.height - 30,
		opacity: 0,
		easing: 'easeOutExpo',
		duration: 900,
		complete: removeAnimation
	});

	let centerX = (logoRect.right - logoRect.left) / 2 + logoRect.left;
	let centerY = (logoRect.bottom - logoRect.top) / 2 + logoRect.top;

	let particles = [];
	for(let i = 0; i < logoParticleCount; i++) {
		let angle = 360 * (i / logoParticleCount);
		let x = centerX + ((logoRect.right - logoRect.left) / 3) * Math.cos(angle * Math.PI / 180);
		let y = centerY + ((logoRect.right - logoRect.left) / 5) * Math.sin(angle * Math.PI / 180);

		let circle = new Circle({
			x: x,
			y: y,
			fill: colors[anime.random(0, 3)],
			radius: anime.random(12, 24),
			ctx: bgCtx,
			opacity: 1
		});
		particles.push(circle);
	}
	let particlesAnimation = anime({
		targets: particles,
		x: (particle) => { return particle.x + anime.random((logoRect.right - logoRect.left) / 2, -(logoRect.right - logoRect.left) / 2); },
		y: (particle) => { return particle.y + anime.random((logoRect.right - logoRect.left) / 2, -(logoRect.right - logoRect.left) / 2); },
		radius: 0,
		easing: 'easeOutExpo',
		duration: anime.random(2000, 3000),
		complete: removeAnimation
	});

	animations.push(rectAnimation, particlesAnimation);
}

function aboutCardClick(e) {
	let cardRect = document.getElementById('aboutCard').getBoundingClientRect();

	let particles = [];
	for(let i = 0; i < particleCount; i++) {
		let particle = new Circle({
			x: e.pageX - cardRect.left,
			y: e.pageY - cardRect.top,
			fill: colors[anime.random(0, 3)],
			radius: anime.random(5, 12),
			ctx: aboutCardCanvasCtx
		});

		particles.push(particle);
	}

	let particlesAnimation = anime({
		targets: particles,
		x: (particle) => { return particle.x + anime.random(100, -100); },
		y: (particle) => { return particle.y + anime.random(100, -100); },
		radius: 0,
		easing: 'easeOutExpo',
		duration: anime.random(1000, 1300),
		complete: removeAnimation
	});

	animations.push(particlesAnimation);
}

function onLoad() {
	if(location.hash)
		onHashChange();

	logoAnim();
}

function onTap(e) {
	if(e.touches) {
		e.preventDefault();
		e = e.touches[0];
	}

	if(location.hash == '#home' || location.hash == '') {
		let logoRect = document.getElementById('logo').getBoundingClientRect();
		if(e.pageY > logoRect.top && e.pageY < logoRect.bottom && e.pageX > logoRect.left && e.pageX < logoRect.right) {
			logoClick(e);
		} else {
			bgClick(e);
		}
	}

	if(location.hash == '#about') {
		let cardRect = document.getElementById('aboutCard').getBoundingClientRect();
		if(e.pageY > cardRect.top && e.pageY < cardRect.bottom && e.pageX > cardRect.left && e.pageX < cardRect.right) {
			aboutCardClick(e);
		}
	}

	if(location.hash == '#contact') {
		particleClick(e, contactCanvasCtx)
	}
}

function randomAnimationTimer() {
	if(document.hasFocus()) {
		if(location.hash == '#about') {
			let x = 0;
			let y = 0;

	 		let side = Math.floor(Math.random() * 4);
	 		if(side == 0) {
	 			x = Math.random() * 20 - 10;
	 			y = (Math.random() * (aboutCardCanvas.height + 20)) - 10;
	 		} else if(side == 1) {
	 			x = (Math.random() * (aboutCardCanvas.width + 20)) - 10;
	 			y = Math.random() * 20 - 10;
	 		} else if(side == 2) {
	 			x = (Math.random() * 20 - 10) + aboutCardCanvas.width;
	 			y = (Math.random() * (aboutCardCanvas.height + 20)) - 10
	 		} else if(side == 3) {
	 			x = (Math.random() * (aboutCardCanvas.width + 20)) - 10;
	 			y = (Math.random() * 20 - 10) + aboutCardCanvas.height;
	 		}

			let particles = [];
			for(let i = 0; i < particleCount; i++) {
				let particle = new Circle({
					x: x,
					y: y,
					fill: colors[anime.random(0, 3)],
					radius: anime.random(5, 12),
					ctx: aboutCardCanvasCtx
				});

				particles.push(particle);
			}

			let particlesAnimation = anime({
				targets: particles,
				x: (particle) => { return particle.x + anime.random(100, -100); },
				y: (particle) => { return particle.y + anime.random(100, -100); },
				radius: 0,
				easing: 'easeOutExpo',
				duration: anime.random(1000, 1300),
				complete: removeAnimation
			});

			animations.push(particlesAnimation);
		}
	}
	
	setTimeout(randomAnimationTimer, Math.random() * 1000 + 500);
}

function onResize() {
	bg.width = window.innerWidth * devicePixelRatio;
	bg.height = window.innerHeight * devicePixelRatio;

	bg.style.width = window.innerWidth + 'px';
	bg.style.height = window.innerHeight + 'px';

	bgCtx.scale(devicePixelRatio, devicePixelRatio);

	overlay.width = window.innerWidth * devicePixelRatio;
	overlay.height = window.innerHeight * devicePixelRatio;

	overlay.style.width = window.innerWidth + 'px';
	overlay.style.height = window.innerHeight + 'px';

	overlayCtx.scale(devicePixelRatio, devicePixelRatio);

	aboutCardCanvas.width = document.getElementById('aboutCard').clientWidth * devicePixelRatio;
	aboutCardCanvas.height = document.getElementById('aboutCard').clientHeight * devicePixelRatio;

	aboutCardCanvas.style.width = document.getElementById('aboutCard').clientWidth + 'px';
	aboutCardCanvas.style.height = document.getElementById('aboutCard').clientHeight + 'px';

	aboutCardCanvasCtx.scale(devicePixelRatio, devicePixelRatio);

	contactCanvas.width = document.getElementById('contact').clientWidth * devicePixelRatio;
	contactCanvas.height = document.getElementById('contact').clientHeight * devicePixelRatio;

	contactCanvas.style.width = document.getElementById('contact').clientWidth + 'px';
	contactCanvas.style.height = document.getElementById('contact').clientHeight + 'px';

	contactCanvasCtx.scale(devicePixelRatio, devicePixelRatio);
}

function onHashChange() {
	document.querySelectorAll('.content-wrapper').forEach(i => {
		i.setAttribute('aria-hidden', true);
	});

	if (location.hash && location.hash.indexOf('home') === -1 && document.querySelector(location.hash))
		document.querySelector(location.hash).setAttribute('aria-hidden', false);
	
	if(location.hash != '#home' && location.hash != '') {
		let element;
		let rect;
		let color;

		switch(location.hash) {
			case '#about':
				element = document.getElementById('about');
				rect = document.getElementById('nav-about').getBoundingClientRect();
				color = colors[1];
				break;
			case '#work':
				element = document.getElementById('work');
				rect = document.getElementById('nav-work').getBoundingClientRect();
				color = colors[0];
				break;
			case '#contact':
				element = document.getElementById('contact');
				rect = document.getElementById('nav-contact').getBoundingClientRect();
				color = colors[2];
				break;
			default:
				break;
		}

		pageFillAnim((rect.right - rect.left) / 2 + rect.left, (rect.top - rect.bottom) / 2 + rect.bottom, element, color);
	}

	lastHash = location.hash;
}

class Rectangle {
	constructor(options = {}) {
		this.width = options.width || 10;
		this.height = options.height || 10;

		this.x = options.x || 0;
		this.y = options.y || 0;

		this.drawFromCenter = options.drawFromCenter || true;

		this.opacity = options.opacity || 1;

		this.stroke = options.stroke || false;
		this.fill = options.fill || false;

		this.ctx = options.ctx || bgCtx;
	}

	draw() {
		this.ctx.globalAlpha = this.opacity;
		this.ctx.beginPath();

		if(this.stroke) {
			this.ctx.strokeStyle = this.stroke.color;
			this.ctx.lineWidth = this.stroke.width;
			if(this.drawFromCenter)
				this.ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
			else
				this.ctx.rect(this.x, this.y, this.width, this.height);
			this.ctx.stroke();
		}

		if(this.fill) {
			this.ctx.fillStyle = this.fill;
			if(this.drawFromCenter)
				this.ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
			else
				this.ctx.rect(this.x, this.y, this.width, this.height);
		}

		this.ctx.closePath();
		this.ctx.globalAlpha = 1;
	}
}

class Circle {
	constructor(options = {}) {
		this.radius = options.radius || 5;

		this.x = options.x || 0;
		this.y = options.y || 0;

		this.opacity = options.opacity || 1;

		this.stroke = options.stroke || false;
		this.fill = options.fill || true;

		this.ctx = options.ctx || bgCtx;
	}

	draw() {
		this.ctx.globalAlpha = this.opacity;
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);

		if(this.stroke) {
			this.ctx.strokeStyle = this.stroke.color;
			this.ctx.lineWidth = this.stroke.width;
			this.ctx.stroke();
		}

		if(this.fill) {
			this.ctx.fillStyle = this.fill;
			this.ctx.fill();
		}

		this.ctx.closePath();
		this.ctx.globalAlpha = 1;
	}
}

randomAnimationTimer();
onResize();
document.addEventListener(tap, onTap, false);
document.addEventListener('DOMContentLoaded', onLoad, false);
window.addEventListener('resize', onResize);
window.addEventListener('hashchange', onHashChange, false);
