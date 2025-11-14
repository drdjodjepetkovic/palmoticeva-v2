
'use server';
/**
 * @fileOverview An AI flow to process article content.
 * It formats plain text to HTML and translates it into multiple languages.
 */

import { ai } from '@/ai/index';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';

// Input schema for the raw article content
const ProcessArticleInputSchema = z.object({
  title: z.string().describe('The title of the article in Serbian Latin.'),
  summary: z.string().describe('A short summary of the article in Serbian Latin.'),
  content: z.string().describe('The full, unformatted body of the article in Serbian Latin. This could be copied from a text editor.'),
});
export type ProcessArticleInput = z.infer<typeof ProcessArticleInputSchema>;


const LocalizedStringSchema = z.object({
    "se-lat": z.string(),
    "se": z.string(),
    "en": z.string(),
    "ru": z.string(),
});

// Output schema for the processed and translated content
const ProcessArticleOutputSchema = z.object({
  title: LocalizedStringSchema.describe("The translated titles of the article."),
  summary: LocalizedStringSchema.describe("The translated summaries of the article."),
  content: LocalizedStringSchema.describe("The article content, formatted as clean HTML and translated."),
});
export type ProcessArticleOutput = z.infer<typeof ProcessArticleOutputSchema>;

// Exported wrapper function
export async function processArticleContent(input: ProcessArticleInput): Promise<ProcessArticleOutput> {
  return processArticleFlow(input);
}

// System instruction for the AI model
const systemInstruction = `You are a professional content editor and translator for a medical clinic's website. Your task is to process an article written in Serbian Latin.
You will perform two main tasks:
1.  **Format the Content**: Take the raw 'content' text and convert it into clean, semantic HTML. You must identify headings, paragraphs, and lists. Use only <h2> for headings, <p> for paragraphs, <ul> and <li> for lists, and <strong> for bold text. Do not use any other HTML tags or any CSS styles.
2.  **Translate**: Translate the original 'title', 'summary', and the newly formatted HTML 'content' into three other languages: Serbian Cyrillic (se), English (en), and Russian (ru). The original Serbian Latin text should be preserved under the 'se-lat' key. You MUST preserve the HTML structure in the translated 'content' fields.

Your final output MUST be a valid JSON object that strictly follows the provided schema.`;

// Define the Genkit prompt
const prompt = ai.definePrompt({
  name: 'processArticlePrompt',
  model: googleAI.model('gemini-flash-latest'),
  input: { schema: ProcessArticleInputSchema },
  output: { schema: ProcessArticleOutputSchema },
  system: systemInstruction,
  prompt: `Please process the following article content:

**Original Title (se-lat):**
{{{title}}}

**Original Summary (se-lat):**
{{{summary}}}

**Original Raw Content (se-lat):**
{{{content}}}

First, format the raw content into clean HTML.
Then, provide the original texts and the translations for all fields as a single JSON object.`,
});

// Define the Genkit flow
const processArticleFlow = ai.defineFlow(
  {
    name: 'processArticleFlow',
    inputSchema: ProcessArticleInputSchema,
    outputSchema: ProcessArticleOutputSchema,
  },
  async (input) => {
    // Call the LLM with the input
    const llmResponse = await prompt(input);
    const output = llmResponse.output;

    if (!output) {
      throw new Error('AI model failed to generate a valid response.');
    }

    // Ensure the original Serbian Latin content is also included in the output
    const finalOutput: ProcessArticleOutput = {
      title: {
        ...output.title,
        "se-lat": input.title,
      },
      summary: {
        ...output.summary,
        "se-lat": input.summary,
      },
      content: {
        ...output.content,
        // The AI generates the se-lat HTML, so we use its output directly
      },
    };

    return finalOutput;
  }
);
