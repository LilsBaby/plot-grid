export interface CellProperties {
	X: number;
	Z: number;
	WorldCFrame?: CFrame;
	WorldPosition?: Vector3;
}

export default class Cell implements CellProperties {
	X: number;
	Z: number;

	constructor({ X, Z }: CellProperties) {
		this.X = X;
		this.Z = Z;
	}
}
