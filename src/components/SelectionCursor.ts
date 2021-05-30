import type { IComponent, IComponentsService } from '../services/ComponentService'

export default class SelectionCursor implements IComponent
{
	private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys
	private readonly events = new Phaser.Events.EventEmitter()

	private gameObject!: Phaser.GameObjects.Image
	private components!: IComponentsService
	private selector?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody

	get selectorPosition()
	{
		return {
			x: this.selector?.x ?? 0,
			y: this.selector?.y ?? 0
		}
	}

	constructor(cursors: Phaser.Types.Input.Keyboard.CursorKeys)
	{
		this.cursors = cursors
	}

	init(go: Phaser.GameObjects.GameObject, components: IComponentsService)
	{
		this.gameObject = go as Phaser.GameObjects.Image
		this.components = components
	}

	awake()
	{
		const { scene } = this.gameObject

		const box = scene.add.rectangle(100, 100, 16, 16, 0xffffff, 0)
		box.setStrokeStyle(1, 0xffffff, 0.5)
		this.selector = scene.physics.add.existing(box) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody
	}

	start()
	{
		const { x, y } = this.gameObject
		this.selector?.setPosition(x, y - 24)
	}

	update(dt: number)
	{
		const { x, y } = this.gameObject
		const distance = 24

		if (this.cursors.left.isDown)
		{
			// move cursor to left
			this.selector?.setPosition(x - distance, y)
		}
		else if (this.cursors.right.isDown)
		{
			// move cursor to right
			this.selector?.setPosition(x + distance, y)
		}
		else if (this.cursors.up.isDown)
		{
			// move cursor to up
			this.selector?.setPosition(x, y - distance)
		}
		else if (this.cursors.down.isDown)
		{
			// move cursor to down
			this.selector?.setPosition(x, y + distance)
		}
		else if (Phaser.Input.Keyboard.JustUp(this.cursors.space))
		{
			console.log('space')
		}
	}
}