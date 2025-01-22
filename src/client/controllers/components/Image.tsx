import Vide, { Derivable, Node } from "@rbxts/vide";

interface ImageProps {
	image?: Derivable<string>;
	transparency?: Derivable<number>;
	color?: Derivable<Color3>;
	size?: Derivable<UDim2>;
	position?: Derivable<UDim2>;
	native?: Vide.InstanceAttributes<ImageLabel>;
	children?: Node;
}

export default function Image({ image, transparency, color, size, position, native, children }: ImageProps) {
	return (
		<frame BackgroundTransparency={1} Size={size} Position={position}>
			<imagelabel
				Image={image}
				ImageTransparency={transparency}
				ImageColor3={color}
				BackgroundTransparency={1}
				{...native}
			>
				{children}
			</imagelabel>
		</frame>
	);
}
