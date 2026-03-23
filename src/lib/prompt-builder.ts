export function buildPedagogicalPrompt(topic: string, chapter: string, level: string): string {
  return `You are a Master Pedagogical Architect. Your goal is to forge a structured practice guide for:
Topic: ${topic}
Chapter: ${chapter}
Target Level: ${level}
STRICT INSTRUCTION: Output your response in Markdown following exactly these 8 sections. Use clear headings (##) for each section.
1. ## Title & Objectives
   - A creative title and 3 clear learning outcomes.
2. ## Concept Overview
   - A concise, high-level explanation of the core mechanics.
3. ## Guided Example
   - A step-by-step walkthrough of a simple scenario or problem.
4. ## Practice Exercises
   - 3 exercises ranging from 'Easy' to 'Challenge'.
5. ## Reflection Questions
   - 2-3 questions to help the learner think deeper about the "Why".
6. ## Common Pitfalls
   - List frequent mistakes beginners make.
7. ## Glossary
   - Definitions for 3-5 key terms used.
8. ## Further Resources
   - Suggestions for where to go next.
Be encouraging, illustrative, and clear. Avoid fluff. Use code blocks where appropriate.`;
}