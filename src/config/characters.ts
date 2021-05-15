import ow from 'ow';
import {JsonValue} from 'type-fest';

/**
 * Every character matching this regular expression:
 * ```js
 * /^[a-z\d]$/i;
 * ```
 */
const alphaNumeric: string[] = [
	// #region alphanumeric
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	'z',
	't',
	'u',
	'v',
	'x',
	'w',
	'y',
	'z',
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'Z',
	'T',
	'U',
	'V',
	'X',
	'W',
	'Y',
	'Z',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'0'
	// #endregion
];

enum EnvVarNames {
	ShortChars = 'SHORT_CHARS',
	ShortLength = 'SHORT_LENGTH',
	ShortRewrites = 'SHORT_REWRITES'
}

const parsedCharacters = JSON.parse(process.env[EnvVarNames.ShortChars] ?? 'null') as JsonValue;

ow(parsedCharacters, EnvVarNames.ShortChars, ow.any(ow.array.ofType(ow.string.nonEmpty).minLength(1)));

/** Characters to use in the shortened ID for a URL. */
export const characters = parsedCharacters === null ? alphaNumeric : [...new Set(parsedCharacters)];

/** The maximum number of short URLs that can be generated. */
const maxShortUrls = 1e9;
/** The default length of a generated short ID. */
const defaultShortLength = Math.round(Math.log(maxShortUrls) / Math.log(characters.length));

/** The length of the shortened ID for a URL. */
export const length = process.env[EnvVarNames.ShortLength] === undefined ? defaultShortLength : Number(process.env[EnvVarNames.ShortLength]);

ow(length, EnvVarNames.ShortLength, ow.number.integer.positive);

const parsedRewrites = JSON.parse(process.env[EnvVarNames.ShortRewrites] ?? '{}') as JsonValue;

ow(parsedRewrites, EnvVarNames.ShortRewrites, ow.object.valuesOfType(ow.string.nonEmpty));
ow(parsedRewrites, EnvVarNames.ShortRewrites, ow.object.not.instanceOf(Array));

/** Rewrites applied to a URL before redirecting. */
export const rewrites = parsedRewrites as Record<string, string>;
