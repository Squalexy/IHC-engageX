import Phaser from '../lib/phaser.js'
import Player from './Player.js'
import Enemy from './Enemy.js'
import CountdownController from './CountdownController.js'

export default class Game extends Phaser.Scene {

    /** @type {CountdownController} */
    countdown
    flag = true
    constructor() {
        super('game')
    }

    preload() {

        // ----------------------------------------------------- PLUGINS 

        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        })

        this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true)

        // ----------------------------------------------------- TILEMAP  

        this.load.image('tiles', 'src/assets/tiles/tilesetv1.png')
        this.load.tilemapTiledJSON('map', 'src/assets/tiles/map_forest.json')

        // ----------------------------------------------------- ASSETS 

        this.load.image('vision', 'src/assets/particles/fog.png')

        //this.load.image('greenHealthBar', 'src/assets/healthBar/green_health_bar.png')
        //this.load.image('redHealthBar', 'src/assets/healthBar/red_health_bar.png')

        this.load.image('logChat', 'src/assets/LogChat/logchat.png')
        
        this.load.image('greenHealthBar', 'src/assets/healthBar/topBar.png')
        this.load.image('redHealthBar', 'src/assets/healthBar/backgroundBar.png')

        // ----------------------------------------------------- SOUND EFFECTS

        this.load.audio('music', 'src/assets/audio/music1.mp3')
        this.load.audio('loseGame', 'src/assets/audio/loseGame.wav')
        this.load.audio('fight_sound', 'src/assets/audio/sfx/fight.wav')
        this.load.audio('gain_life_sound', 'src/assets/audio/sfx/gain_life.wav')
        this.load.audio('harvest_sound', 'src/assets/audio/sfx/harvest.wav')
        this.load.audio('save_sound', 'src/assets/audio/sfx/save.wav')
        this.load.audio('sow_sound', 'src/assets/audio/sfx/sow.wav')
        this.load.audio('steal_sound', 'src/assets/audio/sfx/steal.wav')
        this.load.audio('walk_sound', 'src/assets/audio/sfx/walk.wav')
        this.load.audio('flee_sound', 'src/assets/audio/sfx/flee.wav')

        // ----------------------------------------------------- BUTTONS

        this.load.image('button_harvest', 'src/assets/buttons/Harvest.png')
        this.load.image('button_sow', 'src/assets/buttons/Sow.png')
        this.load.image('button_save', 'src/assets/buttons/Save.png')
        this.load.image('button_share', 'src/assets/buttons/Share.png')
        this.load.image('button_fight', 'src/assets/buttons/Fight.png')
        this.load.image('button_steal', 'src/assets/buttons/Steal.png')
        this.load.image('button_flee', 'src/assets/buttons/Flee.png')
        this.load.image('playButton1', 'src/assets/Menus/play1.png');
        this.load.image('backButton1', 'src/assets/Menus/back.png');
        this.load.image('playerIcon', 'src/assets/Overlay/boneco.png');


        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        // ----------------------------------------------------- CLASSES 

        Player.preload(this)
        Enemy.preload(this)

    }

    create() {

        // ----------------------------------------------------- TILEMAP CREATION 

        this.map = this.make.tilemap({
            key: 'map'
        })
        const tileset = this.map.addTilesetImage('tilesetv1', 'tiles', 32, 32)
        this.layer = this.map.createLayer('toplayer', tileset, 0, 0)

        // ----------------------------------------------------- SPRITES CREATION 

        this.player = new Player({
            scene: this,
            x: 32 + 16 * 3,
            y: 32 + 16 * 3,
            texture: 'final_elf',
            frame: 'elf_idle'
        })

        this.enemy = new Enemy({
            scene: this,
            x: 32 * 5 + 16,
            y: 32 * 5 + 16,
            texture: 'enemy1',
            frame: 'enemy1_idle'
        })

        this.player.health = 100;
        this.player.maxHealth = 100;

        this.enemy.health = 100
        this.enemy.maxHealth = 100

        // ------------------------------------ PLAYER

        this.anims.create({
            key: 'elf_fight',
            frames: this.anims.generateFrameNumbers('final_elf', {start: 42,end: 43}),
            repeat: 0,
            frameRate: 10
        })
        .addFrame(this.anims.generateFrameNames('final_elf', {start: 49,end: 50}))

        this.anims.create({
            key: 'elf_flee',
            frames: this.anims.generateFrameNumbers('final_elf', {start: 44,end: 45}),
            repeat: 0,
            frameRate: 10
        })

        this.anims.create({
            key: 'elf_harvest',
            frames: this.anims.generateFrameNumbers('final_elf', {start: 21,end: 23}),
            repeat: 0,
            frameRate: 10
        })
        .addFrame(this.anims.generateFrameNames('final_elf', {start: 28,end: 30}))
        .addFrame(this.anims.generateFrameNames('final_elf', {start: 35,end: 35}))

        this.anims.create({
            key: 'elf_share',
            frames: this.anims.generateFrameNumbers('final_elf', {start: 21,end: 23}),
            repeat: 0,
            frameRate: 10
        })
        .addFrame(this.anims.generateFrameNames('final_elf', {start: 28, end: 30}))
        .addFrame(this.anims.generateFrameNames('final_elf', {start: 35,end: 35}))

        this.anims.create({
            key: 'elf_idle',
            frames: this.anims.generateFrameNumbers('final_elf', {start: 51,end: 52}),
            repeat: -1,
            frameRate: 5
        })

        this.anims.create({
            key: 'elf_save',
            frames: this.anims.generateFrameNumbers('final_elf', {start: 24,end: 26}),
            repeat: 0,
            frameRate: 10
        })
        .addFrame(this.anims.generateFrameNames('final_elf', {start: 31,end: 33}))
        .addFrame(this.anims.generateFrameNames('final_elf', {start: 38,end: 39}))

        this.anims.create({
            key: 'elf_sow',
            frames: this.anims.generateFrameNumbers('final_elf', {start: 4,end: 6}),
            repeat: 0,
            frameRate: 10
        })
        .addFrame(this.anims.generateFrameNames('final_elf', {start: 11, end: 13}))
        .addFrame(this.anims.generateFrameNames('final_elf', {start: 18,end: 18}))

        this.anims.create({
            key: 'elf_steal',
            frames: this.anims.generateFrameNumbers('final_elf', {start: 0,end: 4 }),
            repeat: 0,
            frameRate: 8
        })
        .addFrame(this.anims.generateFrameNames('final_elf', {start: 7,end: 9}))
        .addFrame(this.anims.generateFrameNames('final_elf', {start: 14,end: 16}))

        this.anims.create({
            key: 'elf_walking',
            frames: this.anims.generateFrameNumbers('final_elf', {start: 46,end: 47}),
            repeat: 0,
            frameRate: 10
        })
        .addFrame(this.anims.generateFrameNames('final_elf', {start: 53, end: 54}))

        // ------------------------------------ ENEMY

        this.anims.create({
            key: 'enemy1_death',
            frames: this.anims.generateFrameNumbers('enemy1', {start: 0,end: 7}),
            repeat: 0,
            frameRate: 10
        }).addFrame(this.anims.generateFrameNames('enemy1', { start: 14,end: 14 }))

        this.anims.create({
            key: 'enemy1_empty',
            frames: this.anims.generateFrameNumbers('enemy1', {start: 14,end: 14 }),
            repeat: 0,
            frameRate: 10
        })

        this.anims.create({
            key: 'enemy1_walk',
            frames: this.anims.generateFrameNumbers('enemy1', {start: 8,end: 13}),
            repeat: 0,
            frameRate: 10
        })

        this.anims.create({
            key: 'enemy1_attack',
            frames: this.anims.generateFrameNumbers('enemy1', {start: 16,end: 19}),
            repeat: 0,
            frameRate: 10
        })

        this.anims.create({
            key: 'enemy1_hurt',
            frames: this.anims.generateFrameNumbers('enemy1', {start: 20,end: 23 }),
            repeat: 0,
            frameRate: 10
        })

        this.anims.create({
            key: 'enemy1_idle',
            frames: this.anims.generateFrameNumbers('enemy1', {start: 24,end: 27,}),
            repeat: -1,
            frameRate: 10
        })

        // ----------------------------------------------------- ZOOM & FOLLOW

        this.cameras.main.setZoom(1.25)
        //this.cameras.main.setSize(800, 600);
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
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
            C: Phaser.Input.Keyboard.KeyCodes.C,
            V: Phaser.Input.Keyboard.KeyCodes.V,
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
        rt.setTint(0x241A0B )

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

        const timerLabel = this.add.text(150, -10, '90', {
            fontSize: 20
        }).setOrigin(0.5)

        this.countdown = new CountdownController(this, timerLabel)
        this.countdown.start(this.handleCountdownFinished.bind(this))
        
        // ----------------------------------------------------- HEALTH BAR
        this.playerIcon = this.add.image(this.player.x + 300, 18, 'playerIcon');

        // change position if needed (but use same position for both images)
        this.backgroundBar = this.add.image(this.player.x + 300, 18, 'redHealthBar');
        this.backgroundBar.fixedToCamera = true;

        this.healthBar = this.add.image(this.player.x + 300, 18, 'greenHealthBar');
        this.healthBar.fixedToCamera = true;
        this.healthBarWidth = this.healthBar.width;

        this.logChatImage = this.add.image(this.player.x - 200, this.player.y +180, 'logChat');
        this.logChatImage.fixedToCamera = true;


        WebFont.load({
            google: {
                families: [ 'VT323'  ]
            }});


        // add text label to left of bar

        this.healthLabel = this.add.text(60, 12, 'Health', { fontSize:'20px', fill:'#ffffff'});
        this.healthLabel.fixedToCamera = true;   

        // ----------------------------------------------------- XP                             

        this.player.xp = 0
        this.xpLabel = this.add.text(0, 0, 'XP ' + this.player.xp, { })
        this.xpLabel.setX(this.healthLabel.x + 200)
        this.xpLabel.setY(this.healthLabel.y)

        // ----------------------------------------------------- MUSIC & SOUND

        this.music = this.sound.add("music", {loop: true});
        //game.sound.setDecodedCallback(music, start, this)
        this.music.play()

        this.fight_sound = this.sound.add("fight_sound", { loop: false });
        this.gain_life_sound = this.sound.add("gain_life_sound", { loop: false });
        this.harvest_sound = this.sound.add("harvest_sound", { loop: false });
        this.save_sound = this.sound.add("save_sound", { loop: false });
        this.sow_sound = this.sound.add("sow_sound", { loop: false });
        this.steal_sound = this.sound.add("steal_sound", { loop: false });
        this.walk_sound = this.sound.add("walk_sound", { loop: false })
        this.flee_sound = this.sound.add("flee_sound", { loop: false });

        this.music.setVolume(0.35)
        this.walk_sound.setVolume(4)
        this.flee_sound.setVolume(0.15)
        this.steal_sound.setVolume(3)
        this.harvest_sound.setVolume(1.5)
        this.sow_sound.setVolume(1.5)
        this.save_sound.setVolume(1.5)

        // ----------------------------------------------------- BUTTONS CREATION 

        // Harvest
        this.button_harvest = this.add.sprite(this.player.x + 400, this.player.y + 340, 'button_harvest').setInteractive()
        this.button_harvest.on('pointerdown', function () {
            this.harvestOnClick()
        }, this)
        this.button_harvest.on('pointerout', function () {})
        this.button_harvest.on('pointerdown', function () {})

        // Sow
        this.button_sow = this.add.sprite(this.player.x + 400, this.player.y + 340, 'button_sow').setInteractive()
        this.button_sow.on('pointerdown', function () {
            this.sowOnClick()
        }, this)
        this.button_sow.on('pointerout', function () {})
        this.button_sow.on('pointerdown', function () {})

        // Save
        this.button_save = this.add.sprite(this.player.x + 400, this.player.y + 340, 'button_save').setInteractive()
        this.button_save.on('pointerdown', function () {
            this.saveOnClick()
        }, this)
        this.button_save.on('pointerout', function () {})
        this.button_save.on('pointerdown', function () {})

        // Share
        this.button_share = this.add.sprite(this.player.x + 400, this.player.y + 340, 'button_share').setInteractive()
        this.button_share.on('pointerdown', function () {
            this.shareOnClick()
        }, this)
        this.button_share.on('pointerout', function () {})
        this.button_share.on('pointerdown', function () {})

        // Fight
        this.button_fight = this.add.sprite(this.player.x + 400, this.player.y + 340, 'button_fight').setInteractive()
        this.button_fight.on('pointerdown', function () {
            this.fightOnClick()
        }, this)
        this.button_fight.on('pointerout', function () {})
        this.button_fight.on('pointerdown', function () {})

        // Steal
        this.button_steal = this.add.sprite(this.player.x + 400, this.player.y + 340, 'button_steal').setInteractive()
        this.button_steal.on('pointerdown', function () {
            this.stealOnClick()
        }, this)
        this.button_steal.on('pointerout', function () {})
        this.button_steal.on('pointerdown', function () {})

        // Flee
        this.button_flee = this.add.sprite(this.player.x + 400, this.player.y + 340, 'button_flee').setInteractive()
        this.button_flee.on('pointerdown', function () {
            this.fleeOnClick()
        }, this)
        this.button_flee.on('pointerout', function () {})
        this.button_flee.on('pointerdown', function () {})

        this.buttonLabel = this.add.text(0, 0, 
            '[W] Up\n[S] Down\n[A] Left\n[D] Right\n[Q] Dark effect\n[E] Sow\n[R] Harvest\n[P] Fight\n[C] Steal\n[V] Share\n[F] Save\n[SPACE] Flee', 
            {fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: 10})
        this.buttonLabel.setX(this.player.x - 300)
        this.buttonLabel.setY(this.player.y - 230)

        // ----------------------------------------------------- LOG CHAT

        this.LogChat1 = this.add.text(0, 0, '', {fontSize:'12px' })
        this.LogChat1.setFill('#241A0B');
        this.LogChat1.setX(this.healthLabel.x - 320)
        this.LogChat1.setY(this.healthLabel.y + 200)

        this.LogChat2 = this.add.text(0, 0, '', {fontSize:'12px'})
        this.LogChat2.setFill('#241A0B');
        this.LogChat2.setX(this.healthLabel.x - 320)
        this.LogChat2.setY(this.healthLabel.y + 180)

        this.LogChat3 = this.add.text(0, 0, '', { fontSize:'12px'})
        this.LogChat3.setFill('#241A0B');
        this.LogChat3.setX(this.healthLabel.x - 320)
        this.LogChat3.setY(this.healthLabel.y + 160)

        this.LogChat4 = this.add.text(0, 0, '', {fontSize:'12px'})
        this.LogChat4.setFill('#241A0B');
        this.LogChat4.setX(this.healthLabel.x - 320)
        this.LogChat4.setY(this.healthLabel.y + 140)

    }

    update() {

        if(this.flag){
            this.tiles = this.getTiles()

            // ----------------------------------------------------- PLAYERS DYING UPDATE
    
            if (this.player.health <= 0) this.handleLifeFinished()
    
            // ----------------------------------------------------- UPDATE PLAYER AND ENEMY
    
            this.player.update()
            if (this.enemy.active) this.enemy.update() // this.enemy.active -> verifies if enemy is alive
    
            // ----------------------------------------------------- UPDATE COUNTDOWN
    
            this.countdown.update(this.player, this.enemy, this.LogChat1, this.LogChat2, this.LogChat3, this.LogChat4)
    
            // ----------------------------------------------------- UPDATE HEALTH BAR
    
            this.healthBar.displayWidth = this.player.health / this.player.maxHealth * this.healthBarWidth;
    
            this.healthBar.setX(this.player.x - 60  - (1 - this.player.health / this.player.maxHealth)/2 * this.healthBarWidth);
            this.healthBar.setY(this.player.y + 160);
    
            this.backgroundBar.setX(this.player.x- 60);
            this.backgroundBar.setY(this.player.y + 160);
    
            this.healthLabel.setX(this.player.x - 85);
            this.healthLabel.setY(this.player.y + 150);
    
            this.logChatImage.setX(this.player.x + 190)
            this.logChatImage.setY(this.player.y + 175)
    
            // ----------------------------------------------------- UPDATE BUTTONS
            this.playerIcon.setX(this.player.x - 220)
            this.playerIcon.setY(this.player.y + 180)
            this.playerIcon.setScale(1.3)

    
            this.button_harvest.x = this.player.x - 150
            this.button_harvest.y = this.player.y + 200
    
            this.button_sow.x = this.player.x - 120
            this.button_sow.y = this.player.y + 200
    
            this.button_save.x = this.player.x - 90
            this.button_save.y = this.player.y + 200
    
            this.button_share.x = this.player.x - 60
            this.button_share.y = this.player.y + 200
    
            this.button_fight.x = this.player.x - 30
            this.button_fight.y = this.player.y + 200
    
            this.button_steal.x = this.player.x 
            this.button_steal.y = this.player.y + 200
    
            this.button_flee.x = this.player.x + 30
            this.button_flee.y = this.player.y + 200
    
            this.xpLabel.setX(this.healthLabel.x + 140)
            this.xpLabel.setY(this.healthLabel.y)
            
            this.buttonLabel.setX(this.player.x - 300)
            this.buttonLabel.setY(this.player.y - 230)
    
            // ----------------------------------------------------- UPDATE LOG CHAT
    
            if(this.player.logArray != null){
                for(let i = 0; i <4 ; i++ ){
                    if(i == 0){
                        this.LogChat1.text = this.player.logArray[this.player.logArray.length -1 ]
                        this.LogChat1.setX(this.player.x + 180)
                        this.LogChat1.setY(this.player.y + 190)
                    }
                    else if(i == 1 ){
                        this.LogChat2.text = this.player.logArray[this.player.logArray.length -2 ]
                        this.LogChat2.setX(this.player.x+ 180)
                        this.LogChat2.setY(this.player.y+ 175)
                    
                    }				
                    else if(i == 2){
                        this.LogChat3.text = this.player.logArray[this.player.logArray.length -3 ]
                        this.LogChat3.setX(this.player.x+ 180)
                        this.LogChat3.setY(this.player.y+ 160)
    
                    }
                    if(i == 3){
                        this.LogChat4.text = this.player.logArray[this.player.logArray.length -4 ]
                        this.LogChat4.setX(this.player.x+ 180)
                        this.LogChat4.setY(this.player.y+ 145)
    
                    }
                }
            }else{
                console.log('null');
            }
        }
       

    }

    handleCountdownFinished() {
        this.flag = false
        this.add.text(this.player.x, this.player.y - 180, 'GAME FINISHED!', {
            fontSize: 30
        }).setOrigin(0.5)


        this.music.stop()
        this.loseGame = this.sound.add("loseGame", {
            volume: 0.4,
            loop: false
        });
        this.loseGame.play()




    }

    handleLifeFinished() {
        this.flag = false

        this.add.text(this.player.x, this.player.y - 180, 'YOU DIED!', {
            fontSize: 30
        }).setOrigin(0.5)

        this.music.stop()
        this.loseGame = this.sound.add("loseGame", {loop: false});
        this.loseGame.setVolume(0.15) 
        this.loseGame.play()
    }


    getTiles() {

        let tiles = [{
                name: 'tileLeft',
                value: this.layer.getTileAtWorldXY(this.player.x - 32, this.player.y, true),x: -32,y: 0},
            {
                name: 'tileRight',
                value: this.layer.getTileAtWorldXY(this.player.x + 32, this.player.y, true),x: 32,y: 0},
            {
                name: 'tileDown',
                value: this.layer.getTileAtWorldXY(this.player.x, this.player.y + 32, true),x: 0,y: 32},
            {
                name: 'tileUp',
                value: this.layer.getTileAtWorldXY(this.player.x, this.player.y - 32, true),x: 0,y: -32},
            {
                name: 'tileUpLeft',
                value: this.layer.getTileAtWorldXY(this.player.x - 32, this.player.y - 32, true),x: -32,y: -32},
            {
                name: 'tileUpRight',
                value: this.layer.getTileAtWorldXY(this.player.x + 32, this.player.y - 32, true),x: 32,y: -32},
            {
                name: 'tileDownLeft',
                value: this.layer.getTileAtWorldXY(this.player.x - 32, this.player.y + 32, true),x: -32,y: 32},
            {
                name: 'tileDownRight',
                value: this.layer.getTileAtWorldXY(this.player.x + 32, this.player.y + 32, true),x: 32,y: 32},
            {
                name: 'tileCenter',
                value: this.layer.getTileAtWorldXY(this.player.x, this.player.y, true),x: 0,y: 0},
        ]

        return tiles
    }

    harvestOnClick() {


        if (!this.harvest_sound.isPlaying) this.harvest_sound.play()

        this.tiles = this.getTiles()
        if (this.tiles[8]["value"].index == 24) {

            this.player.anims.play('elf_harvest', true)
            this.player.logArray.push('You used Harvest');
            let pointerTileX = this.map.worldToTileX(this.player.x)
            let pointerTileY = this.map.worldToTileY(this.player.y)
            this.map.putTileAt(22, pointerTileX, pointerTileY)

            if (!this.gain_life_sound.isPlaying) this.gain_life_sound.play()
            this.player.health += 15
        }
    }

    sowOnClick() {

        const cannot_sow = [17, 18, 19, 20, 21, 25, 26, 27, 28, 29, 30, 31, 32]

        this.player.anims.play('elf_sow', true)
        if (!this.sow_sound.isPlaying) this.sow_sound.play()

        this.tiles = this.getTiles()

        for (const element of this.tiles) {
            if (!cannot_sow.includes(element["value"].index)) {
                this.player.logArray.push('You used Sow');

                let pointerTileX = this.map.worldToTileX(element["x"] + this.player.x)
                let pointerTileY = this.map.worldToTileY(element["y"] + this.player.y)
                this.map.putTileAt(24, pointerTileX, pointerTileY)
                this.player.health -= 1
            }
        }
    }

    fightOnClick() {

        this.player.anims.play('elf_fight', true)
        if (!this.fight_sound.isPlaying) this.fight_sound.play()


        if (this.enemy.active) {
            // Attack in 4 directions: left, right, up, down
            if ((this.enemy.x == this.player.x - 32 && this.enemy.y == this.player.y) ||
                (this.enemy.x == this.player.x + 32 && this.enemy.y == this.player.y) ||
                (this.enemy.x == this.player.x && this.enemy.y == this.player.y + 32) ||
                (this.enemy.x == this.player.x && this.enemy.y == this.player.y - 32)) {
                    this.player.logArray.push('You used Fight');

                this.enemy.health -= 10

                if (this.enemy.health > 0) this.enemy.anims.play('enemy1_hurt', true)
                else {
                    this.active = false
                    this.enemy.anims.play('enemy1_death', true)
                    // this timeout is EXTREMELY NECESSARY to wait for the animation to play fully and then destroy the sprite
                    setTimeout(() => {
                        this.enemy.destroy()
                    }, 500)
                }
            }
        }

    }

    fleeOnClick() {

        const obstacles = [17, 18, 19, 20, 21, 25, 26, 27, 28, 29, 30, 31]

        this.player.anims.play('elf_flee', true)
        if (!this.flee_sound.isPlaying) this.flee_sound.play()
        this.player.logArray.push('You used Flee');

        if (this.player.orientation == "left") {

            let pos = this.layer.getTileAtWorldXY(this.player.x - 32, this.player.y, true)
            for (let i = 1; i < 6; i++) {
                if (obstacles.includes(pos.index)) break
                else {
                    this.player.x -= 32
                    this.player.body.offset.x = 32
                    this.player.scaleX = -1
                    this.player.vision.x -= 32
                    pos = this.layer.getTileAtWorldXY(this.player.x - 32, this.player.y, true)
                }
            }

        } else if (this.player.orientation == "right") {

            let pos = this.layer.getTileAtWorldXY(this.player.x + 32, this.player.y, true)

            for (let i = 1; i < 6; i++) {
                if (obstacles.includes(pos.index)) break
                else {
                    this.player.x += 32
                    this.player.body.offset.x = 0
                    this.player.scaleX = 1
                    this.player.vision.x += 32
                    pos = this.layer.getTileAtWorldXY(this.player.x + 32, this.player.y, true)
                }
            }
        }
    }

    saveOnClick() {
        this.player.logArray.push('You used Save');

        this.player.anims.play('elf_save', true)
        if (!this.save_sound.isPlaying) this.save_sound.play()

        this.player.health -= this.player.health / 2
        this.player.xp = Math.floor(this.player.xp + this.player.health / 2)
        this.xpLabel.setText('XP ' + this.player.xp)
        this.xpLabel.setX(this.healthLabel.x + 140)
        this.xpLabel.setY(this.healthLabel.y)

    }


    

    stealOnClick() {

        this.player.logArray.push('You used Steal');

        this.player.anims.play('elf_steal', true)
        if (!this.steal_sound.isPlaying) this.steal_sound.play()

        if (this.enemy.active) {

            // Steal in 4 directions: left, right, up, down
            if ((this.enemy.x == this.player.x - 32 && this.enemy.y == this.player.y) || 
                (this.enemy.x == this.player.x + 32 && this.enemy.y == this.player.y) ||
                (this.enemy.x == this.player.x && this.enemy.y == this.player.y + 32) ||
                (this.enemy.x == this.player.x && this.enemy.y == this.player.y - 32)){

                const probability = Math.floor(Math.random() * 100)
                console.log(probability)

                if (probability < 25) {

                    this.enemy.health -= 10

                    if (this.enemy.health > 0) this.enemy.anims.play('enemy1_hurt', true)
                    else {
                        this.active = false
                        this.enemy.anims.play('enemy1_death', true)

                        // this timeout is EXTREMELY NECESSARY to wait for the animation to play fully and then destroy the sprite
                        setTimeout(() => {
                            this.enemy.destroy()
                        }, 500) 
                    }

                    if (!this.gain_life_sound.isPlaying) this.gain_life_sound.play()
                    this.player.health += 10
                }
            }
        }


    }

    shareOnClick() {

        if (this.enemy.active) {

            // Steal in 4 directions: left, right, up, down
            if ((this.enemy.x == this.player.x - 32 && this.enemy.y == this.player.y) || 
                (this.enemy.x == this.player.x + 32 && this.enemy.y == this.player.y) ||
                (this.enemy.x == this.player.x && this.enemy.y == this.player.y + 32) ||
                (this.enemy.x == this.player.x && this.enemy.y == this.player.y - 32)){
                this.player.logArray.push('You used Share');


                this.player.anims.play('elf_share', true)
                if (!this.steal_sound.isPlaying) this.steal_sound.play()

                if (!this.gain_life_sound.isPlaying) this.gain_life_sound.play()

                const healthPlayerNow = this.player.health
                const healthEnemyNow = this.enemy.health

                this.player.health -= healthPlayerNow / 2
                this.player.health += healthEnemyNow / 2

                this.enemy.health -= healthEnemyNow / 2
                this.enemy.health += healthPlayerNow  / 2

                if (this.enemy.health > 0) this.enemy.anims.play('enemy1_hurt', true)
                else {
                    this.active = false
                    this.enemy.anims.play('enemy1_death', true)

                    // this timeout is EXTREMELY NECESSARY to wait for the animation to play fully and then destroy the sprite
                    setTimeout(() => {
                        this.enemy.destroy()
                    }, 500) 
                }

                if (!this.gain_life_sound.isPlaying) this.gain_life_sound.play()
                this.player.health += 10
                
            }
        }
        
    }

}