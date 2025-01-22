import { server } from "@rbxts/charm-sync";
import { GlobalEvents } from "shared/network";
import { atoms } from "shared/store/sync/atoms";
import { Events } from "./network";
import { filterPayload } from "shared/store/sync/utils/filter-payload";

const syncer = server({ atoms, interval: 0, preserveHistory: false });

syncer.connect((player, payload) => {
	print(player, payload)
	Events.syncState.fire(player, filterPayload(player, payload))
});

Events.requestState.connect((player) => syncer.hydrate(player))