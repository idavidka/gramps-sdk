/**
 * Gramps SDK Error Classes
 */

/**
 * Base error for Gramps SDK
 */
export class GrampsError extends Error {
	constructor(
		public readonly statusCode: number,
		message: string,
		public readonly details?: unknown
	) {
		super(message);
		this.name = "GrampsError";
	}
}

/**
 * Network-level error (fetch failed, timeout, CORS, etc.)
 */
export class GrampsNetworkError extends Error {
	constructor(cause?: unknown) {
		const message =
			cause instanceof Error ? cause.message : "Network request failed";
		super(message);
		this.name = "GrampsNetworkError";
	}
}
