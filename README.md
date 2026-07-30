# 🤖 AI Code Reviewer (GitHub Action)

An automated GitHub Action that performs AI-powered code reviews on incoming Pull Requests using TypeScript, Octokit, and OpenAI's API. It automatically analyzes pull request diffs, provides structured feedback (critical issues, warnings, suggestions), and posts comments directly to your PRs.

---

## 🚀 Features

- **Automated PR Reviews**: Automatically fetches PR diffs and generates actionable code feedback on pull requests targeting `main`.
- **Structured Feedback**: Categorizes findings into Critical Issues, Edge Cases/Warnings, and General Improvements.
- **Branch Protection Ready**: Built to integrate as a required status check to prevent merging unreviewed code.
- **TypeScript & Octokit**: Built with standard GitHub Actions SDKs for fast, reliable execution.
- **Local Fallback Testing**: Supports local dry-runs using mock diffs before deploying live.

---

## 🛠️ Project Structure

```text
my-code-reviewer/
├── .github/
│   └── workflows/
│       └── ai-review.yml    # GitHub Action workflow configuration
├── src/
│   ├── diffParser.ts        # Parses raw git diff strings into structured objects
│   ├── github.ts            # GitHub Octokit API integrations (fetch diff, post comment)
│   ├── index.ts             # Main entry point & execution flow
│   ├── prompts.ts           # Formats parsed changes into AI prompts
│   └── reviewer.ts          # Integrates with OpenAI API
├── dist/                    # Compiled production build executed by the action
├── package.json
└── tsconfig.json
```

---

## ⚙️ Setup & Configuration

### 1. Set Repository Secrets

Go to your GitHub repository **Settings** > **Secrets and variables** > **Actions** and add the following secret:

- `OPENAI_API_KEY`: Your OpenAI API Key.

_(Note: `GITHUB_TOKEN` is automatically provided by GitHub Actions)._

---

### 2. Add Workflow File

Create `.github/workflows/ai-review.yml` in your repository:

```yaml
name: AI Code Reviewer

on:
  pull_request:
    branches:
      - main

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      issues: write

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install Dependencies
        run: npm ci

      - name: Run AI Code Reviewer
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: node dist/index.js
```

---

### 3. Enforce as a Mandatory Status Check

To block PR merges until the AI Review workflow runs:

1. Push code or open a PR targeting `main` to trigger the workflow at least once.
2. Go to **Settings** > **Branches** in your repository.
3. Click **Add classic branch protection rule** (or create a **Branch Ruleset**).
4. Set **Branch name pattern** to `main`.
5. Check **Require a pull request before merging**.
6. Check **Require status checks to pass before merging**.
7. Search for and select the job name (`review`).
8. Save changes.

---

## 💻 Development & Building

If you make modifications to the source code under `src/`, make sure to build the project before pushing so `dist/index.js` gets updated:

```bash
# Install dependencies
npm install

# Build/bundle the project to dist/
npm run build
```
