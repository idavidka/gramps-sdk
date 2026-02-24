/**
 * Gramps Place Converter
 *
 * Converts Gramps Web API place objects to a TreeViz-compatible format.
 */

import type { GrampsPlace } from "../types/place";

/**
 * TreeViz-compatible place representation
 */
export interface TreeVizPlace {
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
 * Convert a Gramps place to the TreeViz place format
 */
export function convertPlace(place: GrampsPlace): TreeVizPlace {
	return {
		handle: place.handle,
		grampsId: place.gramps_id,
		name: place.title || place.name?.value || "",
		lat: parseCoordinate(place.lat),
		lng: parseCoordinate(place.long),
		type: place.type?.string ?? "Unknown",
	};
}
