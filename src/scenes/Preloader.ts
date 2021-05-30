import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene
{
	constructor()
	{
		super('preloader')
	}

	preload()
	{
		this.load.atlas('faune', 'assets/faune.png', 'assets/faune.json')
		this.load.image('bomb', 'assets/bomb.png')
		this.load.image('pot', 'assets/pot.png')
	}

	create()
	{
		this.scene.start('bomb-attack')
	}
}
