
const menuState = {
	activeCharacter: 0,
	menuSelections: [],
	cachedPositions: [],
	lockedControls: {lock: true, delay: 0},
	menuLoaded: [],
	lastDirection: "right",
	activeSubmenu: false,
	subMenuPosition: []
};


function runNextCharacterUI() {
	const idx = menuState.activeCharacter
	const char = battleParticipants[idx]
	const position = menuPositions[char]

	menuState.cachedPositions[idx] ??= 0 //if no cache, set to zero
	activeObjects.push(new popupUIOrigin(char, idx, position, (ui) => {
		createPopupButtons(ui)
		menuState.menuLoaded[idx] = true
		//menuState.lockedControls.lock = false
	}
	))
}

function popupUIOrigin(charName, idx, positionData, onPositioned) {
	this.type              = "menu"
	this.subtype           = "menu_origin"

	this.characterIdx      = idx
	this.character         = charName
	this.sprite            = getSprite("souls", `soul_${this.character}`)

	this.pathX = !menuState.menuLoaded[idx] ? positionData.startX : positionData.endX
	this.pathY = !menuState.menuLoaded[idx] ? positionData.startY : positionData.endY
	this.modX  = 0
	this.modY  = 0

	this.x = this.pathX + this.modX
	this.y = this.pathY + this.modY
	this.opacity = 0
	this.setForRemoval = false

	this.fadeout = function* () {
		const duration = 0.7
		let t = 0;
		while (t < duration) {
			const progress = t / duration
			this.opacity = 1 - progress
			t += yield;
		}
		this.opacity = 0
		this.setForRemoval = true
	}

		this.fadein = function* () {
		const duration = 0.7
		let t = 0;
		while (t < duration) {
			const progress = t / duration
			this.opacity = progress
			t += yield;
		}
		this.opacity = 1
	}

	this.enqueueFadeout = () => {
		this.motionState.currentGenerators.push(this.fadeout())
	}

	this.enqueueSlideIn = () => {
		this.motionScript.push({step: 0, type: "generator", action: linearMotion(this, "pathX", "pathY", positionData.startX, positionData.startY, positionData.endX, positionData.endY, 0.8, 0, "tOverflow")})
	}

	this.motionScript = [
		{step: 0, type: "fadein", action: this.fadein()},
		{step: 1, type: "generator", action: sinMotion(this, "modY", 3, 6, 0, "forever", 0, null)}
	]

	this.motionState = {
		step:  0,
		currentGenerators: []
	}

	this.onPositioned = (ui) => onPositioned?.(ui)

	if (!menuState.menuLoaded[idx]) this.enqueueSlideIn()
	if (menuState.menuLoaded[idx]) this.onPositioned(this)

	this.update = (dt) => {

		if (this.motionState.currentGenerators.length === 0 && this.motionScript.some((script) => script.step === this.motionState.step)) { //if no active scripts running and there is at least 1 script that can be run during the current step
			this.motionState.currentGenerators = this.motionScript.filter((script) => script.step === this.motionState.step).map((script) => script.action) //add the action of each generator that matches the current step to the current generators
		} 

		this.motionState.currentGenerators = this.motionState.currentGenerators.filter(gen => {
			const {done} = gen.next(dt)
			return !done
		})

		if (this.motionState.currentGenerators.length === 0 && this.motionState.step === 0) {
		 	if (!menuState.menuLoaded[idx]) this.onPositioned(this)//Once Menu Origin finishes its first animation, triggers a function to create the buttons
			this.motionState.step++
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
	this.subtype = "menu_button"

	this.character         = battleParticipants[characterIdx]
	this.characterIdx      = characterIdx
	this.sprite            = getSprite("ui", `ui_button_${this.character}_${i}`)
	this.positionIndex     = i

	this.deltaAngle = 2 * Math.PI / buttonMax       //Generic Angular Diferential between buttons. Should be equal across all buttons
	this.modAngle = -i * this.deltaAngle + Math.PI  //Spaces the buttons based on their position index
	this.baseAngle = -Math.PI                       //The angle of the button at index 0. Should be equal across all buttons. Any animation should be performed on this.
	this.realAngle = this.modAngle + this.baseAngle //final calculated angle of the button. Sum of Angle of Button0 and the deltaAngle*index. Only should be touched by final calculations in update function.

	this.radius = 0

	this.y = originY - Math.cos(this.realAngle) * this.radius / 3
	this.x = originX + Math.sin(this.realAngle) * this.radius

	this.scale = Math.cos(this.realAngle) * 0.1 + 0.9
	this.scalex = 1
	this.scaley = 1
	this.opacity = 0

	this.openSpin = function* () {
		const duration = 0.3
		let t = 0;
		let start = (2 * Math.PI / battleMenuValues.length) * menuState.cachedPositions[menuState.activeCharacter] - Math.PI
		let end = (2 * Math.PI / battleMenuValues.length) * menuState.cachedPositions[menuState.activeCharacter]
		let delta = end - start
		while (t < duration) {
			const progress = t / duration
			this.radius = 60 * progress;
			this.baseAngle = start + delta * progress
			this.opacity = Math.min(progress / 0.8, 1)
			t += yield;
		}
		this.radius = 60
		this.baseAngle = end
		this.opacity = 1
	}

	this.turnTo = function* (targetAngle, direction) {
		const duration = 0.125
		let t = 0
		let start = this.baseAngle ?? 0
		let end = targetAngle
		if (start > end && direction === "right") end += 2 * Math.PI
		if (start < end && direction === "left") start += 2 * Math.PI
		let delta = end - start

		while (t < duration) {
			const progress = t / duration;
			this.baseAngle = start + delta * progress;
			t += yield;
		}
		this.baseAngle = targetAngle;
	}

	this.closeSpin = function* () {
		let t = 0;
		const duration = 0.3

		let startingAngle = this.baseAngle
		while (t < duration) {
			const progress = t / duration
			this.radius = 60 - 60 * progress;
			this.baseAngle = startingAngle + Math.PI * progress
			this.opacity = 1 - progress
			t += yield;
		}
		this.radius = 0
		this.baseAngle = startingAngle + Math.PI
		this.opacity = 0
		this.setForRemoval = true
	}

	this.enqueueRotation = (targetAngle, direction) => {
		this.motionScript.push({type: "turnTo", action: this.turnTo(targetAngle, direction)})
	}

	this.enqueueSpinout = () => {
		this.motionScript.push({type: "closingSpin", action: this.closeSpin()})
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
					menuState.lockedControls.lock = false
				}

				this.motionState.step++
				this.motionState.currentGenerator = null
			}
		}

		this.realAngle = this.modAngle + this.baseAngle
		this.y = originY - Math.cos(this.realAngle) * this.radius / 3
		this.x = originX + Math.sin(this.realAngle) * this.radius
		this.scale = (Math.cos(this.realAngle + Math.PI) * 0.2 + 0.8) * 1
		this.scalex = this.scale
		this.scaley = this.scale
	}
}

//Beginning of New Code

function handleMenuInput() {
	if (menuState.lockedControls.lock === true) return;

	if (input.left() && !keyHeld.left) return handleLeftInput()
		if (!input.left()) keyHeld.left = false

	if (input.right() && !keyHeld.right) return handleRightInput()
		if (!input.right()) keyHeld.right = false

	if (input.confirm() && !keyHeld.confirm) return handleConfirmInput()
		if (!input.confirm()) keyHeld.confirm = false

	if (input.cancel() && !keyHeld.cancel) return handleCancelInput()
		if (!input.cancel()) keyHeld.cancel = false

	if (input.debug() && !keyHeld.debug) return handleDebugInput()
		if (!input.debug()) keyHeld.debug = false
}

function handleLeftInput(){
	const idx = menuState.activeCharacter
	let menuPosition = menuState.cachedPositions[idx]
	keyHeld.left = true
	menuState.lastDirection = "left"
	menuState.cachedPositions[idx] = (menuPosition + 3) % 4
	const newAngle = (2 * Math.PI / battleMenuValues.length) * menuState.cachedPositions[idx]
	const direction = menuState.lastDirection
	activeObjects.forEach(obj => {
		if (obj.subtype === "menu_button" && obj.characterIdx === idx) {
			obj.enqueueRotation(newAngle, direction)
		}
	});
}

function handleRightInput(){
	const idx = menuState.activeCharacter
	let menuPosition = menuState.cachedPositions[idx]
	keyHeld.right = true
	menuState.lastDirection = "right"
	menuState.cachedPositions[idx]  = (menuPosition + 1) % 4
	const newAngle = (2 * Math.PI / battleMenuValues.length) * menuState.cachedPositions[idx]
	const direction = menuState.lastDirection
	activeObjects.forEach(obj => {
		if (obj.subtype === "menu_button" && obj.characterIdx === idx) {
			obj.enqueueRotation(newAngle, direction)
		}
	});
}

function handleConfirmInput(){
	const idx = menuState.activeCharacter
	let menuPosition = menuState.cachedPositions[idx]
	keyHeld.confirm = true
	menuState.lockedControls.lock = true
	proccessMenuButton(idx, menuPosition)
}

function handleCancelInput(){
	const idx = menuState.activeCharacter
	let menuPosition = menuState.cachedPositions[idx]
	keyHeld.cancel = true
	if (menuState.activeCharacter > 0) {
		menuState.lockedControls.lock = true
		activeObjects.forEach(obj => {
			if (obj.subtype === "menu_button" && obj.characterIdx === idx) {
				obj.enqueueSpinout()
			}
			if (obj.subtype === "menu_origin" && obj.characterIdx === idx) {
				obj.enqueueFadeout()
			}
		})
		menuState.activeCharacter -= 1
		runNextCharacterUI()
	}
}

function handleDebugInput(){
	keyHeld.debug = true
	console.log("Active Character:", menuState.activeCharacter, battleParticipants[menuState.activeCharacter])
	console.log("Currently Selected Button:", menuState.cachedPositions[menuState.activeCharacter], battleMenuValues[menuState.cachedPositions[menuState.activeCharacter]].label)
}

function proccessMenuButton(idx, menuPosition) {
	if(!battleMenuValues[menuPosition].submenu) {
		endMainMenu(idx, menuPosition)
	}
	if(battleMenuValues[menuPosition].submenu) {
		menuState.activeSubmenu = true
		menuState.subMenuPosition = [0,0]
		createSubMenu()
	}
}

function endMainMenu(idx, menuPosition) {
	activeObjects.forEach(obj => {
		if (obj.subtype === "menu_button" && obj.characterIdx === idx) {
			obj.enqueueSpinout()
		}
		if (obj.subtype === "menu_origin" && obj.characterIdx === idx) {
				obj.enqueueFadeout()
		}
	});
	menuState.activeCharacter++
	if (menuState.activeCharacter < battleParticipants.length){
		runNextCharacterUI()
	} else {
		changeGameState(gameState.Attack)
	}
}

function createSubMenu() {
	//I hate everything
	//create submenu body
	//create buttons for each selection in submenu
	//log legal submenu positions.
}