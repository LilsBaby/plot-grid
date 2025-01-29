import Vide, { mount } from "@rbxts/vide";
import PlotBuildUI from "../plot/UI";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateVideStory } from "@rbxts/ui-labs";

export = (target: Instance) => {
	return mount(() => {
		return (
			<PlotBuildUI
		cancel={() => {}}
		onToolActivated={(category, tool) => {}}
		onToolDeactivated={(category, tool, isSwitch) => {}}
	></PlotBuildUI>
		);
	}, target);
};
