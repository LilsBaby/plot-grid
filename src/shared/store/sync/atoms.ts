import { plot } from "../plot";
import { flattenAtoms } from "./utils/flatten-atoms";

export type GlobalAtoms = typeof atoms;

export const atoms = flattenAtoms({
	plot,
});