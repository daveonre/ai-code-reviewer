import { FileChange } from "./types";
/**
 * Converts parsed file changes into a prompt for the AI model.
 */
export declare function buildReviewPrompt(fileChanges: FileChange[]): string;
