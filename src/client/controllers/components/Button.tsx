import Vide, { Derivable, Node, read, show, source, spring } from "@rbxts/vide";
import { px } from "../utils/use-px";

interface ButtonProps {
	onClick?: () => void;
	text?: Derivable<string>;
	textFont?: Derivable<Enum.Font>;
	anchor?: Derivable<Vector2>;
	position?: Derivable<UDim2>;
	size?: Derivable<UDim2>;
	color?: Derivable<Color3>;
	backgroundColor?: Derivable<Color3>;
	borderColor?: Derivable<Color3>;
	borderRadius?: Derivable<number>;
	rotation?: Derivable<number>;
	native?: Vide.InstanceAttributes<TextButton>;
	children?: Node;
}

export function Button({
	onClick,
	text,
	textFont,
	color,
	backgroundColor,
	borderColor,
	borderRadius = 0,
	anchor,
	position,
	rotation = 0,
	size,
	native,
	children,
}: ButtonProps) {
	const hovered = source(false);
	const pressed = source(false);

	const buttonSize = spring(() => {
		return hovered() && !pressed() ? new UDim2(1, px(14), 1, px(14)) : new UDim2(1, 0, 1, 0);
	}, 0.2);

	const buttonPosition = spring(() => {
		return pressed() ? new UDim2(0.5, 0, 0.5, px(10)) : new UDim2(0.5, 0, 0.5, 0);
	}, 0.25);

	const showStroke = () => typeIs(read(borderColor), "Color3");
	const stroke = show(showStroke, () => <uistroke Color={borderColor} Thickness={borderRadius}></uistroke>);

	return (
		<frame BackgroundTransparency={1} AnchorPoint={anchor} Position={position} Size={size}>
			<textbutton
				Activated={onClick}
				MouseEnter={() => hovered(true)}
				MouseLeave={() => {
					hovered(false);
					pressed(false);
				}}
				MouseButton1Down={() => pressed(true)}
				MouseButton1Up={() => pressed(false)}
				Text={text}
				TextSize={() => px(24)}
				TextColor3={color}
				BackgroundColor3={backgroundColor}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={buttonPosition}
				Size={buttonSize}
				Rotation={rotation}
				{...native}
			>
				{children}
			</textbutton>
			{stroke}
		</frame>
	);
}
