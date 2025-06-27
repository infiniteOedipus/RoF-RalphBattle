//bullet effects

function bullet_fadeout(bullet, condition, dt){
	if (condition) bullet.opacity -= dt * 4
	if (bullet.opacity <= 0) bullet.setForRemoval = true
}

//bullets

function bul_ralph_brick(direction, speed, initx, inity) {
	this.sprite = getSprite("bullets", "bul_ralph_brick")
	this.x = initx
	this.y = inity
	this.width = this.sprite.width * 2
	this.height = this.sprite.height * 2
	this.scalex = Math.random() < 0.5 ? -1 : 1
	this.opacity = 1
	this.setForRemoval = false
	this.dx = speed * 4 * Math.cos(direction)
	this.dy = speed * Math.sin(direction)
	this.bulTimer = 0 + Math.random()*0.2
	this.update = (dt) => {
		this.x += this.dx * dt
		this.y += this.dy * dt
		this.dy += 210*dt
		this.dx /= 1.03
		if(interval(this.bulTimer, dt, 0.4)){
			this.scalex *= -1
		}
		bullet_fadeout(this, this.y > 300, dt)
		this.bulTimer += dt
	}
}

//mainly just doing this to test if Github is working
//test 2