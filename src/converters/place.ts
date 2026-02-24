/**
 * Gramps Place Converter
 *
 * Converts Gramps Web API place objects to a converted format.
 */

import type { GrampsPlace } from "../types/place";

/**
 * Converted place representation
 */
export interface ConvertedPlace {
	handle: string;
	grampsId: string;
	name: string;
	lat: number | null;
	lng: number | null;
	type: string;
}

/**
 * Parse a coordinate string to a float, returning null if invalid
 */
function parseCoordinate(value: string | undefined | null): number | null {
	if (!value) {
		return null;
	}
	const num = parseFloat(value);
	return isNaN(num) ? null : num;
}

/**
 * Convert a Gramps place to the converted place format
 */
export function convertPlace(place: GrampsPlace): ConvertedPlace {
	return {
		handle: place.handle,
		grampsId: place.gramps_id,
		name: place.title || place.name?.value || "",
		lat: parseCoordinate(place.lat),
		lng: parseCoordinate(place.long),
		type: place.type?.string ?? "Unknown",
	};
}
