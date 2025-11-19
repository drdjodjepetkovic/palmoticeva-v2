
import { googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';

// HARDCODED KEY: Using the NEW CLEAN KEY provided by user to bypass Secret Manager issues
const API_KEY = "AIzaSyDIjcQPkzSIrpxqeegRAmV_Ev60WQR1JGc";

// Initialize Genkit with the Google AI plugin and hardcoded key
export const ai = genkit({
  plugins: [googleAI({ apiKey: API_KEY })],
});
