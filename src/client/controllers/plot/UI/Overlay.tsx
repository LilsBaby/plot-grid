import { Players } from "@rbxts/services";
import Vide, { Derivable, effect, For, read, Show, source, spring } from "@rbxts/vide";
import { Button } from "client/controllers/components/Button";
import Dropdown from "client/controllers/components/Dropdown";
import Text from "client/controllers/components/Text";
import { useItemCategory, useItemIndex } from "client/controllers/composables/use-item";
import { px } from "client/controllers/utils/use-px";
import { updatePlayerData } from "shared/store/plot";
import Card from "./Card";
import { ItemSpriteInterface } from "types/constants/item-sprites";
import { DIRECTIONS_TO_FILL, getCardPositionAtIndex } from "./CardUtils";

interface OverlayProps {
	dropdown?: Derivable<string[]>;
	items?: Derivable<ItemSpriteInterface[]>;
}

export default function Overlay({ items = [], dropdown = [] }: OverlayProps) {
	const dropDownRead = read(dropdown);
	const itemsRead = read(items);
	const category = useItemCategory();
	const currentIndex = useItemIndex();
	itemsRead.sort((a, b) => a.cost! < b.cost!);

	return (
		<frame Size={new UDim2(1, -px(250), 0, px(225))}>
			<Button
				text="<"
				backgroundColor={Color3.fromHex("ECCCCC")}
				size={new UDim2(0, px(30), 0.75, 0)}
				color={Color3.fromRGB(255, 255, 255)}
				anchor={new Vector2(0.5, 0.5)}
				onClick={() => {
					return updatePlayerData(Players.LocalPlayer.Name, (plot) => ({
						...plot,
						currentItemIndex: math.clamp(currentIndex() - 1, 0, itemsRead.size()),
					}));
				}}
			>
				<uicorner CornerRadius={new UDim(0, px(25))} />
			</Button>

			<frame
				Name="overlay-displayer"
				Size={new UDim2(1, 0, 0, px(215))}
				AnchorPoint={new Vector2(0, 1)}
				AutomaticSize="Y"
				BackgroundTransparency={1}
			>
				<Dropdown
					boxPlaceholder={() => (category() !== undefined ? `<${category()}>` : "Select an option")}
					boxBorderColor={Color3.fromHex("FFB2B2")}
					boxBorderRadius={px(1.5)}
					items={dropDownRead}
					direction="Vertical"
					size={UDim2.fromOffset(px(200), px(45))}
					padding={0.25}
					scrollSize={1}
					onClick={(category) =>
						updatePlayerData(Players.LocalPlayer.Name, (plot) => ({
							...plot,
							BuildState: {
								currentSelectedCategory: category,
							},
						}))
					}
				/>

				<frame Size={new UDim2(1, px(50), 0, px(78))}>
					<For each={() => DIRECTIONS_TO_FILL}>
						{(direction) => {
							const index = () => (currentIndex() + direction) % itemsRead.size();
							const item = () => itemsRead[index() - 1];
							return (
								<Show when={() => currentIndex() !== undefined && item() !== undefined}>
									{() => {
										return item() !== undefined ? (
											<Card
												toolName={() => item().id}
												toolPrice={() => item().cost}
												object={() => item().model as Model}
												direction={direction}
												index={() => index()}
												padding={px(65)}
												size={() => UDim2.fromOffset(px(100), px(100))}
												onClick={() => {}}
											/>
										) : (
											<></>
										);
									}}
								</Show>
							);
						}}
					</For>
				</frame>

				<uilistlayout
					Padding={new UDim(0, px(55))}
					HorizontalAlignment="Center"
					VerticalAlignment="Top"
					FillDirection="Vertical"
				/>
			</frame>

			<Button
				text=">"
				backgroundColor={Color3.fromHex("ECCCCC")}
				size={new UDim2(0, px(30), 0.75, 0)}
				color={Color3.fromRGB(255, 255, 255)}
				anchor={new Vector2(0.5, 0.5)}
				onClick={() =>
					updatePlayerData(Players.LocalPlayer.Name, (plot) => ({
						...plot,
						currentItemIndex: math.clamp(currentIndex() + 1, 0, itemsRead.size()),
					}))
				}
			>
				<uicorner CornerRadius={new UDim(0, px(25))} />
			</Button>

			<uilistlayout
				HorizontalAlignment="Center"
				VerticalAlignment="Center"
				HorizontalFlex="SpaceEvenly"
				Padding={new UDim(0, px(35))}
				FillDirection="Horizontal"
			/>
		</frame>
	);
}
