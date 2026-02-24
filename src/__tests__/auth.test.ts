import { describe, it, expect } from "vitest";
import {
	getTokenStorageKey,
	storeTokens,
	getStoredAccessToken,
	getStoredRefreshToken,
	getStoredTokenExpiry,
	clearStoredTokens,
	isTokenExpired,
} from "../auth";

const SERVER_URL = "https://gramps.example.com";

describe("JWT auth utilities", () => {
	describe("getTokenStorageKey", () => {
		it("should build a storage key from serverUrl and type", () => {
			const key = getTokenStorageKey(SERVER_URL, "access");
			expect(key).toBe("gramps_sdk:gramps.example.com:access");
		});

		it("should build distinct keys for different types", () => {
			const accessKey = getTokenStorageKey(SERVER_URL, "access");
			const refreshKey = getTokenStorageKey(SERVER_URL, "refresh");
			const expiresKey = getTokenStorageKey(SERVER_URL, "expires_at");
			expect(accessKey).not.toBe(refreshKey);
			expect(refreshKey).not.toBe(expiresKey);
		});
	});

	describe("storeTokens / getStoredAccessToken / getStoredRefreshToken", () => {
		it("should store and retrieve access token from sessionStorage", () => {
			storeTokens({ serverUrl: SERVER_URL, accessToken: "access-abc" });
			expect(getStoredAccessToken(SERVER_URL)).toBe("access-abc");
		});

		it("should store and retrieve refresh token from localStorage", () => {
			storeTokens({ serverUrl: SERVER_URL, refreshToken: "refresh-xyz" });
			expect(getStoredRefreshToken(SERVER_URL)).toBe("refresh-xyz");
		});

		it("should store expiry in localStorage", () => {
			const expiresAt = Date.now() + 3600_000;
			storeTokens({ serverUrl: SERVER_URL, expiresAt });
			expect(getStoredTokenExpiry(SERVER_URL)).toBeCloseTo(expiresAt, -3);
		});
	});

	describe("clearStoredTokens", () => {
		it("should clear all stored tokens", () => {
			storeTokens({
				serverUrl: SERVER_URL,
				accessToken: "access-abc",
				refreshToken: "refresh-xyz",
				expiresAt: Date.now() + 3600_000,
			});
			clearStoredTokens(SERVER_URL);
			expect(getStoredAccessToken(SERVER_URL)).toBeNull();
			expect(getStoredRefreshToken(SERVER_URL)).toBeNull();
			expect(getStoredTokenExpiry(SERVER_URL)).toBeNull();
		});
	});

	describe("isTokenExpired", () => {
		it("should return false if no expiry stored", () => {
			clearStoredTokens(SERVER_URL);
			expect(isTokenExpired(SERVER_URL)).toBe(false);
		});

		it("should return false if token is not expired", () => {
			storeTokens({ serverUrl: SERVER_URL, expiresAt: Date.now() + 3600_000 });
			expect(isTokenExpired(SERVER_URL)).toBe(false);
		});

		it("should return true if token is expired", () => {
			storeTokens({ serverUrl: SERVER_URL, expiresAt: Date.now() - 1000 });
			expect(isTokenExpired(SERVER_URL)).toBe(true);
		});

		it("should apply a 30 second buffer", () => {
			// Expires in 20 seconds → within buffer → expired
			storeTokens({ serverUrl: SERVER_URL, expiresAt: Date.now() + 20_000 });
			expect(isTokenExpired(SERVER_URL)).toBe(true);
		});
	});
});
