import Vide, { Derivable, Node, read } from "@rbxts/vide";
import { px } from "../utils/use-px";

interface TextProps {
	text?: Derivable<string>;
	textSize?: Derivable<number>;
	textFont?: Derivable<Enum.Font>;
	textColor?: Derivable<Color3>;
	size?: Derivable<UDim2>;
	position?: Derivable<UDim2>;
	anchorPoint?: Derivable<Vector2>;
	rotation?: Derivable<number>;
	native?: Vide.InstanceAttributes<TextLabel>;
	children?: Node;
}

export default function Text({
	text,
	textSize,
	textFont,
	textColor,
	size,
	position,
	rotation = 0,
	anchorPoint,
	native,
	children,
}: TextProps) {
	return (
		<frame
			BackgroundTransparency={1}
			Size={() => read(size) ?? UDim2.fromScale(1, 1)}
			Position={position}
			Rotation={rotation}
			AnchorPoint={anchorPoint}
		>
			<textlabel
				BackgroundTransparency={1}
				Text={text}
				TextSize={textSize ?? px(24)}
				TextColor3={textColor}
				
				Size={UDim2.fromScale(1, 1)}
				Font={textFont}
				{...native}
			>
			</textlabel>
			{children}
		</frame>
	);
}
