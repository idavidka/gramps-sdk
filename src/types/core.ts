/**
 * Core Gramps SDK Types
 *
 * SDK configuration, HTTP client, and base API types
 */

// ====================================
// SDK Configuration
// ====================================

/**
 * Logger interface for SDK debugging
 */
export interface GrampsLogger {
	log: (message: string, ...args: unknown[]) => void;
	warn: (message: string, ...args: unknown[]) => void;
	error: (message: string, ...args: unknown[]) => void;
}

/**
 * SDK initialization options
 */
export interface GrampsSDKConfig {
	/** Gramps Web server URL (e.g. https://gramps.example.com) */
	serverUrl?: string;
	/** JWT access token */
	accessToken?: string;
	/** JWT refresh token */
	refreshToken?: string;
	/** Request timeout in milliseconds (default: 30000) */
	timeoutMs?: number;
	/** Optional logger for debugging */
	logger?: GrampsLogger;
}

// ====================================
// API Response Types
// ====================================

/**
 * Generic API response wrapper
 */
export interface GrampsApiResponse<T> {
	data: T | undefined;
	statusCode: number;
	statusText: string;
	headers: Record<string, string>;
}

/**
 * API error response
 */
export interface GrampsApiError {
	statusCode: number;
	message: string;
	details?: unknown;
}

// ====================================
// Pagination
// ====================================

/**
 * List query options with pagination
 */
export interface GrampsListOptions {
	/** Page offset (0-based) */
	offset?: number;
	/** Page size (default: 20) */
	pageSize?: number;
	/** Filter string */
	filter?: string;
	/** Fields to include/extend */
	extend?: string[];
	/** Keys to include in response */
	keys?: string[];
	/** Sort property */
	sort?: string;
	/** Return profile data */
	profile?: boolean;
	/** Return backlinks */
	backlinks?: boolean;
}
