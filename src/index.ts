import "dotenv/config";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { parseRawDiff } from "./diffParser";
import { buildReviewPrompt } from "./prompts";
import { getAIReview } from "./reviewer";
import { getPullRequestDiff, postPRComment } from "./github";

async function run() {
  let rawDiff = "";

  if (github.context.payload.pull_request) {
    console.log("Fetching diff from GitHub PR...");
    rawDiff = await getPullRequestDiff();
  } else {
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

  console.log("Parsing diff...");
  const parsedChanges = parseRawDiff(rawDiff);

  if (parsedChanges.length === 0) {
    console.log("No code changes detected.");
    return;
  }

  console.log("Building prompt...");
  const prompt = buildReviewPrompt(parsedChanges);

  console.log("Getting AI Review from OpenAI...");
  const review = await getAIReview(prompt);

  if (github.context.payload.pull_request) {
    console.log("Posting review comment to PR...");
    await postPRComment(review);
    console.log("Done!");
  } else {
    console.log("\n=== AI Review Output ===\n");
    console.log(review);
  }
}

run().catch((error: Error) => {
  core.setFailed(`Action failed with error: ${error.message}`);
});
