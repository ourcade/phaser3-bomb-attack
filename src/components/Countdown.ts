import Phaser from 'phaser'
import { IComponent, IComponentsService } from '../services/ComponentService'

export default class Countdown implements IComponent
{
	private gameObject!: Phaser.GameObjects.GameObject
	private components!: IComponentsService
	private events = new Phaser.Events.EventEmitter()

	private totalSecondsInMS: number

	private accumulatedTime = 0

	constructor(secs: number)
	{
		this.totalSecondsInMS = secs * 1000
	}

	init(go: Phaser.GameObjects.GameObject, components: IComponentsService)
	{
		this.gameObject = go
		this.components = components
	}

	onFinished(cb: () => void, context?: any)
	{
		this.events.on('finished', cb, context)

		return () => {
			this.events.off('finished', cb, context)
		}
	}

	update(dt: number)
	{
		this.accumulatedTime += dt

		if (this.accumulatedTime < this.totalSecondsInMS)
		{
			return
		}

		this.events.emit('finished')
		this.components.removeComponent(this.gameObject, this)
	}
}
