export function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

export function map(value: number, min: number, max: number, newMin: number, newMax: number) {
	if (min === max) {
		return newMin;
	}
	return lerp(newMin, newMax, (value - min) / (max - min));
}