/**
 * Fetches the PR raw diff string using GitHub Actions context & Octokit SDK.
 */
export declare function getPullRequestDiff(): Promise<string>;
/**
 * Posts the AI review comment onto the Pull Request.
 */
export declare function postPRComment(commentBody: string): Promise<void>;
