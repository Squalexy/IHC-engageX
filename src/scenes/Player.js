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

    }

    static preload(scene) {
        

        scene.load.spritesheet('sprite1', 'src/assets/sprites/sprite1/sprite1_anim.png', {
            frameWidth: 32,
            frameHeight: 32
        })

    }

    create(scene) {

        this.vision.scale = 0.4     // field of view range
        this.orientation = "right"  // direction the player is oriented, starts oriented looking on the right



    }

    update(scene) {

        if (!this.anims.isPlaying) this.anims.play('sprite1_idle', true)

        // Left
        if (this.inputKeys.left.isDown) {
            this.anims.play('sprite1_walk', true)
            if (!this.pressedLeft && this.scene.tiles[0]["value"].index !== 5) {
                this.x -= 32
                this.scaleX = -1
                this.body.offset.x = 32
                this.vision.x -= 32
                this.pressedLeft = true
                this.orientation = "left"
            }
        }

        // Right
        if (this.inputKeys.right.isDown) {
            this.anims.play('sprite1_walk', true)
            if (!this.pressedRight && this.scene.tiles[1]["value"].index !== 5) {
                this.x += 32
                this.body.offset.x = 0
                this.scaleX = 1
                this.vision.x += 32
                this.pressedRight = true
                this.orientation = "right"
            }
        }

        //  Down
        if (this.inputKeys.down.isDown) {
            this.anims.play('sprite1_walk', true)
            if (!this.pressedDown && this.scene.tiles[2]["value"].index !== 5) {
                this.y += 32
                this.vision.y += 32
                this.pressedDown = true
            }
        }

        //  Up
        if (this.inputKeys.up.isDown && this.scene.tiles[3]["value"].index !== 5) {
            this.anims.play('sprite1_walk', true)
            if (!this.pressedUp) {
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
            this.anims.play('sprite1_sow', true)
            if (!this.pressedE) {
                for (const element of this.scene.tiles) {
                    if (element["value"].index != 5) {
                        let pointerTileX = this.scene.map.worldToTileX(element["x"] + this.x)
                        let pointerTileY = this.scene.map.worldToTileY(element["y"] + this.y)
                        this.scene.map.putTileAt(4, pointerTileX, pointerTileY)
                        this.health -= 1
                    }
                }
                this.pressedE = true
            }
        }

        // Harvest
        if (this.inputKeys.R.isDown) {
            this.anims.play('sprite1_sow', true)
            if (!this.pressedR) {
                if (this.scene.tiles[8]["value"].index == 4) {
                    let pointerTileX = this.scene.map.worldToTileX(this.x)
                    let pointerTileY = this.scene.map.worldToTileY(this.y)
                    this.scene.map.putTileAt(1, pointerTileX, pointerTileY)
                    this.health += 15
                }
            }
            this.pressedR = true
        }

        // Fight
        if (this.inputKeys.P.isDown) {

            this.anims.play('sprite1_attack', true)

            if (!this.pressedP) {
                if (this.scene.enemy.active) {

                    // Attack in 4 directions: left, right, up, down
                    if ((this.scene.enemy.x == this.x - 32 && this.scene.enemy.y == this.y) || 
                        (this.scene.enemy.x == this.x + 32 && this.scene.enemy.y == this.y) ||
                        (this.scene.enemy.x == this.x && this.scene.enemy.y == this.y + 32) ||
                        (this.scene.enemy.x == this.x && this.scene.enemy.y == this.y - 32)){

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


        // Run (maximum 5 tiles left or right)
        if (this.inputKeys.F.isDown) {

            this.anims.play('sprite1_flee', true)

            if (this.orientation == "left") {
                if (!this.pressedF) {
                    let pos = this.scene.layer.getTileAtWorldXY(this.x - 32, this.y, true)
                    for (let i = 1; i < 6; i++) {
                        if (pos.index == 5) break
                        else {
                            this.x -= 32
                            this.body.offset.x = 32
                            this.scaleX = -1
                            this.vision.x -= 32
                            pos = this.scene.layer.getTileAtWorldXY(this.x - 32, this.y, true)
                        }
                    }
                    this.pressedF = true
                }
            } else if (this.orientation == "right") {
                if (!this.pressedF) {
                    let pos = this.scene.layer.getTileAtWorldXY(this.x + 32, this.y, true)
                    for (let i = 1; i < 6; i++) {
                        if (pos.index == 5) break
                        else {
                            this.x += 32
                            this.body.offset.x = 0
                            this.scaleX = 1
                            this.vision.x += 32
                            pos = this.scene.layer.getTileAtWorldXY(this.x + 32, this.y, true)
                        }
                    }
                    this.pressedF = true
                }
            }
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

    }



}