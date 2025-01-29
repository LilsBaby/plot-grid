import Vide, { Derivable, Node } from "@rbxts/vide";
import Image from "./Image";

interface GlowProps {
	color?: Derivable<Color3>;
	position?: Derivable<UDim2>;
	size?: Derivable<UDim2>;
	transparency?: Derivable<number>;
	children?: Node;
}

export default function Glow({ color, position, size, transparency, children }: GlowProps) {
	return (
		<frame Name="glow" Size={size} BackgroundTransparency={1}>
			<Image image="rbxassetid://140715320005086" color={color} position={position} transparency={transparency}>
				{children}
			</Image>
		</frame>
	);
}
