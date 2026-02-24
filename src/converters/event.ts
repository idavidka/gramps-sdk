/**
 * Gramps Event Converter
 *
 * Converts Gramps Web API event objects.
 */

import type { GrampsEvent } from "../types/event";
import { formatGrampsDate } from "./person";

/**
 * Converted event representation
 */
export interface ConvertedEvent {
	handle: string;
	grampsId: string;
	type: string;
	date: string | null;
	placeHandle: string | null;
	description: string;
}

/**
 * Convert a Gramps event to the converted event format
 */
export function convertEvent(event: GrampsEvent): ConvertedEvent {
	return {
		handle: event.handle,
		grampsId: event.gramps_id,
		type: event.type?.string ?? "Unknown",
		date: formatGrampsDate(event.date),
		placeHandle: event.place ?? null,
		description: event.description ?? "",
	};
}
