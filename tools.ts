const OLLAMA_URL = 'http://localhost:11434';
const MODEL = 'qwen3:8b';

async function main() {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: `The user has a query below.  I want to execute a function to complete the user\'s request.  Here is the request:

---
I want to get more information about an expedition.
---

Here is some context about the user:
---
My email address is clintg@adobe.com.
---

Here are the functions, with a description of what they do:
- donate: Donate to 100 humanitarians.  Arguments: {amount: number}
- getExpeditionGuide: Get a guide for an expedition. Arguments: {email: string}
- joinExpedition: Commit to join an expedition. Arguments: {email: string, startDate: Date}

Tell me which function to call, and the arguments (as a JSON object).  Tell me the answer, and nothing else.
          `,
        },
      ],
      stream: false,
    }),
  }).then((res) => res.json());

  console.log(response);

  //   const nonThinkingResponse = response.message.content.replace(
  //     /<think>[\s\S]*?<\/think>/gm,
  //     ''
  //   );

  //   const functionName = JSON.parse(nonThinkingResponse).function;
  //   const functionArgs = JSON.parse(nonThinkingResponse).arguments;

  //   const functionToCall = functions[functionName];
  //   functionToCall(functionArgs);
}

main();

// function donate(amount: number) {
//   console.info('going to call donate API call...');
// }

// function getExpeditionGuide(email: string) {
//   console.info('going to call getExpeditionGuide API call...');
// }

// function joinExpedition(email: string, startDate: Date) {
//   console.info('going to call joinExpedition API call...');
// }

// const functions = {
//   donate,
//   getExpeditionGuide,
//   joinExpedition,
// };
