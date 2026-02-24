import { describe, it, expect } from "vitest";
import { validateServerUrl, checkApiCompatibility } from "../utils/validation";

describe("validateServerUrl", () => {
	it("should accept a valid HTTPS URL", () => {
		const result = validateServerUrl("https://gramps.example.com");
		expect(result.valid).toBe(true);
	});

	it("should accept localhost with HTTP", () => {
		const result = validateServerUrl("http://localhost:5000");
		expect(result.valid).toBe(true);
	});

	it("should accept 127.0.0.1 with HTTP", () => {
		const result = validateServerUrl("http://127.0.0.1:5000");
		expect(result.valid).toBe(true);
	});

	it("should reject a non-HTTPS URL for a non-local host", () => {
		const result = validateServerUrl("http://gramps.example.com");
		expect(result.valid).toBe(false);
		expect(result.error).toContain("HTTPS");
	});

	it("should reject an invalid URL string", () => {
		const result = validateServerUrl("not-a-url");
		expect(result.valid).toBe(false);
		expect(result.error).toBe("Invalid URL format");
	});

	it("should reject an empty string", () => {
		const result = validateServerUrl("");
		expect(result.valid).toBe(false);
	});
});

describe("checkApiCompatibility", () => {
	it("should accept version 2.0.0", () => {
		const result = checkApiCompatibility("2.0.0");
		expect(result.compatible).toBe(true);
	});

	it("should accept version 3.1.2", () => {
		const result = checkApiCompatibility("3.1.2");
		expect(result.compatible).toBe(true);
	});

	it("should reject version 1.9.0", () => {
		const result = checkApiCompatibility("1.9.0");
		expect(result.compatible).toBe(false);
		expect(result.reason).toContain("2.0.0");
	});

	it("should reject version 0.1.0", () => {
		const result = checkApiCompatibility("0.1.0");
		expect(result.compatible).toBe(false);
	});
});
