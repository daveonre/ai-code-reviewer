import "dotenv/config";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { parseRawDiff } from "./diffParser";
import { buildReviewPrompt } from "./prompts";
import { getAIReview } from "./reviewer";
import { getPullRequestDiff, postPRComment } from "./github";

async function run() {
  let rawDiff = "";

  // 1. Check if running inside a real GitHub Action PR event
  if (github.context.payload.pull_request) {
    console.log("Fetching diff from GitHub PR...");
    rawDiff = await getPullRequestDiff();
  } else {
    // Local fallback mock diff (for local testing on your laptop)
    console.log("Running locally with mock diff...");
    rawDiff = `
diff --git a/src/utils/calculator.ts b/src/utils/calculator.ts
index 8325871..b930d41 100644
--- a/src/utils/calculator.ts
+++ b/src/utils/calculator.ts
@@ -10,5 +10,7 @@ export function divide(a: number, b: number): number {
-  return a / b;
+  if (b === 0) {
+    throw new Error("Division by zero");
+  }
+  return a / b;
 }
`;
  }

  // 2. Parse raw diff (Converts raw string into clean structured objects)
  console.log("Parsing diff...");
  const parsedChanges = parseRawDiff(rawDiff);

  if (parsedChanges.length === 0) {
    console.log("No code changes detected.");
    return;
  }

  // 3. Build AI prompt
  console.log("Building prompt...");
  const prompt = buildReviewPrompt(parsedChanges);

  // 4. Get AI review
  console.log("Getting AI Review from OpenAI...");
  const review = await getAIReview(prompt);

  // 5. Post comment if in GitHub PR, otherwise print to local terminal
  if (github.context.payload.pull_request) {
    console.log("Posting review comment to PR...");
    await postPRComment(review);
    console.log("Done!");
  } else {
    console.log("\n=== AI Review Output ===\n");
    console.log(review);
  }
}

run().catch((error) => {
  core.setFailed(`Action failed with error: ${error.message}`);
});
