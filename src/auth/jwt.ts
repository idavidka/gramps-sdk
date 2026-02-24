/**
 * Gramps Web JWT Authentication
 *
 * Handles username/password login, token refresh, and token storage.
 */

import type { GrampsAuthConfig, JWTCredentials, JWTTokenResponse } from "../types/auth";
import { GrampsError, GrampsNetworkError } from "../utils/errors";

const TOKEN_STORAGE_PREFIX = "gramps_sdk";

// ====================================
// Storage helpers
// ====================================

/**
 * Build storage key for a given server URL and token type
 */
export function getTokenStorageKey(
	serverUrl: string,
	type: "access" | "refresh" | "expires_at"
): string {
	const host = new URL(serverUrl).host;
	return `${TOKEN_STORAGE_PREFIX}:${host}:${type}`;
}

/**
 * Store JWT tokens in sessionStorage (access) and localStorage (refresh)
 */
export function storeTokens(config: GrampsAuthConfig): void {
	const { serverUrl, accessToken, refreshToken, expiresAt } = config;
	if (accessToken) {
		sessionStorage.setItem(getTokenStorageKey(serverUrl, "access"), accessToken);
	}
	if (refreshToken) {
		localStorage.setItem(getTokenStorageKey(serverUrl, "refresh"), refreshToken);
	}
	if (expiresAt !== undefined) {
		localStorage.setItem(
			getTokenStorageKey(serverUrl, "expires_at"),
			String(expiresAt)
		);
	}
}

/**
 * Retrieve stored access token for a server
 */
export function getStoredAccessToken(serverUrl: string): string | null {
	return sessionStorage.getItem(getTokenStorageKey(serverUrl, "access"));
}

/**
 * Retrieve stored refresh token for a server
 */
export function getStoredRefreshToken(serverUrl: string): string | null {
	return localStorage.getItem(getTokenStorageKey(serverUrl, "refresh"));
}

/**
 * Retrieve stored token expiry for a server
 */
export function getStoredTokenExpiry(serverUrl: string): number | null {
	const raw = localStorage.getItem(getTokenStorageKey(serverUrl, "expires_at"));
	if (raw === null) {
		return null;
	}
	const value = Number(raw);
	return isNaN(value) ? null : value;
}

/**
 * Clear all stored tokens for a server
 */
export function clearStoredTokens(serverUrl: string): void {
	sessionStorage.removeItem(getTokenStorageKey(serverUrl, "access"));
	localStorage.removeItem(getTokenStorageKey(serverUrl, "refresh"));
	localStorage.removeItem(getTokenStorageKey(serverUrl, "expires_at"));
}

/**
 * Returns true if the stored token has expired (with a 30 s buffer)
 */
export function isTokenExpired(serverUrl: string): boolean {
	const expiresAt = getStoredTokenExpiry(serverUrl);
	if (expiresAt === null) {
		return false;
	}
	return Date.now() > expiresAt - 30_000;
}

// ====================================
// API calls
// ====================================

/**
 * Login to a Gramps Web server with username and password (JWT)
 *
 * POST /api/token/ with form-encoded body
 */
export async function login(
	serverUrl: string,
	credentials: JWTCredentials
): Promise<JWTTokenResponse> {
	const normalizedUrl = serverUrl.replace(/\/$/, "");
	const body = new URLSearchParams({
		username: credentials.username,
		password: credentials.password,
	});

	let response: Response;
	try {
		response = await fetch(`${normalizedUrl}/api/token/`, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: body.toString(),
		});
	} catch (error) {
		throw new GrampsNetworkError(error);
	}

	if (!response.ok) {
		throw new GrampsError(response.status, `Login failed: HTTP ${response.status}`);
	}

	const tokenResponse = (await response.json()) as JWTTokenResponse;

	// Persist tokens
	const expiresAt =
		tokenResponse.expires_in !== undefined
			? Date.now() + tokenResponse.expires_in * 1000
			: undefined;

	storeTokens({
		serverUrl,
		accessToken: tokenResponse.access_token,
		refreshToken: tokenResponse.refresh_token,
		expiresAt,
	});

	return tokenResponse;
}

/**
 * Refresh an access token using a refresh token
 *
 * POST /api/token/refresh/ with JSON body
 */
export async function refreshToken(
	serverUrl: string,
	currentRefreshToken: string
): Promise<JWTTokenResponse> {
	const normalizedUrl = serverUrl.replace(/\/$/, "");

	let response: Response;
	try {
		response = await fetch(`${normalizedUrl}/api/token/refresh/`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refresh_token: currentRefreshToken }),
		});
	} catch (error) {
		throw new GrampsNetworkError(error);
	}

	if (!response.ok) {
		throw new GrampsError(response.status, `Token refresh failed: HTTP ${response.status}`);
	}

	const tokenResponse = (await response.json()) as JWTTokenResponse;

	const expiresAt =
		tokenResponse.expires_in !== undefined
			? Date.now() + tokenResponse.expires_in * 1000
			: undefined;

	storeTokens({
		serverUrl,
		accessToken: tokenResponse.access_token,
		refreshToken: tokenResponse.refresh_token ?? currentRefreshToken,
		expiresAt,
	});

	return tokenResponse;
}

/**
 * Validate a token by calling a lightweight authenticated endpoint
 *
 * Uses GET /api/token/verify/ (or falls back to metadata if not available)
 */
export async function validateToken(
	serverUrl: string,
	accessTokenValue: string
): Promise<boolean> {
	const normalizedUrl = serverUrl.replace(/\/$/, "");

	try {
		const response = await fetch(`${normalizedUrl}/api/token/verify/`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessTokenValue}`,
				Accept: "application/json",
			},
		});
		return response.ok;
	} catch {
		return false;
	}
}
