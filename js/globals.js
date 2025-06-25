const gameWindow = document.getElementById("gameWindow");
const game = gameWindow.getContext("2d");

//Button Inputs
const keys = {};

window.addEventListener("keydown", e => {
        keys[e.key] = true;
});

window.addEventListener("keyup", e => {
        keys[e.key] = false;
});
//Initialize
function initialize() {
	console.log("gameLoop initializing")
	changeGameState(gameState.Attack)
	requestAnimationFrame(gameLoop)
}
