import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt setting ground rules for the AI's persona and output format
const SYSTEM_PROMPT = `
You are an expert Senior Staff Software Engineer and Security Auditor conducting code reviews.

Your Goal:
Review the provided Git diff for logic bugs, security vulnerabilities, edge cases, performance bottlenecks, and style inconsistencies.

Guidelines:
1. Be concise, direct, and actionable. Avoid generic praise or conversational fluff.
2. Reference specific file names and line numbers when giving feedback.
3. If the code change looks solid and has no issues, reply with: "LGTM! No issues found."
4. Structure your response into clear sections:
   - 🔴 Critical Issues
   - 🟡 Warnings / Edge Cases
   - 🟢 Suggestions & Improvements
`;

export async function getAIReview(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  return response.choices[0]?.message?.content || "No feedback generated.";
}
