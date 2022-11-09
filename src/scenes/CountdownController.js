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
	start(callback, duration = 60000)
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

	update(player)
	{
        if (!this.timerEvent || this.duration <= 0)
		{
			return
		}

		const elapsed = this.timerEvent.getElapsed()
        console.log(elapsed)
		const remaining = this.duration - elapsed
		const seconds = remaining / 1000
        if(player.maxHealth - (elapsed/100) > 0){
            player.health = player.maxHealth - (elapsed/100);
        }else {
            player.health = 0;
        }

		this.label.text = seconds.toFixed(2)
        this.label.setX(player.x);
        this.label.setY(player.y - 150);

        
	}
}