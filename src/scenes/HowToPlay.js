
export default class HowToPlay extends Phaser.Scene {
    constructor () {
        super('HowToPlay')
    }


    preload(){
        this.load.image('backgroundHowToPlay', 'src/assets/Menus/howToPlay.png')

        this.load.image('backButton1', 'src/assets/Menus/back.png');

    }

    create(){
        this.background = this.add.sprite(0,0,'backgroundHowToPlay').setOrigin(0);

        this.text = "                           There are 3 basic abilities:\n"           +
                    "                               - Sow      (-33% LP)\n"                  +
                    "                               - Harvest  (+ LP)\n"                     +
                    "                               - Save     (LP -> XP)\n\n"               +
                    "                The first 2 abilities allow you to plant and \n"                +
                    "       collect lifepoints. The third one converts lifepoints into XP\n\n"         +
                    "              If a player gets down to 0 lifepoints, loses\n\n"    +
                    "When 2 players meet in adjacent cells, there is an encounter event.\n"+ 
                    "     There you are abble to choose one of the following actions:\n\n"             +
                    "             - Share: Both give half LP to one another\n"         +
                    "             - Fight: Both spend 50% LP. One wins and\n"          +
                    "                    takes 50% of the sum\n"                     +
                    "             - Flee: Lose 25% LP and leave the encounter\n"       +
                    "             - Steal: 25% Pb to steal 25% LP. Else lose\n\n"      +
                    "             When the clock reaches 0, the game ends"          ;
                    
        this.body = this.add.text(200, 150, this.text, {fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: 16, color: "#241A0B"})
        this.backButton1 = this.add.sprite(100,550,'backButton1')
        .setInteractive().on('pointerdown', () => {
            this.scene.transition({
                target: 'IntroMenu',
                duration: 0,
            });
        });
       
    }
}