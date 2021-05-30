import Phaser from 'phaser'
import ComponentService from '../services/ComponentService'

import KeyboardMovement from '../components/KeyboardMovement'
import AnimationOnInput from '../components/AnimationOnInput'
import SelectionCursor from '../components/SelectionCursor'
import BombSpawner from '~/components/BombSpawner'
import { Body } from 'matter'
import ExplosionDamage from '~/components/ExplosionDamage'


export default class BombAttackScene extends Phaser.Scene
{
	private player!: Phaser.Physics.Arcade.Sprite
	private components!: ComponentService
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

	constructor()
	{
		super('bomb-attack')
	}

	preload()
    {
        this.components = new ComponentService()
		this.cursors = this.input.keyboard.createCursorKeys()

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			this.components.destroy()
		})
    }

    create()
    {
        const { width, height } = this.scale

		const bombsLayer = this.add.layer()

		const bombColliders = this.physics.add.group({
			classType: Phaser.GameObjects.Container
		})
		bombColliders.createCallback = go => {
			const body = go.body as Phaser.Physics.Arcade.Body
			body.setCircle(64, -64, -64)
			this.physics.world.disableBody(body)
		}

		// add pots
		const dummies = this.physics.add.staticGroup()
		let x = 100
		for (let i = 0; i < 5; ++i)
		{
			const pot = dummies.create(x, 100, 'pot')
			this.components.addComponent(pot, new ExplosionDamage(bombColliders))
			x += 50
		}

		const pot = dummies.create(width * 0.7, height * 0.7, 'pot')
		this.components.addComponent(pot, new ExplosionDamage(bombColliders))

		this.player = this.physics.add.sprite(width * 0.5, height * 0.75, 'faune')
		this.player.setBodySize(this.player.width * 0.5, this.player.height * 0.7)
		this.player.setOffset(8, 8)
		this.createPlayerAnimations()

		// add components to player
		this.components.addComponent(this.player, new KeyboardMovement(this.cursors))
		this.components.addComponent(this.player, new AnimationOnInput(this.cursors, {
			left: { key: 'run-side', flip: true },
			right: { key: 'run-side' },
			up: { key: 'run-up' },
			down: { key: 'run-down' },
			none: { key: 'idle' }
		}))
		this.components.addComponent(this.player, new SelectionCursor(this.cursors))
		this.components.addComponent(this.player, new BombSpawner(bombColliders, this.cursors, bombsLayer))

		// add colliders
		this.physics.add.collider(this.player, dummies)
    }

	update(t: number, dt: number)
	{
		this.components.update(dt)
	}

	private createPlayerAnimations()
	{
		this.player.anims.create({
			key: 'run-side',
			frames: this.player.anims.generateFrameNames('faune', {
				start: 1,
				end: 8,
				prefix: 'run-side-',
				suffix: '.png'
			}),
			frameRate: 10
		})
		this.player.anims.create({
			key: 'run-up',
			frames: this.player.anims.generateFrameNames('faune', {
				start: 1,
				end: 8,
				prefix: 'run-up-',
				suffix: '.png'
			}),
			frameRate: 10
		})
		this.player.anims.create({
			key: 'run-down',
			frames: this.player.anims.generateFrameNames('faune', {
				start: 1,
				end: 8,
				prefix: 'run-down-',
				suffix: '.png'
			}),
			frameRate: 10
		})
		this.player.anims.create({
			key: 'idle-up',
			frames: [{
				key: 'faune',
				frame: 'run-up-3.png'
			}]
		})
		this.player.anims.create({
			key: 'idle-down',
			frames: [{
				key: 'faune',
				frame: 'run-down-3.png'
			}]
		})
		this.player.anims.create({
			key: 'idle-side',
			frames: [{
				key: 'faune',
				frame: 'run-side-3.png'
			}]
		})
	}
}
