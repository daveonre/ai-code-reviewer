import parseDiff from "parse-diff";
import { FileChange, DiffHunk, HunkLine } from "./types";

/**
 * Parses a raw unified git diff string into structured code changes.
 */
export function parseRawDiff(rawDiff: string): FileChange[] {
  const parsedFiles = parseDiff(rawDiff);

  // Derive the element type returned by parseDiff()
  type ParsedFile = (typeof parsedFiles)[number];
  type ParsedChunk = ParsedFile["chunks"][number];
  type ParsedChange = ParsedChunk["changes"][number];

  return parsedFiles.map((file: ParsedFile) => {
    const hunks: DiffHunk[] = [];

    (file.chunks || []).forEach((chunk: ParsedChunk) => {
      const lines: HunkLine[] = [];

      (chunk.changes || []).forEach((change: ParsedChange) => {
        if (change.type === "add") {
          lines.push({
            type: "add",
            lineNumber: change.ln,
            content: change.content,
          });
        } else if (change.type === "normal") {
          lines.push({
            type: "normal",
            lineNumber: change.ln2,
            content: change.content,
          });
        }
      });

      hunks.push({
        header: chunk.content,
        newStart: chunk.newStart,
        lines,
      });
    });

    return {
      filename: file.to || file.from || "unknown",
      additions: file.additions || 0,
      deletions: file.deletions || 0,
      hunks,
    };
  });
}
