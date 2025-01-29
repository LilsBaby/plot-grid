import { spring } from "@rbxts/vide";
import { px } from "client/controllers/utils/use-px";

// -2 is the far left and 2 is the far right. 0 is the center
export const DIRECTIONS_TO_FILL = [-2, -1, 0, 1, 2];

export function getCardPositionAtIndex(direction: number, size: UDim2, padding: number): UDim2 {
	return new UDim2(0.5, direction * (size.X.Offset + padding), 0, 0)
}