import Phaser from 'phaser'
import StateMachine from '../statemachine/StateMachine'
import { IComponent, IComponentsService } from '../services/ComponentService'
import SelectionCursor from './SelectionCursor'
import Countdown from './Countdown'
import Explosion from './Explosion'

export default class BombSpawner implements IComponent
{
	private readonly colliders: Phaser.Physics.Arcade.Group
	private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys
	private readonly layer?: Phaser.GameObjects.Layer

	private gameObject!: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform
	private components!: IComponentsService

	private selectionCursor?: SelectionCursor 

	private stateMachine: StateMachine

	constructor(colliders: Phaser.Physics.Arcade.Group, cursors: Phaser.Types.Input.Keyboard.CursorKeys, layer?: Phaser.GameObjects.Layer)
	{
		this.colliders = colliders
		this.cursors = cursors
		this.layer = layer

		this.stateMachine = new StateMachine(this, 'bomb-spawner')
		this.stateMachine
			.addState('idle', {
				onUpdate: this.handleIdleUpdate
			})
			.addState('spawn', {
				onEnter: this.handleSpawnBombEnter,
				onUpdate: this.handleSpawnBombUpdate
			})
			.setState('idle')
	}

	init(go: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform, components: IComponentsService)
	{
		this.gameObject = go
		this.components = components
	}

	start()
	{
		this.selectionCursor = this.components.findComponent(this.gameObject, SelectionCursor)
	}

	update(dt: number)
	{
		this.stateMachine.update(dt)
	}

	private handleIdleUpdate()
	{
		if (this.cursors.space.isDown)
		{
			this.stateMachine.setState('spawn')
		}
	}

	private handleSpawnBombEnter()
	{
		const { scene } = this.gameObject

		const position = this.selectionCursor
			? this.selectionCursor.selectorPosition
			: { x: this.gameObject.x, y: this.gameObject.y }

		const bomb = scene.add.image(position.x, position.y, 'bomb')

		this.components.addComponent(bomb, new Countdown(3))
		this.components.addComponent(bomb, new Explosion(this.colliders))

		if (this.layer)
		{
			this.layer.add(bomb)
		}
	}

	private handleSpawnBombUpdate()
	{
		if (this.cursors.space.isUp)
		{
			this.stateMachine.setState('idle')
		}
	}
}
