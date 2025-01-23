import Vide, { action, Derivable, derive, For, Node, read, source } from "@rbxts/vide";

interface DropdownProps {
	items?: Derivable<string[]>;
	size?: Derivable<UDim2>;
	padding?: Derivable<number>;
	scrollSize?: Derivable<number>;
	position?: Derivable<UDim2>;
	visible?: Derivable<boolean>;
	direction?: Derivable<"Vertical" | "Horizontal">;
	children?: Node;
}

export default function Dropdown({
	size,
	items = [],
	position,
	padding = 0,
	scrollSize = 2,
	direction = "Vertical",
	visible,
	children,
}: DropdownProps) {
	const paddingRead = read(padding);
	const itemsRead = () => read(items);
	const scrollSizeRead = read(scrollSize);
	const absSize = source<Vector2>();
	const isVertical = source(direction === "Vertical");
	const canvasSize = derive(() => {
		const each = itemsRead().size() / scrollSizeRead;
		return isVertical() ? UDim2.fromScale(0, each) : UDim2.fromScale(each, 0);
	});

	return (
		<frame Size={size} Position={position} AbsoluteSizeChanged={(abs) => absSize(abs)} Visible={visible}>
			<scrollingframe Size={UDim2.fromScale(1, 1)} CanvasSize={canvasSize} BackgroundTransparency={1}>
				<For each={itemsRead}>
					{(item, index) => {
						const position = (1 / itemsRead().size() + paddingRead) * index();
						return (
							<frame
								LayoutOrder={index()}
								Size={() => UDim2.fromOffset(absSize()?.X, absSize()?.Y)}
								Position={UDim2.fromScale(0, position)}
							></frame>
						);
					}}
				</For>
			</scrollingframe>
			{children}
		</frame>
	);
}
