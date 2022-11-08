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

        // ----------------------------------------------------- TILEMAP CREATION 
        
        const map = this.make.tilemap({
            key: 'map'
        })
        const tileset = map.addTilesetImage('desert', 'tiles', 32, 32)
        const layer = map.createLayer('toplayer', tileset, 0, 0)
        const layerWall = map.createLayer('walllayer', tileset, 0, 0)

        // ----------------------------------------------------- SPRITES CREATION 

        this.player = new Player({scene:this, x:32+16, y:32+16, texture:'elf', frame:'elf_m_walk_1'})  
        
        // ----------------------------------------------------- ZOOM & FOLLOW
        this.cameras.main.setZoom(1)
        this.cameras.main.setSize(800, 600);
        this.cameras.main.startFollow(this.player)

        // ----------------------------------------------------- COLLISION EFFECTS

        layerWall.setCollisionByProperty({collides: true})

        // ----------------------------------------------------- KEYBINDS

        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S, 
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            Q: Phaser.Input.Keyboard.KeyCodes.Q
        })

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

        // ----------------------------------------------------- DEBUGGING

        // ----- walls
        const debugGraphics = this.add.graphics().setAlpha(0.7)
        layerWall.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        })

    }

    update() {

        this.player.update()


    }

}