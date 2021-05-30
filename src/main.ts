import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import BombAttackScene from './scenes/BombAttackScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 400,
	height: 300,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true
		}
	},
	scale: {
		zoom: 1.5
	},
	scene: [Preloader, BombAttackScene]
}

export default new Phaser.Game(config)
