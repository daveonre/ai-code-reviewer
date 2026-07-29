export interface FileChange {
    filename: string;
    additions: number;
    deletions: number;
    hunks: DiffHunk[];
}
export interface DiffHunk {
    header: string;
    newStart: number;
    lines: HunkLine[];
}
export interface HunkLine {
    type: "add" | "delete" | "normal";
    lineNumber: number;
    content: string;
}
