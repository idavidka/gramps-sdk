/**
 * Gramps SDK Client
 *
 * Main entry point for interacting with a Gramps Web server.
 */

import {
	EventsAPI,
	FamiliesAPI,
	MediaAPI,
	MetadataAPI,
	PeopleAPI,
	PlacesAPI,
} from "./api";
import {
	clearStoredTokens,
	getStoredAccessToken,
	getStoredRefreshToken,
	isTokenExpired,
	login,
	refreshToken,
} from "./auth";
import type { GrampsLogger, GrampsSDKConfig } from "./types/core";
import type { JWTCredentials } from "./types/auth";
import { GrampsHttpClient } from "./utils/http";

// Default no-op logger
const noopLogger: GrampsLogger = {
	log: () => {},
	warn: () => {},
	error: () => {},
};

/**
 * GrampsSDK – Main client class
 *
 * @example
 * ```typescript
 * const sdk = new GrampsSDK({ serverUrl: 'https://gramps.example.com' });
 * await sdk.connect({ username: 'admin', password: 'secret' });
 *
 * const people = await sdk.people.list({ pageSize: 50 });
 * ```
 */
export class GrampsSDK {
	private serverUrl: string;
	private accessToken: string | null = null;
	private refreshTokenValue: string | null = null;
	private timeoutMs: number;
	public readonly logger: GrampsLogger;

	// HTTP client (shared across all API modules)
	private http: GrampsHttpClient;

	// API modules
	public readonly people: PeopleAPI;
	public readonly families: FamiliesAPI;
	public readonly events: EventsAPI;
	public readonly places: PlacesAPI;
	public readonly media: MediaAPI;
	public readonly metadata: MetadataAPI;

	constructor(config: GrampsSDKConfig = {}) {
		this.serverUrl = (config.serverUrl ?? "").replace(/\/$/, "");
		this.accessToken = config.accessToken ?? null;
		this.refreshTokenValue = config.refreshToken ?? null;
		this.timeoutMs = config.timeoutMs ?? 30_000;
		this.logger = config.logger ?? noopLogger;

		this.http = new GrampsHttpClient(
			this.serverUrl,
			this.accessToken,
			this.timeoutMs,
			this.logger
		);

		this.people = new PeopleAPI(this.http);
		this.families = new FamiliesAPI(this.http);
		this.events = new EventsAPI(this.http);
		this.places = new PlacesAPI(this.http);
		this.media = new MediaAPI(this.http);
		this.metadata = new MetadataAPI(this.http);
	}

	/**
	 * Connect to a Gramps Web server using JWT credentials
	 *
	 * Attempts to reuse stored tokens before performing a fresh login.
	 */
	async connect(credentials: JWTCredentials): Promise<void> {
		if (!this.serverUrl) {
			throw new Error("serverUrl must be configured before calling connect()");
		}

		// Try to reuse stored token
		const storedAccess = getStoredAccessToken(this.serverUrl);
		if (storedAccess && !isTokenExpired(this.serverUrl)) {
			this.setAccessToken(storedAccess);
			return;
		}

		// Try refresh token
		const storedRefresh = getStoredRefreshToken(this.serverUrl);
		if (storedRefresh) {
			try {
				const tokenResponse = await refreshToken(this.serverUrl, storedRefresh);
				this.setAccessToken(tokenResponse.access_token);
				if (tokenResponse.refresh_token) {
					this.refreshTokenValue = tokenResponse.refresh_token;
				}
				return;
			} catch {
				this.logger.warn("[Gramps SDK] Token refresh failed, performing fresh login");
			}
		}

		// Fresh login
		const tokenResponse = await login(this.serverUrl, credentials);
		this.setAccessToken(tokenResponse.access_token);
		if (tokenResponse.refresh_token) {
			this.refreshTokenValue = tokenResponse.refresh_token;
		}
	}

	/**
	 * Disconnect from the Gramps Web server and clear stored tokens
	 */
	disconnect(): void {
		if (this.serverUrl) {
			clearStoredTokens(this.serverUrl);
		}
		this.accessToken = null;
		this.refreshTokenValue = null;
		this.http.setAccessToken(null);
	}

	/**
	 * Set the server URL and rebuild the HTTP client
	 */
	setServerUrl(url: string): void {
		this.serverUrl = url.replace(/\/$/, "");
		this.http = new GrampsHttpClient(
			this.serverUrl,
			this.accessToken,
			this.timeoutMs,
			this.logger
		);
		// Re-wire API modules to the new http client
		// (TypeScript readonly prevents direct assignment - use Object.assign on the instance)
		Object.assign(this, {
			people: new PeopleAPI(this.http),
			families: new FamiliesAPI(this.http),
			events: new EventsAPI(this.http),
			places: new PlacesAPI(this.http),
			media: new MediaAPI(this.http),
			metadata: new MetadataAPI(this.http),
		});
	}

	/**
	 * Set the JWT access token directly
	 */
	setAccessToken(token: string): void {
		this.accessToken = token;
		this.http.setAccessToken(token);
	}

	/**
	 * Get the current access token
	 */
	getAccessToken(): string | null {
		return this.accessToken;
	}

	/**
	 * Clear the current access token
	 */
	clearAccessToken(): void {
		this.accessToken = null;
		this.http.setAccessToken(null);
	}

	/**
	 * Returns true if an access token is set
	 */
	hasAccessToken(): boolean {
		return !!this.accessToken;
	}

	/**
	 * Get the configured server URL
	 */
	getServerUrl(): string {
		return this.serverUrl;
	}
}

// ====================================
// Singleton Instance Management
// ====================================

let sdkInstance: GrampsSDK | null = null;

/**
 * Initialize the global GrampsSDK singleton
 */
export function initGrampsSDK(config: GrampsSDKConfig = {}): GrampsSDK {
	if (!sdkInstance) {
		sdkInstance = new GrampsSDK(config);
	} else {
		if (config.accessToken !== undefined) {
			sdkInstance.setAccessToken(config.accessToken);
		}
		if (config.serverUrl !== undefined) {
			sdkInstance.setServerUrl(config.serverUrl);
		}
	}
	return sdkInstance;
}

/**
 * Get the global GrampsSDK singleton (creates a default instance if not yet initialized)
 */
export function getGrampsSDK(): GrampsSDK {
	if (!sdkInstance) {
		sdkInstance = new GrampsSDK();
	}
	return sdkInstance;
}

/**
 * Create a new GrampsSDK instance (for testing or multiple servers)
 */
export function createGrampsSDK(config: GrampsSDKConfig = {}): GrampsSDK {
	return new GrampsSDK(config);
}

/**
 * Reset the global singleton (mainly for testing)
 */
export function resetGrampsSDK(): void {
	sdkInstance = null;
}
