import { OnRender, OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Players, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import Vide, { mount } from "@rbxts/vide";
import MailboxUI from "./UI";
import Tree from "shared/packages/Tree";

interface Attributes {}

interface Instance extends Model {}

@Component({
	tag: "Mailbox",
	ancestorWhitelist: [Workspace],
})
export class Mailbox extends BaseComponent<Attributes, Instance> implements OnStart, OnRender {
	onStart() {}
	onRender(dt: number): void {
		if (this.isWithinRange()) this.setInteractionUIEnabled(true);
		this.setInteractionUIEnabled(false);
	}

	private setInteractionUIEnabled(enabled: boolean): void {
		mount(() => <MailboxUI text="E - Interact" enabled={enabled} />, this.getLocalUI());
	}

	private isWithinRange() {
		const player = this.getLocal();
		const character = player.Character || player.CharacterAdded.Wait()[0];
		const primary = character.PrimaryPart!;

		const mailboxPos = this.getPosition().mul(Vector3.yAxis.mul(0));
		const distance = mailboxPos.sub(primary.Position).Magnitude;
		return distance <= 2.8;
	}

	private getPosition(): Vector3 {
		return this.instance.PrimaryPart!.Position;
	}

	private getLocalUI(): PlayerGui {
		return Tree.Await(this.getLocal(), "PlayerGui") as PlayerGui;
	}

	private getLocal(): Player {
		return Players.LocalPlayer;
	}
}
