/**
 * Gramps People API Module
 */

import type { GrampsListOptions } from "../types/core";
import type { GrampsPerson } from "../types/person";
import type { GrampsHttpClient } from "../utils/http";

/**
 * Build a query string from list options
 */
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
	if (options.profile) {
		params.set("profile", "all");
	}
	if (options.backlinks) {
		params.set("backlinks", "1");
	}
	if (options.extend && options.extend.length > 0) {
		params.set("extend", options.extend.join(","));
	}
	if (options.keys && options.keys.length > 0) {
		params.set("keys", options.keys.join(","));
	}
	const qs = params.toString();
	return qs ? `?${qs}` : "";
}

/**
 * People API – wraps the /api/people endpoints
 */
export class PeopleAPI {
	constructor(private readonly http: GrampsHttpClient) {}

	/**
	 * List all people (paginated)
	 */
	async list(options?: GrampsListOptions): Promise<GrampsPerson[]> {
		const qs = buildQuery(options);
		const response = await this.http.get<GrampsPerson[]>(
			`/api/people${qs}`
		);
		return response.data ?? [];
	}

	/**
	 * Get a person by handle
	 */
	async get(
		handle: string,
		options?: GrampsListOptions
	): Promise<GrampsPerson> {
		const qs = buildQuery(options);
		const response = await this.http.get<GrampsPerson>(
			`/api/people/${handle}${qs}`
		);
		if (!response.data) {
			throw new Error(`Person ${handle} not found`);
		}
		return response.data;
	}

	/**
	 * Get timeline for a person
	 */
	async getTimeline(handle: string): Promise<unknown[]> {
		const response = await this.http.get<unknown[]>(
			`/api/people/${handle}/timeline`
		);
		return response.data ?? [];
	}

	/**
	 * Search people by query string
	 */
	async search(query: string): Promise<GrampsPerson[]> {
		const params = new URLSearchParams({ filter: query });
		const response = await this.http.get<GrampsPerson[]>(
			`/api/people?${params.toString()}`
		);
		return response.data ?? [];
	}
}
