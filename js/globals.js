const gameWindow = document.getElementById("gameWindow");
const game = gameWindow.getContext("2d");

game.imageSmoothingEnabled       = false;
game.webkitImageSmoothingEnabled = false;
game.mozImageSmoothingEnabled    = false;
game.msImageSmoothingEnabled     = false;

//Game Specific variables to be adjusted each game, update for each project
const battleParticipants = ["zeaque", "markor", "phenix"];

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