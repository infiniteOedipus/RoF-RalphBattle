//Initiating Game States
let activeObjects = []

let currentGameState = null;
let combatRound = 0;
let rndTimer = null;

const menuState = {
	activeCharacter: 0,
	menuSelections: [],
	cachedPositions: [],
	lockedControls: true,
	menuLoaded: [],
	lastDirection: "right"
};

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
		activeObjects.push(new popupBattleUI(
			createPopupButtons
		))
	},

	update(dt) {
		//menu controls (transition animations are a part of the individual menu objects)
		//handleMenuInput()
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


function popupBattleUI(onPositioned) {
	this.type              = "menu"

	this.character         = battleParticipants[menuState.activeCharacter]
	this.sprite            = getSprite("souls", `soul_${this.character}`)

	this.pathX = 50
	this.pathY = 400
	this.modX  = 0
	this.modY  = 0

	this.x = this.pathX + this.modX
	this.y = this.pathY + this.modY

	this.motionScript = [
		{type: "generator", action: linearMotion(this, "pathX", "pathY", this.x, this.y, 75, 250, 1.6, 0, "tOverflow")},
		{type: "generator", action: sinMotion(this, "modY", 1, 10, 0, "forever", 0, null)}
	]

	this.motionState = {
		step: 0,
		currentGenerator: null
	}

	this.onPositioned = onPositioned ?? (() => {}) //when positioned, run the function passed through the popupBattleUI function. Also blank function to protect from errors

	this.update = (dt) => {
		if (!this.motionState.currentGenerator) {
			this.motionState.currentGenerator = this.motionScript[this.motionState.step]?.action
		}

		if (this.motionState.currentGenerator) {
			const { done } = this.motionState.currentGenerator.next(dt)
			if (done) {
				if (this.motionState.step === 0) {
					this.onPositioned()
				}
				this.motionState.step++
				this.motionState.currentGenerator = null
			}
		}

		this.x = this.pathX + this.modX
		this.y = this.pathY + this.modY
	} 
}


function createPopupButtons() {
	const buttonMax = battleMenuValues.length
	for (let i = 0; i < buttonMax; i++) {
		activeObjects.push(new popupBattleButton(i, buttonMax, originX, originY))
		
	}
}

function popupBattleButton(i, buttonMax, originX, originY){
	this.type = "menu"

	this.character         = battleParticipants[menuState.activeCharacter]
	this.sprite            = getSprite("souls", `soul_${this.character}`)
	this.positionIndex     = i

	this.deltaAngle = 2 * Math.PI / buttonMax //The Angular Diferential between buttons
	this.modAngle = i * this.deltaAngle
	this.baseAngle = -Math.PI
	this.realAngle = this.modAngle + this.baseAngle

	this.radius = 0

	this.y = originY - Math.cos(this.realAngle) * this.radius / 3
	this.x = originX + Math.sin(this.realAngle) * this.radius

	this.scale = Math.cos(this.realAngle) * 0.1 + 0.9
	this.opacity = 0

	this.motionScript = [
		{type: "openingSpin", action: this.openSpin()},
		{type: "activeUpdate", action:this.controlsUpdate(condition) }, 
		{type: "closingSpin", action: this.closeSpin()}
	]

	this.motionState = {
		step: 0,
		currentGenerator: null
	}

	this.openSpin = function* () {
		let t = 0;
		const duration = 1
		while (t < duration) {
			const progress = t / duration
			this.radius = 30 * progress;
			this.baseAngle = -Math.PI + Math.PI * progress
			this.opacity = Math.min(progress / 0.8, 1)
			t += yield;
		}
		this.radius = 30
		this.baseAngle = 0
		this.opacity = 1
	}
	this.controlsUpdate = function* (condition) {
		let dt = 0 
		while (!condition) {
			const destinationAngle = (2 * Math.PI / battleMenuValues.length) * menuState.cachedPositions[menuState.activeCharacter]
			if (menuState.lastDirection === "right") {
				//struggling to make this work right
			}
			dt = yield
		}
	}
	this.closeSpin = function* () {
		let t = 0;
		const duration = 1

		let startingAngle = this.baseAngle
		while (t < duration) {
			const progress = t / duration
			this.radius = 30 - 30 * progress;
			this.baseAngle = startingAngle + Math.PI * progress
			this.opacity = Math.min(progress / 0.8, 1)
			t += yield;
		}
		this.radius = 0
		this.baseAngle = startingAngle + Math.PI
		this.opacity = 0
	}

	this.update = (dt) => {
		if (!this.motionState.currentGenerator) {
			this.motionState.currentGenerator = this.motionScript[this.motionState.step]?.action
		}

		if (this.motionState.currentGenerator) {
			const { done } = this.motionState.currentGenerator.next(dt)
			if (done) {
				if (this.motionState.step === 0) {
					menuState.lockedControls = false
				}
				if (this.motionState.step === 2) {
					menuState.lockedControls = true
				}
				this.motionState.step++
				this.motionState.currentGenerator = null
			}
		}

		this.realAngle = this.modAngle + this.baseAngle
		this.y = originY - Math.cos(this.realAngle) * this.radius / 3
		this.x = originX + Math.sin(this.realAngle) * this.radius
		this.scale = Math.cos(this.realAngle) * 0.1 + 0.9
	}
}

function handleMenuInput() {
	let menuPosition = menuState.cachedPositions[activeCharacter];
	if (menuState.lockedControls === true) return

	if (input.left() && !keyHeld.left) {
		keyHeld.left = true
		menuState.lastDirection = "left"
		menuPosition = (menuPosition + 3) % 4
	}
	if (!input.left()) keyHeld.left = false

	if (input.right() && !keyHeld.right) {
		keyHeld.right = true
		menuState.lastDirection = "right"
		menuPosition  = (menuPosition + 1) % 4
	}
	if (!input.right()) keyHeld.right = false

	if (input.confirm() && !keyHeld.confirm) {
		keyHeld.confirm = true
		menuState.lockedControls = true

		if (menuState.activeCharacter > (battleParticipants.length - 1)) changeGameState(gameState.Attack)
	}
	if (!input.confirm()) keyHeld.confirm = false

	if (input.cancel() && !keyHeld.cancel) {
		keyHeld.cancel = true
		menuState.lockedControls = true
		if (menuSelect > 0) menuSelect -= 1
	}
	if (!input.cancel()) keyHeld.cancel = false
}