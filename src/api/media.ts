/**
 * Gramps Media API Module
 */

import type { GrampsListOptions } from "../types/core";
import type { GrampsMedia, ThumbnailSize } from "../types/media";
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
	const qs = params.toString();
	return qs ? `?${qs}` : "";
}

const THUMBNAIL_SIZE_MAP: Record<ThumbnailSize, number> = {
	small: 100,
	medium: 300,
	large: 600,
};

/**
 * Media API – wraps the /api/media endpoints
 */
export class MediaAPI {
	constructor(private readonly http: GrampsHttpClient) {}

	/**
	 * List all media objects (paginated)
	 */
	async list(options?: GrampsListOptions): Promise<GrampsMedia[]> {
		const qs = buildQuery(options);
		const response = await this.http.get<GrampsMedia[]>(`/api/media${qs}`);
		return response.data ?? [];
	}

	/**
	 * Get a media object by handle
	 */
	async get(handle: string): Promise<GrampsMedia> {
		const response = await this.http.get<GrampsMedia>(`/api/media/${handle}`);
		if (!response.data) {
			throw new Error(`Media ${handle} not found`);
		}
		return response.data;
	}

	/**
	 * Get the thumbnail URL for a media object
	 * Returns a URL string that the caller can use directly (requires auth header in browser)
	 */
	getThumbnailPath(handle: string, size: ThumbnailSize = "medium"): string {
		const sizePx = THUMBNAIL_SIZE_MAP[size];
		return `/api/media/${handle}/thumbnail/${sizePx}`;
	}

	/**
	 * Get the raw file URL path for a media object
	 */
	getFilePath(handle: string): string {
		return `/api/media/${handle}/file`;
	}
}
