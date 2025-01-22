import Object from "@rbxts/object-utils";
import { CategoriesSprites, CategorySpriteInterface, ItemSpriteInterface } from "types/constants/item-sprites";
import { BuildType } from "types/enums/build-tools";

export function selectToolsByCategory(category: "Wall" | "Stairs" | "Furniture"): (string | undefined)[] {
	switch (category) {
		case "Furniture":
			return ["Chair", "Table"];
		case "Stairs": 
			return [];
		case "Wall":
			return []
		default:
			return [];
	}
}

export function getCategory(category: BuildType): CategorySpriteInterface {
	return CategoriesSprites.find((v) => v.id === category)!
}