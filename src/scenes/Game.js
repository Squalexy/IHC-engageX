import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene {

    constructor() {
        super('game')
    }

    preload() {

        this.load.image('background', 'src/assets/Background/bg_layer1.png')

    }
    create() {

        this.add.image(240, 320, 'background')

    }
}