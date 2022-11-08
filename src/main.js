import Phaser from './lib/phaser.js'
import Game from './scenes/Game.js'

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 1800,
    height: 800,
    scene: [Game],
    parent: 'main',
    backgroundColor: '#1a1a2d',
    pixelArt: true,
    physics: {
        default: 'arcade',
        matter: {
            debug: true,
        },
    },
})
