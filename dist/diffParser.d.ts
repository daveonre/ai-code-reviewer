import { FileChange } from "./types";
/**
 * Parses a raw unified git diff string into structured code changes.
 */
export declare function parseRawDiff(rawDiff: string): FileChange[];
