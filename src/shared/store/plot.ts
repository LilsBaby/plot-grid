import { atom } from "@rbxts/charm";
import { t } from "@rbxts/t";
import { BuildType } from "types/enums/build-tools";

export const DEFAULT_CATEGORY: BuildType = "Wall";

export interface Plot {
	readonly id?: string;
	readonly owner?: string;

	/** Client states */
	category: BuildType;
	categoryIndex: number;
}

const PlotTemplate: Plot = {
	id: "",
	owner: "",
	category: "Wall",
	categoryIndex: 0,
};

type PlayerPlots = {
	readonly [K in string]?: Plot;
};

export const plot = {
	players: atom<PlayerPlots>({}),
};

export function getPlotForPlayer(player: string) {
	return plot.players()[player];
}

export function setPlotForPlayer(player: string, plotData: Plot) {
	plot.players((state) => ({
		...state,
		[player]: {
			...PlotTemplate,
			...plotData,
			owner: player,
		},
	}));
}

export function updatePlayerData(player: string, updater: (data: Plot) => Plot) {
	plot.players((state) => ({
		...state,
		[player]: state[player] && updater(state[player]),
	}));
}
