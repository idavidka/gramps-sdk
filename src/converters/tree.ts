/**
 * Gramps Full Tree Converter
 *
 * Converts all Gramps data objects into a unified TreeViz tree representation.
 */

import type { GrampsEvent } from "../types/event";
import type { GrampsFamily } from "../types/family";
import type { GrampsPerson } from "../types/person";
import type { GrampsPlace } from "../types/place";
import { convertEvent } from "./event";
import type { TreeVizEvent } from "./event";
import { convertFamily } from "./family";
import type { TreeVizFamily } from "./family";
import { convertPerson, formatGrampsDate } from "./person";
import type { TreeVizPerson } from "./person";
import { convertPlace } from "./place";
import type { TreeVizPlace } from "./place";

/**
 * Input data for full tree conversion
 */
export interface GrampsTreeData {
	people: GrampsPerson[];
	families: GrampsFamily[];
	events: GrampsEvent[];
	places: GrampsPlace[];
}

/**
 * Result of a full tree conversion
 */
export interface TreeVizTree {
	people: TreeVizPerson[];
	families: TreeVizFamily[];
	events: TreeVizEvent[];
	places: TreeVizPlace[];
	report: ConversionReport;
}

/**
 * Conversion summary report
 */
export interface ConversionReport {
	peopleCount: number;
	familiesCount: number;
	eventsCount: number;
	placesCount: number;
	warnings: string[];
	errors: string[];
}

/**
 * Convert an entire Gramps dataset to TreeViz format
 */
export function convertTree(data: GrampsTreeData): TreeVizTree {
	const warnings: string[] = [];
	const errors: string[] = [];

	// Build lookup maps for enrichment
	const eventMap = new Map<string, GrampsEvent>();
	for (const event of data.events) {
		eventMap.set(event.handle, event);
	}

	const placeMap = new Map<string, GrampsPlace>();
	for (const place of data.places) {
		placeMap.set(place.handle, place);
	}

	// Convert people
	const people: TreeVizPerson[] = [];
	for (const person of data.people) {
		try {
			const converted = convertPerson(person);

			// Enrich with birth data
			if (person.birth_ref_index >= 0) {
				const birthRef = person.event_ref_list[person.birth_ref_index];
				if (birthRef) {
					const birthEvent = eventMap.get(birthRef.ref);
					if (birthEvent) {
						converted.birthDate = formatGrampsDate(birthEvent.date);
						if (birthEvent.place) {
							const place = placeMap.get(birthEvent.place);
							converted.birthPlace =
								place?.title ?? birthEvent.place;
						}
					}
				}
			}

			// Enrich with death data
			if (person.death_ref_index >= 0) {
				const deathRef = person.event_ref_list[person.death_ref_index];
				if (deathRef) {
					const deathEvent = eventMap.get(deathRef.ref);
					if (deathEvent) {
						converted.deathDate = formatGrampsDate(deathEvent.date);
						if (deathEvent.place) {
							const place = placeMap.get(deathEvent.place);
							converted.deathPlace =
								place?.title ?? deathEvent.place;
						}
					}
				}
			}

			people.push(converted);
		} catch (error) {
			errors.push(
				`Failed to convert person ${person.gramps_id}: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	// Convert families
	const families: TreeVizFamily[] = [];
	for (const family of data.families) {
		try {
			const converted = convertFamily(family);

			// Enrich with marriage event data
			const marriageRef = family.event_ref_list.find(
				(r) => r.role?.string === "Family"
			);
			if (marriageRef) {
				const marriageEvent = eventMap.get(marriageRef.ref);
				if (marriageEvent) {
					converted.marriageDate = formatGrampsDate(
						marriageEvent.date
					);
					if (marriageEvent.place) {
						const place = placeMap.get(marriageEvent.place);
						converted.marriagePlace =
							place?.title ?? marriageEvent.place;
					}
				}
			}

			families.push(converted);
		} catch (error) {
			errors.push(
				`Failed to convert family ${family.gramps_id}: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	// Convert events
	const events: TreeVizEvent[] = data.events.map((e) => convertEvent(e));

	// Convert places
	const places: TreeVizPlace[] = data.places.map((p) => convertPlace(p));

	return {
		people,
		families,
		events,
		places,
		report: {
			peopleCount: people.length,
			familiesCount: families.length,
			eventsCount: events.length,
			placesCount: places.length,
			warnings,
			errors,
		},
	};
}
