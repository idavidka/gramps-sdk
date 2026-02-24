/**
 * Gramps Place Types
 */

import type { GrampsAttribute, GrampsMediaRef, GrampsNameType, GrampsUrl } from "./person";

/**
 * Gramps place coordinate structure
 */
export interface GrampsCoordinates {
	lat: string;
	long: string;
}

/**
 * Gramps place name structure
 */
export interface GrampsPlaceName {
	_class: string;
	value: string;
	lang: string;
	date?: import("./person").GrampsDate;
}

/**
 * Gramps place reference (hierarchy)
 */
export interface GrampsPlaceRef {
	_class: string;
	ref: string;
	date?: import("./person").GrampsDate;
}

/**
 * Gramps Place – matches the Gramps Web API JSON response
 */
export interface GrampsPlace {
	_class: string;
	handle: string;
	gramps_id: string;
	title: string;
	long_name: string;
	name: GrampsPlaceName;
	alt_names: GrampsPlaceName[];
	placeref_list: GrampsPlaceRef[];
	lat: string;
	long: string;
	type: GrampsNameType;
	code: string;
	alt_loc: unknown[];
	urls: GrampsUrl[];
	media_list: GrampsMediaRef[];
	citation_list: string[];
	note_list: string[];
	attribute_list: GrampsAttribute[];
	change: number;
	tag_list: string[];
	private: boolean;
}
