var healthBar

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

        scene.load.atlas('elf', 'src/assets/sprites/elf/elf.png', 'src/assets/sprites/elf/elf_atlas.json')
        scene.load.animation('elf_animation', 'src/assets/sprites/elf/elf_anim.json')

    }

    create(scene) {

        // field of view range
        this.vision.scale = 0.4

    }


    update(scene) {

        this.anims.play('elf_idle', true)
        this.healthAdded = 0

        // Left
        if (this.inputKeys.left.isDown) {
            if (!this.pressedLeft && this.scene.tiles[0]["value"].index !== 5) {
                this.x -= 32
                this.vision.x -= 32
                this.pressedLeft = true
            }
        }

        // Right
        if (this.inputKeys.right.isDown) {
            if (!this.pressedRight && this.scene.tiles[1]["value"].index !== 5) {
                this.x += 32
                this.vision.x += 32
                this.pressedRight = true
            }
        }

        //  Down
        if (this.inputKeys.down.isDown) {
            if (!this.pressedDown && this.scene.tiles[2]["value"].index !== 5) {
                this.y += 32
                this.vision.y += 32
                this.pressedDown = true
            }
        }

        //  Up
        if (this.inputKeys.up.isDown && this.scene.tiles[3]["value"].index !== 5) {
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
            if (!this.pressedE) {
                for (const element of this.scene.tiles) {
                    if (element["value"].index != 5) {
                        let pointerTileX = this.scene.map.worldToTileX(element["x"] + this.x)
                        let pointerTileY = this.scene.map.worldToTileY(element["y"] + this.y)
                        this.scene.map.putTileAt(4, pointerTileX, pointerTileY)
                        this.health -= 25
                    }
                }
                this.pressedE = true
            }
        }

        // Harvest
        if (this.inputKeys.R.isDown) {
            if (!this.pressedR) {
                if (this.scene.tiles[8]["value"].index == 4) {
                    let pointerTileX = this.scene.map.worldToTileX(this.x)
                    let pointerTileY = this.scene.map.worldToTileY(this.y)
                    this.scene.map.putTileAt(1, pointerTileX, pointerTileY)
                    this.health += 50
                }
            }
            this.pressedR = true
        }

        if (this.inputKeys.Q.isUp) this.pressedQ = false
        if (this.inputKeys.up.isUp) this.pressedUp = false
        if (this.inputKeys.down.isUp) this.pressedDown = false
        if (this.inputKeys.left.isUp) this.pressedLeft = false
        if (this.inputKeys.right.isUp) this.pressedRight = false
        if (this.inputKeys.E.isUp) this.pressedE = false
        if (this.inputKeys.R.isUp) this.pressedR = false

    }

}