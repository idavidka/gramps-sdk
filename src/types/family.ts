/**
 * Gramps Family Types
 */

import type { GrampsAttribute, GrampsEventRef, GrampsLdsOrd, GrampsMediaRef } from "./person";

/**
 * Gramps child reference structure
 */
export interface GrampsChildRef {
	_class: string;
	ref: string;
	frel: { _class: string; string: string };
	mrel: { _class: string; string: string };
	note_list: string[];
	citation_list: string[];
	privacy: boolean;
}

/**
 * Gramps Family – matches the Gramps Web API JSON response
 */
export interface GrampsFamily {
	_class: string;
	handle: string;
	gramps_id: string;
	father_handle: string | null;
	mother_handle: string | null;
	child_ref_list: GrampsChildRef[];
	type: { _class: string; string: string };
	event_ref_list: GrampsEventRef[];
	media_list: GrampsMediaRef[];
	attribute_list: GrampsAttribute[];
	lds_ord_list: GrampsLdsOrd[];
	citation_list: string[];
	note_list: string[];
	change: number;
	tag_list: string[];
	private: boolean;
}
