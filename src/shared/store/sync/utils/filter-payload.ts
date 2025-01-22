import { SyncPayload } from "@rbxts/charm-sync";
import { GlobalAtoms } from "../atoms";

export function filterPayload(player: Player, payload: SyncPayload<GlobalAtoms>) {
	if (payload.type === "init") {
		return {
			...payload,
			data: {
				...payload.data,
				"plot/players": {
					[player.Name]: payload.data["plot/players"][player.Name],
				},
			},
		};
	}

	return {
		...payload,
		data: {
			...payload.data,
			"datastore/players": payload.data["plot/players"] !== undefined && {
				[player.Name]: payload.data["plot/players"][player.Name],
			},
		},
	};
}