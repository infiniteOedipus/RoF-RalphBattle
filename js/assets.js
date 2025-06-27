//Loading sprites
    const loadImages = {
    PH: [{
            name: "PH",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/PH.png"
        } 
    ],
    Souls: [{
            name: "ZeaqueSoul",
            src: "https://file.garden/Z49oqnj5okOfzefL/CSS/RoFHeart1.png"
        }, {
            name: "VesstaSoul",
            src: "https://file.garden/Z49oqnj5okOfzefL/CSS/RoFHeart2.png"
        }, {
            name: "PhenixSoul",
            src: "https://file.garden/Z49oqnj5okOfzefL/CSS/RoFHeart3.png"
        }, {
            name: "MarkorSoul",
            src: "https://file.garden/Z49oqnj5okOfzefL/CSS/RoFHeart4.png"
        }
    ],
	Bullets: [{
		    name: "bul_ralph_brick",
		    src: "https://file.garden/Z49oqnj5okOfzefL/Battle/bul_ralph_brick.png"
	    }
	],
    BG: [{
            name: "bg_floor",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/bg_floor_PH.png",
        }, {
            name: "bg_wall_scroll",
            src: "https://file.garden/Z49oqnj5okOfzefL/pages/0014.png",
        }, {
            name: "bg_floor_glow_FX",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/bg_floor_glow_FX.png",
        }
    ]
}
//Loading audio
const loadAudio = {
    music: [{
            name: "TierList_song",
            src: "https://file.garden/Z6AuUPzHKDCUgCsZ/RoFGames/Vessta_Tier_List/TierList_song.mp3"
        }
    ]
}

// Load Assets, then start initialize

let assets = {}
let loadPromises = []

function checkImgLoad(imgSrc) { // Load image Promise
    return new Promise((resolve, reject) => {
        
        imgSrc.onload = () => {
            resolve(imgSrc)
        }

        imgSrc.onerror = () => {
            reject(new Error(`Failed to load ${imgSrc.src}`))
        }
    })
}

for (const [groupName, groupArray] of Object.entries(loadImages)) { //generates promises for images
    assets[groupName] = []
    for (const sprite of groupArray) {
        const img = new Image();
		    img.crossOrigin = "anonymous"
        img.src = sprite.src
        img.name = sprite.name
        assets[groupName].push(img)
        loadPromises.push(checkImgLoad(img))
    }
}

Promise.all(loadPromises) //requests promises, then initializes
.then(() => {
    console.log('All assets loaded:', assets)
    initialize()
})
.catch(() => {
    console.error("asset loading error")
})

