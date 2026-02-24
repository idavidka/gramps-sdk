/**
 * Gramps Families API Module
 */

import type { GrampsListOptions } from "../types/core";
import type { GrampsFamily } from "../types/family";
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
	if (options.sort) {
		params.set("sort", options.sort);
	}
	const qs = params.toString();
	return qs ? `?${qs}` : "";
}

/**
 * Families API – wraps the /api/families endpoints
 */
export class FamiliesAPI {
	constructor(private readonly http: GrampsHttpClient) {}

	/**
	 * List all families (paginated)
	 */
	async list(options?: GrampsListOptions): Promise<GrampsFamily[]> {
		const qs = buildQuery(options);
		const response = await this.http.get<GrampsFamily[]>(`/api/families${qs}`);
		return response.data ?? [];
	}

	/**
	 * Get a family by handle
	 */
	async get(handle: string): Promise<GrampsFamily> {
		const response = await this.http.get<GrampsFamily>(`/api/families/${handle}`);
		if (!response.data) {
			throw new Error(`Family ${handle} not found`);
		}
		return response.data;
	}

	/**
	 * Get timeline for a family
	 */
	async getTimeline(handle: string): Promise<unknown[]> {
		const response = await this.http.get<unknown[]>(`/api/families/${handle}/timeline`);
		return response.data ?? [];
	}
}
