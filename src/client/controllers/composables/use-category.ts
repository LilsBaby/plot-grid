import { Players } from "@rbxts/services";
import { t } from "@rbxts/t";
import { useAtom } from "@rbxts/vide-charm";
import { DEFAULT_CATEGORY, getPlotForPlayer } from "shared/store/plot";

export function useCategory() {
	return useAtom(() => {
		const plot = getPlotForPlayer(Players.LocalPlayer.Name);
		return plot !== undefined && plot.category ? plot.category : DEFAULT_CATEGORY;
	});
}

export function useCategoryIndex() {
	return useAtom(() => {
		const plot = getPlotForPlayer(Players.LocalPlayer.Name);
		return plot !== undefined && plot.categoryIndex ? plot.categoryIndex : 0;
	});
}
