import { describe, it, expect } from "vitest";
import { convertPerson, formatGrampsDate } from "../converters/person";
import { convertFamily } from "../converters/family";
import { convertEvent } from "../converters/event";
import { convertPlace } from "../converters/place";
import { convertTree } from "../converters/tree";
import type { GrampsPerson } from "../types/person";
import type { GrampsFamily } from "../types/family";
import type { GrampsEvent } from "../types/event";
import type { GrampsPlace } from "../types/place";

// ────────────────────────────────────────────
// Helpers / fixtures
// ────────────────────────────────────────────

function makePerson(overrides: Partial<GrampsPerson> = {}): GrampsPerson {
	return {
		_class: "Person",
		handle: "h001",
		gramps_id: "I0001",
		gender: 1,
		primary_name: {
			_class: "Name",
			type: { _class: "NameType", string: "Birth Name" },
			first_name: "John",
			surname_list: [
				{
					surname: "Smith",
					primary: true,
					origintype: { _class: "NameOriginType", string: "" },
					connector: "",
					prefix: "",
				},
			],
			suffix: "Jr.",
			title: "",
			call: "",
			nick: "",
			famnick: "",
			group_as: "",
			sort_as: 0,
			display_as: 0,
		},
		alternate_names: [],
		death_ref_index: -1,
		birth_ref_index: -1,
		event_ref_list: [],
		family_list: ["fh001"],
		parent_family_list: ["fh000"],
		media_list: [],
		address_list: [],
		attribute_list: [],
		urls: [],
		lds_ord_list: [],
		citation_list: [],
		note_list: [],
		change: 0,
		tag_list: [],
		private: false,
		...overrides,
	};
}

function makeFamily(overrides: Partial<GrampsFamily> = {}): GrampsFamily {
	return {
		_class: "Family",
		handle: "fh001",
		gramps_id: "F0001",
		father_handle: "h001",
		mother_handle: "h002",
		child_ref_list: [
			{
				_class: "ChildRef",
				ref: "h003",
				frel: { _class: "ChildRefType", string: "Birth" },
				mrel: { _class: "ChildRefType", string: "Birth" },
				note_list: [],
				citation_list: [],
				privacy: false,
			},
		],
		type: { _class: "FamilyRelType", string: "Married" },
		event_ref_list: [],
		media_list: [],
		attribute_list: [],
		lds_ord_list: [],
		citation_list: [],
		note_list: [],
		change: 0,
		tag_list: [],
		private: false,
		...overrides,
	};
}

function makeEvent(overrides: Partial<GrampsEvent> = {}): GrampsEvent {
	return {
		_class: "Event",
		handle: "eh001",
		gramps_id: "E0001",
		type: { _class: "EventType", string: "Birth" },
		date: {
			_class: "Date",
			modifier: "none",
			quality: "normal",
			dateval: [15, 6, 1980, false],
			text: "15 Jun 1980",
			sortval: 0,
			newyear: 0,
		},
		description: "Birth of John",
		place: "ph001",
		media_list: [],
		attribute_list: [],
		citation_list: [],
		note_list: [],
		change: 0,
		tag_list: [],
		private: false,
		...overrides,
	};
}

function makePlace(overrides: Partial<GrampsPlace> = {}): GrampsPlace {
	return {
		_class: "Place",
		handle: "ph001",
		gramps_id: "P0001",
		title: "Springfield, USA",
		long_name: "Springfield, Illinois, USA",
		name: { _class: "PlaceName", value: "Springfield", lang: "" },
		alt_names: [],
		placeref_list: [],
		lat: "39.7817",
		long: "-89.6501",
		type: { _class: "PlaceType", string: "City" },
		code: "",
		alt_loc: [],
		urls: [],
		media_list: [],
		citation_list: [],
		note_list: [],
		attribute_list: [],
		change: 0,
		tag_list: [],
		private: false,
		...overrides,
	};
}

// ────────────────────────────────────────────
// Tests
// ────────────────────────────────────────────

describe("formatGrampsDate", () => {
	it("should return null for null input", () => {
		expect(formatGrampsDate(null)).toBeNull();
	});

	it("should return text if available", () => {
		const date = {
			_class: "Date",
			modifier: "none" as const,
			quality: "normal" as const,
			dateval: null,
			text: "circa 1900",
			sortval: 0,
			newyear: 0,
		};
		expect(formatGrampsDate(date)).toBe("circa 1900");
	});

	it("should format dateval as YYYY-MM-DD", () => {
		const date = {
			_class: "Date",
			modifier: "none" as const,
			quality: "normal" as const,
			dateval: [15, 6, 1980, false] as [number, number, number, boolean],
			text: "",
			sortval: 0,
			newyear: 0,
		};
		expect(formatGrampsDate(date)).toBe("1980-06-15");
	});

	it("should apply 'before' modifier prefix", () => {
		const date = {
			_class: "Date",
			modifier: "before" as const,
			quality: "normal" as const,
			dateval: [0, 0, 1900, false] as [number, number, number, boolean],
			text: "",
			sortval: 0,
			newyear: 0,
		};
		expect(formatGrampsDate(date)).toBe("before 1900");
	});
});

describe("convertPerson", () => {
	it("should convert basic person fields", () => {
		const person = makePerson();
		const result = convertPerson(person);
		expect(result.id).toBe("I0001");
		expect(result.grampsHandle).toBe("h001");
		expect(result.grampsId).toBe("I0001");
		expect(result.firstName).toBe("John");
		expect(result.lastName).toBe("Smith");
		expect(result.suffix).toBe("Jr.");
		expect(result.gender).toBe("M");
	});

	it("should map gender codes correctly", () => {
		expect(convertPerson(makePerson({ gender: 1 })).gender).toBe("M");
		expect(convertPerson(makePerson({ gender: 2 })).gender).toBe("F");
		expect(convertPerson(makePerson({ gender: 0 })).gender).toBe("U");
	});

	it("should include family and parent family IDs", () => {
		const result = convertPerson(makePerson());
		expect(result.familyIds).toEqual(["fh001"]);
		expect(result.parentFamilyIds).toEqual(["fh000"]);
	});

	it("should have null birth/death dates without events", () => {
		const result = convertPerson(makePerson());
		expect(result.birthDate).toBeNull();
		expect(result.deathDate).toBeNull();
	});
});

describe("convertFamily", () => {
	it("should convert basic family fields", () => {
		const family = makeFamily();
		const result = convertFamily(family);
		expect(result.id).toBe("F0001");
		expect(result.grampsHandle).toBe("fh001");
		expect(result.fatherHandle).toBe("h001");
		expect(result.motherHandle).toBe("h002");
		expect(result.childHandles).toEqual(["h003"]);
		expect(result.relationshipType).toBe("Married");
	});

	it("should handle null parents", () => {
		const result = convertFamily(makeFamily({ father_handle: null, mother_handle: null }));
		expect(result.fatherHandle).toBeNull();
		expect(result.motherHandle).toBeNull();
	});
});

describe("convertEvent", () => {
	it("should convert basic event fields", () => {
		const event = makeEvent();
		const result = convertEvent(event);
		expect(result.handle).toBe("eh001");
		expect(result.grampsId).toBe("E0001");
		expect(result.type).toBe("Birth");
		expect(result.date).toBe("15 Jun 1980");
		expect(result.placeHandle).toBe("ph001");
	});

	it("should handle null date and place", () => {
		const result = convertEvent(makeEvent({ date: null, place: null }));
		expect(result.date).toBeNull();
		expect(result.placeHandle).toBeNull();
	});
});

describe("convertPlace", () => {
	it("should convert basic place fields", () => {
		const place = makePlace();
		const result = convertPlace(place);
		expect(result.handle).toBe("ph001");
		expect(result.grampsId).toBe("P0001");
		expect(result.name).toBe("Springfield, USA");
		expect(result.lat).toBeCloseTo(39.7817);
		expect(result.lng).toBeCloseTo(-89.6501);
		expect(result.type).toBe("City");
	});

	it("should return null coordinates for empty strings", () => {
		const result = convertPlace(makePlace({ lat: "", long: "" }));
		expect(result.lat).toBeNull();
		expect(result.lng).toBeNull();
	});
});

describe("convertTree", () => {
	it("should convert a full tree dataset", () => {
		const person = makePerson();
		const family = makeFamily();
		const event = makeEvent();
		const place = makePlace();

		const result = convertTree({
			people: [person],
			families: [family],
			events: [event],
			places: [place],
		});

		expect(result.people).toHaveLength(1);
		expect(result.families).toHaveLength(1);
		expect(result.events).toHaveLength(1);
		expect(result.places).toHaveLength(1);
		expect(result.report.peopleCount).toBe(1);
		expect(result.report.familiesCount).toBe(1);
		expect(result.report.errors).toHaveLength(0);
	});

	it("should enrich person with birth data from events", () => {
		const birthEvent = makeEvent({ handle: "eh001" });
		const person = makePerson({
			birth_ref_index: 0,
			event_ref_list: [
				{
					_class: "EventRef",
					ref: "eh001",
					role: { _class: "EventRoleType", string: "Primary" },
					attribute_list: [],
					note_list: [],
					privacy: false,
				},
			],
		});

		const result = convertTree({
			people: [person],
			families: [],
			events: [birthEvent],
			places: [makePlace()],
		});

		expect(result.people[0].birthDate).toBe("15 Jun 1980");
		expect(result.people[0].birthPlace).toBe("Springfield, USA");
	});

	it("should report conversion errors without crashing", () => {
		// Intentionally break the person by casting to avoid TS error
		const brokenPerson = { gramps_id: "BROKEN" } as unknown as GrampsPerson;

		const result = convertTree({
			people: [brokenPerson],
			families: [],
			events: [],
			places: [],
		});

		expect(result.people).toHaveLength(0);
		expect(result.report.errors.length).toBeGreaterThan(0);
	});
});
