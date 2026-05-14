
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

HITECH SOFTWARE COMPANY offers a vast catalog of advanced digital solutions. When providing recommendations, focus on how HITECH's specific offerings can meet the client's needs.

AVAILABLE SERVICES AT HITECH:
- Software Development: Custom Dev, Enterprise Systems, Desktop/Cloud Apps, SaaS, ERP, CRM, POS.
- Website Development: E-commerce, School/Hotel/Real Estate Management, Portfolio, NGO, Custom Web Apps.
- Mobile App Development: Android, iOS, Flutter, React Native, Marketplace, Chat, Booking Apps.
- AI & Smart Systems: AI Chatbots, Virtual Assistants, ML Integration, Business Analytics, Workflow Automation.
- UI/UX & Product Design: Design Systems, SaaS Interfaces, Prototypes, User Experience Optimization.
- Cloud & Hosting: Deployment, VPS, Server Management, Cloud Storage, Domain Services.
- Cybersecurity: Secure Auth, Data Protection, Malware Protection, Security Audits.
- Fintech: Payment Integrations (Airtel/MTN Mobile Money, PayPal, Stripe, Flutterwave), Billing Systems.
- Media & Streaming: Music/Movie Platforms, Live Streaming, Creator Platforms.
- Smart Business Systems: School/Hospital/HR/Inventory/Transport Management Systems.
- Digital Marketing: SEO, Social Media Marketing, Analytics.
- Advanced Tech: API Dev, IoT Integration, Blockchain Solutions.

PREMIUM FEATURES INCLUDED:
Modern Responsive Designs, High-Speed Performance, AI-Powered Features, Secure Infrastructure, Real-Time Analytics, Multi-Language Support, Professional Admin Panels.

Client Business Requirements: {{{businessRequirements}}}

Based on these requirements, recommend a suitable software architecture and a specific list of HITECH services. Provide a clear justification for your recommendations.`,
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
