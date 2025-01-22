import Vide, { Derivable } from "@rbxts/vide";
import { Button } from "client/controllers/components/Button";
import Image from "client/controllers/components/Image";
import { px } from "client/controllers/utils/use-px";

interface BuildToolProps {
    toolName?: Derivable<string>
    index?: Derivable<number>
}

export default function BuildTool({toolName, index}: BuildToolProps) {
    return <frame>
        <Image image="" />
        <Button text={toolName} />

        <uicorner CornerRadius={new UDim(0, px(15))} />
    </frame>
}