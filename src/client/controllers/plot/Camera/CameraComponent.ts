import { Flamework, OnStart, OnTick } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { AxisActionBuilder, InputManager, RawInput, StandardActionBuilder } from "@rbxts/mechanism";
import { HttpService, Players, RunService, Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { t } from "@rbxts/t";
import Tree from "shared/packages/Tree";
import { Janitor } from "@rbxts/better-janitor";

interface Attributes {
	
}

interface Instance extends Player {}

@Component({
	tag: "CameraEdit",
	ancestorWhitelist: [Players],

	defaults: {  },
})

/**
 * `CameraComponent`
 * Enable custom camera control system once player starts editing.
 *
 * Controls: {
 *     W - Move (Up)
 *     A - Rotate (Left)
 *     S - Move (Down)
 *     D - Rotate (Right)
 *
 *     Mouse Scroll - (Up Or Down)
 * }
 */
export class CameraComponent extends BaseComponent<Attributes, Instance> implements OnStart, OnTick {
	private readonly janitor = new Janitor<string>();

	private readonly inputPressedEvent: Signal<(input: RawInput) => void> = new Signal();
	private readonly mouseScrollEvent: Signal<(input: RawInput, position: Vector3) => void> = new Signal();
	private readonly inputUnpressedEvent: Signal<(input: RawInput) => void> = new Signal();

	private readonly plot: Model = Tree.Find(Workspace, "Plot")! as Model;

	private readonly HEIGHT = 45;
	private readonly UPDATE_CAMERA_RENDER_ID = HttpService.GenerateGUID(false);
	private readonly CUSTOM_CAMERA_TYPE = Enum.CameraType.Scriptable;
	private readonly DEFAULT_ZOOM = this.getCamera().FieldOfView;

	private ORIGIN: CFrame = new CFrame();
	private CURRENT_KEYBIND: RawInput | undefined;
	private MOUSE_SCROLL_POSITION: Vector3 = Vector3.zero;

	/** Keyboard support */
	private Keyboard = [
		new StandardActionBuilder("W"),
		new StandardActionBuilder("A"),
		new StandardActionBuilder("S"),
		new StandardActionBuilder("D"),

		new AxisActionBuilder("MouseWheel"),
	];

	/** @ignore */
	constructor() {
		super();
	}

	onStart() {
		this.applyDefaultKeySettings();
		this.applyDefaultCameraSettings();
		this.listenToKeyBinds();
	}

	onTick(dt: number): void {
		const primary = this.plot.PrimaryPart!;
		const cameraCF = this.getCameraCF();
		// let offset = new Vector3();
		let direction: 1 | -1 = 1;
		let zoom: number = 0;
		const delta = RunService.Heartbeat.Wait()[0];
		const rot = math.rad(primary.Orientation.Y);
		let invalidKey: boolean;
		const keyBind = this.CURRENT_KEYBIND;
		if (keyBind) {
			switch (keyBind) {
				case "W":
					direction += 1 * delta * 1.5;
					break;

				/**
			 * case "A":
				offset = new Vector3(-1, 0, 0)
				break;
			 */
				case "S":
					direction += -1 * delta * 1.5;
					break;

				/**
				 * case "D":
				offset = new Vector3(1, 0, 0)
				break;
				 */

				case "MouseWheel": {
					const up = this.MOUSE_SCROLL_POSITION.Z >= 0;
					zoom = up ? -1 : 1;
					this.setCameraCF(cameraCF.mul(new CFrame(0, 0, zoom)));
					break;
				}

				default:
					invalidKey = true;
					print(`Invalid keybind, got: ${keyBind}`);
					break;
			}
		}
	}

	private applyDefaultCameraSettings() {
		this.disablePlayerMovement();
		const camera = this.getCamera()!;
		const plot = this.plot;
		const center = this.plot.PrimaryPart!.Position;
		const sizeH = plot.GetExtentsSize().div(2);
		const offset = new CFrame(0, this.HEIGHT, -center.Z / 2);
		const finalCF = new CFrame(center).mul(offset);

		if (camera.CameraType !== this.CUSTOM_CAMERA_TYPE) {
			camera.CameraType = this.CUSTOM_CAMERA_TYPE;
		}
		this.ORIGIN = camera.CFrame;
		camera.CFrame = finalCF;
	}

	private applyDefaultKeySettings() {
		const inputManager = new InputManager();
		this.Keyboard.forEach((builder) => {
			let prevZoom: Vector3;
			if (builder instanceof StandardActionBuilder) {
				const http = HttpService.GenerateGUID(false);
				builder.setCooldown(0.01).setInputQueueing(false).setID(http);

				builder.activated.Connect(() => {
					this.inputPressedEvent.Fire(builder.rawInputs[0]);
				});

				builder.deactivated.Connect(() => {
					this.inputUnpressedEvent.Fire(builder.rawInputs[0]);
				});
			} else if (builder instanceof AxisActionBuilder) {
				builder.updated.Connect(() => {
					this.mouseScrollEvent.Fire(builder.axes[0], builder.position);
				});
			}

			inputManager.bind(builder);
		});
	}

	private listenToKeyBinds() {
		this.janitor.addConnection(this.inputPressedEvent.Connect((input) => (this.CURRENT_KEYBIND = input)));
		this.janitor.addConnection(this.inputUnpressedEvent.Connect((input) => (this.CURRENT_KEYBIND = input)));
		this.janitor.addConnection(
			this.mouseScrollEvent.Connect((input, position) => {
				this.CURRENT_KEYBIND = input;
				this.MOUSE_SCROLL_POSITION = position;
			}),
		);
	}

	private disablePlayerMovement() {
		const char = this.instance.Character!;
		const humanoid = Tree.Await(char, "Humanoid") as Humanoid;
		humanoid.WalkSpeed = 0;
	}

	private enablePlayerMovement() {
		const char = this.instance.Character!;
		const humanoid = Tree.Await(char, "Humanoid") as Humanoid;
		humanoid.WalkSpeed = 16;
	}

	private setCameraCF(cf: CFrame) {
		this.getCamera().CFrame = cf;
	}

	private getCameraCF() {
		return this.getCamera().CFrame;
	}

	private getCamera(): Camera {
		return Workspace.CurrentCamera!;
	}

	destroy(): void {
		this.enablePlayerMovement();
		this.setCameraCF(this.ORIGIN);
		this.getCamera().CameraType = Enum.CameraType.Custom;
		this.janitor.cleanup();
		this.janitor.destroy();
	}
}
