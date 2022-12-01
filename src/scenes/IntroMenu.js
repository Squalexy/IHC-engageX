
export default class IntroMenu extends Phaser.Scene {
    constructor () {
        super('IntroMenu');
    }
    preload(){
        this.load.image('background', 'src/assets/Menus/background.png')
        this.load.image('playButton1', 'src/assets/Menus/play1.png');
        this.load.image('playButton2', 'src/assets/Menus/play2.png');
        this.load.image('howToPlayButton1', 'src/assets/Menus/howToPlay1.png');
        this.load.image('howToPlayButton2', 'src/assets/Menus/howToPlay2.png');



    }

    create(){
        this.background = this.add.sprite(0,0,'background').setOrigin(0);

        this.playButton1 = this.add.sprite(400,320,'playButton1').setInteractive().on('pointerdown', () => {
            this.scene.transition({
                target: 'game',
                duration: 0,
            });
        });

        this.howToPlayButton1 = this.add.sprite(400,380,'howToPlayButton1')
        .setInteractive().on('pointerdown', () => {
            this.scene.transition({
                target: 'HowToPlay',
                duration: 0,
            });
        });
    }
}