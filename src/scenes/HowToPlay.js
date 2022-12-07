
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

        this.text = "                         There are 3 basic abilities:\n"           +
                    "                             - Sow      (- 3LP for each cell)\n"                  +
                    "                             - Harvest  (+ 10LP)\n"                     +
                    "                             - Save     (LP -> XP)\n\n"               +
                    "              The first 2 abilities allow you to plant and \n"                +
                    "   collect lifepoints. The third one converts lifepoints into XP\n\n"         +
                    "            If a player gets down to 0 lifepoints he loses\n\n"    +
                    "                         There are another 4 abilities\n"             +
                    "                   - Share: Both give half LP to one another\n"         +
                    "                   - Fight: takes 10LP from the enemy\n"                     +
                    "                   - Steal: 25% Probability to steal 25% LP. Else\n "+
                    "                            lose that amount\n"+
                    "                   - Flee: Lose 10LP and move up to 5 cells \n"      +
                    "     The first 3 ones only take effect if the enemy is on an adjacent cell \n\n"+
                    "                       When the clock reaches 0, the game ends"          ;
                    
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