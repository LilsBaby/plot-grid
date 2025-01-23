import Vide, { Derivable } from "@rbxts/vide";
import { Button } from "client/controllers/components/Button";
import Image from "client/controllers/components/Image";
import { px } from "client/controllers/utils/use-px";

interface BuildToolProps {
	toolName?: Derivable<string>;
	index?: Derivable<string>;
    onActivated?: Derivable<() => void>
}

export default function BuildTool({ toolName, index, onActivated }: BuildToolProps) {
	return (
		<frame Name={index}>
			<Image image="" />
			<Button text={toolName} onClick={onActivated}/>

			<uicorner CornerRadius={new UDim(0, px(15))} />
		</frame>
	);
}
