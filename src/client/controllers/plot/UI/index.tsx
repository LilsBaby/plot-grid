import Vide, { action, Derivable, derive, effect, For, read, show, Show, source, spring } from "@rbxts/vide";
import { BuildTools, BuildType } from "types/enums/build-tools";
import { UserInputService, Workspace } from "@rbxts/services";
import { px, usePx } from "client/controllers/utils/use-px";
import { useEvent } from "client/controllers/utils/use-event";
import { t } from "@rbxts/t";
import Text from "client/controllers/components/Text";
import { Button } from "client/controllers/components/Button";
import BuildTool from "./BuildTool";

const CAMERA = Workspace.CurrentCamera as Camera;
const DEFAULT_CATEGORY = "Wall";
const ARROW_PRESSED_ROTATION = 270;
const ARROW_DEFAULT_ROTATION = 90;
const TOGGLE_KEY = Enum.KeyCode.M;

interface PlotBuildUIProps {
	onToolActivated: Derivable<(category: BuildType, tool: Model) => void>;
	onToolDeactivated: Derivable<(category: BuildType, tool: Model, switchTool: boolean) => void>;
	categories: Derivable<BuildType[]>;
	onInputBegan: Derivable<(inputObject: InputObject) => void>;
	onInputEnded: Derivable<(inputObject: InputObject) => void>;
	cancel: Derivable<() => void>;
}

const FEATURES = ["Terrain", "Paint", "Build", "Delete"];
const BUILD_TOOLS = ["Scale", "Transform", "Redo", "Grid"];

export default function PlotBuildUI({
	categories,
	cancel,
	onToolActivated,
	onToolDeactivated,
	onInputBegan,
	onInputEnded,
}: PlotBuildUIProps) {
	usePx();
	const arrowPressed = source<boolean>(false);
	const featureActivated = source<boolean>(false);
	const absSize = source<Vector2>();
	const arrowRotation = spring(() => (arrowPressed() ? 90 : 270), 0.2);
	const containerSize = spring(() =>
		arrowPressed() ? UDim2.fromOffset(px(350), px(300)) : UDim2.fromOffset(px(350), px(100)),
	);

	return (
		<frame Name="build_ui" BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
			<frame Name="build" BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
				<frame
					Name="container"
					Size={() => {
						const size = read(absSize);
						return UDim2.fromOffset(size?.X, size?.Y);
					}}
					ClipsDescendants={true}
				></frame>

				<frame
					Size={containerSize}
					AutomaticSize={"Y"}
					BackgroundTransparency={1}
					action={(container) => {
						absSize(container.AbsoluteSize);
						container
							.GetPropertyChangedSignal("AbsoluteSize")
							.Connect(() => absSize(container.AbsoluteSize));
					}}
				>
					<frame Size={UDim2.fromOffset(px(150), px(95))} BackgroundTransparency={1}>
						<Text text="Build" textSize={() => px(25)} size={UDim2.fromOffset(px(50), px(10))} />
						<Button
							text=">"
							size={UDim2.fromOffset(px(55), px(55))}
							rotation={arrowRotation}
							onClick={() => arrowPressed(!arrowPressed())}
						>
							<uicorner CornerRadius={new UDim(0, px(15))} />
						</Button>
						<uilistlayout
							HorizontalAlignment="Center"
							VerticalAlignment="Center"
							Padding={new UDim(0, px(15))}
							HorizontalFlex="SpaceAround"
						/>
					</frame>

					<frame Size={UDim2.fromOffset(px(150), px(50))}>
						<Show when={() => arrowPressed()}>
							{() => (
								<For each={() => FEATURES}>
									{(feature) => (
										<Button
											text={feature.upper()}
											size={UDim2.fromOffset(px(45), px(10))}
											anchor={new Vector2(0.5, 0.5)}
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

					<uilistlayout
						HorizontalAlignment="Center"
						VerticalAlignment="Center"
						Padding={new UDim(0, px(15))}
					/>
				</frame>

				<uipadding PaddingBottom={new UDim(0, px(15))} />
				<uilistlayout HorizontalAlignment="Center" VerticalAlignment="Bottom" />
			</frame>

			<Show when={() => featureActivated()}>
				{() => (
					<frame Name="tools" Size={UDim2.fromScale(1, 1)}>
						<For each={() => BUILD_TOOLS}>
							{([tool, index]) => <BuildTool toolName={tool} index={index} />}
						</For>

						<uilistlayout
							HorizontalAlignment="Right"
							VerticalAlignment="Center"
							Padding={new UDim(0, px(15))}
							FillDirection="Vertical"
						/>
					</frame>
				)}
			</Show>
		</frame>
	);

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
