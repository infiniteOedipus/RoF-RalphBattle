const gameWindow = document.getElementById("gameWindow");
const game = gameWindow.getContext("2d");

game.imageSmoothingEnabled       = false;
game.webkitImageSmoothingEnabled = false;
game.mozImageSmoothingEnabled    = false;
game.msImageSmoothingEnabled     = false;

//Game Specific variables to be adjusted each game, update for each project
const battleParticipants = ["zeaque", "markor", "phenix"];

const menuPositions = {
  zeaque: {
    startX: 50, startY: 400,
    endX: 100, endY: 250
  },
  markor: {
    startX: 150, startY: 400,
    endX: 200, endY: 250
  },
  phenix: {
    startX: 350, startY: 400,
    endX: 400, endY: 250
  }
};

const battleMenuValues = [
	{
		label: "Attack",
		submenu: false,
		getFlavorText: (char) => ({
			zeaque: "Zeaque readies his Buckshot",
			markor: "Markor charges his lazer",
			phenix: "Phenixs burns a way forward"
		})[char]
	},
	{
		label: "Item",
		submenu: true,
		getFlavorText: (char) => ({
			zeaque: "Zeaque reorginizes his inventory",
			markor: "Markor might have something",
			phenix: "Phenix has something burning a hole in his pocket"
		})[char],
		getOptions: 1
	},
	{
		label: "Defend",
		submenu: false,
		getFlavorText: (char) => ({
			zeaque: "Zeaque is ready to parry",
			markor: "Markor forms a mental barrier",
			phenix: "Phenix burns a way forward"
		})[char]
	},
	{
		label: "Blood",
		submenu: true,
		getFlavorText: (char) => ({
			zeaque: "Teal",
			markor: "Gold",
			phenix: "Rust"
		})[char],
		getOptions: 1
	}
]

//Button Inputs
const keys = {};
const keyHeld = {};

window.addEventListener("keydown", e => {
        keys[e.key] = true;
});

window.addEventListener("keyup", e => {
        keys[e.key] = false;
});
const input = {
	left    : () => keys["ArrowLeft"] || keys["a"] || keys["A"],
	right   : () => keys["ArrowRight"] || keys["d"] || keys["D"],
	up      : () => keys["ArrowUp"] || keys["w"] || keys["W"],
	down    : () => keys["ArrowDown"] || keys["s"] || keys["S"],
	confirm : () => keys["z"] || keys[" "] || keys["Z"],
	cancel  : () => keys["x"] || keys["Shift"] || keys["X"]
}
//Initialize
const initListeners = []

function onInit(fn) {
	initListeners.push(fn)
}

function initialize() {
	console.log("running initialize events")
	for(const fn of initListeners) {
		fn()
	}
	console.log("initializing gameState")
	changeGameState(gameState.Menu)
	//changeGameState(gameState.Attack)
	console.log("initializing gameLoop")
	requestAnimationFrame(gameLoop)
}

//generic functions
function getSprite(group, name) {
  return assets[group].find(sprite => sprite.name === name);
}

function interval(time, dt, interval, delay){
	const d = delay ?? 0
	if ( time > d ) return Math.floor((time - d + dt) / interval) > Math.floor((time - d) / interval)
	return false
}

//generic animation functions

/*function linearMotion(obj, dt, xStart, yStart, xEnd, yEnd, speedTime, travel) {
	const deltaX = xEnd - xStart
	const xDir = deltaX === 0 ? 1 : deltaX / Math.abs(deltaX)
	const deltaY = yEnd - yStart
	const yDir = deltaY === 0 ? 1 : deltaY / Math.abs(deltaY)
	let dx = null
	let dy = null
	switch(travel ?? "duration") {
		case "duration":
			dx = deltaX / speedTime
			dy = deltaY / speedTime
			break
		case "speed": 
			const dHyp = Math.sqrt(deltaX**2 + deltaY**2)
			dx = deltaX * speedTime / dHyp
			dy = deltaY * speedTime / dHyp
			break
		default: console.warn(`Unknown motion type "${travel}", defaulting to duration.`);
	}

	if ((obj.x + dx * dt) * xDir < xEnd * xDir) {obj.x += dx * dt} else {obj.x = xEnd}
	if ((obj.y + dy * dt) * yDir < yEnd * yDir) {obj.y += dy * dt} else {obj.y = yEnd}

	return obj.x === xEnd && obj.y === yEnd
}*/

function* linearMotion(obj, xProp, yProp, x1, y1, x2, y2, duration, tHanded = 0, tPassover = null, endCondition = () => false) {
	let t = tHanded ?? 0
	while (t < duration && !endCondition()){
		let progress = Math.min(t / duration, 1)
		obj[xProp] = x1 + (x2 - x1) * progress
		obj[yProp] = y1 + (y2 - y1) * progress
		t += yield;
	}
	if (t >= duration) {
		obj[xProp] = x2
		obj[yProp] = y2
	}
	if (tPassover && typeof tPassover === "string") {
			obj[tPassover] = Math.max(t - duration, 0)
	}
}

function* sinMotion(obj, prop, frequency, amplitude, phase, duration, tHanded = 0, tPassover = null, endCondition = () => false,) {
	let t = tHanded ?? 0
	const looping = duration === "forever"
	while (looping || (t < duration) && !endCondition()){
		obj[prop] = Math.sin(frequency * t + phase * frequency) * amplitude
		t += yield
	}
	if (!looping && tPassover && typeof tPassover === "string") {
			obj[tPassover] = Math.max(t - duration, 0)
	}
}
	