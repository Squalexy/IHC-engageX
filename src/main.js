import Phaser from './lib/phaser.js'
import Game from './scenes/Game.js'

export default new Phaser.Game({
    type: Phaser.AUTO,
    scene: [Game],
    parent: 'main',
    backgroundColor: '#241A0B',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false    
        },
    },
    autoCenter: true,
    scale: {
        mode: Phaser.Scale.FIT,
            width: 800,
            height: 600
    }
})
