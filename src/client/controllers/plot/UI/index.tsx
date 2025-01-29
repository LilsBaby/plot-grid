import Vide, {
	action,
	Case,
	Derivable,
	derive,
	effect,
	For,
	read,
	show,
	Show,
	source,
	spring,
	Switch,
} from "@rbxts/vide";
import { BuildTools, BuildType } from "types/enums/build-tools";
import { UserInputService, Workspace } from "@rbxts/services";
import { px, usePx } from "client/controllers/utils/use-px";
import { useEvent } from "client/controllers/utils/use-event";
import { t } from "@rbxts/t";
import Text from "client/controllers/components/Text";
import { Button } from "client/controllers/components/Button";
import BuildTool from "./Card";
import Dropdown from "client/controllers/components/Dropdown";
import { DropShadow } from "client/controllers/components/DropShadow";
import Glow from "client/controllers/components/Glow";
import Features from "./Features";
import Overlay from "./Overlay";
import { ItemSprites } from "types/constants/item-sprites";
import { Input } from "client/controllers/components/Input";

const CAMERA = Workspace.CurrentCamera as Camera;
const DEFAULT_CATEGORY = "Wall";
const ARROW_PRESSED_ROTATION = 270;
const ARROW_DEFAULT_ROTATION = 90;
const TOGGLE_KEY = Enum.KeyCode.M;

interface PlotBuildUIProps {
	onToolActivated: Derivable<(category: BuildType, tool: Model) => void>;
	onToolDeactivated: Derivable<(category: BuildType, tool: Model, switchTool: boolean) => void>;
	cancel: Derivable<() => void>;
}

const DROPDOWN_ITEMS = ["Furniture", "Decoration", "Roof", "Wall", "Window"];
const FEATURES = ["Terrain", "Paint", "Build", "Delete"];
const BUILD_TOOLS = ["Scale", "Transform", "Redo", "Grid"];

export default function PlotBuildUI({ onToolActivated, onToolDeactivated, cancel }: PlotBuildUIProps) {
	usePx();
	const arrowPressed = source<boolean>(false);
	const featureActivated = source<boolean>(false);
	const arrowRotation = spring(() => (arrowPressed() ? ARROW_DEFAULT_ROTATION : ARROW_PRESSED_ROTATION), 0.2);
	const absSize = source<Vector2>();
	const absPosition = spring(
		() => (absSize() !== undefined ? UDim2.fromOffset(absSize()!.X, absSize()!.Y) : UDim2.fromOffset(0, 0)),
		0.2,
	);

	const featuresShow = show(
		() => arrowPressed() && !featureActivated(),
		() => (
			<Features
				features={FEATURES}
				featurePressed={() => {
					featureActivated(true);
				}}
			/>
		),
		() => <></>,
	);

	const overlayShow = show(
		() => featureActivated(),
		() => <Overlay dropdown={DROPDOWN_ITEMS} items={ItemSprites.Furniture} />,
		() => <></>,
	);

	return (
		<frame Name="build_ui" BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
			<frame Name="first" Size={() => absPosition()} ClipsDescendants={true} AnchorPoint={new Vector2(0, 1)}>
				<uicorner CornerRadius={new UDim(0, px(50))} />

				<Glow size={UDim2.fromScale(1, 1)} transparency={0} />
				<DropShadow color={Color3.fromRGB(169, 193, 194)} radius={px(35)} offset={px(65)} />
				<uilistlayout VerticalAlignment="Bottom" HorizontalAlignment="Center" />
			</frame>

			<frame
				Name="second"
				Size={UDim2.fromOffset(px(1750), px(115))}
				BackgroundTransparency={1}
				AutomaticSize="Y"
				AnchorPoint={new Vector2(0, 1)}
				AbsoluteSizeChanged={(abs) => absSize(abs)}
			>
				<frame Size={UDim2.fromOffset(px(2350), px(190))} BackgroundTransparency={1}>
					<Text
						text="Build"
						textSize={() => px(25)}
						textFont={Enum.Font.ArialBold}
						textColor={Color3.fromHex("FFB2B2")}
						size={UDim2.fromOffset(px(50), px(10))}
					/>
					<Button
						text=">"
						color={Color3.fromHex("FFB2B2")}
						size={UDim2.fromOffset(px(55), px(55))}
						rotation={arrowRotation}
						onClick={() => {
							featureActivated(false);
							arrowPressed(!arrowPressed());
						}}
					>
						<Glow size={UDim2.fromScale(1, 1)} color={Color3.fromHex("FFB2B2")} />
						<uicorner CornerRadius={new UDim(0, px(30))} />
					</Button>

					<uipadding PaddingLeft={new UDim(0, px(30))} />
					<uilistlayout
						HorizontalAlignment="Center"
						VerticalAlignment="Center"
						Padding={new UDim(0, px(15))}
						FillDirection="Horizontal"
						HorizontalFlex="SpaceAround"
					/>
				</frame>

				{featuresShow}
				{overlayShow}

				<Input
					inputBegan={(input) => {
						if (input.KeyCode === TOGGLE_KEY) {
							featureActivated(false);
							arrowPressed(!arrowPressed());
						}
					}}
				/>

				<uilistlayout FillDirection="Vertical" HorizontalAlignment="Center" />
			</frame>

			<uipadding PaddingBottom={new UDim(0, px(25))} PaddingLeft={new UDim(0.3, 0)} PaddingTop={new UDim(1, 0)} />
		</frame>
	);

	/**
	 * <frame Size={UDim2.fromOffset(px(150), px(50))}>
						<Show when={() => arrowPressed()}>
							{() => (
								<For each={() => FEATURES}>
									{(feature) => (
										<Button
											text={feature.upper()}
											size={UDim2.fromOffset(px(45), px(10))}
											anchor={new Vector2(0.5, 0.5)}
											onClick={() => featureActivated(true)}
										></Button>
									)}
								</For>
							)}
						</Show>
						<uilistlayout
							HorizontalAlignment="Center"
							VerticalAlignment="Center"
							HorizontalFlex="SpaceEvenly"
						/>
					</frame>
	 */

	/**
	 * const activated = source(false);
	const isToolActivated = source(false);
	const currentCategory = source<BuildType>(DEFAULT_CATEGORY);
	const currentTool = source<Model | undefined>();
	const categoryActivated = source(false);
	const itemsContainer = read(categories);

	const toolsContainerPosition = spring(() => {
		return activated() ? SLIDE_OVERLAY_POSITION : DEFAULT_OVERLAY_POSITION;
	}, 0.2);

	useEvent(UserInputService.InputBegan, (input, gps) => {
		if (gps) return;
		if (input.KeyCode === Enum.KeyCode.M) {
			activated(!activated());
		} else if (input.KeyCode === Enum.KeyCode.X && isToolActivated()) {
			isToolActivated(false);
			onToolDeactivated(currentCategory(), currentTool() as Model, false);
			currentTool(undefined)
		}
	});

	return (
		<>
			<frame>
				<frame
					Size={UDim2.fromOffset(px(850), px(250))}
					Position={toolsContainerPosition}
					AnchorPoint={new Vector2(0.5, 0.5)}
				>
					<frame Name="container" Size={UDim2.fromScale(0.4, 1)} BackgroundTransparency={1}>
						<For
							each={() => itemsContainer}
							children={(v) => (
								<frame
									Name={v}
									Size={UDim2.fromOffset(px(200), px(45))}
									BackgroundColor3={Color3.fromRGB(255, 229, 211)}
								>
									<textlabel
										Size={UDim2.fromScale(1, 1)}
										Text={v.upper()}
										TextScaled={true}
										TextColor3={Color3.fromRGB(255, 255, 255)}
										Font={Enum.Font.FredokaOne}
										TextSize={px(18)}
										FontFace={new Font("rbxassetid://12187365364")}
										BackgroundTransparency={1}
									></textlabel>

									<textbutton
										Size={UDim2.fromScale(1, 1)}
										BackgroundTransparency={1}
										MouseButton1Click={() => {
											categoryActivated(false);
											currentCategory(v);
											categoryActivated(true);
											print("activated", v, currentCategory());
										}}
									></textbutton>
								</frame>
							)}
						></For>

						<uilistlayout
							Padding={new UDim(0, px(10))}
							HorizontalAlignment="Center"
							VerticalAlignment="Center"
							ItemLineAlignment="Start"
							FillDirection="Vertical"
						/>
					</frame>

					<frame Name="tools-container" Size={UDim2.fromScale(0.6, 1)} BackgroundTransparency={1}>
						<Show when={categoryActivated} fallback={() => <></>}>
							{() => (
								<ToolsDisplay
									category={() => currentCategory()}
									onActivated={(category, tool) => {
										if (currentTool() || isToolActivated()) {
											print("Picking another tool");
											onToolDeactivated(category, tool, true);
											currentTool(tool);
											onToolActivated(category, tool);
										} else {
											isToolActivated(true);
											currentTool(tool);
											onToolActivated(category, tool);
										}
									}}
								/>
							)}
						</Show>
					</frame>

					<uilistlayout FillDirection="Horizontal" />

					<uicorner></uicorner>
				</frame>
			</frame>

			<frame BackgroundTransparency={1}>
				<ToolsIcon onBuildIconActivated={() => activated(!activated())} />
			</frame>

			<uilistlayout
				HorizontalAlignment="Center"
				VerticalAlignment="Bottom"
				ItemLineAlignment="Start"
				FillDirection="Vertical"
			/>
			<uipadding PaddingBottom={new UDim(0, px(50))}></uipadding>
		</>
	);
	 */
}
