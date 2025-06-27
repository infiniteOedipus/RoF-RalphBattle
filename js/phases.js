//Initiating Game States
let currentGameState = null;
let combatRound = 0;
let rndTimer = null;
let menuSelect = null;
let menuSelections = []
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
      // create objects involved in all attacks (soul, borders)
		createSoul()
		rndTimer = 0
    },

	update(dt) {
		bulletmap0(dt)
		rndTimer += dt
	},

    end() {
		// Clean up if needed, step combat round, and change state back to Menu
		combatRound++
		changeGameState(Menu)
    }
},

Menu: {
	init() { 
		//create interactive menu elements
		createBattleUI()
		menuSelect = 0;
		menuSelections = []
	},

	update() {
		//menu controls (transition animations are a part of the individual menu objects)

	},
	end() {
		//prepare for combat round and move to atack
		changeGameState(Attack)
	}
}
}

function createSoul() {
	let soul = {
			x: 325,
			y: 225,
			z: 10,
			height: 32,
			width: 32,
			angle: 0,
			sprite: getSprite("souls", "soul_zeaque"),
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
		activeObjects.push(soul)
}

function createBattleUI() {
	battleParticipants.forEach(character => {
		
	});
}