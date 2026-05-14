'use server';
/**
 * @fileOverview An AI assistant that recommends software architecture and services based on business requirements.
 *
 * - intelligentSolutionConsultant - A function that handles the solution consultation process.
 * - IntelligentSolutionConsultantInput - The input type for the intelligentSolutionConsultant function.
 * - IntelligentSolutionConsultantOutput - The return type for the intelligentSolutionConsultant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentSolutionConsultantInputSchema = z.object({
  businessRequirements: z
    .string()
    .describe(
      'A detailed description of the potential client\'s business requirements.'
    ),
});
export type IntelligentSolutionConsultantInput = z.infer<
  typeof IntelligentSolutionConsultantInputSchema
>;

const IntelligentSolutionConsultantOutputSchema = z.object({
  recommendedArchitecture: z
    .string()
    .describe('Recommended software architecture for the given requirements.'),
  recommendedServices: z
    .array(z.string())
    .describe(
      'A list of recommended services from HITECH SOFTWARE COMPANY that align with the requirements.'
    ),
  justification: z
    .string()
    .describe(
      'A clear justification for the recommended architecture and services.'
    ),
});
export type IntelligentSolutionConsultantOutput = z.infer<
  typeof IntelligentSolutionConsultantOutputSchema
>;

export async function intelligentSolutionConsultant(
  input: IntelligentSolutionConsultantInput
): Promise<IntelligentSolutionConsultantOutput> {
  return intelligentSolutionConsultantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentSolutionConsultantPrompt',
  input: {schema: IntelligentSolutionConsultantInputSchema},
  output: {schema: IntelligentSolutionConsultantOutputSchema},
  prompt: `You are an expert AI solution consultant for HITECH SOFTWARE COMPANY. Your goal is to provide tailored recommendations for software architecture and services based on the client's business requirements.

HITECH SOFTWARE COMPANY offers advanced software, cloud, and AI solutions. When providing recommendations, focus on how HITECH SOFTWARE COMPANY's offerings can meet the client's needs.

Client Business Requirements: {{{businessRequirements}}}

Based on these requirements, recommend a suitable software architecture and a list of specific services that HITECH SOFTWARE COMPANY can provide. Provide a clear justification for your recommendations.`,
});

const intelligentSolutionConsultantFlow = ai.defineFlow(
  {
    name: 'intelligentSolutionConsultantFlow',
    inputSchema: IntelligentSolutionConsultantInputSchema,
    outputSchema: IntelligentSolutionConsultantOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
