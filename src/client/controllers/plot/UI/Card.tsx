import Make from "@rbxts/make";
import { RunService } from "@rbxts/services";
import Vide, { cleanup, Derivable, derive, effect, read, source, spring } from "@rbxts/vide";
import { Button } from "client/controllers/components/Button";
import { DropShadow } from "client/controllers/components/DropShadow";
import Image from "client/controllers/components/Image";
import { Input } from "client/controllers/components/Input";
import ObjectViewport from "client/controllers/components/ObjectViewport";
import Text from "client/controllers/components/Text";
import { useItemIndex } from "client/controllers/composables/use-item";
import { useEvent } from "client/controllers/utils/use-event";
import { px } from "client/controllers/utils/use-px";
import { getCardPositionAtIndex } from "./CardUtils";

interface CardToolProps {
	toolName?: Derivable<string>;
	toolPrice?: Derivable<number | string>;
	object?: Derivable<Model>;
	index?: Derivable<number>;
	direction?: Derivable<number>;
	size?: Derivable<UDim2>;
	padding?: Derivable<number>;
	onClick?: () => void;
}

const CENTER = new Vector2(0.5, 0.5);
const ROTATION_SPEED = 0.1;

export default function CardTool({
	toolName,
	toolPrice,
	object = Make("Model", {}),
	size = new UDim2(),
	padding = 0,
	index = 1,
	direction = 0,
	onClick,
}: CardToolProps) {
	const sizeRead = read(size);
	const paddingRead = read(padding);
	const costRead = typeIs(read(toolPrice), "string")
		? () => tonumber(string.split(read(toolPrice) as string, "$")[1])
		: () => read(toolPrice);
	const directionRead = read(direction);
	const nameRead = () => read(toolName);
	const indexChanged = () => read(index);
	const modelRead = () => read(object);
	const rotation = source<CFrame>(CFrame.Angles(0, 0, 0));
	const position = derive(() => getCardPositionAtIndex(directionRead, sizeRead, px(65)));

	const disconnect = useEvent(RunService.Heartbeat, (delta) => {
		const newRot = CFrame.Angles(0, math.rad(rotation().Y + ROTATION_SPEED * delta) % (math.pi * 2), 0);
		rotation(newRot);
	});
	cleanup(disconnect);

	return (
		<frame
			Name={() => `${indexChanged()}`}
			Position={position()}
			Size={size}
			BackgroundColor3={Color3.fromHex("FFE0E0")}
			AnchorPoint={new Vector2(0.5, 0)}
		>
			<ObjectViewport Rotation={() => rotation()} Object={() => modelRead()} Depth={px(0)} />
			<Text
				text={() => `${nameRead()}`}
				textColor={Color3.fromHex("F49494")}
				textFont={Enum.Font.ArialBold}
				position={UDim2.fromOffset(0, -px(25))}
				native={{ TextYAlignment: "Top" }}
			/>
			<Text
				text={() => `$${costRead()}`}
				textColor={Color3.fromHex("F49494")}
				textFont={Enum.Font.ArialBold}
				position={UDim2.fromOffset(0, px(55))}
				native={{ TextXAlignment: "Right" }}
			/>

			<DropShadow radius={px(5)} color={Color3.fromHex("#9ac8db")} />

			<Input
				inputBegan={(input) => {
					if (input.UserInputType === Enum.UserInputType.MouseButton1) onClick;
				}}
			/>

			<uicorner CornerRadius={new UDim(0, px(30))} />
		</frame>
	);
}
