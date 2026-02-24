/**
 * @treeviz/gramps-sdk
 *
 * TypeScript SDK for Gramps Web API
 *
 * @example
 * ```typescript
 * import { GrampsSDK, createGrampsSDK } from '@treeviz/gramps-sdk';
 *
 * const sdk = createGrampsSDK({ serverUrl: 'https://gramps.example.com' });
 * await sdk.connect({ username: 'admin', password: 'secret' });
 *
 * const people = await sdk.people.list({ pageSize: 50 });
 * ```
 *
 * @packageDocumentation
 */

// Core SDK Client
export {
	GrampsSDK,
	initGrampsSDK,
	getGrampsSDK,
	createGrampsSDK,
	resetGrampsSDK,
} from "./client";

// Types
export type {
	GrampsLogger,
	GrampsSDKConfig,
	GrampsApiResponse,
	GrampsApiError,
	GrampsListOptions,
	JWTTokenResponse,
	GrampsAuthConfig,
	JWTCredentials,
	GrampsName,
	GrampsNameType,
	GrampsSurname,
	GrampsDate,
	GrampsDateModifier,
	GrampsDateQuality,
	GrampsEventRef,
	GrampsAttribute,
	GrampsMediaRef,
	GrampsLdsOrd,
	GrampsUrl,
	GrampsPerson,
	GrampsChildRef,
	GrampsFamily,
	GrampsEvent,
	GrampsCoordinates,
	GrampsPlaceName,
	GrampsPlaceRef,
	GrampsPlace,
	GrampsMedia,
	ThumbnailSize,
} from "./types";

// Auth module
export * from "./auth";

// API modules
export { PeopleAPI, FamiliesAPI, EventsAPI, PlacesAPI, MediaAPI, MetadataAPI } from "./api";
export type { GrampsTreeInfo } from "./api";

// Converters
export {
	convertPerson,
	convertFamily,
	convertEvent,
	convertPlace,
	convertTree,
	formatGrampsDate,
} from "./converters";
export type {
	TreeVizPerson,
	TreeVizFamily,
	TreeVizEvent,
	TreeVizPlace,
	GrampsTreeData,
	TreeVizTree,
	ConversionReport,
} from "./converters";

// Utils
export {
	GrampsHttpClient,
	GrampsError,
	GrampsNetworkError,
	validateServerUrl,
	testServerConnection,
	checkApiCompatibility,
} from "./utils";
export type { GrampsServerInfo } from "./utils";
