import Phaser from './lib/phaser.js'
import Game from './scenes/Game.js'
import IntroMenu from './scenes/IntroMenu.js'


export default new Phaser.Game({
    type: Phaser.AUTO,
    scene: [IntroMenu, Game],
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
