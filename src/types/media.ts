/**
 * Gramps Media Types
 */

import type { GrampsAttribute } from "./person";

/**
 * Gramps Media object – matches the Gramps Web API JSON response
 */
export interface GrampsMedia {
	_class: string;
	handle: string;
	gramps_id: string;
	path: string;
	mime: string;
	desc: string;
	checksum: string;
	attribute_list: GrampsAttribute[];
	citation_list: string[];
	note_list: string[];
	change: number;
	date?: import("./person").GrampsDate;
	tag_list: string[];
	private: boolean;
}

/**
 * Thumbnail size options
 */
export type ThumbnailSize = "small" | "medium" | "large";
