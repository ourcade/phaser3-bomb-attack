import Phaser from 'phaser'
import { IComponent, IComponentsService } from '../services/ComponentService'
import Countdown from './Countdown'

export default class Explosion implements IComponent
{
	private readonly colliders: Phaser.Physics.Arcade.Group

	private gameObject!: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform
	private components!: IComponentsService

	private unsub?: () => void

	constructor(colliders: Phaser.Physics.Arcade.Group)
	{
		this.colliders = colliders
	}

	init(go: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform, components: IComponentsService)
	{
		this.gameObject = go
		this.components = components
	}

	start()
	{
		const countdown = this.components.findComponent(this.gameObject, Countdown)
		if (!countdown)
		{
			return
		}

		this.unsub = countdown.onFinished(this.handleExplosion, this)
	}

	destroy()
	{
		this.unsub?.()
	}

	private handleExplosion()
	{
		this.unsub?.()

		const { x, y, scene } = this.gameObject

		const collider = this.colliders.get(x, y) as Phaser.Types.Physics.Arcade.ImageWithDynamicBody
		scene.physics.world.enableBody(collider)

		scene.time.delayedCall(500, () => {
			scene.physics.world.disableBody(collider.body)

			this.components.removeAllComponents(this.gameObject)

			this.gameObject.destroy()
		})
	}
}
