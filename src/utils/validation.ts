/**
 * Gramps Web server URL validation and connection testing
 */

import type { GrampsApiResponse } from "../types/core";

/**
 * Validate that a URL is a syntactically valid HTTPS URL (or HTTP for localhost/dev)
 */
export function validateServerUrl(url: string): { valid: boolean; error?: string } {
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== "https:" && !isLocalhost(parsed.hostname)) {
			return {
				valid: false,
				error: "Server URL must use HTTPS (HTTP is only allowed for localhost)",
			};
		}
		return { valid: true };
	} catch {
		return { valid: false, error: "Invalid URL format" };
	}
}

/**
 * Returns true if the hostname is a local address
 */
function isLocalhost(hostname: string): boolean {
	return (
		hostname === "localhost" ||
		hostname === "127.0.0.1" ||
		hostname === "::1" ||
		hostname.endsWith(".local")
	);
}

/**
 * Gramps Web API version info returned by /api/metadata
 */
export interface GrampsServerInfo {
	version: string;
	gramps_version: string;
	locale: string;
}

/**
 * Test connectivity to a Gramps Web server by calling /api/metadata
 */
export async function testServerConnection(
	serverUrl: string
): Promise<{ reachable: boolean; info?: GrampsServerInfo; error?: string }> {
	const normalizedUrl = serverUrl.replace(/\/$/, "");
	try {
		const response = await fetch(`${normalizedUrl}/api/metadata`, {
			headers: { Accept: "application/json" },
			signal: AbortSignal.timeout(10_000),
		});
		if (!response.ok) {
			return {
				reachable: false,
				error: `Server responded with HTTP ${response.status}`,
			};
		}
		const data = (await response.json()) as GrampsServerInfo;
		return { reachable: true, info: data };
	} catch (error) {
		return {
			reachable: false,
			error: error instanceof Error ? error.message : "Connection failed",
		};
	}
}

/**
 * Check whether a Gramps Web API version is compatible with this SDK
 *
 * The SDK requires Gramps Web API >= 2.0.0
 */
export function checkApiCompatibility(version: string): {
	compatible: boolean;
	reason?: string;
} {
	const parts = version.split(".").map(Number);
	const major = parts[0] ?? 0;
	if (major < 2) {
		return {
			compatible: false,
			reason: `Gramps Web API version ${version} is not supported. Minimum required: 2.0.0`,
		};
	}
	return { compatible: true };
}


