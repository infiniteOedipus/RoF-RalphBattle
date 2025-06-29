const gameWindow = document.getElementById("gameWindow");
const game = gameWindow.getContext("2d");

game.imageSmoothingEnabled       = false;
game.webkitImageSmoothingEnabled = false;
game.mozImageSmoothingEnabled    = false;
game.msImageSmoothingEnabled     = false;

//Game Specific variables to be adjusted each game, update for each project
const battleParticipants = ["zeaque"];

//Button Inputs
const keys = {};
let keyHeld = false;

window.addEventListener("keydown", e => {
        keys[e.key] = true;
});

window.addEventListener("keyup", e => {
        keys[e.key] = false;
});
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