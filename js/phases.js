//Initiating Game States
let activeObjects = []

let currentGameState = null;
let combatRound = 0;
let rndTimer = null;



function changeGameState(newState) {
	console.log("changing game state to:", newState)
	if (currentGameState?.end) currentGameState.end();
	currentGameState = newState;
	console.log("initializing game state:", currentGameState)
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
		if (rndTimer > 10) changeGameState(gameState.Menu)
	},

    end() {
		// Clean up if needed, step combat round, and change state back to Menu
		activeObjects.find(obj => obj.name === "soul")
			.setForRemoval = true;

		activeObjects.filter(obj => obj.type === "bullet" && typeof obj.endBullet === "function")
			.forEach(obj => obj.endBullet());

		combatRound++
    }
},

Menu: {
	init() { 
		//create interactive menu elements
		//createBattleUI()
		menuState.activeCharacter      = 0
		menuState.menuSelections       = []
		menuState.cachedSelections     = battleParticipants.map(() => 0)
		runNextCharacterUI()
	},

	update(dt) {
		//menu controls (transition animations are a part of the individual menu objects)
		handleMenuInput()
	},

	end() {
		//prepare for combat round and move to atack
		//menuCleanup()
		activeObjects.filter(obj => obj.type === "menu")
			.forEach(obj => obj.setForRemoval = true);
	}
}
}

function createSoul() {
	let soul = {
			name: "soul",
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
				if (input.up())    dy -= 1;
				if (input.down())  dy += 1;
				if (input.left())  dx -= 1;
				if (input.right()) dx += 1;
		
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

