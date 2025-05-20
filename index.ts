import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Ollama } from '@langchain/ollama';

const llm = new Ollama({
  model: 'qwen3:8b',
});

async function main() {
  const promptTemplate = ChatPromptTemplate.fromMessages([
    [
      'system',
      `Please answer the user's question using only the knowledge below:
---
{knowledge}
---`,
    ],
    ['user', '{question}'],
  ]);

  let totalResponse = '';

  const prompt = await promptTemplate.invoke({
    question:
      "Explain what 100 humanitarians is like you're talking to a 5 year old",
    knowledge,
  });
  const response = await llm.stream(prompt);

  for await (const chunk of response) {
    totalResponse += chunk;
    console.clear();
    console.log(totalResponse);
  }
}

const knowledge = `
# 100 Humanitarians International – Organization Summary

[100 Humanitarians International](https://100humanitarians.org/) is a U.S.-based nonprofit organization founded in 2015 by Heidi Totten. Its mission is to mentor families globally through self-reliance, education, and entrepreneurship, aiming to eliminate physical, mental, spiritual, and emotional poverty.

The organization primarily operates in rural Kenya, focusing on sustainable development initiatives that empower communities to break the cycle of poverty.

---

## Core Programs

The organization's work is structured around four key pillars:

### 1. Sustainable Food
- Implements Garden Towers, chicken businesses, and goat farming.
- Over 20,000 Garden Towers built to enable year-round produce growth.

### 2. Clean Water
- Provides rainwater capture systems, spring protection, and boreholes.
- Reduces waterborne diseases and frees up time for women and girls.

### 3. Education
- Offers school fees, supplies, and skills training.
- Focuses on literacy, sewing, and computer skills for long-term success.

### 4. Health
- Supports dental clinics, menstrual health programs (HopeKits), and clean water initiatives.
- Improves family health and economic stability.

---

## Impact and Operations

Since its founding, 100 Humanitarians International has:

- Completed over **21,000** sustainable food projects  
- Implemented more than **1,675** clean water projects  
- Supported over **6,000** education initiatives  
- Conducted over **8,575** health projects

The organization runs **six expeditions to Kenya annually**, involving volunteers in both project work and cultural exchange. It is powered by a dedicated team of volunteers in the U.S. and Kenya.

---

## How to Get Involved

You can support 100 Humanitarians International in several ways:

- **Donations** (one-time, monthly, stock, or crypto)
- **Volunteering**
- **Participating in expeditions**

The organization emphasizes transparency and regularly shares updates on project progress and impact.

➡️ Visit the official website to learn more: [https://100humanitarians.org/](https://100humanitarians.org/)
`;

main();
