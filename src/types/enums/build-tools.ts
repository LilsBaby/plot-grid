export enum BuildTools {
    Wall = "Wall",
    Stairs = "Stairs",
    Furniture = "Furniture"
}

export type BuildType = keyof typeof BuildTools