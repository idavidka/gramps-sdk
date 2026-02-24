import { describe, it, expect, beforeEach } from "vitest";
import {
	GrampsSDK,
	createGrampsSDK,
	initGrampsSDK,
	getGrampsSDK,
	resetGrampsSDK,
} from "../client";

describe("GrampsSDK", () => {
	beforeEach(() => {
		resetGrampsSDK();
	});

	describe("constructor", () => {
		it("should create SDK with empty config", () => {
			const sdk = new GrampsSDK();
			expect(sdk.getServerUrl()).toBe("");
			expect(sdk.getAccessToken()).toBeNull();
			expect(sdk.hasAccessToken()).toBe(false);
		});

		it("should create SDK with server URL", () => {
			const sdk = new GrampsSDK({ serverUrl: "https://gramps.example.com" });
			expect(sdk.getServerUrl()).toBe("https://gramps.example.com");
		});

		it("should strip trailing slash from server URL", () => {
			const sdk = new GrampsSDK({ serverUrl: "https://gramps.example.com/" });
			expect(sdk.getServerUrl()).toBe("https://gramps.example.com");
		});

		it("should create SDK with access token", () => {
			const sdk = new GrampsSDK({ accessToken: "test-token" });
			expect(sdk.getAccessToken()).toBe("test-token");
			expect(sdk.hasAccessToken()).toBe(true);
		});

		it("should expose API modules", () => {
			const sdk = new GrampsSDK();
			expect(sdk.people).toBeDefined();
			expect(sdk.families).toBeDefined();
			expect(sdk.events).toBeDefined();
			expect(sdk.places).toBeDefined();
			expect(sdk.media).toBeDefined();
			expect(sdk.metadata).toBeDefined();
		});
	});

	describe("access token management", () => {
		it("should set and get access token", () => {
			const sdk = new GrampsSDK();
			sdk.setAccessToken("new-token");
			expect(sdk.getAccessToken()).toBe("new-token");
		});

		it("should clear access token", () => {
			const sdk = new GrampsSDK({ accessToken: "test-token" });
			sdk.clearAccessToken();
			expect(sdk.getAccessToken()).toBeNull();
			expect(sdk.hasAccessToken()).toBe(false);
		});
	});

	describe("server URL management", () => {
		it("should update server URL", () => {
			const sdk = new GrampsSDK({ serverUrl: "https://gramps.example.com" });
			sdk.setServerUrl("https://gramps2.example.com");
			expect(sdk.getServerUrl()).toBe("https://gramps2.example.com");
		});

		it("should strip trailing slash when updating server URL", () => {
			const sdk = new GrampsSDK();
			sdk.setServerUrl("https://gramps.example.com/");
			expect(sdk.getServerUrl()).toBe("https://gramps.example.com");
		});
	});

	describe("disconnect", () => {
		it("should clear access token on disconnect", () => {
			const sdk = new GrampsSDK({
				serverUrl: "https://gramps.example.com",
				accessToken: "test-token",
			});
			sdk.disconnect();
			expect(sdk.getAccessToken()).toBeNull();
			expect(sdk.hasAccessToken()).toBe(false);
		});
	});
});

describe("singleton management", () => {
	beforeEach(() => {
		resetGrampsSDK();
	});

	it("should create singleton with initGrampsSDK", () => {
		const sdk = initGrampsSDK({ serverUrl: "https://gramps.example.com" });
		expect(sdk.getServerUrl()).toBe("https://gramps.example.com");
	});

	it("should return same instance with getGrampsSDK", () => {
		const sdk1 = initGrampsSDK({ accessToken: "token1" });
		const sdk2 = getGrampsSDK();
		expect(sdk1).toBe(sdk2);
		expect(sdk2.getAccessToken()).toBe("token1");
	});

	it("should update token on existing instance", () => {
		initGrampsSDK({ accessToken: "token1" });
		initGrampsSDK({ accessToken: "token2" });
		const sdk = getGrampsSDK();
		expect(sdk.getAccessToken()).toBe("token2");
	});

	it("should create new instance with createGrampsSDK", () => {
		const sdk1 = createGrampsSDK({ serverUrl: "https://gramps1.example.com" });
		const sdk2 = createGrampsSDK({ serverUrl: "https://gramps2.example.com" });
		expect(sdk1).not.toBe(sdk2);
		expect(sdk1.getServerUrl()).toBe("https://gramps1.example.com");
		expect(sdk2.getServerUrl()).toBe("https://gramps2.example.com");
	});

	it("should reset singleton", () => {
		const sdk1 = initGrampsSDK({ serverUrl: "https://gramps.example.com" });
		resetGrampsSDK();
		const sdk2 = getGrampsSDK();
		expect(sdk1).not.toBe(sdk2);
	});
});
