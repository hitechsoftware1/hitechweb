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

/**
 * Expert solution consultant for HITECH SOFTWARE COMPANY.
 * @param input The business requirements from the client.
 */
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

HITECH SOFTWARE COMPANY is a premium engineering firm specializing in high-performance digital ecosystems.

AVAILABLE SERVICES AT HITECH:
- Software Development: Custom ERP, CRM, Enterprise Systems, SaaS, Desktop Apps.
- Website Development: E-commerce, Management Systems (School, Hotel, Real Estate), Portfolio.
- Mobile App Development: Android, iOS, Flutter, React Native, Marketplace, Booking Apps.
- AI & Smart Systems: Neural Chatbots, Virtual Assistants, ML Integration, Workflow Automation.
- UI/UX & Product Design: Design Systems, SaaS Interfaces, User Experience Optimization.
- Cloud & Hosting: VPS Management, Cloud Storage, Deployment Pipelines.
- Cybersecurity: Secure Auth, Data Protection, Security Audits.
- Fintech: Payment Integrations (Mobile Money, PayPal, Stripe), Billing Systems.
- Media & Streaming: Live Streaming, Creator Platforms.
- Advanced Tech: API Development, IoT Integration, Blockchain.

Client Business Requirements: {{{businessRequirements}}}

Based on these requirements, recommend a specific list of HITECH services and a suitable architecture. Provide a clear justification for why this combination is optimal for their vision.`,
});

const intelligentSolutionConsultantFlow = ai.defineFlow(
  {
    name: 'intelligentSolutionConsultantFlow',
    inputSchema: IntelligentSolutionConsultantInputSchema,
    outputSchema: IntelligentSolutionConsultantOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) throw new Error('Failed to generate a recommendation.');
    return output;
  }
);
