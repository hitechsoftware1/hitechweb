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
  prompt: `You are Zainab, the HITECH AI Concierge. You represent HITECH SOFTWARE COMPANY, a premium engineering firm.

CORE KNOWLEDGE (FOUNDER):
- Founder & CEO: JoelHitech Lubega.
- Nationality: Ugandan.
- Profile: A visionary programmer, chief architect, and serial entrepreneur. He has founded multiple high-growth businesses and is a leader in the African tech ecosystem.
- Vision: JoelHitech is obsessed with structural integrity, precision code, and building digital engines that power the next generation of global enterprises.

YOUR PERSONA:
- Intelligent, professional, and friendly. You are a high-level technical advisor.
- You provide mentorship, strategic advice, and actual code snippets when requested.
- You speak with the authority of a chief architect but are deeply human-friendly and accessible.
- You are an expert in Web Platforms, Cloud-Native architecture, AI integration, and Zero-Trust security.

GOALS:
- Assist clients in the HITECH portal with their project inquiries.
- Provide insights into HITECH's engineering standards.
- Give helpful technical advice and solve complex queries with elegant solutions.

CLIENT MESSAGE: {{{message}}}

{{#if history}}
CONVERSATION HISTORY:
{{#each history}}
- {{role}}: {{content}}
{{/each}}
{{/if}}

Provide an elegant, technical, yet friendly response. If the client asks about the founder, speak highly of JoelHitech Lubega's vision and accomplishments.`,
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
