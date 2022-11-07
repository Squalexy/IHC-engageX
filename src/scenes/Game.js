import Phaser from '../lib/phaser.js'
import Player from './Player.js'

export default class Game extends Phaser.Scene {

    constructor() {
        super('game')
    }
 
    preload() {

        this.load.image('bunny', 'src/assets/sprites/bunny2_ready.png')
        this.load.image('tiles', 'src/assets/tiles/desert.png')
        this.load.tilemapTiledJSON('map', 'src/assets/tiles/map1.json')
        this.load.image('vision', 'src/assets/particles/fog.png')

        Player.preload(this)

    }

    create() {

        //this.cameras.main.setZoom(0.7)

        // ----------------------------------------------------- TILEMAP CREATION 
        
        const map = this.make.tilemap({
            key: 'map'
        }, 32, 32)
        const tileset = map.addTilesetImage('desert', 'tiles', 32, 32)
        const layer = map.createLayer('toplayer', tileset)

        // ----------------------------------------------------- DARK EFFECT

        const width = this.scale.width
        const height = this.scale.height
        const rt = this.make.renderTexture({
            width,
            height
        }, true)
        rt.fill(0x000000, 1)
        rt.draw(layer)
        rt.setTint(0x0a2948)

        // ----------------------------------------------------- SPRITES CREATION 

        // const player = this.add.image(32 + 16, 32 + 16, 'bunny')


        this.player = new Player({scene:this, x:50, y:50, texture:'elf', frame:'elf_m_walk_1'})  
        this.player.layer = layer
        this.time.addEvent({delay:1000, loop:true})


        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S, 
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            Q: Phaser.Input.Keyboard.KeyCodes.Q
        })

        // field of view effect
        const vision = this.make.image({
            x: this.player.x,
            y: this.player.y,
            key: 'vision',
            add: false
        })
        vision.scale = 0.4

        rt.mask = new Phaser.Display.Masks.BitmapMask(this, vision)
        rt.mask.invertAlpha = true

        this.player.vision = vision

    }

    update() {
        this.player.update()
    }

}