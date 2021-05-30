import Phaser from 'phaser'
import { IComponent, IComponentsService } from '../services/ComponentService'

export default class ExplosionDamage implements IComponent
{
	private colliders: Phaser.Physics.Arcade.Group
	
	private gameObject!: Phaser.GameObjects.GameObject
	private components!: IComponentsService

	constructor(colliders: Phaser.Physics.Arcade.Group)
	{
		this.colliders = colliders
	}

	init(go: Phaser.GameObjects.GameObject, components: IComponentsService)
	{
		this.gameObject = go
		this.components = components
	}

	start()
	{
		const { scene } = this.gameObject

		scene.physics.add.overlap(this.gameObject, this.colliders, this.handleDamage, undefined, this)
	}

	private handleDamage()
	{
		this.components.removeAllComponents(this.gameObject)

		this.gameObject.destroy()
	}
}
