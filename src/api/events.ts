/**
 * Gramps Events API Module
 */

import type { GrampsListOptions } from "../types/core";
import type { GrampsEvent } from "../types/event";
import type { GrampsHttpClient } from "../utils/http";

function buildQuery(options?: GrampsListOptions): string {
	if (!options) {
		return "";
	}
	const params = new URLSearchParams();
	if (options.offset !== undefined) {
		params.set("offset", String(options.offset));
	}
	if (options.pageSize !== undefined) {
		params.set("page_size", String(options.pageSize));
	}
	if (options.filter) {
		params.set("filter", options.filter);
	}
	const qs = params.toString();
	return qs ? `?${qs}` : "";
}

/**
 * Events API – wraps the /api/events endpoints
 */
export class EventsAPI {
	constructor(private readonly http: GrampsHttpClient) {}

	/**
	 * List all events (paginated)
	 */
	async list(options?: GrampsListOptions): Promise<GrampsEvent[]> {
		const qs = buildQuery(options);
		const response = await this.http.get<GrampsEvent[]>(`/api/events${qs}`);
		return response.data ?? [];
	}

	/**
	 * Get an event by handle
	 */
	async get(handle: string): Promise<GrampsEvent> {
		const response = await this.http.get<GrampsEvent>(`/api/events/${handle}`);
		if (!response.data) {
			throw new Error(`Event ${handle} not found`);
		}
		return response.data;
	}
}
