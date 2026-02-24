/**
 * Gramps Places API Module
 */

import type { GrampsListOptions } from "../types/core";
import type { GrampsPlace } from "../types/place";
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
 * Places API – wraps the /api/places endpoints
 */
export class PlacesAPI {
	constructor(private readonly http: GrampsHttpClient) {}

	/**
	 * List all places (paginated)
	 */
	async list(options?: GrampsListOptions): Promise<GrampsPlace[]> {
		const qs = buildQuery(options);
		const response = await this.http.get<GrampsPlace[]>(`/api/places${qs}`);
		return response.data ?? [];
	}

	/**
	 * Get a place by handle
	 */
	async get(handle: string): Promise<GrampsPlace> {
		const response = await this.http.get<GrampsPlace>(`/api/places/${handle}`);
		if (!response.data) {
			throw new Error(`Place ${handle} not found`);
		}
		return response.data;
	}
}
