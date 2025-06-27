function bulletmap0(dt) {
	if(interval(rndTimer, dt, 1.3)) { //every 1.3 seconds
		const pickx = Math.random() * 300 + 175
		const picky = Math.random() * 50 + 50
		for(let i = 0; i < 3; i++){
			activeObjects.push(new bul_ralph_brick(
				( Math.random() * 2 * Math.PI / 4 ) + ( 5 * Math.PI / 4 ), 	//direction
				120, 								//speed
				pickx, 								//initx
				picky								//inity
			))
		}
	}
	if(interval(rndTimer, dt, 1.3, 0.3)) { //every 1.3 seconds, ofset 0.3 seconds
		const pickx = Math.random() * 300 + 175
		const picky = Math.random() * 50 + 50
		for(let i = 0; i < 3; i++){
			activeObjects.push(new bul_ralph_brick(
				( Math.random() * 2 * Math.PI / 12 ) + ( 2 * Math.PI * i / 12 ) + ( 5 * Math.PI / 4 ), 	//direction
				120, 								//speed
				pickx, 								//initx
				picky								//inity
			))
		}
	}
}