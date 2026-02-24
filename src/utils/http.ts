/**
 * Gramps Web API HTTP Client
 *
 * Provides authenticated fetch-based HTTP communication with a Gramps Web server.
 */

import type { GrampsApiResponse, GrampsLogger } from "../types/core";
import { GrampsError, GrampsNetworkError } from "./errors";

const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * HTTP client for Gramps Web API
 */
export class GrampsHttpClient {
	private serverUrl: string;
	private accessToken: string | null;
	private timeoutMs: number;
	private logger: GrampsLogger;

	constructor(
		serverUrl: string,
		accessToken: string | null,
		timeoutMs: number,
		logger: GrampsLogger
	) {
		this.serverUrl = serverUrl.replace(/\/$/, "");
		this.accessToken = accessToken;
		this.timeoutMs = timeoutMs || DEFAULT_TIMEOUT_MS;
		this.logger = logger;
	}

	/**
	 * Update the access token
	 */
	setAccessToken(token: string | null): void {
		this.accessToken = token;
	}

	/**
	 * Build a full URL from a path
	 */
	private buildUrl(path: string): string {
		const normalizedPath = path.startsWith("/") ? path : `/${path}`;
		return `${this.serverUrl}${normalizedPath}`;
	}

	/**
	 * Build request headers
	 */
	private buildHeaders(extra?: Record<string, string>): Record<string, string> {
		const headers: Record<string, string> = {
			Accept: "application/json",
			"Content-Type": "application/json",
			...extra,
		};
		if (this.accessToken) {
			headers.Authorization = `Bearer ${this.accessToken}`;
		}
		return headers;
	}

	/**
	 * Execute an HTTP request with timeout and error handling
	 */
	async request<T>(
		method: string,
		path: string,
		body?: unknown,
		extraHeaders?: Record<string, string>
	): Promise<GrampsApiResponse<T>> {
		const url = this.buildUrl(path);
		const headers = this.buildHeaders(extraHeaders);
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

		this.logger.log(`[Gramps SDK] ${method} ${url}`);

		try {
			const response = await fetch(url, {
				method,
				headers,
				body: body !== undefined ? JSON.stringify(body) : undefined,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			const responseHeaders: Record<string, string> = {};
			response.headers.forEach((value, key) => {
				responseHeaders[key] = value;
			});

			let data: T | undefined;
			const contentType = response.headers.get("content-type") ?? "";
			if (contentType.includes("application/json")) {
				try {
					data = (await response.json()) as T;
				} catch (_parseError) {
					this.logger.warn("[Gramps SDK] Failed to parse JSON response");
				}
			}

			const apiResponse: GrampsApiResponse<T> = {
				data,
				statusCode: response.status,
				statusText: response.statusText,
				headers: responseHeaders,
			};

			if (!response.ok) {
				throw new GrampsError(
					response.status,
					`HTTP ${response.status}: ${response.statusText}`,
					data
				);
			}

			return apiResponse;
		} catch (error) {
			clearTimeout(timeoutId);
			if (error instanceof GrampsError) {
				throw error;
			}
			this.logger.error("[Gramps SDK] Request failed:", error);
			throw new GrampsNetworkError(error);
		}
	}

	async get<T>(path: string): Promise<GrampsApiResponse<T>> {
		return this.request<T>("GET", path);
	}

	async post<T>(path: string, body?: unknown): Promise<GrampsApiResponse<T>> {
		return this.request<T>("POST", path, body);
	}

	async put<T>(path: string, body?: unknown): Promise<GrampsApiResponse<T>> {
		return this.request<T>("PUT", path, body);
	}

	async delete<T>(path: string): Promise<GrampsApiResponse<T>> {
		return this.request<T>("DELETE", path);
	}
}
