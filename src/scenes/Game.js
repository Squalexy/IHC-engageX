import Phaser from '../lib/phaser.js'
import Player from './Player.js'
import Enemy from './Enemy.js'
import CountdownController from './CountdownController.js'

export default class Game extends Phaser.Scene {

	/** @type {CountdownController} */
	countdown

    constructor() {
        super('game')
    }
 
    preload() {


        this.load.image('tiles', 'src/assets/tiles/desert.png')
        this.load.tilemapTiledJSON('map', 'src/assets/tiles/map1.json')

        this.load.image('vision', 'src/assets/particles/fog.png')
        this.load.image('greenHealthBar', 'src/assets/healthBar/green_health_bar.png');
        this.load.image('redHealthBar', 'src/assets/healthBar/red_health_bar.png');
        this.load.audio('music', 'src/assets/audio/music1.mp3');
        this.load.audio('loseGame', 'src/assets/audio/loseGame.wav');

        Player.preload(this)
        Enemy.preload(this)

    }

    create() {

        // ----------------------------------------------------- TILEMAP CREATION 
        
        this.map = this.make.tilemap({
            key: 'map'
        })
        const tileset = this.map.addTilesetImage('desert', 'tiles', 32, 32)
        this.layer = this.map.createLayer('toplayer', tileset, 0, 0)

        // ----------------------------------------------------- SPRITES CREATION 

        this.player = new Player({scene:this, x:32+16, y:32+16, texture:'sprite1', frame:'sprite1_idle'})  
        this.enemy = new Enemy({scene:this, x:32 * 5 + 16, y:32 * 5 + 16, texture: 'enemy1', frame: 'enemy1_idle'})

        this.player.health = 100;
        this.player.maxHealth = 100;

        this.enemy.health = 100
        this.enemy.maxHealth = 100

        // ----------------------------------------------------- ANIMATIONS CREATION 

        // ------------------------------------ PLAYER

        this.anims.create({
            key: 'sprite1_death',
            frames: this.anims.generateFrameNumbers('sprite1', {
                start: 0,
                end: 7
            }),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: 'sprite1_attack',
            frames: this.anims.generateFrameNumbers('sprite1', {
                start: 16,
                end: 21
            }),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: 'sprite1_flee',
            frames: this.anims.generateFrameNumbers('sprite1', {
                start: 24,
                end: 29
            }),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: 'sprite1_sow',
            frames: this.anims.generateFrameNumbers('sprite1', {
                start: 32,
                end: 37
            }),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: 'sprite1_walk',
            frames: this.anims.generateFrameNumbers('sprite1', {
                start: 40,
                end: 45
            }),
            repeat: 2,
            frameRate: 10
        })

        this.anims.create({
            key: 'sprite1_hurt',
            frames: this.anims.generateFrameNumbers('sprite1', {
                start: 48,
                end: 51
            }),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: 'sprite1_idle',
            frames: this.anims.generateFrameNumbers('sprite1', {
                start: 52,
                end: 55
            }),
            repeat: -1,
            frameRate: 8
        })

        this.anims.create({
            key: 'sprite1_steal',
            frames: this.anims.generateFrameNumbers('sprite1', {
                start: 56,
                end: 59
            }),
            repeat: -1,
            frameRate: 10
        })

        // ------------------------------------ ENEMY

        this.anims.create({
            key: 'enemy1_death',
            frames: this.anims.generateFrameNumbers('enemy1', {
                start: 0,
                end: 7
            }),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: 'enemy1_walk',
            frames: this.anims.generateFrameNumbers('enemy1', {
                start: 8,
                end: 13
            }),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: 'enemy1_attack',
            frames: this.anims.generateFrameNumbers('enemy1', {
                start: 16,
                end: 19
            }),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: 'enemy1_hurt',
            frames: this.anims.generateFrameNumbers('enemy1', {
                start: 20,
                end: 23
            }),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: 'enemy1_idle',
            frames: this.anims.generateFrameNumbers('enemy1', {
                start: 24,
                end: 27
            }),
            repeat: -1,
            frameRate: 10
        })

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
            Q: Phaser.Input.Keyboard.KeyCodes.Q,
            E: Phaser.Input.Keyboard.KeyCodes.E,
            R: Phaser.Input.Keyboard.KeyCodes.R,
            P: Phaser.Input.Keyboard.KeyCodes.P,
            F: Phaser.Input.Keyboard.KeyCodes.F,
        })

        // ----------------------------------------------------- DARK EFFECT 
        
        const width = this.scale.width * 2
        const height = this.scale.height * 2
        const rt = this.make.renderTexture({
            width,
            height
        }, true)
        rt.fill(0x000000, 1)
        rt.draw(this.layer)
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

        // ----------------------------------------------------- COUNTDOWN 

        const timerLabel = this.add.text(150,-10, '90', { fontSize: 20 }).setOrigin(0.5)

        this.countdown = new CountdownController(this, timerLabel)
        this.countdown.start(this.handleCountdownFinished.bind(this))

        // ----------------------------------------------------- HEALTH BAR

        // change position if needed (but use same position for both images)
        this.backgroundBar = this.add.image(this.player.x + 300, 20, 'redHealthBar');
        this.backgroundBar.fixedToCamera = true;

        this.healthBar = this.add.image(this.player.x + 300, 20, 'greenHealthBar');
        this.healthBar.fixedToCamera = true;
        this.healthBarWidth = this.healthBar.width;

        // add text label to left of bar
        this.healthLabel = this.add.text(60, 12, 'Health', {fontSize:'20px', fill:'#ffffff'});
        this.healthLabel.fixedToCamera = true;
        
        // ----------------------------------------------------- MUSIC

        this.music = this.sound.add("music",  { loop: true });
        //game.sound.setDecodedCallback(music, start, this);
        this.music.play()

    }

    update() {

        this.tiles = this.getTiles()

        this.player.update()
        this.enemy.update()

        this.countdown.update(this.player)

        if(this.player.health <= 0){
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

    handleCountdownFinished(){

		this.add.text(this.player.x, this.player.y - 180,  'GAME FINISHED!', { fontSize: 30 }).setOrigin(0.5)

        this.scene.pause()
        
        this.music.stop()
        this.loseGame = this.sound.add("loseGame",  { volume:0.4 , loop: false });
        //game.sound.setDecodedCallback(music, start, this);
        this.loseGame.play()

    }

    handleLifeFinished(){

		this.add.text(this.player.x, this.player.y - 180,  'YOU DIED!', { fontSize: 30 }).setOrigin(0.5)

        this.music.stop()
        this.loseGame = this.sound.add("loseGame",  { volume:0.4 , loop: false });
        //game.sound.setDecodedCallback(music, start, this);
        this.loseGame.play()
        this.scene.pause()

    }

    getTiles() {

        let tiles = [{
                name: 'tileLeft',
                value: this.layer.getTileAtWorldXY(this.player.x - 32, this.player.y, true),
                x: -32,
                y: 0
            },
            {
                name: 'tileRight',
                value: this.layer.getTileAtWorldXY(this.player.x + 32, this.player.y, true),
                x: 32,
                y: 0
            },
            {
                name: 'tileDown',
                value: this.layer.getTileAtWorldXY(this.player.x, this.player.y + 32, true),
                x: 0,
                y: 32
            },
            {
                name: 'tileUp',
                value: this.layer.getTileAtWorldXY(this.player.x, this.player.y - 32, true),
                x: 0,
                y: -32
            },
            {
                name: 'tileUpLeft',
                value: this.layer.getTileAtWorldXY(this.player.x - 32, this.player.y - 32, true),
                x: -32,
                y: -32
            },
            {
                name: 'tileUpRight',
                value: this.layer.getTileAtWorldXY(this.player.x + 32, this.player.y - 32, true),
                x: 32,
                y: -32
            },
            {
                name: 'tileDownLeft',
                value: this.layer.getTileAtWorldXY(this.player.x - 32, this.player.y + 32, true),
                x: -32,
                y: 32
            },
            {
                name: 'tileDownRight',
                value: this.layer.getTileAtWorldXY(this.player.x + 32, this.player.y + 32, true),
                x: 32,
                y: 32
            },
            {
                name: 'tileCenter',
                value: this.layer.getTileAtWorldXY(this.player.x, this.player.y, true),
                x: 0,
                y: 0
            },
        ]
    
        return tiles
    }

}