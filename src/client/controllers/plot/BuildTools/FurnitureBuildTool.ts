import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Players, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import { InstanceAttributes } from "@rbxts/vide";
import { Janitor } from "@rbxts/better-janitor";
import Grid from "shared/utils/Grid";
import Mouse from "client/controllers/keybinds/Mouse";
import Tree from "shared/packages/Tree";
import { InputManager, StandardActionBuilder } from "@rbxts/mechanism";
import Builder from "./Builder";

const CastParams = new RaycastParams();
CastParams.FilterType = Enum.RaycastFilterType.Exclude;

interface Attributes {
	edit: boolean;
}

interface Instance extends Player {}

type attributeValue = keyof Attributes;

@Component({
	tag: "WallBuildTool",
	ancestorWhitelist: [Players],
	warningTimeout: 60,

	defaults: {
		edit: t.boolean(false),
	},
})

/**
 * `FurnitureBuildTool`
 * A tool for wall placement
 */
export class FurnitureBuildTool extends Builder<Attributes, Instance> implements OnStart {
	private input = new InputManager();

	private Grid = new Grid(Tree.Await(Workspace, "Plot", 30) as Model, 6);
	private Cursor: Model | undefined;

	private RENDER_NAME = "EditWall";
	private ROTATION = 0;
	private ROTATION_ANGLE = math.pi / 2;
	private MAX_ROTATION_ANGLE = math.pi * 2;
	private SMOOTHNESS = 8.5;

	private ROTATE_ACTION = new StandardActionBuilder("R").setCooldown(0.01).setInputQueueing(false);

	constructor() {
		super();
		print(`Enabling FurnitureBuildTool for Player: ${this.instance.GetFullName()}`);
	}

	onStart() {
		print(this.Grid);
		task.defer(() => {
			this.ROTATE_ACTION.activated.Connect(() => {
				this.ROTATION = (this.ROTATION + 1) % 4;
			});

			this.input.bind(this.ROTATE_ACTION);
		});

		/** Start / stop placement once player start / stop editing */
		task.wait(0.5);
		this.setEdit(true);
		this.runListeningToAttribute("edit");

		this.janitor.addFunction(() => {
			print("Disabling FurnitureBuildTool");
			RunService.UnbindFromRenderStep(this.RENDER_NAME);
		});
	}

	private runListeningToAttribute(attribute: attributeValue) {
		const scanForAttribute = (value: Attributes[attributeValue]) => {
			switch (attribute) {
				case "edit": {
					if (value) {
						this._startPlacement();
					} else {
						this.destroy();
					}
					break;
				}
				default: {
					break;
				}
			}
		};

		scanForAttribute(this.attributes[attribute]);
		this.onAttributeChanged(attribute, (value, _) => {
			print("changed");
			scanForAttribute(value);
		});
	}

	private _startPlacement() {
		if (!this.Cursor) return;
		this.Cursor.Parent = Workspace;

		RunService.UnbindFromRenderStep(this.RENDER_NAME);
		RunService.BindToRenderStep(this.RENDER_NAME, Enum.RenderPriority.Last.Value, (delta) => {
			const mousePos = Mouse.RayCast(CastParams).Unwrap();
			this.Grid.GetCellFromWorldPosition(mousePos).Match({
				Some: (cell) => {
					const worldCFrame = this.Grid.GetCellWorldCFrame(cell);

					if (!worldCFrame) return;
					if (!this.Cursor?.PrimaryPart) return;

					this.Cursor.PivotTo(
						this.Cursor.PrimaryPart.CFrame.Lerp(
							worldCFrame
								.add(new Vector3(0, this.Cursor.GetExtentsSize().Y / 2, 0))
								.mul(CFrame.fromEulerAnglesXYZ(0, (math.pi / 2) * this.ROTATION, 0)),
							delta * this.SMOOTHNESS,
						),
					);
				},
				None: () => {},
			});
		});

		this.janitor.addInstance(this.Cursor);
	}

	public setEdit(edit: boolean) {
		this.attributes.edit = edit;
	}

	public setCursor(cursor: Model) {
		this.Cursor = cursor.Clone();
	}

	public getOwner() {
		return this.getBuilder();
	}

	public destroy(): void {
		this.setEdit(false);
		this.janitor.cleanup();
		this.janitor.destroy();
	}
}
