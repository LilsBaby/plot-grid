import { Service, OnStart, OnInit } from "@flamework/core";
import { HttpService, Players } from "@rbxts/services";
import { setPlotForPlayer } from "shared/store/plot";

@Service({})
export class PlotService implements OnStart, OnInit {
	onStart() {}
	onInit(): void | Promise<void> {
		Players.PlayerAdded.Connect((player) => {
			this.onPlayerJoin(player).catch((err) => error(`Player failed to join: ${err}`, 0));
		});

		Players.PlayerRemoving.Connect((player) => {
			this.onPlayerJoin(player).catch((err) => error(`Unable to remove plot: ${err}`, 0));
		})
	}

	public async onPlayerJoin(player: Player): Promise<void> {
		setPlotForPlayer(player.Name, { id: HttpService.GenerateGUID(false), BuildState: {}, currentItemIndex: 3 });
	}

	public async onPlayerLeave(player: Player): Promise<void> {
		setPlotForPlayer(player.Name, undefined)
	}
}
