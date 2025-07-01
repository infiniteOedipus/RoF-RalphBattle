

//Update
function update(dt) {
	activeObjects.forEach(obj => obj.update?.(dt));
	currentGameState?.update?.(dt);
	activeObjects = activeObjects.filter(obj => !obj.setForRemoval)
}
	
//Render
function render(dt) {
	game.fillStyle = "#000"; // black
	game.fillRect(0, 0, gameWindow.width, gameWindow.height);
        renderBG(dt);
	activeObjects
                .slice()
                .sort((a, b) => a.z - b.z)
	        .forEach((obj) => {
		        game.save()
		        game.translate(Math.floor(obj.x) ?? 0, Math.floor(obj.y) ?? 0)
			game.rotate(obj.angle ?? 0)
                        game.scale(obj.scalex ?? 1, obj.scaley ?? 1)
			game.globalAlpha = (obj.opacity ?? 1)
                        //for (const fx of obj.effects ?? []) {
                        //        applyVisualEffect(fx, obj, dt);
                        //}
                        const drawSprite = obj.sprite ?? getSprite("ph", "PH")
                        const w = obj.width ?? drawSprite?.width ?? 32;
                        const h = obj.height ?? drawSprite?.height ?? 32;
                        drawActiveObject(drawSprite, w, h, obj.origin)
                        game.restore()
                })
}

function drawActiveObject(drawSprite, w, h, origin) {
        switch(origin ?? "center") {
                case "center": game.drawImage(drawSprite, -w / 2, -h / 2, w, h)
                        break
                case "bottomLeft": game.drawImage(drawSprite, 0, -h, w, h)
                        break
                case "topLeft": game.drawImage(drawSprite, 0, 0, w, h)
                        break
                default: console.warn(`Unknown origin "${origin}", defaulting to center.`);
                        game.drawImage(drawSprite, -w / 2, -h / 2, w, h)
        }
}

//game loop
let lastTime = performance.now();
let fpsTime = lastTime
let frameCount = 0;
const fpsCounter = document.getElementById("fpsCounter")
function gameLoop(currentTime = performance.now()) {
        const dt = (currentTime - lastTime) / 1000;
//        if(dt > (1/30)) dt = (1/30)
        lastTime = currentTime;
        update(dt);
        render(dt);

  frameCount++;
  if (currentTime - fpsTime >= 1000) {
    fpsCounter.innerHTML = `FPS: ${frameCount}`
    frameCount = 0;
    fpsTime = currentTime;
  }

        requestAnimationFrame(gameLoop);
}
