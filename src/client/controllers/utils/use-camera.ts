import { Workspace } from "@rbxts/services";

/**
 * Returns the player's current camera instance
 * 
 * @returns Camera - The player current camera
 */
export function useCamera() {
    const camera = Workspace.CurrentCamera!;
    return camera
}