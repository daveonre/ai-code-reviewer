import * as github from "@actions/github";
import * as core from "@actions/core";

/**
 * Fetches the PR raw diff string using GitHub Actions context & Octokit SDK.
 */
export async function getPullRequestDiff(): Promise<string> {
  const token = core.getInput("github-token") || process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is missing!");
  }

  const octokit = github.getOctokit(token);
  const context = github.context;

  if (!context.payload.pull_request) {
    throw new Error("This action can only be run on pull_request events!");
  }

  const pullNumber = context.payload.pull_request.number;
  const { owner, repo } = context.repo;

  // Fetch the diff representation of the Pull Request
  const { data: diff } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
    mediaType: {
      format: "diff",
    },
  });

  return diff as unknown as string;
}

/**
 * Posts the AI review comment onto the Pull Request.
 */
export async function postPRComment(commentBody: string): Promise<void> {
  const token = core.getInput("github-token") || process.env.GITHUB_TOKEN;
  if (!token) return;

  const octokit = github.getOctokit(token);
  const context = github.context;

  if (!context.payload.pull_request) return;

  await octokit.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.payload.pull_request.number,
    body: `### 🤖 AI Code Review\n\n${commentBody}`,
  });
}
