import Phaser from 'phaser'
import short from 'short-uuid'

export type Constructor<T extends {} = {}> = new (...args: any[]) => T

export interface IComponent
{
	// NOTE: components were added later
	init(go: Phaser.GameObjects.GameObject, components: ComponentService)

	awake?: () => void
	start?: () => void
	update?: (dt: number) => void

	destroy?: () => void
}

// NOTE: this interface were added later
export interface IComponentsService
{
	addComponent(go: Phaser.GameObjects.GameObject, component: IComponent)
	findComponent<ComponentType>(go: Phaser.GameObjects.GameObject, componentType: Constructor<ComponentType>): ComponentType | undefined
	removeComponent(go: Phaser.GameObjects.GameObject, component: IComponent)
	removeAllComponents(go: Phaser.GameObjects.GameObject)
	destroy()
	update(dt: number)
}

export default class ComponentService implements IComponentsService
{
	private componentsByGameObject = new Map<string, IComponent[]>()

	private queuedForStart: IComponent[] = []

	addComponent(go: Phaser.GameObjects.GameObject, component: IComponent)
	{
		if (!go.name)
		{
			// give it an id if not exist
			go.name = short.generate()
		}
		
		if (!this.componentsByGameObject.has(go.name))
		{
			this.componentsByGameObject.set(go.name, [])
		}
		
		const list = this.componentsByGameObject.get(go.name)
		list!.push(component)

		component.init(go, this)
		if (component.awake)
		{
			component.awake()
		}

		if (component.start)
		{
			this.queuedForStart.push(component)
		}
	}

	// NOTE: this is new
	removeComponent(go: Phaser.GameObjects.GameObject, component: IComponent)
	{
		if (!go.name)
		{
			return
		}

		if (!this.componentsByGameObject.has(go.name))
		{
			return
		}

		const list = this.componentsByGameObject.get(go.name) as IComponent[]
		const index = list.findIndex(comp => comp === component)

		if (index < 0)
		{
			return
		}

		list.splice(index, 1)

		component.destroy?.()
	}

	// NOTE: this is also new
	removeAllComponents(go: Phaser.GameObjects.GameObject)
	{
		const components = this.componentsByGameObject.get(go.name) ?? []
		components.forEach(component => {
			component.destroy?.()
		})

		this.componentsByGameObject.delete(go.name)
	}

	findComponent<ComponentType>(go: Phaser.GameObjects.GameObject, componentType: Constructor<ComponentType>)
	{
		const components = this.componentsByGameObject.get(go.name) ?? []
		return components.find(component => component instanceof componentType) as ComponentType | undefined
	}

	destroy()
	{
		this.componentsByGameObject.forEach(components => {
			components.forEach(component => {
				if (component.destroy)
				{
					component.destroy()
				}
			})
		})
	}

	update(dt: number)
	{
		while (this.queuedForStart.length > 0)
		{
			const component = this.queuedForStart.shift()
			if (component && component.start)
			{
				component.start()
			}
		}

		this.componentsByGameObject.forEach(components => {
			// NOTE: new, create shallow copy for added remove
			components.slice().forEach(component => {
				if (component.update)
				{
					component.update(dt)
				}
			})
		})
	}
}