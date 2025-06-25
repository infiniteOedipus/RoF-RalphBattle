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
	changeGameState(gameState.Attack)
	requestAnimationFrame(gameLoop)
}

//Update
function update(deltaTime) {
	activeObjects.forEach(obj => obj.update?.(deltaTime));
}
	
//Render
function render(dt) {
	game.fillStyle = "#000"; // black
	game.fillRect(0, 0, gameWindow.width, gameWindow.height);		
	activeObjects
                .slice()
                .sort((a, b) => a.z - b.z)
	        .forEach((obj) => {
		        game.save()
		        game.translate(obj.x, obj.y)
			game.rotate(obj.angle || 0)
                        game.scale(obj.scalex ?? 1, obj.scaley ?? 1)
                        //for (const fx of obj.effects ?? []) {
                        //        applyVisualEffect(fx, obj, dt);
                        //}
                        game.drawImage(obj.sprite, -obj.width / 2, -obj.height / 2, obj.width, obj.height)
                        game.restore()
                })
}

//game loop
let lastTime = performance.now();

function gameLoop(currentTime = performance.now()) {
        const dt = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        update(dt);
        render(dt);
        requestAnimationFrame(gameLoop);
}
