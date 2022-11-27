class BasicButton extends Phaser.GameObjects.Sprite {

    constructor(config) {

        super(config.scene, 0, 0, config.key, config.up)

        //if there is an x assign it
        if (config.x) {
            this.x = config.x;
        }
        
        //if there is an x assign it
        if (config.y) {
            this.y = config.y;
        }
         
        //check if config contains a scene
        if (!config.scene) {
            console.log('missing scene');
            return;
        }
        //check if config contains a key
        if (!config.key) {
            console.log("missing key!");
            return;
        }
        //if there is no up property assume 0
        if (!config.up) {
            config.up = 0;
        }
        //if there is no down in config use up
        if (!config.down) {
            config.down = config.up;
        }
        //if there is no over in config use up
        if (!config.over) {
            config.over = config.up;
        }

        config.scene.add.existing(this)

        this.setInteractive();
        this.on('pointerdown',this.onDown,this);
        this.on('pointerup',this.onUp,this);
        this.on('pointerover',this.onOver,this);
        this.on('pointerout',this.onUp,this);

        onDown()
        {
            this.setFrame(this.config.down);
        }
        onOver()
        {
            this.setFrame(this.config.over);
        }
        onUp()
        {
            this.setFrame(this.config.up);
        }

     }
      
  }