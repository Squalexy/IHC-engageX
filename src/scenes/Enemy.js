export default class Enemy extends Phaser.Physics.Arcade.Sprite {

    gameDuration = 60000
    
    constructor(data) {
        let {
            scene,
            x,
            y,
            texture,
            frame
        } = data

        super(scene, x, y, texture, frame)
        scene.physics.add.existing(this)
        this.scene.add.existing(this)
    }


    static preload(scene) {

        scene.load.spritesheet('enemy1', 'src/assets/sprites/enemy1/enemy1.png', {
            frameWidth: 32,
            frameHeight: 32
        })

    }

    create(scene) {

        this.active = true // active = is alive
        this.orientation = "right"  // direction the player is oriented, starts oriented looking on the right
    }

    update(gameTime, player) {

        if (!this.anims.isPlaying && this.active) this.anims.play('enemy1_idle', true) // "!this.anims.isPlaying" is to not overlap the idle animation on another one


        //this.enemyFollows(player);
        //console.log('Game Duration ' + this.gameDuration)
        //console.log('Game Time ' + gameTime)

        if(gameTime != 0){
            if(this.gameDuration - gameTime >= 1){
                this.gameDuration = gameTime

                const cannot_sow = [17, 18, 19, 20, 21, 25, 26, 27, 28, 29, 30, 31, 32]


                const min = Math.ceil(1)
                const max = Math.floor(4)
                const result = Math.floor(Math.random() * (max - min + 1) + min)


                if(    (player.x == this.x - 32 && player.y == this.y) ||
                       (player.y == this.y - 32 && player.x == this.x) ||
                       (player.x == this.x + 32 && player.y == this.y) || 
                       (player.y == this.y + 32 && player.x == this.x) ||
                       (player.x == this.x && player.y == this.y )      )    
                {
                    if(result ==1){
                        // Share
                        if (this.scene.player.active) {
                            // Steal in 4 directions: left, right, up, down
                            player.logArray.push('Enemy used Share');
                            this.anims.play('enemy1_attack', true)


                            const healthEnemyNow = this.health
                            const healthPlayerNow = player.health

                            this.health -=healthEnemyNow  / 2
                            this.health += healthPlayerNow / 2

                            player.health -= healthPlayerNow / 2
                            player.health += healthEnemyNow   / 2

                            if ( player.health > 0) this.scene.player.anims.play('elf_steal', true)
                            else {
                                this.scene.active = false
                                this.scene.player.anims.play('elf_steal', true)

                                // this timeout is EXTREMELY NECESSARY to wait for the animation to play fully and then destroy the sprite
                                setTimeout(() => {
                                    this.scene.player.destroy()
                                }, 500) 
                            }

                        }
                    }
                    else if(result == 2){
                        // Fight
                        this.anims.play('enemy1_attack', true)

                        if (this.scene.player.active) {
                            // Attack in 4 directions: left, right, up, down
                            player.logArray.push('Enemy used Fight');

                            player.health -= 10
                            if (this.scene.player.health > 0) this.scene.player.anims.play('elf_steal', true)
                            else {
                                this.scene.active = false
                                this.scene.player.anims.play('elf_steal', true)

                                // this timeout is EXTREMELY NECESSARY to wait for the animation to play fully and then destroy the sprite
                                setTimeout(() => {
                                    this.scene.player.destroy()
                                }, 500) 
                            }
                            
                        }
                    }
                    else if(result == 3){
                        // Flee (maximum 5 tiles left or right)
                        this.anims.play('enemy1_idle', true)
                        player.logArray.push('Enemy used Flee');

                        if (this.orientation == "left") {
                            let pos = this.scene.layer.getTileAtWorldXY(this.x - 32, this.y, true)
                            for (let i = 1; i < 6; i++) {
                                    this.x -= 32
                                    this.body.offset.x = 32
                                    this.scaleX = -1
                                    pos = this.scene.layer.getTileAtWorldXY(this.x - 32, this.y, true)
                                
                            }
                        }else if (this.orientation == "right") {
                            let pos = this.scene.layer.getTileAtWorldXY(this.x + 32, this.y, true)
                            for (let i = 1; i < 6; i++) {
                                    this.x += 32
                                    this.body.offset.x = 0
                                    this.scaleX = 1
                                    pos = this.scene.layer.getTileAtWorldXY(this.x + 32, this.y, true)
                                
                            }                
                        }
                    }
                    else {
                        // Steal
                        this.anims.play('enemy1_attack', true)

                        player.logArray.push('Enemy used Steal');

                        if (player.active) {

                            // Steal in 4 directions: left, right, up, down

                                const probability = Math.floor(Math.random() * 100)
                                console.log(probability)

                                if (probability < 25) {

                                    this.scene.player.health -= 10

                                    if (this.scene.player.health > 0) this.scene.player.anims.play('elf_steal', true)
                                    else {
                                        this.scene.active = false
                                        this.scene.player.anims.play('elf_steal', true)

                                        // this timeout is EXTREMELY NECESSARY to wait for the animation to play fully and then destroy the sprite
                                        setTimeout(() => {
                                            this.scene.player.destroy()
                                        }, 500) 
                                    }

                                    this.health += 10
                                }
                            }
                        }
                }
                
                // AQUI ACABA O IF GRANDE 
                else{
                    // MOVE 
                    if(player.x < this.x ){
                        // Left
                        this.anims.play('enemy1_idle', true)

                            player.logArray.push('Enemy Moved');
                            this.x -= 32
                            this.scaleX = -1
                            this.body.offset.x = 32
                            this.orientation = "left"
                        
                    }else if(player.x > this.x){
                        // Right
                        this.anims.play('enemy1_idle', true)

                            player.logArray.push('Enemy Moved');
                            this.x += 32
                            this.body.offset.x = 0
                            this.scaleX = 1
                            this.orientation = "right"
                        
                    }else{
                        if(player.y > this.y){
                            //  Down
                            this.anims.play('enemy1_idle', true)
                                player.logArray.push('Enemy Moved');
                                this.y += 32
                            
                        }else{
                            //  Up
                            this.anims.play('enemy1_idle', true)
    
                                player.logArray.push('Enemy Moved');
                                this.y -= 32
                            
                        }
                    }
                        
                    /*else if(result == 2){
                        // Save
                        this.anims.play('enemy1_idle', true)

                        player.logArray.push('Enemy used Save');

                        this.health -= this.health / 2
                        this.xp = Math.floor(this.xp + this.health / 2)
                        this.scene.xpLabel.setText('XP ' + this.xp)
                        this.scene.xpLabel.setX(this.scene.healthLabel.x + 140)
                        this.scene.xpLabel.setY(this.scene.healthLabel.y)
                    }else if(result == 3){
                        // Sow
                        this.anims.play('enemy1_idle', true)

                        player.logArray.push('Enemy used Sow');

                        for (const element of this.scene.tiles) {
                            if (!cannot_sow.includes(element["value"].index)) {
                                let pointerTileX = this.scene.map.worldToTileX(element["x"] + this.x)
                                let pointerTileY = this.scene.map.worldToTileY(element["y"] + this.y)
                                this.scene.map.putTileAt(24, pointerTileX, pointerTileY)
                                this.health -= 1
                            }
                        }
                    }else{
                        // Harvest
                        player.logArray.push('Enemy used Harvest');

                        if (this.scene.tiles[8]["value"].index == 24) {
                            this.anims.play('enemy1_idle', true)

                            let pointerTileX = this.scene.map.worldToTileX(this.x)
                            let pointerTileY = this.scene.map.worldToTileY(this.y)
                            this.scene.map.putTileAt(22, pointerTileX, pointerTileY)

                            this.health += 15
                        }
                    }*/
                }
            }
        }
    }


    enemyFollows (player) {
        this.scene.physics.moveToObject(this, player, 50);
    }
}