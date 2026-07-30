# 🤖 AI Code Reviewer (GitHub Action)

An automated GitHub Action that performs AI-powered code reviews on incoming Pull Requests using TypeScript, Octokit, and OpenAI's API. It automatically analyzes pull request diffs, provides structured feedback (critical issues, warnings, suggestions), and posts comments directly to your PRs.

---

## 🚀 Features

- **Automated PR Reviews**: Automatically fetches PR diffs and generates actionable code feedback on pull requests targeting `main`.
- **Structured Feedback**: Categorizes findings into Critical Issues, Edge Cases/Warnings, and General Improvements.
- **Marketplace Ready**: Plug-and-play setup for any repository with zero build or dependency setup required.
- **Branch Protection Ready**: Built to integrate as a required status check to prevent merging unreviewed code.
- **TypeScript & Octokit**: Built with standard GitHub Actions SDKs for fast, reliable execution.

---

## ⚙️ Setup & Usage

Integrating the AI Code Reviewer into any repository takes less than two minutes.

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

      - name: Run Davenom AI Code Reviewer
        uses: Davenom/ai-code-reviewer@v1
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

### 3. Enforce as a Mandatory Status Check (Optional)

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

## 🛠️ Project Structure

```text
ai-code-reviewer/
├── .github/
│   └── workflows/
│       └── ai-review.yml    # Example workflow testing the action
├── src/
│   ├── diffParser.ts        # Parses raw git diff strings into structured objects
│   ├── github.ts            # GitHub Octokit API integrations (fetch diff, post comment)
│   ├── index.ts             # Main entry point & execution flow
│   ├── prompts.ts           # Formats parsed changes into AI prompts
│   └── reviewer.ts          # Integrates with OpenAI API
├── dist/                    # Compiled production bundle executed by GitHub Actions
├── action.yml               # Action metadata definition for GitHub Marketplace
├── package.json
└── tsconfig.json
```

---

## 💻 Local Development & Contributing

If you want to contribute to this repository or modify the source code under `src/`:

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Build/Bundle code:**
   Make sure to re-bundle the source before committing changes so `dist/index.js` gets updated:

   ```bash
   npm run build
   ```

3. **Release updates:**
   When publishing new updates, update both the semantic tag (e.g., `v1.0.1`) and move the major release tag (`v1`):
   ```bash
   git tag -a v1.0.1 -m "Release v1.0.1"
   git push origin v1.0.1
   git tag -fa v1 -m "Update v1 release pointer"
   git push origin v1 --force
   ```
