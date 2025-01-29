import Vide, { Derivable, For, read } from "@rbxts/vide";
import { Button } from "client/controllers/components/Button";
import Text from "client/controllers/components/Text";
import { px } from "client/controllers/utils/use-px";

interface featureProps {
	features?: Derivable<string[]>;
	featurePressed?: Derivable<() => void>;
}

export default function Features({ featurePressed = () => {}, features = [] }: featureProps) {
	return (
		<frame Name="features" BackgroundTransparency={1} Size={new UDim2(1, 0, 0, px(50))} AutomaticSize="X">
			<For each={() => read(features)}>
				{(feature) => (
					<Button
						text=""
						color={Color3.fromRGB(255, 255, 255)}
						backgroundColor={Color3.fromHex("FFB2B2")}
						anchor={new Vector2(0.5, 0.5)}
						size={UDim2.fromOffset(px(75), px(35))}
						onClick={() => featurePressed()}
					>
						<Text
							text={() => `<${feature}>`}
							size={UDim2.fromScale(1, 1)}
							textSize={px(20)}
							textColor={Color3.fromRGB(255, 255, 255)}
							textFont={Enum.Font.ArialBold}
						/>
						<uicorner CornerRadius={new UDim(0, px(50))} />
					</Button>
				)}
			</For>

			<uilistlayout
				HorizontalAlignment="Center"
				VerticalAlignment="Center"
				Padding={new UDim(0, px(15))}
				FillDirection="Horizontal"
			/>
		</frame>
	);
}
