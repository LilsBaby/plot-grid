import { UserInputService, Workspace } from "@rbxts/services";
import Option from "shared/packages/Option";

const camera = Workspace.CurrentCamera as Camera;
const raycastParams = new RaycastParams();

export default class Mouse {
	public static RayCast(raycastParams: RaycastParams): Option<Vector3> {
		const mouseLocation = UserInputService.GetMouseLocation();
		const mouseRay = camera.ViewportPointToRay(mouseLocation.X, mouseLocation.Y, 1);

		const raycast = Workspace.Raycast(mouseRay.Origin, mouseRay.Direction.mul(1000), raycastParams);
		if (raycast?.Position) {
			return Option.Some(raycast.Position);
		} else {
			const alongCF = CFrame.lookAlong(mouseRay.Origin, mouseRay.Direction.mul(100)).Position;
			return Option.Some(alongCF);
		}

		return Option.None;
	}
}
