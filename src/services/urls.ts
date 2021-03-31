import {sample} from '@pizzafox/util';
import {ShortenedUrl} from '@prisma/client';
import {Opaque} from 'type-fest';
import {characters} from '../config';
import db from '../db';
import {UniqueShortIdTimeout} from '../server/errors';

/** A base64 encoded string. */
type Base64 = Opaque<string, 'Base64'>;

/** Maximum number of attempts to generate a unique ID. */
const maxGenerationAttempts = 10;

function encode(value: string): Base64 {
	return Buffer.from(value).toString('base64') as Base64;
}

export function debugInfo(id: string, encodedId: Base64) {
	return {short: id, encodedShort: encodedId, shortCodepoints: id.split('').map(char => char.charCodeAt(0).toString(16))};
}

// Reused to avoid expensive iteration
const rewritesEntries = Object.entries(characters.rewrites);

export function normalizeShortId(id: string): string {
	for (const [original, rewrite] of rewritesEntries) {
		id = id.replaceAll(original, rewrite);
	}

	return id;
}

/**
 * Generate a short ID.
 * Not guaranteed to be unique.
 *
 * @returns A short ID
 */
function generateShortId(): string {
	let shortId = '';

	// eslint-disable-next-line @typescript-eslint/prefer-for-of
	for (let i = 0; i < characters.length; i++) {
		shortId += sample(characters.characters);
	}

	return shortId;
}

/**
 * Visit a shortened URL.
 *
 * @param id - The ID of the shortened URL to visit
 * @param track - If the visit should be tracked
 *
 * @returns The long URL, or `null` if it couldn't be found
 */
export async function visit(id: string, track: boolean): Promise<string | null> {
	const encodedId = encode(id);

	const url = (await db.shortenedUrl.findUnique({where: {shortBase64: encodedId}, select: {url: true}}))?.url;

	if (url === undefined) {
		return null;
	}

	if (track) {
		db.visit.create({data: {shortenedUrl: {connect: {shortBase64: encodedId}}}}).catch(error => {
			throw error;
		});
	}

	return url;
}

/**
 * Retrieve usage statistics for a shortened URL
 *
 * @param id - The ID of the shortened URL
 *
 * @returns Shortened URL information and statistics, or `null` if it couldn't be found
 */
export async function stats(id: string): Promise<null | {url: string; visits: Date[]}> {
	const encodedId = encode(id);

	const shortenedUrl = await db.shortenedUrl.findUnique({where: {shortBase64: encodedId}, select: {url: true, visits: {select: {timestamp: true}}}});

	if (!shortenedUrl) {
		return null;
	}

	return {visits: shortenedUrl.visits.map(visit => visit.timestamp), url: shortenedUrl.url};
}

/**
 * Shorten a long URL
 *
 * @param url - The long URL to shorten
 *
 * @returns The ID of the shortened URL
 */
export async function shorten(url: string): Promise<string> {
	let attempts = 0;
	let created: ShortenedUrl | null = null;
	let id: string;

	do {
		if (attempts++ > maxGenerationAttempts) {
			throw new UniqueShortIdTimeout(maxGenerationAttempts);
		}

		id = generateShortId();
		const shortBase64 = encode(id);

		try {
			// eslint-disable-next-line no-await-in-loop
			created = await db.shortenedUrl.create({data: {url, shortBase64}});
		} catch {
			continue;
		}
	} while (!created);

	return id;
}

/**
 * Get total statistics for all URLs.
 *
 * @returns Total statistics for all URLs
 */
export async function totalStats(): Promise<{urls: number; visits: number}> {
	const [urls, visits] = await db.$transaction([db.shortenedUrl.count(), db.visit.count()]);

	return {urls, visits};
}
