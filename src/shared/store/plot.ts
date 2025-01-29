import { atom } from "@rbxts/charm";
import { t } from "@rbxts/t";
import { BuildType } from "types/enums/build-tools";

export const DEFAULT_CATEGORY: BuildType = "Wall";

interface BuildState {
	currentSelectedCategory?: string
}

export interface Plot {
	readonly id?: string;
	readonly owner?: string;

	/** Client states */
	BuildState: BuildState
	currentItemIndex: number;
}

const PlotTemplate: Plot = {
	id: "",
	owner: "",
	BuildState: {  },
	currentItemIndex: 3,
};

type PlayerPlots = {
	readonly [K in string]?: Plot | undefined;
};

export const plot = {
	players: atom<PlayerPlots>({}),
};

export function getPlotForPlayer(player: string) {
	return plot.players()[player];
}

export function setPlotForPlayer(player: string, plotData: Plot | undefined) {
	plot.players((state) => ({
		...state,
		[player]: plotData ? {
			...PlotTemplate,
			...plotData,
			owner: player,
			
		} : undefined
	}));
}



export function updatePlayerData(player: string, updater: (data: Plot) => Plot) {
	plot.players((state) => ({
		...state,
		[player]: state[player] && updater(state[player]),
	}));
}
