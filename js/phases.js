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
			height: 32,
			width: 32,
			angle: 0,
			sprite: getSprite("Souls", "ZeaqueSoul"),
			speed: 300,
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

