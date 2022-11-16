export default class Enemy extends Phaser.Physics.Arcade.Sprite {

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

    }

    update(scene) {

        if (!this.anims.isPlaying && this.active) this.anims.play('enemy1_idle', true) // "!this.anims.isPlaying" is to not overlap the idle animation on another one

    }

}