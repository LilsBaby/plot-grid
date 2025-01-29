import { Optional } from "@flamework/core";
import Cell, { CellProperties } from "./Cell";
import Option from "shared/packages/Option";
import { t } from "@rbxts/t";

export default class Grid {
	private readonly Grid: Cell[][] = [];
	private readonly LOT_GRID: BasePart;
	private readonly LENGTH: number;
	private readonly WIDTH: number;

	private readonly GRID_CELL_SIZE: number;
	private readonly GRID_HALF_SIZE: number;

	constructor(lotGrid: Model, cellSize: number) {
		const primary = lotGrid.PrimaryPart!
		const size = primary.Size;
		const length = size.X / cellSize;
		const width = size.Z / cellSize;

		for (const x of $range(1, length)) {
			this.Grid[x] = []
			for (const z of $range(1, width)) {
				this.Grid[x][z] = new Cell({
					X: x,
					Z: z,
				});
			}
		}

		this.LOT_GRID = primary;
		this.LENGTH = length;
		this.WIDTH = width;
		this.GRID_CELL_SIZE = cellSize;
		this.GRID_HALF_SIZE = cellSize * 0.5;
	}

	public GetCellWorldCFrame({ X, Z }: Cell) {
		const center = this.LOT_GRID.Position;
		const sizeH = this.LOT_GRID.Size.div(2);

		const offsetX = X * this.GRID_CELL_SIZE - this.GRID_HALF_SIZE;
		const offsetZ = Z * this.GRID_CELL_SIZE - this.GRID_HALF_SIZE;

		const worldCFrame = new CFrame(-sizeH.X + offsetX, sizeH.Y, -sizeH.Z + offsetZ);
		/**
		 * const [xDirection, zDirection] = [math.sign(center.X - offsetX), math.sign(center.Z - offsetZ)];


		const worldCF = new CFrame(offsetX * xDirection, center.Y, offsetZ * zDirection);
		 */

		return this.LOT_GRID.CFrame.ToWorldSpace(worldCFrame);
	}

	public GetCellFromWorldPosition({ X, Y, Z }: Vector3): Option<Cell> {
		const relativeToGrid = this.LOT_GRID.CFrame.PointToObjectSpace(new Vector3(X, Y, Z));
		const sizeH = this.LOT_GRID.Size.div(2);
		const adjustedPosition = relativeToGrid.add(
			new Vector3(sizeH.X + this.GRID_HALF_SIZE, 0, sizeH.Z + this.GRID_HALF_SIZE),
		);

		const [x, z] = [
			math.round(adjustedPosition.X / this.GRID_CELL_SIZE) ,
			math.round(adjustedPosition.Z / this.GRID_CELL_SIZE)
		];

		/**
		 * if (this.isOutOfBound(x, z)) {
			return Option.None
		}	
		 */

		return this.GetCell(x, z);
	}

	private isOutOfBound(x: number, z: number) {
		return !this.GetCell(x, z);
	}

	public GetCell(x: number, z: number): Option<Cell> {
		const cell = this.Grid[x]?.[z];
		return !t.nil(cell) ? Option.Some(cell) : Option.None;
	}

	public GetCorner(x: number, z: number): Option<Cell> {
		return this.GetCell(1, 1);
	}
}
