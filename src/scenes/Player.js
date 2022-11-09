var healthBar;

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

        const tileUp = this.layer.getTileAtWorldXY(this.x, this.y - 32, true);
        const tileDown = this.layer.getTileAtWorldXY(this.x, this.y + 32, true);
        const tileLeft = this.layer.getTileAtWorldXY(this.x - 32, this.y, true);
        const tileRight = this.layer.getTileAtWorldXY(this.x + 32, this.y, true);


        this.anims.play('elf_idle', true)

        // Left
        if (this.inputKeys.left.isDown) {

            if (!this.pressedLeft && tileLeft.index !== 5) {
                this.x -= 32
                this.vision.x -= 32
                this.pressedLeft = true
            }
        }

        // Right
        if (this.inputKeys.right.isDown) {
            if (!this.pressedRight && tileRight.index !== 5) {
                this.x += 32
                this.vision.x += 32
                this.pressedRight = true
            }
        }

        //  Down
        if (this.inputKeys.down.isDown) {
            if (!this.pressedDown && tileDown.index !== 5) {
                this.y += 32
                this.vision.y += 32
                this.pressedDown = true
            }
        }

        //  Up
        if (this.inputKeys.up.isDown && tileUp.index !== 5) {
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

        if (this.inputKeys.Q.isUp) this.pressedQ = false
        if (this.inputKeys.up.isUp) this.pressedUp = false
        if (this.inputKeys.down.isUp) this.pressedDown = false
        if (this.inputKeys.left.isUp) this.pressedLeft = false
        if (this.inputKeys.right.isUp) this.pressedRight = false



    }

}