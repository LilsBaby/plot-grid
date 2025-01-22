import { Controller, OnStart } from "@flamework/core";
import { ReplicatedStorage, RunService, UserInputService, Workspace } from "@rbxts/services";
import Mouse from "../keybinds/Mouse";
import { t } from "@rbxts/t";

/**
 * `PlotPlacementController`
 * Handles plot placement.
 */

@Controller({})
export class PlotPlacementController implements OnStart {
	// private Grid = new Grid(Workspace.WaitForChild("Plot", 30) as BasePart, 6);
	private Cursor = ReplicatedStorage.FindFirstChild("Cursor")?.Clone() as Model;

	private RotateIndex = 1;
	private IN_BOUNDS_COLOR = Color3.fromRGB(78, 165, 86);
	private NOT_IN_BOUNDS_COLOR = Color3.fromRGB(193, 36, 78);
	private SMOOTHNESS = 10

	onStart() {
		

		/**
		 * 
		 * const raycastParams = new RaycastParams();
		this.Cursor.Parent = Workspace;
		 * UserInputService.InputBegan.Connect((input, gps) => {
			if (input.KeyCode === Enum.KeyCode.R && !gps) {
				this.RotateIndex += 1;
				this.RotateIndex %= 4;
			}
		});

		const UpdateCursor = () => {
			Mouse.RayCast(raycastParams).Match({
				Some: (worldPos) => {
					this.Grid.GetCellFromWorldPosition(worldPos).Match({
						Some: (cell) => {
							const cellCFrame = this.Grid.GetCellWorldCFrame(cell);
							if (!cellCFrame) return;
							if (!this.Cursor.PrimaryPart) return;

							// const [rotX, rotY, rotZ] = (this.Cursor.PrimaryPart as BasePart).CFrame.ToEulerAnglesXYZ();
							const heartbeat = RunService.Heartbeat.Wait()[0];

							this.Cursor.PivotTo(
								this.Cursor.PrimaryPart.CFrame.Lerp(
									cellCFrame
										.add(new Vector3(0, this.Cursor.GetExtentsSize().Y / 2, 0))
										.mul(CFrame.fromEulerAnglesXYZ(0, (math.pi / 2) * this.RotateIndex, 0)),
									heartbeat * this.SMOOTHNESS,
								),
							);
						},
						None: () => {},
					});
				},
				None: () => {},
			});
		};

		UpdateCursor();
		RunService.BindToRenderStep("placement", Enum.RenderPriority.Last.Value, UpdateCursor);
		 */
		
	}

	private toggleInBounds(cursor: Model, toggle: boolean) {
		const inBoundsPart = this.Cursor.FindFirstChild("CanPlaceInBounds") as BasePart;
		if (t.nil(inBoundsPart)) return;

		inBoundsPart.Color = toggle ? this.IN_BOUNDS_COLOR : this.NOT_IN_BOUNDS_COLOR;
	}
}
