import { ReplicatedStorage } from "@rbxts/services";
import { accents } from "shared/constants/palette";
import Tree from "shared/packages/Tree";
import { BuildTools, BuildType } from "types/enums/build-tools";

interface ItemSpriteCategory {
	readonly [parent: string]: ItemSpriteInterface[];
}

export interface ItemSpriteInterface {
	id: string;
	cost: string;
	parent: keyof typeof BuildTools;
	model: Model | Instance;
	imageID?: string;
}

export interface CategorySpriteInterface {
	readonly id: BuildType;
	readonly placeholder: Model | Instance;
	readonly color?: Color3;
}

export const CategoriesSprites: CategorySpriteInterface[] = [
	{ id: "Wall", placeholder: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Table"), color: accents.red },
	{ id: "Furniture", placeholder: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Chair"), color: accents.pink },
];

export const ItemSprites: ItemSpriteCategory = {
	Furniture: [
		{
			id: "Chair",
			cost: "$10",
			parent: "Furniture",
			model: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Chair"),
		},
		{
			id: "Modern Chair",
			cost: "$50",
			parent: "Furniture",
			model: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Chair"),
		},
		{
			id: "Table",
			cost: "$15",
			parent: "Furniture",
			model: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Table"),
		},
		{
			id: "Outdoor Table",
			cost: "$65",
			parent: "Furniture",
			model: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Table"),
		},
		{
			id: "Dining Table",
			cost: "$100",
			parent: "Furniture",
			model: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Table"),
		},
		{
			id: "Expensive Table",
			cost: "$150",
			parent: "Furniture",
			model: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Table"),
		},
		{
			id: "Expensive Table",
			cost: "$150",
			parent: "Furniture",
			model: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Table"),
		},
		{
			id: "Expensive Table",
			cost: "$150",
			parent: "Furniture",
			model: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Table"),
		},
		{
			id: "Expensive Table",
			cost: "$150",
			parent: "Furniture",
			model: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Table"),
		},
		{
			id: "Expensive Table",
			cost: "$150",
			parent: "Furniture",
			model: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Table"),
		},
	],
};
