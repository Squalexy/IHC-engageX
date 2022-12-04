
export default class IntroMenu extends Phaser.Scene {
    constructor () {
        super('introMenu');
    }
    preload(){
        this.load.image('background', 'src/assets/Menus/menu_background.png')
        this.load.image('playButton', 'src/assets/Menus/play.png');

    }

    create(){
        this.background = this.add.sprite(0,0,'background').setOrigin(0);

        this.playButton = this.add.sprite(0,0,'playButton').setOrigin(0).setScale(0.1,0.1)
        .setInteractive().on('pointerdown', () => {
          
            this.scene.transition({
                target: 'game',
                duration: 0,
            });
        })
        ;

    }
}