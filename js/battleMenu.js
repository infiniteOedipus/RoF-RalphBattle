
const menuState = {
	activeCharacter: 0,
	menuSelections: [],
	cachedPositions: [],
	lockedControls: true,
	menuLoaded: [],
	lastDirection: "right"
};


function runNextCharacterUI() {
	const char = battleParticipants[menuState.activeCharacter]
	const position = menuPositions[char]
	menuState.cachedPositions[menuState.activeCharacter] = 0
	activeObjects.push(new popupUIOrigin(char, position, (ui) => {
		createPopupButtons(ui)
		menuState.lockedControls = false
	}
	))
}

function popupUIOrigin(charName, positionData, onPositioned) {
	this.type              = "menu"

	//this.character         = battleParticipants[menuState.activeCharacter]
	this.character         = charName
	this.sprite            = getSprite("souls", `soul_${this.character}`)

	this.pathX = positionData.startX
	this.pathY = positionData.startY
	this.modX  = 0
	this.modY  = 0

	this.x = this.pathX + this.modX
	this.y = this.pathY + this.modY

	this.motionScript = [
		{type: "generator", action: linearMotion(this, "pathX", "pathY", positionData.startX, positionData.startY, positionData.endX, positionData.endY, 0.8, 0, "tOverflow")},
		{type: "generator", action: sinMotion(this, "modY", 1, 10, 0, "forever", 0, null)}
	]

	this.motionState = {
		step: 0,
		currentGenerator: null
	}

	this.onPositioned = (ui) => onPositioned?.(ui)

	this.update = (dt) => {
		if (!this.motionState.currentGenerator) {
			this.motionState.currentGenerator = this.motionScript[this.motionState.step]?.action
		}

		if (this.motionState.currentGenerator) {
			const { done } = this.motionState.currentGenerator.next(dt)
			if (done) {
				if (this.motionState.step === 0) {
					this.onPositioned(this)
				}
				this.motionState.step++
				this.motionState.currentGenerator = null
			}
		}

		this.x = this.pathX + this.modX
		this.y = this.pathY + this.modY
	} 
}


function createPopupButtons(popupUI) {
	const buttonMax = battleMenuValues.length
	const characterIdx = menuState.activeCharacter

	const originX = popupUI.pathX
	const originY = popupUI.pathY

	for (let i = 0; i < buttonMax; i++) {
		activeObjects.push(new popupBattleButton(i, buttonMax, originX, originY, characterIdx))
		
	}
}

function popupBattleButton(i, buttonMax, originX, originY, characterIdx){
	this.type = "menu"

	this.character         = battleParticipants[menuState.activeCharacter]
	this.characterIdx      = characterIdx
	this.sprite            = getSprite("souls", `soul_${this.character}`)
	this.positionIndex     = i

	this.deltaAngle = 2 * Math.PI / buttonMax       //Generic Angular Diferential between buttons. Should be equal across all buttons
	this.modAngle = i * this.deltaAngle 	        //Spaces the buttons based on their position index
	this.baseAngle = -Math.PI                       //The angle of the button at index 0. Should be equal across all buttons. Any animation should be performed on this.
	this.realAngle = this.modAngle + this.baseAngle //final calculated angle of the button. Sum of Angle of Button0 and the deltaAngle*index. Only should be touched by final calculations in update function.

	this.radius = 0

	this.y = originY - Math.cos(this.realAngle) * this.radius / 3
	this.x = originX + Math.sin(this.realAngle) * this.radius

	this.scale = Math.cos(this.realAngle) * 0.1 + 0.9
	this.scalex = 2
	this.scaley = 2
	this.opacity = 0

	this.openSpin = function* () {
		let t = 0;
		const duration = 1
		while (t < duration) {
			const progress = t / duration
			this.radius = 60 * progress;
			this.baseAngle = -Math.PI + Math.PI * progress
			this.opacity = Math.min(progress / 0.8, 1)
			t += yield;
		}
		this.radius = 60
		this.baseAngle = 0
		this.opacity = 1
	}

	this.turnTo = function* (targetAngle) {
		console.log("turning function subroutine started")
		const duration = 0.125
		let t = 0
		let start = this.baseAngle
		let dir = (targetAngle - start) / Math.abs(targetAngle - start)
		let delta = dir * ((Math.abs(targetAngle - start) - 0.0001) % (this.deltaAngle)) + 0.0001;
		console.log("baseAngle:",this.baseAngle, "targetAngle:", targetAngle)
		while (t < duration) {
			const p = t / duration;
			this.baseAngle = start + delta * p;
			t += yield;
		}
		console.log("turning function subroutine ended")
		this.baseAngle = targetAngle;
		console.log(this.baseAngle)
	}

	this.closeSpin = function* () {
		let t = 0;
		const duration = 1

		let startingAngle = this.baseAngle
		while (t < duration) {
			const progress = t / duration
			this.radius = 60 - 60 * progress;
			this.baseAngle = startingAngle + Math.PI * progress
			this.opacity = Math.min(progress / 0.8, 1)
			t += yield;
		}
		this.radius = 0
		this.baseAngle = startingAngle + Math.PI
		this.opacity = 0
	}

	this.enqueueRotation = (targetAngle) => {
		console.log("enqueue targetAngle:", targetAngle)
		this.motionScript.push({type: "turnTo", action: this.turnTo(targetAngle)})
	}

	this.motionScript = [
		{type: "openingSpin", action: this.openSpin()}
	]

	this.motionState = {
		step: 0,
		currentGenerator: null
	}

	this.update = (dt) => {
		if (!this.motionState.currentGenerator && this.motionScript[this.motionState.step]) {
			this.motionState.currentGenerator = this.motionScript[this.motionState.step]?.action
		}

		if (this.motionState.currentGenerator) {
			const { done } = this.motionState.currentGenerator.next(dt)
			if (done) {
				if (this.motionState.step === 0) {
					menuState.lockedControls = false
				}

				this.motionState.step++
				this.motionState.currentGenerator = null
				console.log(this.motionState.step)
			}
		}

		this.realAngle = this.modAngle + this.baseAngle
		this.y = originY - Math.cos(this.realAngle) * this.radius / 3
		this.x = originX + Math.sin(this.realAngle) * this.radius
		this.scale = (Math.cos(this.realAngle + Math.PI) * 0.2 + 0.8) * 2
		this.scalex = this.scale
		this.scaley = this.scale
	}
}

function handleMenuInput() {
	const idx = menuState.activeCharacter
	let menuPosition = menuState.cachedPositions[idx];

	if (menuState.lockedControls === true) return

		/*Input left*/

	if (input.left() && !keyHeld.left) {
		keyHeld.left = true
		menuState.lastDirection = "left"
		menuState.cachedPositions[idx] = (menuPosition + 3) % 4

		const newAngle = (2 * Math.PI / battleMenuValues.length) * menuState.cachedPositions[idx];
		console.log("menuValues length:", battleMenuValues.length, "menuState cache index:", menuState.cachedPositions[idx])
		activeObjects.forEach(obj => {
			if (obj.type === "menu" && obj.characterIdx === idx) {
				console.log("TargetAngle Source:", newAngle)
				obj.enqueueRotation(newAngle);
			}
		});
	}
	if (!input.left()) keyHeld.left = false

		/*Input Right*/

	if (input.right() && !keyHeld.right) {
		keyHeld.right = true
		menuState.lastDirection = "right"
		menuState.cachedPositions[idx]  = (menuPosition + 1) % 4

		const newAngle = (2 * Math.PI / battleMenuValues.length) * menuState.cachedPositions[idx];

		activeObjects.forEach(obj => {
			if (obj.type === "menu" && obj.characterIdx === idx) {
				obj.enqueueRotation(newAngle);
			}
		});
	}
	if (!input.right()) keyHeld.right = false

		/*Input Confirm, Save Selection and progress Active Character. Change Game State if Last Active Character accounted for*/

	if (input.confirm() && !keyHeld.confirm) {
		keyHeld.confirm = true
		menuState.lockedControls = true

		//Add code to save menu Selection later

		menuState.activeCharacter++
		if (menuState.activeCharacter < battleParticipants.length){
			runNextCharacterUI()
		} else {
			changeGameState(gameState.Attack)
		}
	}
	if (!input.confirm()) keyHeld.confirm = false

		/*Input Cancel*/

	if (input.cancel() && !keyHeld.cancel) {
		keyHeld.cancel = true
		menuState.lockedControls = true
		if (menuState.activeCharacter > 0) menuState.activeCharacter -= 1
	}
	if (!input.cancel()) keyHeld.cancel = false
}