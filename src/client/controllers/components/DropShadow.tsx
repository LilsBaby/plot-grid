import Vide, { Derivable, read } from "@rbxts/vide";
import { px } from "../utils/use-px";

interface DropShadowProps {
	circular?: boolean;
	color?: Derivable<Color3>;
	image?: Derivable<string>;
	transparency?: Derivable<number>;
	radius?: Derivable<number>;
	overflow?: Derivable<number>;
	offset?: Derivable<number>;
	children?: Vide.Node;
}

const OFFSET = -23;
const SLICE_CENTER = new Rect(52, 52, 52, 52);
const OVERFLOW = new Vector2(72, 90);
const BASE_RADIUS = 16;

export function DropShadow({
	circular,
	color = new Color3(),
	transparency = 0.7,
	image = "rbxassetid://14120516187",
	radius = BASE_RADIUS,
	overflow = 0,
	offset = 0,
	children,
}: DropShadowProps) {
	const scale = () => {
		const percent = px(read(radius)) / px(BASE_RADIUS);
		return px.scale(percent);
	};

	const size = () => {
		const x = OVERFLOW.X * scale() + px(read(overflow));
		const y = OVERFLOW.Y * scale() + px(read(overflow));
		return new UDim2(1, x, 1, y);
	};

	const position = () => {
		return new UDim2(0.5, 0, 0, (OFFSET + read(offset)) * scale());
	};
	return (
		<imagelabel
			Name="shadow"
			Image={image}
			ImageColor3={color}
			ImageTransparency={transparency}
			ScaleType="Slice"
			SliceScale={circular ? 100 : scale}
			SliceCenter={SLICE_CENTER}
			BackgroundTransparency={1}
			AnchorPoint={new Vector2(0.5, 0)}
			Size={size}
			Position={position}
		>
			{children}
		</imagelabel>
	);
}
