import Vide, { action, Derivable, derive, For, Node, read, show, source } from "@rbxts/vide";
import { Button } from "./Button";
import Text from "./Text";
import { px } from "../utils/use-px";

interface DropdownProps {
	boxPlaceholder?: Derivable<string>;
	boxBorderColor?: Derivable<Color3>;
	boxBorderRadius?: Derivable<number>;
	items?: Derivable<string[]>;
	size?: Derivable<UDim2>;
	padding?: Derivable<number>;
	scrollSize?: Derivable<number>;
	position?: Derivable<UDim2>;
	visible?: Derivable<boolean>;
	direction?: Derivable<"Vertical" | "Horizontal">;
	onClick: Derivable<(item: string) => void>;
	children?: Node;
}

export default function Dropdown({
	boxPlaceholder,
	boxBorderColor,
	boxBorderRadius,
	size,
	items = [],
	position,
	padding = 0,
	scrollSize = 2,
	direction = "Vertical",
	onClick,
	children,
}: DropdownProps) {
	const paddingRead = read(padding);
	const itemsRead = () => read(items);
	const scrollSizeRead = read(scrollSize);
	const visible = source(false);
	const absSize = source<Vector2>();
	const isVertical = source(direction === "Vertical");
	const canvasSize = derive(() => {
		const each = itemsRead().size() / scrollSizeRead;
		return isVertical() ? UDim2.fromScale(0, each) : UDim2.fromScale(each, 0);
	});

	return (
		<frame
			Name="dropdown"
			Size={size}
			Position={position}
			AbsoluteSizeChanged={(abs) => absSize(abs)}
			AnchorPoint={new Vector2(0, 1)}
		>
			<scrollingframe
				Size={() => UDim2.fromScale(1, itemsRead().size())}
				CanvasSize={canvasSize}
				BackgroundTransparency={1}
				Position={new UDim2()}
				AnchorPoint={new Vector2(0, 1)}
				Visible={visible}
			>
				<For each={itemsRead}>
					{(item, index) => {
						const position = math.abs((1 / itemsRead().size() ) * index() - 1);
						return (
							<frame
								LayoutOrder={index()}
								Size={() => UDim2.fromOffset(absSize()?.X, absSize()?.Y)}
								Position={UDim2.fromScale(0, position)}
							>
								<Button
									size={UDim2.fromScale(1, 1)}
									text={() => `<${item}>`}
									onClick={() => {
										onClick(item);
										visible(!visible());
									}}
								/>
							</frame>
						);
					}}
				</For>
			</scrollingframe>

			<Button
				text=""
				color={Color3.fromRGB(255, 255, 255)}
				anchor={new Vector2()}
				size={UDim2.fromScale(1, 1)}
				onClick={() => visible(!visible())}
			>
				<Text
					text={() => `${read(boxPlaceholder)}`}
					size={UDim2.fromScale(1, 1)}
					textSize={px(25)}
					textColor={Color3.fromHex("CCBEBE")}
				>
					<uistroke Color={boxBorderColor} Thickness={boxBorderRadius} />
					<uicorner CornerRadius={new UDim(0, px(50))} />
				</Text>
				<uicorner CornerRadius={new UDim(0, px(50))} />
			</Button>
			{children}
		</frame>
	);
}
