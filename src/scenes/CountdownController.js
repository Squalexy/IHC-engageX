export default class CountdownController
{
	/** @type {Phaser.Scene} */
	scene

	/** @type {Phaser.GameObjects.Text} */
	label

	/** @type {Phaser.Time.TimerEvent} */
	timerEvent

    passedSeconds = 0

	duration = 0
	GameDuration = 60000
	seconds = 0

	/**
	 * 
	 * @param {Phaser.Scene} scene 
	 * @param {Phaser.GameObjects.Text} label 
	 */
	constructor(scene, label)
	{
		this.scene = scene
		this.label = label
	}

	/**
	 * @param {() => void} callback
	 * @param {number} duration 
	 */
	start(callback, duration = this.GameDuration)
	{
		this.stop()
		this.finishedCallback = callback
		this.duration = duration

		this.timerEvent = this.scene.time.addEvent({
			delay: duration,
			callback: () => {
				this.label.text = '0'

				this.stop()
				
				if (callback)
				{
					callback()
				}
			}
		})
	}

	stop()
	{
		if (this.timerEvent)
		{
			this.timerEvent.destroy()
			this.timerEvent = undefined
		}
	}

	update(player, enemy, LogChat1,LogChat2, LogChat3, LogChat4 )
	{
        if (!this.timerEvent || this.duration <= 0)
		{
			return
		}

		const elapsed = this.timerEvent.getElapsed()
		const remaining = this.duration - elapsed
		this.seconds = remaining / 1000
        if(player.health - 0.05 > 0 && player.health - 0.05 < 100){
            player.health = player.health - 0.05;
        }else if(player.health - 0.05 < 0) {
            player.health = 0;
        }else{
			player.health = 100;
		}

		if(enemy.health - 0.05 > 0 && enemy.health - 0.05 < 100){
            enemy.health = enemy.health - 0.05;
        }else if(enemy.health - 0.05 < 0) {
            enemy.health = 0;
        }else{
			enemy.health = 100;
		}
		
		
		this.label.text = this.seconds.toFixed(2)
        this.label.setX(player.x);
        this.label.setY(player.y - 150);

        
	}
}