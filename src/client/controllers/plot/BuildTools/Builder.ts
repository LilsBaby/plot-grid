import { BaseComponent } from "@flamework/components";
import { Janitor } from "@rbxts/better-janitor";

interface BuilderAttributes {
	edit: boolean;
}

interface BuilderInstance extends Player {}

export default abstract class Builder<A extends BuilderAttributes, I extends BuilderInstance> extends BaseComponent<
	A,
	I
> {
	protected janitor = new Janitor<string>();

	constructor() {
		super();
	}

	public getBuilder() {
		return this.instance
	}
}
