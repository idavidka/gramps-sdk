/**
 * Gramps Metadata API Module
 */

import type { GrampsHttpClient } from "../utils/http";
import type { GrampsServerInfo } from "../utils/validation";

/**
 * Database tree info returned by /api/trees
 */
export interface GrampsTreeInfo {
	id: string;
	name: string;
}

/**
 * Metadata API – wraps the /api/metadata and /api/trees endpoints
 */
export class MetadataAPI {
	constructor(private readonly http: GrampsHttpClient) {}

	/**
	 * Get Gramps Web server metadata (version, locale, etc.)
	 */
	async getMetadata(): Promise<GrampsServerInfo> {
		const response = await this.http.get<GrampsServerInfo>("/api/metadata");
		if (!response.data) {
			throw new Error("Failed to retrieve server metadata");
		}
		return response.data;
	}

	/**
	 * List available trees (multi-tree support)
	 */
	async listTrees(): Promise<GrampsTreeInfo[]> {
		const response = await this.http.get<GrampsTreeInfo[]>("/api/trees");
		return response.data ?? [];
	}

	/**
	 * Get a specific tree by id
	 */
	async getTree(treeId: string): Promise<GrampsTreeInfo> {
		const response = await this.http.get<GrampsTreeInfo>(
			`/api/trees/${treeId}`
		);
		if (!response.data) {
			throw new Error(`Tree ${treeId} not found`);
		}
		return response.data;
	}
}
