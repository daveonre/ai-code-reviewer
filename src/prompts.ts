import { FileChange } from "./types";

/**
 * Converts parsed file changes into a prompt for the AI model.
 */
export function buildReviewPrompt(fileChanges: FileChange[]): string {
  let diffContent = "";

  for (const file of fileChanges) {
    diffContent += `\n--- File: ${file.filename} ---\n`;

    for (const hunk of file.hunks) {
      diffContent += `Hunk Header: ${hunk.header}\n`;

      for (const line of hunk.lines) {
        if (line.type === "add") {
          diffContent += `[Line ${line.lineNumber}] + ${line.content}\n`;
        } else {
          diffContent += `[Line ${line.lineNumber}]   ${line.content}\n`;
        }
      }
    }
  }

  return `You are an expert senior code reviewer. 
Review the following Git code changes and provide feedback on potential bugs, code smells, or performance issues.

Code Changes:
${diffContent}

Please respond with clear, concise, and constructive code review comments.`;
}
