import { ReplicatedStorage } from "@rbxts/services";
import { accents } from "shared/constants/palette";
import Tree from "shared/packages/Tree";
import { BuildTools, BuildType } from "types/enums/build-tools";

export interface ItemSpriteInterface {
	id?: string;
	cost?: string;
	parent?: keyof typeof BuildTools;
	model?: Model | Instance;
	imageID?: string;
}

export interface CategorySpriteInterface { 
	readonly id: BuildType, readonly placeholder: Model | Instance, readonly color?: Color3 }

export const CategoriesSprites: CategorySpriteInterface[] = [
	{ id: "Wall", placeholder: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Table"), color: accents.red },
	{ id: "Furniture", placeholder: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Chair"), color: accents.pink },
	{ id: "Stairs", placeholder: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Chair"), color: accents.pink}
]


export const ItemSprites: ItemSpriteInterface[] = [
	/**
	 * {
		id: "Chair",
		cost: "1",
		parent: "Furniture",
		model: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Chair"),
		imageID: "",
	},
	{
		id: "Table",
		cost: "5",
		parent: "Furniture",
		model: Tree.Find(ReplicatedStorage, "TS-Assets/@furniture/Table"),
		imageID: "",
	},
	 */
	
];
