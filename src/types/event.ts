/**
 * Gramps Event Types
 */

import type { GrampsAttribute, GrampsDate, GrampsMediaRef, GrampsNameType } from "./person";

/**
 * Gramps Event – matches the Gramps Web API JSON response
 */
export interface GrampsEvent {
	_class: string;
	handle: string;
	gramps_id: string;
	type: GrampsNameType;
	date: GrampsDate | null;
	description: string;
	place: string | null;
	media_list: GrampsMediaRef[];
	attribute_list: GrampsAttribute[];
	citation_list: string[];
	note_list: string[];
	change: number;
	tag_list: string[];
	private: boolean;
}
