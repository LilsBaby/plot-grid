import Vide, { Derivable } from "@rbxts/vide"
import Text from "client/controllers/components/Text";

interface MailboxProps {
	text?: Derivable<string>;
	adornee?: Derivable<Model>;
	enabled?: Derivable<boolean>;
}

export default function MailboxUI({ text, adornee, enabled }: MailboxProps) {
    return <billboardgui Enabled={enabled} AlwaysOnTop={true} ResetOnSpawn={true}>
		<Text></Text>
	</billboardgui>
}
