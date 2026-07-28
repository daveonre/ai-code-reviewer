# 🤖 AI Code Reviewer (GitHub Action)

An automated GitHub Action that performs AI-powered code reviews on incoming Pull Requests using TypeScript and OpenAI's API.

## 🚀 Features

- **Automated PR Reviews**: Automatically fetches PR diffs and generates actionable code feedback.
- **Smart Event Triggers**: Runs on both `opened` and `synchronize` (re-reviews when new commits are pushed).
- **TypeScript & Octokit**: Built with standard GitHub Actions SDKs for fast, reliable execution.
- **Local Fallback Testing**: Supports local dry-runs using mock diffs before deploying.

---

## 🛠️ Project Structure

```text
my-code-reviewer/
├── .github/
│   └── workflows/
│       └── ai-review.yml    # GitHub Actions workflow configuration
├── src/
│   ├── diffParser.ts        # Parses raw git diff strings into structured objects
│   ├── github.ts            # GitHub Octokit API integrations (fetch diff, post comment)
│   ├── index.ts             # Main entry point & execution flow
│   ├── prompts.ts           # Formats parsed changes into AI prompts
│   └── reviewer.ts          # Integrates with OpenAI API
├── package.json
└── tsconfig.json
```
