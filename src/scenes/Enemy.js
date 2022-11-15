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

    }


    update(scene) {

        this.anims.play('enemy1_idle', true)

    }

}