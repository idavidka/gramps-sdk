/**
 * Gramps Family Converter
 *
 * Converts Gramps Web API family objects to a converted format.
 */

import type { GrampsFamily } from "../types/family";

/**
 * Converted family representation
 */
export interface ConvertedFamily {
	id: string;
	grampsHandle: string;
	grampsId: string;
	fatherHandle: string | null;
	motherHandle: string | null;
	childHandles: string[];
	relationshipType: string;
	marriageDate: string | null;
	marriagePlace: string | null;
}

/**
 * Convert a Gramps family to the converted family format
 */
export function convertFamily(family: GrampsFamily): ConvertedFamily {
	return {
		id: family.gramps_id,
		grampsHandle: family.handle,
		grampsId: family.gramps_id,
		fatherHandle: family.father_handle,
		motherHandle: family.mother_handle,
		childHandles: family.child_ref_list.map((c) => c.ref),
		relationshipType: family.type?.string ?? "Unknown",
		// Marriage date/place resolved at tree level via event lookup
		marriageDate: null,
		marriagePlace: null,
	};
}
