
//getSprite("bg", "bg_floor")
//getSprite("bg", "bg_wall_scroll")
//getSprite("bg", "bg_floor_glow_FX")

let bgScroll = null
let bgGlow = null
onInit(() => {
    bgScroll = {
        xPos   : 0,
        get sprite() {return getSprite("bg", "bg_wall_scroll")}
    }
    bgGlow = {
        loop   : 0,
        get sprite() {return getSprite("bg", "bg_floor_glow_FX")}
    }
})

function renderBG(dt) {
    renderScroll(bgScroll, dt)
    game.drawImage(getSprite("bg", "bg_floor"), 0, 0)
    //renderGlow(getSprite("bg", "bg_floor_glow_FX"), dt)
}

function renderScroll(bg, dt){
    for(let x = 0; x < gameWindow.width; x++) {
        const y = -Math.sqrt(350 ** 2 - (x - 325) ** 2) / 3.2;
        const srcX = (x+Math.floor(bg.xPos)) % bg.sprite.width
        game.drawImage(bg.sprite, 
            srcX, 0, 1, bg.sprite.height,    //source x, y, width, height
            x, y, 1, bg.sprite.height);                                          //destinition x, y, width, height
    }
    bg.xPos = (bg.xPos + dt * 50) % bg.sprite.width
}

function renderGlow(){

}