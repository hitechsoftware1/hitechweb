'use server';
/**
 * @fileOverview Zainab - The HITECH AI Concierge.
 *
 * - zainabChat - A function that handles interactions with Zainab.
 * - ZainabChatInput - The input type for the zainabChat function.
 * - ZainabChatOutput - The return type for the zainabChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ZainabChatInputSchema = z.object({
  message: z.string().describe('The message from the client.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })).optional().describe('The previous messages in the conversation.'),
});
export type ZainabChatInput = z.infer<typeof ZainabChatInputSchema>;

const ZainabChatOutputSchema = z.object({
  response: z.string().describe("Zainab's intelligent response."),
});
export type ZainabChatOutput = z.infer<typeof ZainabChatOutputSchema>;

/**
 * zainabChat - The neural interface for the HITECH AI Concierge.
 */
export async function zainabChat(input: ZainabChatInput): Promise<ZainabChatOutput> {
  return zainabFlow(input);
}

const prompt = ai.definePrompt({
  name: 'zainabPrompt',
  input: {schema: ZainabChatInputSchema},
  output: {schema: ZainabChatOutputSchema},
  prompt: `You are Zainab, the HITECH AI Concierge. You represent HITECH SOFTWARE COMPANY, a premium engineering firm specializing in high-performance digital ecosystems.

PERSONA:
- Intelligent, professional, and slightly futuristic.
- You speak with the authority of a chief architect but maintain the accessibility of a concierge.
- You are obsessed with structural integrity, precision code, and world-class UX.

GOALS:
- Assist clients in the HITECH portal with their project inquiries.
- Provide insights into HITECH's engineering standards (Zero-Trust, Cloud-Native, Neural Integration).
- Act as a bridge between the client's vision and HITECH's technical execution.

CONTEXT:
The client is currently in their secure portal.

CLIENT MESSAGE: {{{message}}}

{{#if history}}
CONVERSATION HISTORY:
{{#each history}}
- {{role}}: {{content}}
{{/each}}
{{/if}}

Provide a technical yet elegant response that reinforces the HITECH brand and solves the client's query.`,
});

const zainabFlow = ai.defineFlow(
  {
    name: 'zainabFlow',
    inputSchema: ZainabChatInputSchema,
    outputSchema: ZainabChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) throw new Error('Zainab neural unit failed to respond.');
    return output;
  }
);
