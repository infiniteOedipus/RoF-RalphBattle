//Initiating Game States
let currentGameState = null;
let combatRound = 0;
let rndTimer = null;
let activeObjects = []

function changeGameState(newState) {
	if (currentGameState?.end) currentGameState.end();
	currentGameState = newState;
	currentGameState.init();
	//activeObjects = activeObjects.filter(obj => obj.phase === newPhase);
}

const gameState = {
Attack: {
    init() {
      // create Objects
		let Soul = {
			x: 325,
			y: 225,
			z: 10,
			height: 48,
			width: 48,
			angle: 0,
			sprite: getSprite("Souls", "ZeaqueSoul"),
			speed: 250,
			update(dt) {
				// Animate Soul Movement
				let dy = 0
				let dx = 0
				if (keys["ArrowUp"]) dy -= 1;
				if (keys["ArrowDown"]) dy += 1;
				if (keys["ArrowLeft"]) dx -= 1;
				if (keys["ArrowRight"]) dx += 1;
				if (keys["q"]) this.angle -= Math.PI / 180 ;
				if (keys["e"]) this.angle += Math.PI / 180;
		
				const length = Math.hypot(dx, dy);
				if (length > 0) {
					dx /= length;
					dy /= length;
				}
			
				this.x += dx * this.speed * dt;
				this.y += dy * this.speed * dt;
			}
		};
		activeObjects.push(Soul)
		rndTimer = 0
    },
	update(dt) {
		bulletmap0(dt)
		rndTimer += dt
	},
    end() {
		// Clean up if needed
		combatRound++
    }
}    
}

//sketching out attack phase
function bulletmap0(dt) {
	if(interval(rndTimer, dt, 0.9)) { //every 0.9 seconds
		const pickx = Math.random() * 300 + 175
		const picky = Math.random() * 50 + 50
		for(let i = 0; i < 3; i++){
			activeObjects.push(new bul_ralph_brick(
				( Math.random() * 2 * Math.PI / 4 ) + ( 5 * Math.PI / 4 ), 	//direction
				120, 								//speed
				pickx, 								//initx
				picky								//inity
			))
		}
	}
}
function bul_ralph_brick(direction, speed, initx, inity) {
	this.sprite = getSprite("Bullets", "bul_ralph_brick")
	this.x = initx
	this.y = inity
	this.width = this.sprite.width * 2
	this.height = this.sprite.height * 2
	this.scalex = 1
	this.opacity = 1
	this.setForRemoval = false
	this.dx = speed * Math.cos(direction)
	this.dy = speed * Math.sin(direction)
	this.bulTimer = 0 + Math.random()*0.4
	this.update = (dt) => {
		this.x += this.dx * dt
		this.y += this.dy * dt
		this.dy += 210*dt
		if(interval(this.bulTimer, dt, 0.4)){
			this.scalex *= -1
		}
		bullet_fadeout(this, this.y > 400, dt)
		this.bulTimer += dt
	}
}
function bullet_fadeout(bullet, condition, dt){
	if (condition) bullet.opacity -= dt / 0.5
	if (bullet.opacity <= 0) bullet.setForRemoval = true
}
