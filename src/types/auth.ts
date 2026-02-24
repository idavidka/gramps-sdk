/**
 * Gramps Authentication Types
 */

/**
 * JWT token response from Gramps Web API
 */
export interface JWTTokenResponse {
	access_token: string;
	token_type: string;
	/** Expiration time in seconds from now */
	expires_in?: number;
	refresh_token?: string;
}

/**
 * Gramps authentication configuration
 */
export interface GrampsAuthConfig {
	/** Gramps Web server URL */
	serverUrl: string;
	/** JWT access token */
	accessToken?: string;
	/** JWT refresh token */
	refreshToken?: string;
	/** Token expiry timestamp (ms since epoch) */
	expiresAt?: number;
}

/**
 * JWT login credentials
 */
export interface JWTCredentials {
	username: string;
	password: string;
}
