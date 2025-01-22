import { Service, OnStart, OnInit } from "@flamework/core";
import { HttpService, Players } from "@rbxts/services";
import { setPlotForPlayer } from "shared/store/plot";

@Service({})
export class PlotService implements OnStart, OnInit {
    onStart() {
        
    }
    onInit(): void | Promise<void> {
        Players.PlayerAdded.Connect((player) => {
            this.onPlayerJoin(player).catch((err) => error(`Player failed to join: ${err}`, 0))
        })
    }

    public async onPlayerJoin(player: Player): Promise<void> {
        setPlotForPlayer(player.Name, { id: HttpService.GenerateGUID(false), category: "Wall", categoryIndex: 0 })
    }
}