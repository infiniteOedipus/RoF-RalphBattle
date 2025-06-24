//game loop
let lastTime = performance.now();
function gameLoop(currentTime = performance.now()) {

  const dt = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  update(dt);
  render(dt);

  requestAnimationFrame(gameLoop);
}
