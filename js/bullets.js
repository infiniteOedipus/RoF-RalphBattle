//bullet effects

//function bullet_fadeout(bullet, condition, dt){
//	if (condition) bullet.opacity -= dt * 4
//	if (bullet.opacity <= 0) bullet.setForRemoval = true
//	return bullet
//}
const bulletFX = {
	bullet_fadeout(condition, dt){
		if (condition) this.opacity -= dt * 4
		if (this.opacity <= 0) this.setForRemoval = true
		return this
	}
}
//bullets

function bul_ralph_brick(direction, speed, initx, inity) {
	this.type = "bullet"
	Object.assign(this, bulletFX)

	this.fading = false 	                    //default method of bullet ending
	this.endBullet = () => {this.fading = true} //mass triggers on end of combat step
	

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
		//change positioning
		this.x += this.dx * dt
		this.y += this.dy * dt
		this.dy += 210*dt
		this.dx /= 1.03

		//control other properties
		if(interval(this.bulTimer, dt, 0.4)) this.scalex *= -1

		//end bullet
		if (this.y > 300) this.fading = true
		this.bullet_fadeout(this.fading, dt)

		//increment bullet lifetime counter
		this.bulTimer += dt
	}
}
