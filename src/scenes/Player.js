import Game from './Game.js'

export default class Player extends Phaser.Physics.Matter.Sprite {

    constructor(data) {
        let {
            scene,
            x,
            y,
            texture,
            frame
        } = data
        super(scene.matter.world, x, y, texture, frame)
        this.scene.add.existing(this)
    }

    static preload(scene) {

        scene.load.atlas('elf', 'src/assets/sprites/elf/elf.png', 'src/assets/sprites/elf/elf_atlas.json')
        scene.load.animation('elf_animation', 'src/assets/sprites/elf/elf_anim.json')

    }

    create(scene) {

        this.vision.scale = 0.4

    }


    update(scene) {

        this.anims.play('elf_idle', true)

        // Left
        if (this.inputKeys.left.isDown) {

            if (!this.pressedLeft) {

                const tile = this.layer.getTileAtWorldXY(this.x - 32, this.y, true)
                if (tile.index === 2) this.x += 0
                else {
                    this.x -= 32
                    this.vision.x -= 32
                }
                this.pressedLeft = true
            }
        }

        // Right
        if (this.inputKeys.right.isDown) {

            if (!this.pressedRight) {

                const tile = this.layer.getTileAtWorldXY(this.x + 32, this.y, true)
                if (tile.index === 2) this.x += 0
                else {
                    this.x += 32
                    this.vision.x += 32
                }
                this.pressedRight = true
            }
        }

        //  Down
        if (this.inputKeys.down.isDown) {

            if (!this.pressedDown) {

                const tile = this.layer.getTileAtWorldXY(this.x, this.y + 32, true)
                if (tile.index === 2) this.y += 0
                else {
                    this.y += 32
                    this.vision.y += 32
                }
                this.pressedDown = true
            }
        }

        //  Up
        if (this.inputKeys.up.isDown) {

            if (!this.pressedUp) {

                const tile = this.layer.getTileAtWorldXY(this.x, this.y - 32, true)
                if (tile.index === 2) this.y += 0
                else {
                    this.y -= 32
                    this.vision.y -= 32
                }
                this.pressedUp = true
            }
        }

        // Q for fog effect
        if (this.inputKeys.Q.isDown) {
            if (!this.pressedQ) {
                if (this.vision.scale == 0.4) this.vision.scale = 100
                else this.vision.scale = 0.4
            }
            this.pressedQ = true
        }

        if (this.inputKeys.Q.isUp) this.pressedQ = false
        if (this.inputKeys.up.isUp) this.pressedUp = false
        if (this.inputKeys.down.isUp) this.pressedDown = false
        if (this.inputKeys.left.isUp) this.pressedLeft = false
        if (this.inputKeys.right.isUp) this.pressedRight = false

    }

}