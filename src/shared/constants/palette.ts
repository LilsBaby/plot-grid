

export const accents = {
	rosewater: Color3.fromRGB(245, 224, 220),
	flamingo: Color3.fromRGB(242, 205, 205),
	pink: Color3.fromRGB(243, 181, 219),
	mauve: Color3.fromRGB(203, 166, 247),
	red: Color3.fromRGB(243, 139, 168),
	maroon: Color3.fromRGB(235, 160, 172),
	peach: Color3.fromRGB(250, 179, 135),
	yellow: Color3.fromRGB(249, 226, 175),
	green: Color3.fromRGB(166, 227, 161),
	teal: Color3.fromRGB(148, 226, 213),
	sky: Color3.fromRGB(137, 220, 235),
	sapphire: Color3.fromRGB(116, 199, 236),
	blue: Color3.fromRGB(137, 180, 250),
	lavender: Color3.fromRGB(180, 190, 254),
} as const;

const lerpAlpha = (a: number, b: number, t: number) => math.clamp(a + (b - a) * t, 0, 1);


export function brighten(color: Color3, amount: number, desaturation = 0.25 * amount) {
	const [h, s, v] = color.ToHSV();

	return Color3.fromHSV(h, lerpAlpha(s, 0, desaturation), lerpAlpha(v, 1, 0.7 * amount));
}