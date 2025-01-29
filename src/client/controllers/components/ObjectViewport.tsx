import Make from "@rbxts/make";
import Object from "@rbxts/object-utils";
import { t } from "@rbxts/t";
import Vide, { Derivable, derive, effect, PropsWithChildren, read, source } from "@rbxts/vide";
import { cframe } from "@rbxutil/quaternion";
import { useEvent } from "../utils/use-event";
import { RunService } from "@rbxts/services";

export interface ObjectViewportProps {
	readonly Object: Derivable<Model>;
	readonly Depth: number;
	readonly Rotation?: Derivable<CFrame>;
	readonly Transparency?: Derivable<number>;
	readonly children?: Vide.Node;
}

function setDefaultCameraView(camera: Camera, model: Model, cameraDepth = 0): void {
	const [modelCF] = model.GetBoundingBox();

	const radius = model.GetExtentsSize().Magnitude / 2;
	const halfFov = math.rad(camera.FieldOfView) / 2;
	const depth = radius / math.tan(halfFov) + cameraDepth;
	camera.CFrame = camera.CFrame.sub(camera.CFrame.Position)
		.add(modelCF.Position)
		.add(camera.CFrame.Position.sub(modelCF.Position).Unit.mul(depth));
}

/**
 *
 * @param Object
 * @param Depth
 * @param Rotation
 * @param Transparency 
 * @returns
 */
export default function ObjectViewport({ Object, Depth, Rotation, Transparency = 0, children }: ObjectViewportProps) {
	Rotation ??= new CFrame();
	const model = () => (!t.nil(read(Object)) ? read(Object).Clone() : Make("Model", {}));
	const viewportCamera = Make("Camera", {});
	setDefaultCameraView(viewportCamera, model(), Depth);

	effect(() => {
		model().PivotTo(model().GetPivot().mul(read(Rotation)));
	});

	return (
		<viewportframe
			BackgroundTransparency={1}
			CurrentCamera={viewportCamera}
			Size={UDim2.fromScale(1, 1)}
			ImageTransparency={Transparency}
		>
			{viewportCamera}
			{model}
			{children}
		</viewportframe>
	);
}
