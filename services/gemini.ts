
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { Domain, AgentStep, AgentArtifact } from "../types";
import { AGENTS, DOMAIN_CONFIGS } from "../constants";

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

/**
 * Generate contextual AI responses based on user input and domain
 */
function generateAIResponse(userInput: string, domain: Domain): string {
  const input = (userInput || '').toLowerCase();

  // Healthcare responses
  if (domain === Domain.HEALTHCARE) {
    if (input.includes('headache') || input.includes('pain')) {
      return "Headaches can have many causes. While I can't diagnose, common triggers include stress, dehydration, or eye strain. For persistent headaches, consider consulting a healthcare professional.";
    }
    if (input.includes('fever') || input.includes('temperature')) {
      return "A fever is your body's natural response to infection. Monitor your temperature and stay hydrated. If it exceeds 103°F or persists more than a few days, seek medical attention.";
    }
    if (input.includes('cough') || input.includes('cold')) {
      return "Coughs are common with respiratory infections. Rest, hydration, and over-the-counter remedies can help. If symptoms worsen or include shortness of breath, consult a doctor.";
    }
    if (input.includes('diet') || input.includes('nutrition') || input.includes('eat')) {
      return "A balanced diet rich in fruits, vegetables, lean proteins, and whole grains supports good health. Consider consulting a nutritionist for personalized advice.";
    }
    if (input.includes('exercise') || input.includes('workout')) {
      return "Regular exercise improves cardiovascular health, strengthens muscles, and boosts mental well-being. Aim for 150 minutes of moderate activity weekly.";
    }
    if (input.includes('stress') || input.includes('anxiety')) {
      return "Stress management techniques like deep breathing, meditation, or regular exercise can help. If stress feels overwhelming, consider speaking with a mental health professional.";
    }
    return "I'm here to help with health-related questions. While I can provide general information, please remember I'm not a substitute for professional medical advice. What specific health concern can I help you understand better?";
  }

  // Education responses
  if (domain === Domain.EDUCATION) {
    if (input.includes('math') || input.includes('mathematics')) {
      return "Mathematics builds critical thinking skills. Focus on understanding concepts rather than memorization. Practice regularly and don't hesitate to ask questions.";
    }
    if (input.includes('science') || input.includes('physics') || input.includes('chemistry')) {
      return "Science helps us understand the world. Hands-on experiments and real-world applications make learning more engaging. What scientific topic interests you most?";
    }
    if (input.includes('history') || input.includes('historical')) {
      return "History teaches us about human progress and mistakes. Understanding the past helps us make better decisions for the future. Which historical period fascinates you?";
    }
    if (input.includes('language') || input.includes('english') || input.includes('writing')) {
      return "Language skills are essential for communication. Reading widely, practicing writing, and speaking regularly improve proficiency. What aspect of language learning interests you?";
    }
    if (input.includes('study') || input.includes('learn')) {
      return "Effective study techniques include active recall, spaced repetition, and teaching others. Find a quiet environment and take regular breaks to maintain focus.";
    }
    if (input.includes('motivation') || input.includes('inspire')) {
      return "Learning is a lifelong journey. Set small goals, celebrate progress, and remember that every expert was once a beginner. Your effort today builds tomorrow's success.";
    }
    return "Education opens doors to new possibilities. I'm here to help you explore any subject or learning challenge. What would you like to learn about or improve in your studies?";
  }

  // Finance responses
  if (domain === Domain.FINANCE) {
    if (input.includes('budget') || input.includes('save') || input.includes('saving')) {
      return "Creating a budget helps track income and expenses. Aim to save 20% of income, cut unnecessary spending, and build an emergency fund covering 3-6 months of expenses.";
    }
    if (input.includes('invest') || input.includes('investment')) {
      return "Investing should align with your risk tolerance and timeline. Diversify across stocks, bonds, and other assets. Consider consulting a financial advisor for personalized guidance.";
    }
    if (input.includes('debt') || input.includes('loan') || input.includes('credit')) {
      return "Managing debt effectively means prioritizing high-interest obligations. Focus on paying more than minimums and avoiding new debt. Your credit score impacts future opportunities.";
    }
    if (input.includes('retirement') || input.includes('pension')) {
      return "Start planning for retirement early. Maximize employer matches, consider tax-advantaged accounts, and regularly review your investment strategy as you approach retirement age.";
    }
    if (input.includes('tax') || input.includes('taxes')) {
      return "Tax planning is important year-round. Keep good records, maximize deductions, and consider consulting a tax professional for complex situations.";
    }
    if (input.includes('insurance') || input.includes('protect')) {
      return "Insurance protects against financial loss. Consider health, auto, home, and life insurance based on your circumstances. Review coverage annually.";
    }
    return "Financial literacy empowers better decision-making. While I can provide general guidance, complex financial situations benefit from professional advice. What financial topic would you like to explore?";
  }

  // Generic responses for unrecognized input
  const genericResponses = [
    `I understand you're asking about ${userInput}. As a ${String(domain).toLowerCase()} assistant, I'm here to help you navigate this topic. Could you provide more details?`,
    `That's an interesting question about ${userInput}. In the ${String(domain).toLowerCase()} field, this is an important consideration. What specific aspect would you like me to elaborate on?`,
    `Regarding ${userInput}, the ${String(domain).toLowerCase()} domain has much to offer. I'd be happy to share insights and guidance. What would you like to know more about?`,
    `Your question about ${userInput} touches on key ${String(domain).toLowerCase()} concepts. I can provide information and context. Is there a particular angle you'd like me to address?`
  ];

  return genericResponses[Math.floor(Math.random() * genericResponses.length)];
}

/**
 * PROFESSIONAL COMPREHENSIVE ANALYSIS ENGINE
 * Robust implementation with proper error handling, mock fallback, and real AI integration
 */
export async function* runFastComprehensiveAnalysis(
  domain: Domain,
  userInput: string,
  onStep: (step: AgentStep) => void
): AsyncGenerator<{
  text: string;
  grounding: any[];
  approvalRequired: boolean;
  isFinal: boolean;
}, void, unknown> {
  // Check if we should use mock mode (professional implementation)
  const apiKey = import.meta.env.VITE_API_KEY;
  const useMockMode = !apiKey ||
    apiKey === 'PLACEHOLDER_API_KEY' ||
    apiKey === 'your_api_key_here' ||
    apiKey === 'YOUR_API_KEY_HERE' ||
    apiKey.includes('API_KEY') ||
    apiKey.length < 20; // Basic validation

  const domainAgents = AGENTS.filter(a => a.domain === domain);
  const specialist = domainAgents.find(a => a.role === 'Researcher' || a.role === 'Specialist')!;

  try {
    onStep({
      agentId: specialist.id,
      agentName: specialist.name,
      status: 'running',
      thought: useMockMode
        ? 'Generating intelligent mock analysis with domain expertise...'
        : 'Performing comprehensive analysis with real-time data grounding...',
      timestamp: Date.now()
    });

    if (useMockMode) {
      // Professional mock implementation with comprehensive responses
      const mockResponse = await generateComprehensiveMockResponse(domain, userInput);

      // Simulate streaming for realistic UX
      const words = mockResponse.split(' ');
      let currentText = '';

      for (let i = 0; i < words.length; i++) {
        currentText += (i > 0 ? ' ' : '') + words[i];

        // Yield chunks for streaming effect
        if (i % 3 === 0 || i === words.length - 1) {
          yield {
            text: currentText.slice(-100), // Yield recent text for streaming
            grounding: [],
            approvalRequired: false,
            isFinal: i === words.length - 1
          };

          // Small delay for realistic streaming
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }

      // Generate mock grounding for demonstration
      const mockGrounding = generateMockGrounding(domain, userInput);

      onStep({
        agentId: specialist.id,
        agentName: specialist.name,
        status: 'completed',
        output: 'Mock analysis completed - upgrade to real API for enhanced responses',
        artifacts: mockGrounding.slice(0, 3).map(g => ({
          type: 'link',
          label: g.title,
          value: g.uri
        })),
        confidence: 0.85,
        timestamp: Date.now()
      });

      return;
    }

    // Real AI implementation
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-1.5-flash-latest";

    const analysisPrompt = `
SYSTEM: ${specialist.systemPrompt || 'You are a helpful AI assistant providing expert analysis.'}

DOMAIN: ${domain}
QUERY: "${userInput}"

TASK: Provide a comprehensive, evidence-based analysis that includes:
1. Direct answer with key insights
2. Supporting data from reliable sources (use search when needed)
3. Practical implications and recommendations
4. Important caveats or considerations
5. Related context and connections

Format as a structured response. Be thorough but concise. Include specific facts and evidence.

For ${domain.toLowerCase()} queries, ensure responses are:
${domain === Domain.HEALTHCARE ? '- Evidence-based medical information with appropriate disclaimers' : ''}
${domain === Domain.EDUCATION ? '- Educational best practices and learning science' : ''}
${domain === Domain.FINANCE ? '- Financial principles with risk considerations' : ''}
- Grounded in current, verifiable information
- Balanced and comprehensive in analysis
`;

    const response = await ai.models.generateContentStream({
      model,
      contents: analysisPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      }
    });

    let fullText = '';
    let grounding: any[] = [];

    for await (const chunk of response) {
      if (chunk.text) {
        fullText += chunk.text;
      }

      const candidates = chunk.candidates;
      if (candidates && candidates[0]?.groundingMetadata?.groundingChunks) {
        grounding = candidates[0].groundingMetadata.groundingChunks;
      }

      yield {
        text: chunk.text,
        grounding: grounding ?? [],
        approvalRequired: false,
        isFinal: false
      };
    }

    // Check for sensitive content requiring approval
    const requiresApproval = (domain === Domain.HEALTHCARE || domain === Domain.FINANCE) &&
      (fullText.toLowerCase().includes('diagnosis') ||
       fullText.toLowerCase().includes('medical advice') ||
       fullText.toLowerCase().includes('investment advice') ||
       fullText.toLowerCase().includes('financial planning'));

    if (requiresApproval) {
      yield {
        text: '',
        grounding: grounding ?? [],
        approvalRequired: true,
        isFinal: true
      };
    }

    onStep({
      agentId: specialist.id,
      agentName: specialist.name,
      status: 'completed',
      output: 'Comprehensive analysis completed with real-time data integration',
      artifacts: grounding.slice(0, 3).map((g: any) => ({
        type: 'link',
        label: g.web?.title || 'Source',
        value: g.web?.uri || '#'
      })),
      confidence: 0.92,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Analysis error:', error);

    // Fallback to mock if real API fails
    onStep({
      agentId: specialist.id,
      agentName: specialist.name,
      status: 'running',
      thought: 'API error - falling back to mock analysis...',
      timestamp: Date.now()
    });

    const fallbackResponse = await generateComprehensiveMockResponse(domain, userInput);
    yield {
      text: fallbackResponse,
      grounding: [],
      approvalRequired: false,
      isFinal: true
    };

    onStep({
      agentId: specialist.id,
      agentName: specialist.name,
      status: 'completed',
      output: 'Fallback mock analysis completed',
      confidence: 0.7,
      timestamp: Date.now()
    });
  }
}

/**
 * PROFESSIONAL MOCK RESPONSE GENERATOR
 * Creates comprehensive, domain-specific responses that demonstrate full functionality
 */
async function generateComprehensiveMockResponse(domain: Domain, userInput: string): Promise<string> {
  const input = userInput.toLowerCase().trim();

  // Healthcare domain responses
  if (domain === Domain.HEALTHCARE) {
    if (input.includes('headache') || input.includes('migraine')) {
      return `# Headache Analysis

## Key Insights
Headaches affect over 50% of adults worldwide, with tension headaches being the most common type. Migraines impact approximately 12% of the population.

## Contributing Factors
- **Stress & Tension**: Primary trigger in 70% of cases
- **Dehydration**: Can reduce blood flow to brain
- **Sleep Issues**: Poor sleep patterns increase risk by 2-3x
- **Dietary Factors**: Caffeine withdrawal, alcohol, processed foods

## Evidence-Based Recommendations
1. **Hydration**: Maintain 8-10 glasses of water daily
2. **Stress Management**: Practice mindfulness or progressive muscle relaxation
3. **Regular Sleep**: 7-9 hours nightly on consistent schedule
4. **Exercise**: 30 minutes moderate activity most days

## When to Seek Medical Attention
- Severe, sudden onset headaches
- Headaches with neurological symptoms
- Changes in headache pattern or intensity
- Headaches in those over 50 with new onset

*Note: This is general information. Consult healthcare providers for personalized medical advice.*`;
    }

    if (input.includes('exercise') || input.includes('fitness')) {
      return `# Exercise & Health Benefits

## Scientific Evidence
Regular physical activity reduces risk of:
- Cardiovascular disease by 30-40%
- Type 2 diabetes by 50%
- Certain cancers by 20-30%
- Depression and anxiety by 30%

## Recommended Guidelines
- **Aerobic Exercise**: 150 minutes moderate-intensity weekly
- **Strength Training**: 2-3 sessions per week targeting major muscle groups
- **Flexibility**: Daily stretching or yoga
- **Balance**: Particularly important for adults over 65

## Practical Implementation
1. Start with activities you enjoy
2. Gradually increase duration and intensity
3. Include variety to prevent boredom and injury
4. Consult physician before starting new programs

## Latest Research (2024)
Recent studies show high-intensity interval training (HIIT) provides similar benefits in 30-40% less time compared to moderate continuous exercise.`;
    }

    return `# Health Query Analysis

## Comprehensive Assessment
Your question about "${userInput}" requires careful consideration of multiple health factors.

## General Health Principles
- **Prevention First**: Healthy lifestyle prevents 80% of chronic diseases
- **Early Intervention**: Most conditions are more treatable when caught early
- **Holistic Approach**: Physical, mental, and social health are interconnected

## Recommended Next Steps
1. Consult qualified healthcare professionals for personalized advice
2. Maintain healthy lifestyle habits
3. Stay informed through reputable health sources
4. Regular health screenings appropriate for age and risk factors

## Important Disclaimer
This response provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment.

*Always consult healthcare providers for medical concerns.*`;
  }

  // Education domain responses
  if (domain === Domain.EDUCATION) {
    if (input.includes('study') || input.includes('learn')) {
      return `# Effective Learning Strategies

## Evidence-Based Techniques
Research from cognitive science shows these methods improve retention by 2-3x:

## Spaced Repetition
- Review material at increasing intervals
- Scientific backing: Ebbinghaus forgetting curve research
- Implementation: Use apps like Anki or Quizlet

## Active Recall
- Test yourself rather than re-reading
- Studies show 150% improvement in long-term retention
- Method: Cover notes and try to explain concepts aloud

## Interleaved Practice
- Mix different topics instead of massed practice
- Research: Reduces interference, improves discrimination
- Example: Alternate between math topics rather than focusing on one

## Dual Coding
- Combine verbal and visual information
- Brain research shows enhanced memory formation
- Practice: Create diagrams, mind maps, or teach concepts

## Implementation Plan
1. **Daily Review**: 15-20 minutes spaced repetition
2. **Weekly Testing**: Self-quiz on learned material
3. **Concept Mapping**: Visual organization of ideas
4. **Teaching Others**: Explain concepts to reinforce understanding

## Latest Research (2024)
Meta-analysis of 45 studies confirms active learning approaches outperform passive methods by significant margins across all age groups.`;
    }

    if (input.includes('math') || input.includes('mathematics')) {
      return `# Mathematics Learning Framework

## Cognitive Foundations
Mathematical thinking develops through concrete, pictorial, and abstract stages (Bruner, 1966).

## Key Principles
- **Problem-Solving Focus**: Emphasize reasoning over memorization
- **Conceptual Understanding**: Deep comprehension beats procedural fluency
- **Growth Mindset**: Intelligence is developable through effort

## Effective Strategies
1. **Visual Representations**: Use manipulatives and diagrams
2. **Real-World Connections**: Apply math to everyday situations
3. **Collaborative Learning**: Peer explanations enhance understanding
4. **Metacognitive Awareness**: Teach thinking about thinking

## Common Challenges & Solutions
- **Word Problems**: Break down language barriers with clear translation steps
- **Fractions**: Use physical models before symbolic representations
- **Algebra**: Focus on patterns and relationships before equations

## Assessment Approaches
- **Formative Assessment**: Ongoing feedback during learning
- **Standards-Based Grading**: Focus on mastery of concepts
- **Portfolio Assessment**: Showcase growth over time

## Technology Integration
- **Adaptive Learning Platforms**: Personalized instruction paths
- **Visualization Tools**: GeoGebra, Desmos for dynamic exploration
- **Gamification**: Engage through interactive challenges

*Research shows conceptual understanding leads to better long-term mathematical proficiency.*`;
    }

    return `# Educational Analysis

## Learning Science Insights
Your question touches on important educational principles supported by decades of research.

## Key Educational Research Findings
- **Active Learning**: Students learn more when actively engaged
- **Metacognition**: Teaching students how to think about thinking improves outcomes
- **Growth Mindset**: Belief in developable intelligence enhances achievement
- **Social Learning**: Collaborative learning builds deeper understanding

## Evidence-Based Recommendations
1. **Active Engagement**: Incorporate hands-on activities and discussions
2. **Feedback Loops**: Provide timely, specific feedback regularly
3. **Real-World Connections**: Link learning to authentic applications
4. **Differentiated Instruction**: Adapt to diverse learning needs

## Current Trends (2024)
- **AI Tutoring**: Personalized learning paths showing 2x improvement
- **Project-Based Learning**: Increased focus on real-world problem-solving
- **Social-Emotional Learning**: Integration of SEL with academic content
- **Micro-Credentials**: Competency-based recognition gaining traction

## Professional Development
Continuous learning for educators shows measurable student outcome improvements.

*Education research consistently shows student-centered approaches yield better results.*`;
  }

  // Finance domain responses
  if (domain === Domain.FINANCE) {
    if (input.includes('budget') || input.includes('saving')) {
      return `# Personal Budgeting & Savings Strategy

## Financial Health Assessment
Proper budgeting is the foundation of financial well-being. Studies show households with budgets have 30% higher savings rates.

## Core Principles
- **Income Tracking**: Know exactly what comes in each month
- **Expense Categorization**: Fixed vs. discretionary spending
- **Savings Priority**: Pay yourself first (10-20% of income)
- **Emergency Fund**: 3-6 months expenses as safety net

## Budgeting Methods
1. **50/30/20 Rule**: 50% needs, 30% wants, 20% savings/debt
2. **Zero-Based Budgeting**: Every dollar assigned a job
3. **Envelope System**: Cash allocation for spending categories
4. **Digital Tools**: Apps for automated tracking and alerts

## Savings Strategies
- **Automated Transfers**: Set up automatic savings deposits
- **High-Yield Accounts**: Earn 4-5% interest currently
- **Compound Growth**: Start early for maximum benefit
- **Tax-Advantaged Accounts**: 401(k), IRA for retirement savings

## Implementation Steps
1. **Track Current Spending**: 30 days of detailed expense logging
2. **Set Realistic Goals**: Start with achievable targets
3. **Create Accountability**: Regular budget reviews
4. **Adjust as Needed**: Life changes require budget updates

## Common Pitfalls to Avoid
- **Lifestyle Inflation**: Income increases shouldn't automatically increase spending
- **Emotional Spending**: Impulse purchases erode savings goals
- **Neglecting Small Expenses**: Minor leaks add up significantly
- **Ignoring Irregular Expenses**: Annual/biannual costs require planning

## Financial Education Resources
- **Books**: "The Total Money Makeover" by Dave Ramsey
- **Apps**: Mint, YNAB, EveryDollar for budget tracking
- **Courses**: Personal finance education platforms
- **Professional Advice**: Certified Financial Planners for complex situations

*Consistent budgeting leads to financial freedom and reduced stress.*`;
    }

    if (input.includes('invest') || input.includes('investment')) {
      return `# Investment Principles & Strategy

## Risk-Return Relationship
All investments involve trade-offs between risk and potential returns. Modern Portfolio Theory (Markowitz, 1952) provides the framework.

## Asset Allocation Fundamentals
- **Diversification**: Don't put all eggs in one basket
- **Risk Tolerance**: Match investments to your risk capacity
- **Time Horizon**: Longer horizons allow more risk-taking
- **Regular Rebalancing**: Maintain target allocations

## Investment Vehicles
### Stocks
- **Historical Returns**: ~7% annual average (1926-2023)
- **Risk Level**: High volatility, potential for loss
- **Tax Treatment**: Capital gains rates apply

### Bonds
- **Income Focus**: Regular interest payments
- **Risk Level**: Generally lower than stocks
- **Inverse Relationship**: Often rise when stocks fall

### Real Estate
- **Income & Appreciation**: Rental income plus property value growth
- **Leverage Potential**: Use borrowed money to increase returns
- **Illiquidity**: Harder to sell quickly

### Alternative Investments
- **Hedge Funds**: Absolute return focus, higher minimums
- **Private Equity**: Illiquid, long time horizons
- **Commodities**: Inflation hedge, high volatility

## Investment Strategy Framework
1. **Emergency Fund First**: 3-6 months expenses in liquid accounts
2. **Retirement Accounts**: Maximize tax-advantaged contributions
3. **Taxable Brokerage**: After retirement accounts funded
4. **Education Savings**: 529 plans for children's education

## Behavioral Finance Insights
- **Loss Aversion**: People feel losses 2x more than equivalent gains
- **Recency Bias**: Recent events overweighted in decision-making
- **Herd Mentality**: Following crowd often leads to poor timing
- **Overconfidence**: Most investors overestimate their abilities

## Professional Guidance
Consider consulting fee-only financial advisors (CFP®) for personalized strategies. They provide objective advice without product sales pressure.

## Current Market Context (2024)
- **Interest Rates**: Higher rates benefit savers, challenge borrowers
- **Geopolitical Risks**: Global events impact all markets
- **Technological Disruption**: AI and automation creating new opportunities
- **Demographic Shifts**: Aging populations affect investment demand

*Successful investing requires discipline, patience, and continuous education.*`;
    }

    return `# Financial Analysis Framework

## Comprehensive Financial Assessment
Your query about "${userInput}" involves important financial principles and decision-making.

## Core Financial Principles
- **Time Value of Money**: Dollar today worth more than tomorrow
- **Risk-Return Tradeoff**: Higher returns require accepting more risk
- **Diversification**: Spread risk across uncorrelated assets
- **Tax Efficiency**: Minimize taxes legally through proper structuring

## Decision-Making Framework
1. **Define Goals**: Specific, measurable, achievable, relevant, time-bound
2. **Assess Current Situation**: Income, expenses, assets, liabilities
3. **Develop Strategy**: Evidence-based approach aligned with goals
4. **Implement Consistently**: Discipline over perfect timing
5. **Monitor & Adjust**: Regular reviews and course corrections

## Risk Management
- **Insurance Coverage**: Protect against catastrophic losses
- **Emergency Reserves**: Liquidity for unexpected events
- **Asset Allocation**: Appropriate diversification by age/risk tolerance
- **Regular Rebalancing**: Maintain target allocations over time

## Professional Financial Planning Process
1. **Data Gathering**: Complete financial picture assessment
2. **Goal Setting**: Prioritize and quantify objectives
3. **Strategy Development**: Customized recommendations
4. **Implementation**: Coordinated execution across accounts
5. **Ongoing Monitoring**: Regular performance reviews and adjustments

## Educational Resources
- **Books**: "The Intelligent Investor" by Benjamin Graham
- **Online Courses**: CFA Institute, Coursera personal finance
- **Professional Certifications**: CFP®, CFA, ChFC designations
- **Regulatory Resources**: SEC.gov, FINRA.org for investor protection

## Important Caveats
- **Past Performance**: No guarantee of future results
- **Market Timing**: Consistently difficult even for professionals
- **Fees Matter**: High costs erode returns over time
- **Tax Implications**: Always consider tax consequences

*Financial planning is personal. Consider consulting qualified professionals for your specific situation.*`;
  }

  // Generic comprehensive response
  return `# Comprehensive Analysis: ${userInput}

## Executive Summary
Your query has been analyzed through a comprehensive framework considering multiple perspectives and implications.

## Key Findings
- **Context Assessment**: Understanding the broader environment and factors
- **Impact Analysis**: Evaluating potential effects and consequences
- **Recommendation Framework**: Evidence-based suggestions for optimal outcomes

## Detailed Analysis
### Current State
Analysis of present conditions and contributing factors reveals several important considerations that require attention.

### Trends & Patterns
Historical data and current patterns suggest certain trajectories that should be monitored and potentially influenced.

### Risk Assessment
Potential challenges and obstacles have been identified with corresponding mitigation strategies.

## Strategic Recommendations
1. **Immediate Actions**: Priority steps to address critical issues
2. **Medium-term Strategies**: Sustainable approaches for ongoing improvement
3. **Long-term Planning**: Vision and roadmap for future success

## Implementation Considerations
- **Resource Requirements**: Necessary tools, skills, and support
- **Timeline Expectations**: Realistic scheduling for various phases
- **Success Metrics**: Measurable indicators of progress and achievement

## Monitoring & Adjustment
Regular assessment and flexibility to adapt strategies based on new information and changing conditions.

## Supporting Evidence
Analysis grounded in established principles, research findings, and practical experience in the field.

*This comprehensive analysis provides a foundation for informed decision-making and strategic action.*`;
}

/**
 * GENERATE MOCK GROUNDING DATA
 * Creates realistic source links for demonstration purposes
 */
function generateMockGrounding(domain: Domain, _userInput: string): Array<{title: string, uri: string}> {
  const baseUrls = {
    [Domain.HEALTHCARE]: [
      { title: "Mayo Clinic - Patient Care & Health Information", uri: "https://www.mayoclinic.org/" },
      { title: "CDC - Centers for Disease Control and Prevention", uri: "https://www.cdc.gov/" },
      { title: "NIH - National Institutes of Health", uri: "https://www.nih.gov/" },
      { title: "WebMD - Better information. Better health.", uri: "https://www.webmd.com/" },
      { title: "Healthline - Health Conditions, Recipes, Wellness", uri: "https://www.healthline.com/" }
    ],
    [Domain.EDUCATION]: [
      { title: "Education Week - Comprehensive News and Analysis", uri: "https://www.edweek.org/" },
      { title: "Edutopia - Education Research and Best Practices", uri: "https://www.edutopia.org/" },
      { title: "Khan Academy - Free Online Courses", uri: "https://www.khanacademy.org/" },
      { title: "PBS LearningMedia - Digital Educational Resources", uri: "https://www.pbslearningmedia.org/" },
      { title: "Teaching Channel - Professional Development", uri: "https://www.teachingchannel.com/" }
    ],
    [Domain.FINANCE]: [
      { title: "SEC.gov - U.S. Securities and Exchange Commission", uri: "https://www.sec.gov/" },
      { title: "FINRA.org - Financial Industry Regulatory Authority", uri: "https://www.finra.org/" },
      { title: "Investopedia - Sharper Insight. Smarter Investing.", uri: "https://www.investopedia.com/" },
      { title: "Morningstar - Independent Investment Research", uri: "https://www.morningstar.com/" },
      { title: "Vanguard - Institutional Investor Services", uri: "https://investor.vanguard.com/" }
    ]
  };

  const domainUrls = baseUrls[domain] || [];
  return domainUrls.slice(0, 3);
}

/**
 * DAMA ADVANCED ORCHESTRATION ENGINE (v4.0)
 * Full multi-agent system with proper role specialization, orchestration, and coordination
 */
export async function* runAgentOrchestrator(
  domain: Domain,
  userInput: string,
  onStep: (step: AgentStep) => void
) {
  const apiKey = import.meta.env.VITE_API_KEY;
  const useMockMode = !apiKey ||
    apiKey === 'PLACEHOLDER_API_KEY' ||
    apiKey === 'your_api_key_here' ||
    apiKey === 'YOUR_API_KEY_HERE' ||
    apiKey.includes('API_KEY') ||
    apiKey.length < 20;

  if (useMockMode) {
    // Use enhanced mock orchestration for demonstration
    yield* runMockAgentOrchestration(domain, userInput, onStep);
    return;
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-1.5-flash-latest";

  const domainAgents = AGENTS.filter(a => a.domain === domain);
  const specialist = domainAgents.find(a => a.role === 'Researcher' || a.role === 'Specialist')!;
  const critic = domainAgents.find(a => a.role === 'Critic')!;
  const supervisor = domainAgents.find(a => a.role === 'Supervisor')!;

  // SHARED STATE/MEMORY SYSTEM
  const ensembleState = {
    originalQuery: userInput,
    plan: "",
    rawFindings: "",
    critique: "",
    safetyScore: 1.0,
    grounding: [] as any[],
    interAgentCommunications: [] as string[],
    requiresHumanApproval: false,
    agentContributions: {} as Record<string, any>
  };

  // PHASE 1: SUPERVISOR PLANNING (Effective Orchestration)
  onStep({
    agentId: supervisor.id,
    agentName: supervisor.name,
    status: 'running',
    thought: 'Analyzing user intent and architecting multi-agent execution plan...',
    timestamp: Date.now()
  });

  try {
    const planRes = await ai.models.generateContent({
      model,
      contents: `SYSTEM: ${supervisor.systemPrompt}

TASK: As the ${supervisor.name}, create a detailed execution plan for: "${userInput}"

Analyze the query and determine:
1. What specialized research is needed
2. What safety/critique checks are required
3. How to coordinate findings into final output
4. Any human oversight needed

Provide a structured plan with clear agent assignments and coordination steps.

DOMAIN CONTEXT: ${domain} - ${DOMAIN_CONFIGS[domain].systemTask}`,
      config: {
        temperature: 0.2, // Low temperature for consistent planning
      }
    });

    ensembleState.plan = planRes.text || "Standard research → audit → synthesis workflow";
    ensembleState.interAgentCommunications.push(`SUPERVISOR_PLAN: ${ensembleState.plan}`);

    onStep({
      agentId: supervisor.id,
      agentName: supervisor.name,
      status: 'completed',
      output: ensembleState.plan,
      timestamp: Date.now()
    });

    // PHASE 2: SPECIALIST RESEARCH (Tool Integration & Role Specialization)
    onStep({
      agentId: specialist.id,
      agentName: specialist.name,
      status: 'running',
      thought: 'Executing specialized research with domain tools and data sources...',
      timestamp: Date.now()
    });

    const researchRes = await ai.models.generateContent({
      model,
      contents: `SYSTEM: ${specialist.systemPrompt}

COORDINATION CONTEXT: ${ensembleState.interAgentCommunications.join('\n')}

QUERY: "${userInput}"
PLAN: ${ensembleState.plan}

TASK: Conduct thorough research using available tools and domain knowledge.
${domain === Domain.HEALTHCARE ? 'Focus on evidence-based medical information with citations.' : ''}
${domain === Domain.EDUCATION ? 'Apply pedagogical principles and learning science.' : ''}
${domain === Domain.FINANCE ? 'Use financial analysis frameworks and regulatory considerations.' : ''}

Provide detailed findings with supporting evidence and data sources.`,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      }
    });

    ensembleState.rawFindings = researchRes.text || "Research completed with domain-specific insights";
    ensembleState.grounding = researchRes.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    ensembleState.agentContributions[specialist.id] = {
      role: specialist.role,
      findings: ensembleState.rawFindings,
      tools_used: ['googleSearch'],
      confidence: 0.95
    };

    ensembleState.interAgentCommunications.push(`SPECIALIST_FINDINGS: ${ensembleState.rawFindings.substring(0, 200)}...`);

    const artifacts: AgentArtifact[] = ensembleState.grounding.slice(0, 3).map((g: any) => ({
      type: 'link',
      label: g.web?.title || 'Research Source',
      value: g.web?.uri || '#'
    }));

    onStep({
      agentId: specialist.id,
      agentName: specialist.name,
      status: 'completed',
      output: ensembleState.rawFindings,
      artifacts,
      confidence: 0.95,
      timestamp: Date.now()
    });

    // PHASE 3: CRITIC AUDIT (Safety/Reflection Mechanisms)
    onStep({
      agentId: critic.id,
      agentName: critic.name,
      status: 'reflecting',
      thought: 'Performing deep recursive audit for domain-specific risks and quality assurance...',
      timestamp: Date.now()
    });

    const auditPrompt = `SYSTEM: ${critic.systemPrompt}

COORDINATION CONTEXT:
${ensembleState.interAgentCommunications.join('\n')}

CONTENT TO AUDIT: "${ensembleState.rawFindings}"

DOMAIN: ${domain}
ORIGINAL QUERY: "${userInput}"

TASK: Perform comprehensive audit for:
${domain === Domain.HEALTHCARE ? '- Medical accuracy and safety disclaimers\n- Diagnostic language and emergency flags\n- Evidence quality and source credibility' : ''}
${domain === Domain.EDUCATION ? '- Academic rigor and factual accuracy\n- Pedagogical soundness\n- Potential misconceptions or oversimplifications' : ''}
${domain === Domain.FINANCE ? '- Regulatory compliance and risk disclosures\n- Financial accuracy and disclaimers\n- Potential conflicts or biased recommendations' : ''}

Output JSON: {
  "critique": "detailed analysis of strengths and concerns",
  "riskScore": 0.0-1.0,
  "recommendations": ["specific improvements"],
  "approval_required": boolean
}`;

    const criticRes = await ai.models.generateContent({
      model,
      contents: auditPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1, // Very low for consistent auditing
      }
    });

    let auditData;
    try {
      auditData = JSON.parse(criticRes.text || '{"critique": "Content reviewed", "riskScore": 0.1, "recommendations": [], "approval_required": false}');
    } catch (e) {
      auditData = {
        critique: criticRes.text || "Audit completed",
        riskScore: 0.2,
        recommendations: ["Review content for domain compliance"],
        approval_required: false
      };
    }

    ensembleState.critique = auditData.critique;
    ensembleState.safetyScore = 1.0 - auditData.riskScore;
    ensembleState.requiresHumanApproval = auditData.approval_required ||
      ((domain === Domain.HEALTHCARE || domain === Domain.FINANCE) && auditData.riskScore > 0.4);

    ensembleState.agentContributions[critic.id] = {
      role: critic.role,
      critique: ensembleState.critique,
      riskScore: auditData.riskScore,
      recommendations: auditData.recommendations,
      approval_required: ensembleState.requiresHumanApproval
    };

    ensembleState.interAgentCommunications.push(`CRITIC_AUDIT: Risk ${auditData.riskScore}, Approval: ${ensembleState.requiresHumanApproval}`);

    onStep({
      agentId: critic.id,
      agentName: critic.name,
      status: 'completed',
      output: ensembleState.critique,
      riskScore: auditData.riskScore,
      timestamp: Date.now()
    });

    // PHASE 4: SUPERVISOR SYNTHESIS (Final Orchestration)
    onStep({
      agentId: supervisor.id,
      agentName: supervisor.name,
      status: 'running',
      thought: 'Synthesizing verified multi-agent findings into executive report...',
      timestamp: Date.now()
    });

    const synthesisPrompt = `
SYSTEM: ${supervisor.systemPrompt}

COORDINATION SUMMARY:
${ensembleState.interAgentCommunications.join('\n')}

AGENT CONTRIBUTIONS:
${Object.entries(ensembleState.agentContributions).map(([id, contrib]) =>
  `${id}: ${JSON.stringify(contrib).substring(0, 200)}...`
).join('\n')}

FINAL SYNTHESIS TASK:
Create a comprehensive, professional report that integrates:
- Specialist research findings
- Critic audit recommendations
- Safety considerations and disclaimers
- Actionable insights and next steps

Format as a structured Markdown report with:
# DAMA ${domain} Executive Report
## Executive Summary
## Key Findings
## Analysis & Recommendations
## Safety Notes & Disclaimers
${ensembleState.requiresHumanApproval ? '## Human Approval Required' : ''}

Ensure the final output reflects collaborative intelligence while maintaining domain expertise.`;

    const finalStream = await ai.models.generateContentStream({
      model,
      contents: synthesisPrompt,
      config: {
        temperature: 0.2,
      }
    });

    let fullContent = '';
    for await (const chunk of finalStream) {
      if (chunk.text) {
        fullContent += chunk.text;
      }

      yield {
        text: chunk.text,
        grounding: ensembleState.grounding,
        approvalRequired: ensembleState.requiresHumanApproval,
        isFinal: false
      };
    }

    // Add final coordination note
    ensembleState.interAgentCommunications.push(`FINAL_SYNTHESIS: ${fullContent.substring(0, 200)}...`);

    onStep({
      agentId: supervisor.id,
      agentName: supervisor.name,
      status: 'completed',
      output: 'Multi-agent orchestration completed successfully',
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Orchestration error:', error);

    // Fallback to enhanced mock mode
    yield* runMockAgentOrchestration(domain, userInput, onStep);
  }
}

/**
 * MOCK MULTI-AGENT ORCHESTRATION
 * Demonstrates full agent coordination without real API calls
 */
async function* runMockAgentOrchestration(
  domain: Domain,
  userInput: string,
  onStep: (step: AgentStep) => void
) {
  const domainAgents = AGENTS.filter(a => a.domain === domain);
  const specialist = domainAgents.find(a => a.role === 'Researcher' || a.role === 'Specialist')!;
  const critic = domainAgents.find(a => a.role === 'Critic')!;
  const supervisor = domainAgents.find(a => a.role === 'Supervisor')!;

  // SHARED STATE FOR DEMONSTRATION
  const ensembleState = {
    originalQuery: userInput,
    plan: "",
    rawFindings: "",
    critique: "",
    safetyScore: 1.0,
    interAgentCommunications: [] as string[],
    requiresHumanApproval: false,
    agentContributions: {} as Record<string, any>
  };

  // PHASE 1: SUPERVISOR PLANNING
  onStep({
    agentId: supervisor.id,
    agentName: supervisor.name,
    status: 'running',
    thought: 'Analyzing user intent and architecting multi-agent execution plan...',
    timestamp: Date.now()
  });

  // Simulate planning delay
  await new Promise(resolve => setTimeout(resolve, 800));

  ensembleState.plan = `Multi-agent execution plan for "${userInput}":
1. ${specialist.name} will conduct specialized research
2. ${critic.name} will perform safety and quality audit
3. ${supervisor.name} will synthesize final comprehensive report
4. Human oversight will be requested for sensitive ${domain.toLowerCase()} content`;

  ensembleState.interAgentCommunications.push(`SUPERVISOR_PLAN: ${ensembleState.plan}`);

  onStep({
    agentId: supervisor.id,
    agentName: supervisor.name,
    status: 'completed',
    output: ensembleState.plan,
    timestamp: Date.now()
  });

  // PHASE 2: SPECIALIST RESEARCH
  onStep({
    agentId: specialist.id,
    agentName: specialist.name,
    status: 'running',
    thought: 'Executing specialized research with domain tools and data sources...',
    timestamp: Date.now()
  });

  // Simulate research delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  const mockFindings = await generateComprehensiveMockResponse(domain, userInput);
  ensembleState.rawFindings = mockFindings;
  ensembleState.agentContributions[specialist.id] = {
    role: specialist.role,
    findings: mockFindings,
    tools_used: ['domainKnowledge', 'mockSearch'],
    confidence: 0.92
  };

  ensembleState.interAgentCommunications.push(`SPECIALIST_FINDINGS: Research completed with ${mockFindings.length} characters of analysis`);

  const mockArtifacts = generateMockGrounding(domain, userInput).map(g => ({
    type: 'link' as const,
    label: g.title,
    value: g.uri
  }));

  onStep({
    agentId: specialist.id,
    agentName: specialist.name,
    status: 'completed',
    output: ensembleState.rawFindings,
    artifacts: mockArtifacts,
    confidence: 0.92,
    timestamp: Date.now()
  });

  // PHASE 3: CRITIC AUDIT
  onStep({
    agentId: critic.id,
    agentName: critic.name,
    status: 'reflecting',
    thought: 'Performing deep recursive audit for domain-specific risks and quality assurance...',
    timestamp: Date.now()
  });

  // Simulate audit delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const auditResult = {
    critique: `Mock audit completed for ${domain} content. Content quality: High. Safety compliance: Verified. Risk score: 0.15. Recommendations: Include standard disclaimers, verify all citations in production.`,
    riskScore: 0.15,
    recommendations: ["Add domain-specific disclaimers", "Verify source credibility", "Include contact information for professional consultation"],
    approval_required: (domain === Domain.HEALTHCARE || domain === Domain.FINANCE) && userInput.toLowerCase().includes('advice')
  };

  ensembleState.critique = auditResult.critique;
  ensembleState.safetyScore = 1.0 - auditResult.riskScore;
  ensembleState.requiresHumanApproval = auditResult.approval_required;

  ensembleState.agentContributions[critic.id] = {
    role: critic.role,
    critique: auditResult.critique,
    riskScore: auditResult.riskScore,
    recommendations: auditResult.recommendations,
    approval_required: ensembleState.requiresHumanApproval
  };

  ensembleState.interAgentCommunications.push(`CRITIC_AUDIT: Risk ${auditResult.riskScore}, Human approval: ${ensembleState.requiresHumanApproval}`);

  onStep({
    agentId: critic.id,
    agentName: critic.name,
    status: 'completed',
    output: ensembleState.critique,
    riskScore: auditResult.riskScore,
    timestamp: Date.now()
  });

  // PHASE 4: SUPERVISOR SYNTHESIS
  onStep({
    agentId: supervisor.id,
    agentName: supervisor.name,
    status: 'running',
    thought: 'Synthesizing verified multi-agent findings into executive report...',
    timestamp: Date.now()
  });

  // Simulate synthesis delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Create final comprehensive report
  const finalReport = `# DAMA ${domain} Executive Report

## Executive Summary
This comprehensive analysis was produced through coordinated multi-agent intelligence, combining specialized research, safety auditing, and professional synthesis.

## Key Findings
${ensembleState.rawFindings.split('\n').slice(0, 3).join('\n')}

## Analysis & Recommendations
${ensembleState.rawFindings.split('\n').slice(3, 8).join('\n')}

## Quality Assurance
**Audit Results:** ${ensembleState.critique}
**Safety Score:** ${(ensembleState.safetyScore * 100).toFixed(1)}%
**Risk Level:** ${ensembleState.safetyScore > 0.8 ? 'Low' : ensembleState.safetyScore > 0.6 ? 'Medium' : 'High'}

## Agent Coordination Summary
- **${supervisor.name}**: Planned and orchestrated the multi-agent workflow
- **${specialist.name}**: Conducted specialized research and analysis
- **${critic.name}**: Performed safety audit and quality assurance
- **Shared State**: Successfully coordinated findings and recommendations

## Safety Notes & Disclaimers
${DOMAIN_CONFIGS[domain].disclaimer}

${ensembleState.requiresHumanApproval ? '## Human Approval Required\nThis content has been flagged for human review due to sensitive domain considerations.' : ''}

---
*Generated by DAMA Multi-Agent Intelligence System v4.0*`;

  ensembleState.interAgentCommunications.push(`FINAL_SYNTHESIS: Comprehensive report generated with ${finalReport.length} characters`);

  // Stream the final report
  const words = finalReport.split(' ');
  let currentText = '';

  for (let i = 0; i < words.length; i++) {
    currentText += (i > 0 ? ' ' : '') + words[i];

    if (i % 5 === 0 || i === words.length - 1) {
      yield {
        text: currentText.slice(-200), // Stream chunks
        grounding: generateMockGrounding(domain, userInput),
        approvalRequired: ensembleState.requiresHumanApproval,
        isFinal: i === words.length - 1
      };

      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  onStep({
    agentId: supervisor.id,
    agentName: supervisor.name,
    status: 'completed',
    output: 'Multi-agent orchestration completed successfully',
    timestamp: Date.now()
  });
}

/** 
 * AUDIO ENCODING / DECODING 
 * Essential for the Live API to process raw PCM streams correctly.
 */
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * LIVE SESSION ENGINE
 * Mock implementation for demonstration purposes when API key is not available.
 * Simulates voice conversation with text-to-speech and basic speech recognition.
 */
export async function connectLiveSession(
  domain: Domain,
  callbacks: {
    onTranscription?: (text: string, role: 'user' | 'model') => void;
    onError?: (err: any) => void;
    onClose?: () => void;
    onStatusChange?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  }
) {
  // Check if we should use mock mode (no API key or placeholder)
  const apiKey = import.meta.env.VITE_API_KEY;
  const useMockMode = !apiKey ||
    apiKey === 'PLACEHOLDER_API_KEY' ||
    apiKey === 'your_api_key_here' ||
    apiKey === 'YOUR_API_KEY_HERE' ||
    apiKey.includes('API_KEY');

  if (!useMockMode) {
    // Use real Gemini Live API
    return connectLiveSessionReal(domain, callbacks);
  }

  console.log('Using mock voice conversation mode (no API key configured)');

  // Mock implementation
  let isConnected = false;
  
  let speechRecognition: SpeechRecognition | null = null;
  let speechSynthesis: SpeechSynthesis | null = null;
  let audioContext: AudioContext | null = null;
  let stream: MediaStream | null = null;
  let isCleaningUp = false;

  // Mock responses based on domain
  

  const cleanup = async () => {
    if (isCleaningUp) return;
    isCleaningUp = true;

    console.log('Cleaning up mock voice session...');

    // Stop speech recognition
    if (speechRecognition) {
      try {
        speechRecognition.stop();
      } catch (e) {
        console.warn('Error stopping speech recognition:', e);
      }
      speechRecognition = null;
    }

    // Stop speech synthesis
    if (speechSynthesis) {
      try {
        speechSynthesis.cancel();
      } catch (e) {
        console.warn('Error stopping speech synthesis:', e);
      }
    }

    // Stop media stream
    if (stream) {
      stream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping media track:', e);
        }
      });
      stream = null;
    }

    // Close audio context
    if (audioContext && audioContext.state !== 'closed') {
      try {
        await audioContext.close();
      } catch (e) {
        console.warn('Error closing audio context:', e);
      }
      audioContext = null;
    }

    isConnected = false;
    isListening = false;
    console.log('Mock cleanup complete');
  };

  try {
    callbacks.onStatusChange?.('connecting');

    // Check if Web Speech API is available
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Speech recognition not supported in this browser. Try Chrome or Edge.');
    }

    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported in this browser.');
    }

    // Request microphone access (still needed for visual feedback)
    console.log('Requesting microphone access for mock mode...');
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      console.log('Microphone access granted');
    } catch (err) {
      console.warn('Microphone access failed, continuing in mock mode without audio input:', err);
      // Continue without microphone for demonstration
    }

    // Initialize audio context
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
    } catch (err) {
      console.warn('Audio context creation failed:', err);
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognition = new SpeechRecognition();
    speechSynthesis = window.speechSynthesis;

    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = 'en-US';

    speechRecognition.onstart = () => {
      console.log('Mock speech recognition started - listening for voice input');
      isListening = true;
      callbacks.onStatusChange?.('connected');
      isConnected = true;

      // Immediate feedback that voice is being listened to
      callbacks.onTranscription?.('🎤 Listening... Speak clearly into your microphone', 'model');

      // Simulate AI greeting after a short delay
      setTimeout(() => {
        const greeting = `Hello! I'm a mock ${domain.toLowerCase()} assistant. Speak your question and I'll respond immediately!`;
        callbacks.onTranscription?.(greeting, 'model');
        speakText(greeting);
      }, 1500);
    };

    speechRecognition.onresult = (event) => {
      if (!isConnected) return;

      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Process interim results for immediate feedback
      if (interimTranscript && interimTranscript.length > 5) {
        console.log('Interim speech detected:', interimTranscript);
        // Show interim text with visual indicator
        callbacks.onTranscription?.(`🎤 ${interimTranscript}`, 'user');
      }

      if (finalTranscript) {
        console.log('Final speech detected:', finalTranscript);
        // Replace interim with final transcript
        callbacks.onTranscription?.(finalTranscript, 'user');

        // Generate immediate AI response
        setTimeout(() => {
          const response = generateAIResponse(finalTranscript.trim(), domain);
          callbacks.onTranscription?.(response, 'model');
          speakText(response);
        }, 200 + Math.random() * 300); // Faster response time
      }
    };

    speechRecognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error, event.message);

      // Handle different error types appropriately
      if (event.error === 'not-allowed') {
        callbacks.onError?.(new Error('Microphone access denied. Please allow microphone access in your browser settings.'));
        startMockMode();
      } else if (event.error === 'aborted') {
        console.log('Speech recognition aborted - restarting...');
        // Aborted is normal when stopping/starting, just restart quietly
        if (isConnected && !isCleaningUp) {
          setTimeout(() => {
            if (speechRecognition && isConnected && !isCleaningUp) {
              try {
                speechRecognition.start();
              } catch (e: any) {
                console.warn('Failed to restart speech recognition:', e);
              }
            }
          }, 500);
        }
      } else if (event.error === 'network') {
        callbacks.onError?.(new Error('Network error in speech recognition. Check your internet connection.'));
        startMockMode();
      } else if (event.error === 'no-speech') {
        console.log('No speech detected - continuing to listen');
        // No-speech is normal, just continue listening
        if (isConnected && !isCleaningUp) {
          setTimeout(() => {
            if (speechRecognition && isConnected && !isCleaningUp) {
              try {
                speechRecognition.start();
              } catch (e) {
                console.warn('Failed to restart after no-speech:', e);
              }
            }
          }, 1000);
        }
      } else {
        console.warn('Unhandled speech recognition error:', event.error);
        // For other errors, try to continue but don't spam the user
      }
    };

    speechRecognition.onend = () => {
      console.log('Speech recognition ended');
      isListening = false;
      if (isConnected && !isCleaningUp) {
        // Restart if still connected, but with a longer delay to prevent rapid restarts
        setTimeout(() => {
          if (isConnected && !isCleaningUp && speechRecognition) {
            try {
              speechRecognition.start();
            } catch (e) {
              console.warn('Failed to restart speech recognition:', e);
              if (e instanceof message && e.message.includes('already started')) {
                // Already started, ignore
              } else {
                console.error('Speech recognition restart failed:', e);
              }
            }
          }
        }, 500); // Longer delay to prevent aborted errors
      }
    };

    const speakText = (text: string) => {
      if (!speechSynthesis) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      // Try to use a female voice if available
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice =>
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('victoria')
      ) || voices.find(voice => voice.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      speechSynthesis.speak(utterance);
    };

    const startMockMode = () => {
      console.log('Starting mock mode without speech recognition');
      callbacks.onStatusChange?.('connected');
      isConnected = true;

      // Simulate conversation with text input prompts
      setTimeout(() => {
        const message = `Mock mode activated! Since speech recognition isn't available, try typing your questions below. This demonstrates the voice interface layout.`;
        callbacks.onTranscription?.(message, 'model');
        speakText(message);
      }, 500);

      // Simulate periodic mock interactions
      const mockInterval = setInterval(() => {
        if (!isConnected || isCleaningUp) {
          clearInterval(mockInterval);
          return;
        }

        const mockMessages = [
          `The ${domain.toLowerCase()} interface is working perfectly!`,
          `This mock system shows how real AI voice conversations would appear.`,
          `Try asking about ${domain.toLowerCase()} topics to see the interface in action.`,
          `Voice interactions make AI much more accessible and natural.`
        ];

        const message = mockMessages[Math.floor(Math.random() * mockMessages.length)];
        callbacks.onTranscription?.(message, 'model');
        speakText(message);
      }, 8000 + Math.random() * 7000); // Every 8-15 seconds
    };

    // Start speech recognition or mock mode
    if (stream) {
      speechRecognition.start();
    } else {
      startMockMode();
    }

    return {
      stop: async () => {
        console.log('Stopping mock voice session...');
        await cleanup();
        callbacks.onStatusChange?.('disconnected');
        callbacks.onClose?.();
      },
      isConnected: () => isConnected,
    };

  } catch (err) {
    console.error('Failed to start mock voice session:', err);
    await cleanup();
    callbacks.onStatusChange?.('error');
    callbacks.onError?.(err instanceof Error ? err : new Error('Failed to start voice session'));
    throw err;
  }
}

/**
 * REAL LIVE SESSION ENGINE
 * Original implementation using Google Gemini Live API
 */
async function connectLiveSessionReal(
  domain: Domain,
  callbacks: {
    onTranscription?: (text: string, role: 'user' | 'model') => void;
    onError?: (err: any) => void;
    onClose?: () => void;
    onStatusChange?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  }
) {
  // Validate API key
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY' || apiKey === 'your_api_key_here') {
    const error = new Error('Google Gemini API key is not configured. Please set VITE_API_KEY in your .env file.');
    console.error('Voice Link Error:', error.message);
    callbacks.onError?.(error);
    callbacks.onStatusChange?.('error');
    throw error;
  }

  const ai = new GoogleGenAI({ apiKey });
  let nextStartTime = 0;
  let isConnected = false;
  let session: any = null;
  let mediaRecorder: MediaRecorder | null = null;
  let scriptProcessor: ScriptProcessorNode | null = null;
  let mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  
  // Audio contexts - will be created after user gesture
  let inputAudioContext: AudioContext | null = null;
  let outputAudioContext: AudioContext | null = null;
  let outputNode: GainNode | null = null;
  const sources = new Set<AudioBufferSourceNode>();
  
  let stream: MediaStream | null = null;
  let isCleaningUp = false;

  // Cleanup function to properly dispose all resources
  const cleanup = async () => {
    if (isCleaningUp) return;
    isCleaningUp = true;

    console.log('Cleaning up voice session resources...');

    // Stop media recorder
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      try {
        mediaRecorder.stop();
      } catch (e) {
        console.warn('Error stopping media recorder:', String(e));
      }
    }
    mediaRecorder = null;

    // Disconnect and stop script processor
    if (scriptProcessor) {
      try {
        scriptProcessor.disconnect();
      } catch (e) {
        console.warn('Error disconnecting script processor:', String(e));
      }
      scriptProcessor = null;
    }

    // Disconnect media stream source
    if (mediaStreamSource) {
      try {
        mediaStreamSource.disconnect();
      } catch (e) {
        console.warn('Error disconnecting media stream source:', e);
      }
      mediaStreamSource = null;
    }

    // Stop all audio sources
    for (const source of sources.values()) {
      try {
        source.stop();
      } catch (e) {
        console.warn('Error stopping audio source:', e);
      }
    }
    sources.clear();

    // Stop media stream tracks
    if (stream) {
      stream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping media track:', e);
        }
      });
      stream = null;
    }

    // Close audio contexts
    if (inputAudioContext && inputAudioContext.state !== 'closed') {
      try {
        await inputAudioContext.close();
      } catch (e) {
        console.warn('Error closing input audio context:', e);
      }
      inputAudioContext = null;
    }

    if (outputAudioContext && outputAudioContext.state !== 'closed') {
      try {
        await outputAudioContext.close();
      } catch (e) {
        console.warn('Error closing output audio context:', e);
      }
      outputAudioContext = null;
    }

    // Close session
    if (session) {
      try {
        session.close();
      } catch (e) {
        console.warn('Error closing session:', e);
      }
      session = null;
    }

    isConnected = false;
    console.log('Cleanup complete');
  };

  try {
    callbacks.onStatusChange?.('connecting');

    // Request microphone access
    console.log('Requesting microphone access...');
    try {
      stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        }
      });
      console.log('Microphone access granted');
    } catch (err) {
      const error = new Error('Microphone access denied. Please allow microphone access in your browser settings.');
      console.error('Microphone access error:', err);
      callbacks.onError?.(error);
      callbacks.onStatusChange?.('error');
      throw error;
    }

    // Create audio contexts after user gesture (microphone permission)
    console.log('Creating audio contexts...');
    try {
      inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // Resume contexts (they may be suspended)
      if (inputAudioContext.state === 'suspended') {
        await inputAudioContext.resume();
      }
      if (outputAudioContext.state === 'suspended') {
        await outputAudioContext.resume();
      }
      
      console.log('Audio contexts created and resumed');
    } catch (err) {
      const error = new Error('Failed to initialize audio contexts. Your browser may not support Web Audio API.');
      console.error('Audio context error:', err);
      callbacks.onError?.(error);
      callbacks.onStatusChange?.('error');
      await cleanup();
      throw error;
    }

    // Setup output audio
    outputNode = outputAudioContext.createGain();
    outputNode.gain.value = 1.0;
    outputNode.connect(outputAudioContext.destination);

    // Connect to Gemini Live API
    console.log('Connecting to Gemini Live API...');
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.0-flash-exp',
      callbacks: {
        onopen: async () => {
          console.log('Live session opened');
          isConnected = true;
          callbacks.onStatusChange?.('connected');

          try {
            // Setup audio processing with ScriptProcessorNode
            mediaStreamSource = inputAudioContext!.createMediaStreamSource(stream!);

            // Use ScriptProcessorNode for real-time PCM processing
            scriptProcessor = inputAudioContext!.createScriptProcessor(4096, 1, 1);

            scriptProcessor.onaudioprocess = (audioProcessingEvent: AudioProcessingEvent) => {
              if (!isConnected || !session) return;

              try {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const l = inputData.length;
                const int16 = new Int16Array(l);

                // Convert float32 to int16 PCM
                for (let i = 0; i < l; i++) {
                  // Clamp and convert
                  const sample = Math.max(-1, Math.min(1, inputData[i]));
                  int16[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
                }

                const pcmBlob = {
                  data: encode(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000',
                };

                // Send audio data directly (no promise.then in hot path)
                session.sendRealtimeInput({ media: pcmBlob });
              } catch (e) {
                console.error('Error processing audio:', e);
              }
            };

            // Connect audio graph (NOT to destination to avoid feedback)
            mediaStreamSource.connect(scriptProcessor);
            // Do NOT connect scriptProcessor to destination - this causes feedback
            console.log('Audio processing pipeline established with ScriptProcessorNode');
          } catch (err) {
            console.error('Error setting up audio processing:', err);
            callbacks.onError?.(new Error('Failed to setup audio processing pipeline'));
            await cleanup();
          }
        },
        onmessage: async (message: LiveServerMessage) => {
          if (!isConnected) return;

          try {
            // Handle Transcriptions
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              if (text) {
                callbacks.onTranscription?.(text, 'model');
              }
            } else if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              if (text) {
                callbacks.onTranscription?.(text, 'user');
              }
            }

            // Handle Audio Output
            const modelTurn = message.serverContent?.modelTurn;
            if (modelTurn?.parts && outputAudioContext && outputNode) {
              for (const part of modelTurn.parts) {
                if (part.inlineData?.data) {
                  try {
                    const base64Audio = part.inlineData.data;
                    nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                    
                    const audioBuffer = await decodeAudioData(
                      decode(base64Audio),
                      outputAudioContext,
                      24000,
                      1,
                    );
                    
                    const source = outputAudioContext.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(outputNode);
                    
                    source.addEventListener('ended', () => {
                      sources.delete(source);
                    });
                    
                    source.start(nextStartTime);
                    nextStartTime = nextStartTime + audioBuffer.duration;
                    sources.add(source);
                  } catch (e) {
                    console.error('Error playing audio:', e);
                  }
                }
              }
            }

            // Handle Interruption
            if (message.serverContent?.interrupted) {
              console.log('Audio interrupted');
              for (const source of sources.values()) {
                try {
                  source.stop();
                } catch (e) {
                  console.warn('Error stopping interrupted audio:', e);
                }
                sources.delete(source);
              }
              nextStartTime = 0;
            }
          } catch (e) {
            console.error('Error processing server message:', e);
          }
        },
        onerror: (e: any) => {
          console.error("Live API Error:", e);
          isConnected = false;
          callbacks.onStatusChange?.('error');
          
          // Provide user-friendly error messages
          let errorMessage = 'Voice connection error occurred.';
          if (e?.message) {
            if (e.message.includes('API key')) {
              errorMessage = 'Invalid API key. Please check your VITE_API_KEY configuration.';
            } else if (e.message.includes('quota')) {
              errorMessage = 'API quota exceeded. Please try again later.';
            } else if (e.message.includes('network')) {
              errorMessage = 'Network error. Please check your internet connection.';
            } else {
              errorMessage = `Voice error: ${e.message}`;
            }
          }
          
          callbacks.onError?.(new Error(errorMessage));
        },
        onclose: (e: any) => {
          console.log('Live session closed:', e);
          isConnected = false;
          callbacks.onStatusChange?.('disconnected');
          callbacks.onClose?.();
        },
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        outputAudioTranscription: {},
        inputAudioTranscription: {},
        systemInstruction: `You are the DAMA Supervisor for the ${domain} domain. You are providing high-quality, expert-level advice via real-time voice. Be concise and authoritative.`,
      },
    });

    // Wait for session to be established
    session = await sessionPromise;
    console.log('Session established successfully');

    return {
      stop: async () => {
        console.log('Stopping voice session...');
        await cleanup();
      },
      isConnected: () => isConnected,
    };
  } catch (err) {
    console.error('Failed to establish live session:', err);
    await cleanup();
    throw err;
  }
}
