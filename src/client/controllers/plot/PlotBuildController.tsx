import { Controller, Dependency, OnInit, OnStart } from "@flamework/core";
import Vide, { mount } from "@rbxts/vide";
import PlotUI from "./UI";
import { Players, ReplicatedStorage, UserInputService } from "@rbxts/services";
import { BuildTools, BuildType } from "types/enums/build-tools";
import { Component, Components } from "@flamework/components";
import { usePx } from "../utils/use-px";
import Tree from "shared/packages/Tree";
import { CameraComponent } from "./Camera/CameraComponent";
import { FurnitureBuildTool } from "./BuildTools/FurnitureBuildTool";
import Builder from "./BuildTools/Builder";

const localPlayer = Players.LocalPlayer;
const playerGui = localPlayer.WaitForChild("PlayerGui");

@Controller({})
export class PlotBuildController implements OnStart, OnInit {
	private readonly components = Dependency<Components>();

	private enableUI = false;
	private toggleKey: Enum.KeyCode = Enum.KeyCode.M;
	private buildToolsContainer = new Map<Player, FurnitureBuildTool>();

	onStart(): void {}
	onInit(): void | Promise<void> {
		mount(
			() => (
				<screengui>
					<PlotUI
						cancel={() => {}}
						onToolActivated={(category, tool) => this.createBuildToolForPlayer(category, tool, false)}
						onToolDeactivated={(category, tool, isSwitch) =>
							this.createBuildToolForPlayer(category, tool, true, isSwitch)
						}
					></PlotUI>
				</screengui>
			),
			playerGui,
		);
	}

	private createBuildToolForPlayer(build: BuildType, tool: Model, remove: boolean, canSwitch: boolean = false) {
		switch (build) {
			case BuildTools.Furniture: {
				const cursorExists = Tree.Find(ReplicatedStorage, `TS-Assets/@furniture/${tool.Name}`) as Model;
				if (!cursorExists) return;

				if (!remove) {
					const component = this.components.addComponent<FurnitureBuildTool>(localPlayer);
					component.setCursor(tool);
					component.setEdit(true);
					this.components.addComponent<CameraComponent>(localPlayer);
					this.buildToolsContainer.set(localPlayer, component);
				} else {
					if (canSwitch) {
						// switching to a new cursor
						this.components.removeComponent<FurnitureBuildTool>(localPlayer);
						const component = this.components.addComponent<FurnitureBuildTool>(localPlayer);
					component.setCursor(tool);
					component.setEdit(true);
					} else {
						this.components.removeComponent<FurnitureBuildTool>(localPlayer);
						this.components.removeComponent<CameraComponent>(localPlayer);
						print("Removing furniture build tool");
					}
				}
				break;
			}
			default:
				break;
		}
	}

	public getBuilderForPlayer(): FurnitureBuildTool {
		return this.buildToolsContainer.get(localPlayer)!;
	}
}
