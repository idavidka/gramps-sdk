/**
 * Gramps Event Converter
 *
 * Converts Gramps Web API event objects to a TreeViz-compatible format.
 */

import type { GrampsEvent } from "../types/event";
import { formatGrampsDate } from "./person";

/**
 * TreeViz-compatible event representation
 */
export interface TreeVizEvent {
	handle: string;
	grampsId: string;
	type: string;
	date: string | null;
	placeHandle: string | null;
	description: string;
}

/**
 * Convert a Gramps event to the TreeViz event format
 */
export function convertEvent(event: GrampsEvent): TreeVizEvent {
	return {
		handle: event.handle,
		grampsId: event.gramps_id,
		type: event.type?.string ?? "Unknown",
		date: formatGrampsDate(event.date),
		placeHandle: event.place ?? null,
		description: event.description ?? "",
	};
}
