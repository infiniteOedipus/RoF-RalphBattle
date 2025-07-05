//Loading sprites
    const loadImages = {
    ph: [{
            name: "PH",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/PH.png"
        } 
    ],
    souls: [{
            name: "soul_zeaque",
            src: "https://file.garden/Z49oqnj5okOfzefL/CSS/RoFHeart1.png"
        }, {
            name: "soul_vessta",
            src: "https://file.garden/Z49oqnj5okOfzefL/CSS/RoFHeart2.png"
        }, {
            name: "soul_phenix",
            src: "https://file.garden/Z49oqnj5okOfzefL/CSS/RoFHeart3.png"
        }, {
            name: "soul_markor",
            src: "https://file.garden/Z49oqnj5okOfzefL/CSS/RoFHeart4.png"
        }
    ],
	bullets: [{
		    name: "bul_ralph_brick",
		    src: "https://file.garden/Z49oqnj5okOfzefL/Battle/bul_ralph_brick.png"
	    }
	],
    bg: [{
            name: "bg_floor",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/bg_floor_PH.png",
        }, {
            name: "bg_wall_scroll",
            src: "https://file.garden/Z49oqnj5okOfzefL/pages/0014.png",
        }, {
            name: "bg_floor_glow_FX",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/bg_floor_glow_FX.png",
        }
    ],
    ui: [{ // Zeaques Attack
            name: "ui_button_zeaque_0",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/ui_button_zeaque_00.png"
        }, { // Zeaques Item
            name: "ui_button_zeaque_1",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/ui_button_zeaque_01.png"
        }, { // Zeaques Defend
            name: "ui_button_zeaque_2",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/ui_button_zeaque_2.png"
        }, { // Zeaques Blood
            name: "ui_button_zeaque_3",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/ui_button_zeaque_3.png"
        },{ // Vessta Attack
            name: "ui_button_vessta_0",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/ui_button_vessta_0.png"
        }, { // Vessta Item
            name: "ui_button_vessta_1",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/ui_button_vessta_1.png"
        }, { // Vessta Defend
            name: "ui_button_vessta_2",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/ui_button_vessta_2.png"
        }, { // Vessta Blood
            name: "ui_button_vessta_3",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/ui_button_vessta_3.png"
        },{ // Phenix Attack
            name: "ui_button_phenix_0",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/ui_button_phenix_0.png"
        }, { // Phenix Item
            name: "ui_button_phenix_1",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/ui_button_phenix_1.png"
        }, { // Phenix Defend
            name: "ui_button_phenix_2",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/ui_button_phenix_2.png"
        }, { // Phenix Blood
            name: "ui_button_phenix_3",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/ui_button_phenix_3.png"
        },{ // Markor Attack
            name: "ui_button_markor_0",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/ui_button_markor_0.png"
        }, { // Markor Item
            name: "ui_button_markor_1",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/ui_button_markor_1.png"
        }, { // Markor Defend
            name: "ui_button_markor_2",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/ui_button_markor_2.png"
        }, { // Markor Blood
            name: "ui_button_markor_3",
            src: "https://file.garden/Z49oqnj5okOfzefL/Battle/ui_button_markor_3.png"
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

