import { client } from "@rbxts/charm-sync";
import { atoms } from "shared/store/sync/atoms"
import { Events } from "./network";

const syncer = client({atoms})
print(syncer)

Events.syncState.connect((payload) => {
    print(payload)
    syncer.sync(payload)
})

Events.requestState()