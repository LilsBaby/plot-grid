import { Players } from "@rbxts/services";
import { t } from "@rbxts/t";
import { useAtom } from "@rbxts/vide-charm";
import { DEFAULT_CATEGORY, getPlotForPlayer } from "shared/store/plot";

export function useItemCategory() {
	return useAtom(() => {
		const plot = getPlotForPlayer(Players.LocalPlayer.Name);
		return plot !== undefined && plot.BuildState.currentSelectedCategory
			? plot.BuildState.currentSelectedCategory
			: undefined;
	});
}

export function useItemIndex() {
	return useAtom(() => {
		const plot = getPlotForPlayer(Players.LocalPlayer.Name);
		return plot !== undefined && plot.currentItemIndex ? plot.currentItemIndex : 0;
	});
}
