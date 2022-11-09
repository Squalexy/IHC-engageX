import Phaser from '../lib/phaser.js'
import Player from './Player.js'
import CountdownController from './CountdownController.js'


export default class Game extends Phaser.Scene {

	/** @type {CountdownController} */
	countdown

    constructor() {
        super('game')
    }
 

    preload() {

        this.load.image('bunny', 'src/assets/sprites/bunny2_ready.png')
        this.load.image('tiles', 'src/assets/tiles/desert.png')
        this.load.tilemapTiledJSON('map', 'src/assets/tiles/map1.json')
        this.load.image('vision', 'src/assets/particles/fog.png')
        this.load.image('greenHealthBar', 'src/assets/healthBar/green_health_bar.png');
        this.load.image('redHealthBar', 'src/assets/healthBar/red_health_bar.png');
        
        Player.preload(this)

    }


    
    create() {

        // ----------------------------------------------------- TILEMAP CREATION 
        
        const map = this.make.tilemap({
            key: 'map'
        })
        const tileset = map.addTilesetImage('desert', 'tiles', 32, 32)
        const layer = map.createLayer('toplayer', tileset, 0, 0)

        // ----------------------------------------------------- SPRITES CREATION 

        this.player = new Player({scene:this, x:32+16, y:32+16, texture:'elf', frame:'elf_m_walk_1'})  
        this.player.layer = layer

        // ----------------------------------------------------- ZOOM & FOLLOW

        this.cameras.main.setZoom(1.5)
        this.cameras.main.setSize(800, 600);
        this.cameras.main.startFollow(this.player)

        // ----------------------------------------------------- KEYBINDS

        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S, 
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            Q: Phaser.Input.Keyboard.KeyCodes.Q
        })

        // ----------------------------------------------------- DARK EFFECT 
        
        const width = this.scale.width * 2
        const height = this.scale.height * 2
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

        // ----------------------------------------------------- Time 
        const timerLabel = this.add.text(150,-10, '90', { fontSize: 20 }).setOrigin(0.5)

        this.countdown = new CountdownController(this, timerLabel)
        this.countdown.start(this.handleCountdownFinished.bind(this))
        

        // Player's health bar
        this.player.health = 100;
        this.player.maxHealth = 100;

        // change position if needed (but use same position for both images)
        this.backgroundBar = this.add.image(this.player.x + 300, 20, 'redHealthBar');
        this.backgroundBar.fixedToCamera = true;


        this.healthBar = this.add.image(this.player.x + 300, 20, 'greenHealthBar');
        this.healthBar.fixedToCamera = true;
        this.healthBarWidth = this.healthBar.width;


        // add text label to left of bar
        this.healthLabel = this.add.text(60, 12, 'Health', {fontSize:'20px', fill:'#ffffff'});
        this.healthLabel.fixedToCamera = true;

    }

    update() {
        this.player.update()
        this.countdown.update(this.player)
        if(this.player.health == 0){
            this.handleLifeFinished();
        }

        this.healthBar.displayWidth = this.player.health / this.player.maxHealth * this.healthBarWidth;
        this.healthBar.setX(this.player.x  - (1 - this.player.health / this.player.maxHealth)/2 * this.healthBarWidth);
        this.healthBar.setY(this.player.y + 150);
        
        this.backgroundBar.setX(this.player.x);
        this.backgroundBar.setY(this.player.y + 150);

        this.healthLabel.setX(this.player.x - 25);
        this.healthLabel.setY(this.player.y + 140);


    }

    handleCountdownFinished()
	{
		this.add.text(this.player.x, this.player.y - 180,  'GAME FINISHED!', { fontSize: 30 }).setOrigin(0.5)

        this.scene.pause()
    }

    handleLifeFinished()
	{
		this.add.text(this.player.x, this.player.y - 180,  'YOU DIED!', { fontSize: 30 }).setOrigin(0.5)

        this.scene.pause()
    }

}