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
		createBattleUI()
		menuSelect = 0;
		menuSelections = []
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
				if (input.up()) dy -= 1;
				if (input.down()) dy += 1;
				if (input.left()) dx -= 1;
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

function createBattleUI() {
	console.log("Creating Battle ui")
	let n = 0
	battleParticipants.forEach(character => {
		let body = new battle_ui_body(character, n++)
		activeObjects.push(body)
		let buttons = [new battle_ui_button(body, 0), 
			new battle_ui_button(body, 1), 
			new battle_ui_button(body, 2), 
			new battle_ui_button(body, 3)
		]
		buttons.forEach(button => {
			activeObjects.push(button)
		})
	});
}

function battle_ui_body(character, n) {
	console.log("Creating Battle ui body for", character)
	this.type = "menu"

	this.character = character
	this.slotOrder = n
	this.uiBody = [getSprite(`ui`, `ui_body_${character}_0`), getSprite("ui", `ui_body_${character}_1`)]
	this.isSelected = false
	this.buttonSelectedCache = 0      //The cached position of last button selected.
	this.buttonSelectedDisplay = null //the highlighted button. Is set to null when not positioned in the menu of Active Character. May change this later if I want to add a special highlight to show previous choices.

	this.sprite = this.uiBody[this.isSelected ? 1 : 0]
	this.origin = "bottomLeft"
	this.x = n * this.sprite.width
	this.y = gameWindow.height + this.sprite.height
	this.update = (dt) => {
		if (this.y > gameWindow.height) this.y -= dt * 120
		if (this.y < gameWindow.height) this.y = gameWindow.height

		if (menuSelect == this.slotOrder) {
			this.isSelected = true
			this.buttonSelectedDisplay = this.buttonSelectedCache
		}
		if (menuSelect != this.slotOrder) {
			this.isSelected = false
			this.buttonSelectedDisplay = null
		}
		this.sprite = this.uiBody[this.isSelected ? 1 : 0]
	}
}

function battle_ui_button(body, n) {
	this.type = "menu"

	console.log("Creating button", n, "for", body.character)
	this.character = body.character
	this.characterSlot = body.slotOrder
	this.buttonOrder = n
	this.uiButton = [getSprite(`ui`, `ui_button_${this.character}_0`), getSprite("ui", `ui_button_${this.character}_1`)]
	this.isSelected = false
	//this.buttonSelected = 0

	this.sprite = this.uiButton[this.isSelected ? 1 : 0]
	this.origin = "bottomLeft"
	this.x = n * this.sprite.width + body.x
	this.y = body.y
	this.update = (dt) => {
		this.y = body.y
		this.isSelected = body.buttonSelectedCache == this.buttonOrder
		this.sprite = this.uiButton[body.buttonSelectedDisplay == this.buttonOrder ? 1 : 0]

	}
}

function handleMenuInput() {
	let activeChar = activeObjects.find(Char => Char.slotOrder === menuSelect);

	if (input.left() && !keyHeld.left) {
		keyHeld.left = true
		activeChar.buttonSelectedCache = (activeChar.buttonSelectedCache + 3) % 4
	}
	if (!input.left()) keyHeld.left = false

	if (input.right() && !keyHeld.right) {
		keyHeld.right = true
		activeChar.buttonSelectedCache = (activeChar.buttonSelectedCache + 1) % 4
	}
	if (!input.right()) keyHeld.right = false

	if (input.confirm() && !keyHeld.confirm) {
		keyHeld.confirm = true
		let optionSelect = activeObjects.find(button => button.buttonOrder === activeChar.buttonSelectedCache);
		menuSelections[menuSelect] = optionSelect
		menuSelect++
		if (menuSelect > (battleParticipants.length - 1)) changeGameState(gameState.Attack)
	}
	if (!input.confirm()) keyHeld.confirm = false

	if (input.cancel() && !keyHeld.cancel) {
		keyHeld.cancel = true
		if (menuSelect > 0) menuSelect -= 1
	}
	if (!input.cancel()) keyHeld.cancel = false
}

function menuCleanup() {

}