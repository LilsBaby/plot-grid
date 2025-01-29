export enum BuildTools {
    Wall = "Wall",
    Window = "Window",
    Furniture = "Furniture",
    Decoration = "Decoration",
    Roof = "Roof"
}

/**
 * "Furniture", "Decoration", "Roof", "Wall", "Window"
 */

export type BuildType = keyof typeof BuildTools