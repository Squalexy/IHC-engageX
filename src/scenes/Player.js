export default class Player extends Phaser.Physics.Arcade.Sprite {

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
        this.logArray = [];
    }

    static preload(scene) {
        
        scene.load.spritesheet('final_elf', 'src/assets/sprites/final_elf/final_elf.png', {
            frameWidth: 32,
            frameHeight: 32
        })

    }

    create(scene) {

        this.vision.scale = 0.4     // field of view range
        this.orientation = "right"  // direction the player is oriented, starts oriented looking on the right

    }

    update() {

        const obstacles = [17, 18, 19, 20, 21, 25, 26, 27, 28, 29, 30, 31]
        const cannot_sow = [17, 18, 19, 20, 21, 25, 26, 27, 28, 29, 30, 31, 32]

        if (!this.anims.isPlaying) this.anims.play('elf_idle', true)

        // Left
        if (this.inputKeys.left.isDown) {

            this.anims.play('elf_walking', true)
            if (!this.scene.walk_sound.isPlaying) this.scene.walk_sound.play()

            if (!this.pressedLeft && !obstacles.includes(this.scene.tiles[0]["value"].index)) {
                this.logArray.push('You Moved');
                this.x -= 32
                this.scaleX = -1
                this.body.offset.x = 32
                this.vision.x -= 32
                this.pressedLeft = true
                this.orientation = "left"
                console.log("Index: " + this.scene.tiles[0]["value"].index)
            }
        }

        // Right
        if (this.inputKeys.right.isDown) {

            this.anims.play('elf_walking', true)
            if (!this.scene.walk_sound.isPlaying) this.scene.walk_sound.play()

            if (!this.pressedRight && !obstacles.includes(this.scene.tiles[1]["value"].index)) {
                this.logArray.push('You Moved');

                this.x += 32
                this.body.offset.x = 0
                this.scaleX = 1
                this.vision.x += 32
                this.pressedRight = true
                this.orientation = "right"
                //console.log("Index RIGHT: " + this.scene.tiles[1]["value"].index)
            }
        }

        //  Down
        if (this.inputKeys.down.isDown) {

            this.anims.play('elf_walking', true)
            if (!this.scene.walk_sound.isPlaying) this.scene.walk_sound.play()

            if (!this.pressedDown && !obstacles.includes(this.scene.tiles[2]["value"].index)) {
                this.logArray.push('You Moved');

                this.y += 32
                this.vision.y += 32
                this.pressedDown = true
            }
        }

        //  Up
        if (this.inputKeys.up.isDown && !obstacles.includes(this.scene.tiles[3]["value"].index)) {

            this.anims.play('elf_walking', true)
            if (!this.scene.walk_sound.isPlaying) this.scene.walk_sound.play()

            if (!this.pressedUp) {
                this.logArray.push('You Moved');

                this.y -= 32
                this.vision.y -= 32
                this.pressedUp = true
            }
        }

        // Q for field of view effect
        if (this.inputKeys.Q.isDown) {
            if (!this.pressedQ) {
                if (this.vision.scale == 0.4) this.vision.scale = 100
                else this.vision.scale = 0.4
            }
            this.pressedQ = true
        }

        // Sow
        if (this.inputKeys.E.isDown) {

            this.anims.play('elf_sow', true)
            if (!this.scene.sow_sound.isPlaying) this.scene.sow_sound.play()

            if (!this.pressedE) {
                this.logArray.push('You used Sow');

                for (const element of this.scene.tiles) {
                    if (!cannot_sow.includes(element["value"].index)) {
                        let pointerTileX = this.scene.map.worldToTileX(element["x"] + this.x)
                        let pointerTileY = this.scene.map.worldToTileY(element["y"] + this.y)
                        this.scene.map.putTileAt(24, pointerTileX, pointerTileY)
                        this.health -= 1
                    }
                }
                this.pressedE = true
            }
        }

        // Harvest
        if (this.inputKeys.R.isDown) {

            if (!this.scene.harvest_sound.isPlaying) this.scene.harvest_sound.play()

            if (!this.pressedR) {

                this.logArray.push('You used Harvest');

                if (this.scene.tiles[8]["value"].index == 24) {

                    this.anims.play('elf_harvest', true)

                    if (!this.scene.gain_life_sound.isPlaying) this.scene.gain_life_sound.play()

                    let pointerTileX = this.scene.map.worldToTileX(this.x)
                    let pointerTileY = this.scene.map.worldToTileY(this.y)
                    this.scene.map.putTileAt(22, pointerTileX, pointerTileY)

                    if (!this.scene.gain_life_sound.isPlaying) this.scene.gain_life_sound.play()
                    this.health += 15
                }
            }
            this.pressedR = true
        }

        // Fight
        if (this.inputKeys.P.isDown) {

            this.anims.play('elf_fight', true)
            if (!this.scene.fight_sound.isPlaying) this.scene.fight_sound.play()

            if (!this.pressedP) {
                if (this.scene.enemy.active) {

                    // Attack in 4 directions: left, right, up, down
                    if ((this.scene.enemy.x == this.x - 32 && this.scene.enemy.y == this.y) || 
                        (this.scene.enemy.x == this.x + 32 && this.scene.enemy.y == this.y) ||
                        (this.scene.enemy.x == this.x && this.scene.enemy.y == this.y + 32) ||
                        (this.scene.enemy.x == this.x && this.scene.enemy.y == this.y - 32)){
                            this.logArray.push('You used Fight');
            

                        this.scene.enemy.health -= 10
                        if (this.scene.enemy.health > 0) this.scene.enemy.anims.play('enemy1_hurt', true)
                        else {
                            this.scene.active = false
                            this.scene.enemy.anims.play('enemy1_death', true)

                            // this timeout is EXTREMELY NECESSARY to wait for the animation to play fully and then destroy the sprite
                            setTimeout(() => {
                                this.scene.enemy.destroy()
                            }, 500) 
                        }
                        
                    }
                }
            }

            this.pressedP = true
        }


        // Flee (maximum 5 tiles left or right)
        if (this.inputKeys.SPACE.isDown) {

            this.anims.play('elf_flee', true)
            if (!this.scene.flee_sound.isPlaying) this.scene.flee_sound.play()
            this.logArray.push('You used Flee');

            if (this.orientation == "left") {
                if (!this.pressedSPACE) {
                    let pos = this.scene.layer.getTileAtWorldXY(this.x - 32, this.y, true)
                    for (let i = 1; i < 6; i++) {
                        if (obstacles.includes(pos.index)) break
                        else {
                            this.x -= 32
                            this.body.offset.x = 32
                            this.scaleX = -1
                            this.vision.x -= 32
                            pos = this.scene.layer.getTileAtWorldXY(this.x - 32, this.y, true)
                        }
                    }
                    this.pressedSPACE = true
                }
            } else if (this.orientation == "right") {
                if (!this.pressedSPACE) {
                    let pos = this.scene.layer.getTileAtWorldXY(this.x + 32, this.y, true)
                    for (let i = 1; i < 6; i++) {
                        if (obstacles.includes(pos.index)) break
                        else {
                            this.x += 32
                            this.body.offset.x = 0
                            this.scaleX = 1
                            this.vision.x += 32
                            pos = this.scene.layer.getTileAtWorldXY(this.x + 32, this.y, true)
                        }
                    }
                    this.pressedSPACE = true
                }
            }
        }

        // Save
        if (this.inputKeys.F.isDown) {

            this.anims.play('elf_save', true)
            if (!this.scene.save_sound.isPlaying) this.scene.save_sound.play()

            if (!this.pressedF) {
                this.logArray.push('You used Save');

                this.health -= this.health / 2
                this.xp = Math.floor(this.xp + this.health / 2)
                this.scene.xpLabel.setText('XP ' + this.xp)
                this.scene.xpLabel.setX(this.scene.healthLabel.x + 140)
                this.scene.xpLabel.setY(this.scene.healthLabel.y)
            }

            this.pressedF = true

        }

        // Steal
        if (this.inputKeys.C.isDown) {

            this.anims.play('elf_steal', true)
            if (!this.scene.steal_sound.isPlaying) this.scene.steal_sound.play()

            if (!this.pressedC) {
                this.logArray.push('You used Steal');

                if (this.scene.enemy.active) {

                    // Steal in 4 directions: left, right, up, down
                    if ((this.scene.enemy.x == this.x - 32 && this.scene.enemy.y == this.y) || 
                        (this.scene.enemy.x == this.x + 32 && this.scene.enemy.y == this.y) ||
                        (this.scene.enemy.x == this.x && this.scene.enemy.y == this.y + 32) ||
                        (this.scene.enemy.x == this.x && this.scene.enemy.y == this.y - 32)){

                        const probability = Math.floor(Math.random() * 100)
                        console.log(probability)

                        if (probability < 25) {

                            this.scene.enemy.health -= 10

                            if (this.scene.enemy.health > 0) this.scene.enemy.anims.play('enemy1_hurt', true)
                            else {
                                this.scene.active = false
                                this.scene.enemy.anims.play('enemy1_death', true)
    
                                // this timeout is EXTREMELY NECESSARY to wait for the animation to play fully and then destroy the sprite
                                setTimeout(() => {
                                    this.scene.enemy.destroy()
                                }, 500) 
                            }

                            if (!this.scene.gain_life_sound.isPlaying) this.scene.gain_life_sound.play()
                            this.health += 10
                        }
                    }
                }
            }
            this.pressedC = true
        }

        // Share
        if (this.inputKeys.V.isDown) {

            if (!this.pressedV) {

                if (this.scene.enemy.active) {
                    

                    // Steal in 4 directions: left, right, up, down
                    if ((this.scene.enemy.x == this.x - 32 && this.scene.enemy.y == this.y) || 
                        (this.scene.enemy.x == this.x + 32 && this.scene.enemy.y == this.y) ||
                        (this.scene.enemy.x == this.x && this.scene.enemy.y == this.y + 32) ||
                        (this.scene.enemy.x == this.x && this.scene.enemy.y == this.y - 32)){
                        this.logArray.push('You used Share');
                        this.anims.play('elf_share', true)
                        if (!this.scene.steal_sound.isPlaying) this.scene.steal_sound.play()


                        const healthPlayerNow = this.health
                        const healthEnemyNow = this.scene.enemy.health

                        this.health -= healthPlayerNow / 2
                        this.health += healthEnemyNow / 2
 
                        this.scene.enemy.health -= healthEnemyNow / 2
                        this.scene.enemy.health += healthPlayerNow  / 2

                        if (this.scene.enemy.health > 0) this.scene.enemy.anims.play('enemy1_hurt', true)
                        else {
                            this.scene.active = false
                            this.scene.enemy.anims.play('enemy1_death', true)

                            // this timeout is EXTREMELY NECESSARY to wait for the animation to play fully and then destroy the sprite
                            setTimeout(() => {
                                this.scene.enemy.destroy()
                            }, 500) 
                        }

                        if (!this.scene.gain_life_sound.isPlaying) this.scene.gain_life_sound.play()
                        
                    }
                }
            }
            this.pressedV = true
        }
        
        if (this.inputKeys.Q.isUp) this.pressedQ = false
        if (this.inputKeys.up.isUp) this.pressedUp = false
        if (this.inputKeys.down.isUp) this.pressedDown = false
        if (this.inputKeys.left.isUp) this.pressedLeft = false
        if (this.inputKeys.right.isUp) this.pressedRight = false
        if (this.inputKeys.E.isUp) this.pressedE = false
        if (this.inputKeys.R.isUp) this.pressedR = false
        if (this.inputKeys.F.isUp) this.pressedF = false
        if (this.inputKeys.P.isUp) this.pressedP = false
        if (this.inputKeys.C.isUp) this.pressedC = false
        if (this.inputKeys.V.isUp) this.pressedV = false
        if (this.inputKeys.SPACE.isUp) this.pressedSPACE = false

    }

}