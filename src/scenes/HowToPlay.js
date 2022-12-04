
export default class HowToPlay extends Phaser.Scene {
    constructor () {
        super('howToPlay')
    }


    preload(){
    }

    create(){
        this.text = "           There are 3 basic abilities:\n\n"           +
                    "              - Sow      (-33% LP)\n"                  +
                    "              - Harvest  (+ LP)\n"                     +
                    "              - Save     (LP -> XP)\n\n"               +
                    "              The first 2 abilities \n"                +
                    "             allow you to plant and \n"                +
                    "           collect lifepoints. The third\n"            +
                    "          one converts lifepoints into XP\n\n"         +
                    "  The player with most XP points wins the game\n"      +
                    "  If a player gets down to 0 lifepoints, loses\n\n"    +
                    "  When 2 players meet in a cell, there is an\n"        + 
                    "  encounter event. The first player to choose\n"       + 
                    "  forces one of the following actions:\n\n"            +
                    "  - Share: Both give half LP to one another\n"         +
                    "  - Fight: Both spend 50% LP. One wins and\n"          +
                    "           takes 50% of the sum\n"                     +
                    "  - Flee: Lose 25% LP and leave the encounter\n"       +
                    "          Other may find it with 20% Pb\n"             +
                    "  - Steal: 25% Pb to steal 25% LP. Else lose\n\n"      +
                    "     When the clock reaches 0, the game ends"          ;
                    
        this.body = this.add.text(10, 30, this.text, {strokeThickness: 1, fontSize: 16, color: "#000000"})
       
    }
}