/**
 * Gramps Person Converter
 *
 * Converts Gramps Web API person objects to a converted format.
 */

import type { GrampsDate, GrampsPerson } from "../types/person";

/**
 * Gender codes used by Gramps (0=unknown, 1=male, 2=female)
 */
const GENDER_MAP: Record<number, "M" | "F" | "U"> = {
	0: "U",
	1: "M",
	2: "F",
};

/**
 * Converted person representation
 */
export interface ConvertedPerson {
	id: string;
	grampsHandle: string;
	grampsId: string;
	firstName: string;
	lastName: string;
	suffix: string;
	gender: "M" | "F" | "U";
	birthDate: string | null;
	birthPlace: string | null;
	deathDate: string | null;
	deathPlace: string | null;
	familyIds: string[];
	parentFamilyIds: string[];
}

/**
 * Format a Gramps date value as a human-readable string
 */
export function formatGrampsDate(
	date: GrampsDate | null | undefined
): string | null {
	if (!date) {
		return null;
	}
	if (date.text) {
		return date.text;
	}
	if (date.dateval) {
		const [day, month, year] = date.dateval;
		const parts: string[] = [];
		if (year) {
			parts.push(String(year));
		}
		if (month) {
			parts.push(String(month).padStart(2, "0"));
		}
		if (day) {
			parts.push(String(day).padStart(2, "0"));
		}
		if (parts.length === 0) {
			return null;
		}
		const prefix =
			date.modifier === "before"
				? "before "
				: date.modifier === "after"
					? "after "
					: date.modifier === "about"
						? "about "
						: "";
		return `${prefix}${parts.join("-")}`;
	}
	return null;
}

/**
 * Extract the primary surname from a Gramps name
 */
function getPrimarySurname(name: GrampsPerson["primary_name"]): string {
	const primary = name.surname_list.find((s) => s.primary);
	if (primary) {
		return primary.surname;
	}
	return name.surname_list[0]?.surname ?? "";
}

/**
 * Convert a Gramps person to the converted person format
 */
export function convertPerson(person: GrampsPerson): ConvertedPerson {
	const gender = GENDER_MAP[person.gender] ?? "U";
	const firstName = person.primary_name.first_name ?? "";
	const lastName = getPrimarySurname(person.primary_name);
	const suffix = person.primary_name.suffix ?? "";

	// Resolve birth and death event handles via index
	const birthEventRef =
		person.birth_ref_index >= 0
			? person.event_ref_list[person.birth_ref_index]
			: undefined;
	const deathEventRef =
		person.death_ref_index >= 0
			? person.event_ref_list[person.death_ref_index]
			: undefined;

	return {
		id: person.gramps_id,
		grampsHandle: person.handle,
		grampsId: person.gramps_id,
		firstName,
		lastName,
		suffix,
		gender,
		// Date/place values require resolving event handles - leave as null
		// (full conversion happens at the tree level with event/place lookup)
		birthDate: null,
		birthPlace: null,
		deathDate: null,
		deathPlace: null,
		// Keep event ref handles for later enrichment
		familyIds: person.family_list,
		parentFamilyIds: person.parent_family_list,
		// Store raw event refs for downstream use
		...(birthEventRef ? { _birthEventHandle: birthEventRef.ref } : {}),
		...(deathEventRef ? { _deathEventHandle: deathEventRef.ref } : {}),
	} as ConvertedPerson;
}
