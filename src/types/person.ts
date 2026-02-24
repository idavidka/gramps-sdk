/**
 * Gramps Person Types
 */

/**
 * Gramps name type structure
 */
export interface GrampsNameType {
	string: string;
	_class: string;
}

/**
 * Gramps surname structure
 */
export interface GrampsSurname {
	surname: string;
	primary: boolean;
	origintype: GrampsNameType;
	connector: string;
	prefix: string;
}

/**
 * Gramps name structure
 */
export interface GrampsName {
	_class: string;
	type: GrampsNameType;
	first_name: string;
	surname_list: GrampsSurname[];
	suffix: string;
	title: string;
	call: string;
	nick: string;
	famnick: string;
	group_as: string;
	sort_as: number;
	display_as: number;
	date?: GrampsDate;
}

/**
 * Gramps date modifier
 */
export type GrampsDateModifier =
	| "none"
	| "before"
	| "after"
	| "about"
	| "calculated"
	| "estimated"
	| "interpreted";

/**
 * Gramps date quality
 */
export type GrampsDateQuality = "normal" | "estimated" | "calculated";

/**
 * Gramps date structure
 */
export interface GrampsDate {
	_class: string;
	modifier: GrampsDateModifier;
	quality: GrampsDateQuality;
	dateval: [number, number, number, boolean] | null;
	text: string;
	sortval: number;
	newyear: number | string;
}

/**
 * Gramps event reference on a person
 */
export interface GrampsEventRef {
	_class: string;
	ref: string;
	role: GrampsNameType;
	attribute_list: GrampsAttribute[];
	note_list: string[];
	privacy: boolean;
}

/**
 * Gramps attribute structure
 */
export interface GrampsAttribute {
	_class: string;
	type: GrampsNameType;
	value: string;
	note_list: string[];
	citation_list: string[];
	privacy: boolean;
}

/**
 * Gramps media reference
 */
export interface GrampsMediaRef {
	_class: string;
	ref: string;
	attribute_list: GrampsAttribute[];
	note_list: string[];
	citation_list: string[];
	rect?: [number, number, number, number];
	privacy: boolean;
}

/**
 * Gramps LDS ord structure
 */
export interface GrampsLdsOrd {
	_class: string;
	type: GrampsNameType;
	famc?: string;
	temple: string;
	place?: string;
	date?: GrampsDate;
	status: GrampsNameType;
	note_list: string[];
	citation_list: string[];
	privacy: boolean;
}

/**
 * Gramps URL structure
 */
export interface GrampsUrl {
	_class: string;
	path: string;
	desc: string;
	type: GrampsNameType;
	privacy: boolean;
}

/**
 * Gramps Person – matches the Gramps Web API JSON response
 */
export interface GrampsPerson {
	_class: string;
	handle: string;
	gramps_id: string;
	gender: number;
	primary_name: GrampsName;
	alternate_names: GrampsName[];
	death_ref_index: number;
	birth_ref_index: number;
	event_ref_list: GrampsEventRef[];
	family_list: string[];
	parent_family_list: string[];
	media_list: GrampsMediaRef[];
	address_list: unknown[];
	attribute_list: GrampsAttribute[];
	urls: GrampsUrl[];
	lds_ord_list: GrampsLdsOrd[];
	citation_list: string[];
	note_list: string[];
	change: number;
	tag_list: string[];
	private: boolean;
}
