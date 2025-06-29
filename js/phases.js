//Initiating Game States
let currentGameState = null;
let combatRound = 0;
let rndTimer = null;
let menuSelect = null;
let menuSelections = []
let activeObjects = []

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
	},

    end() {
		// Clean up if needed, step combat round, and change state back to Menu
		combatRound++
		changeGameState(gameState.Menu)
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
		changeGameState(gameState.Attack)
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
	console.log("Creating Battle ui")
	let n = 0
	battleParticipants.forEach(character => {
		let body = new battle_ui_body(character, n++)
		activeObjects.push(body)
		activeObjects.push(new battle_ui_button(body, 0))
		activeObjects.push(new battle_ui_button(body, 1))
		activeObjects.push(new battle_ui_button(body, 2))
		activeObjects.push(new battle_ui_button(body, 3))
	});
}

function battle_ui_body(character, n) {
	console.log("Creating Battle ui body for", character)
	this.character = character
	this.slotOrder = n
	this.uiBody = [getSprite(`ui`, `ui_body_${character}_0`), getSprite("ui", `ui_body_${character}_1`)]
	this.isSelected = false
	this.buttonSelected = 0

	this.sprite = this.uiBody[this.isSelected ? 1 : 0]
	this.origin = "bottomLeft"
	this.x = n * this.sprite.width
	this.y = gameWindow.height + this.sprite.height
	this.update = (dt) => {
		if (this.y > gameWindow.height) this.y -= dt * 60
		if (this.y < gameWindow.height) this.y = gameWindow.height

		if (menuSelect == this.slotOrder) this.isSelected = true
		if (menuSelect != this.slotOrder) this.isSelected = false

		this.sprite = this.uiBody[this.isSelected ? 1 : 0]
	}
}

function battle_ui_button(body, n) {
	console.log("Creating button", n, "for", body.character)
	this.character = body.character
	this.slotOrder = n
	this.uiButton = [getSprite(`ui`, `ui_button_${this.character}_0`), getSprite("ui", `ui_button_${this.character}_1`)]
	this.isSelected = false
	this.buttonSelected = 0

	this.sprite = this.uiButton[this.isSelected ? 1 : 0]
	this.origin = "bottomLeft"
	this.x = n * this.sprite.width + body.x
	this.y = body.y
	this.update = (dt) => {
		this.y = body.y

		if (body.buttonSelected == this.slotOrder) this.isSelected = true
		if (body.buttonSelected != this.slotOrder) this.isSelected = false

		this.sprite = this.uiButton[this.isSelected ? 1 : 0]
	}
}