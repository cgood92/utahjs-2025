import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { Command } from '@langchain/langgraph';
import { v4 as uuidv4 } from 'uuid';
import { graph } from './graph.ts';

export async function startConversation(
  input: string,
  threadId: string = uuidv4()
) {
  return run(input, threadId, false);
}

export async function continueConversation(input: string, threadId: string) {
  return run(input, threadId, true);
}

async function run(
  input: string,
  threadId: string,
  continueConversation = false
) {
  const threadConfig = { configurable: { thread_id: threadId } };

  const inputs = continueConversation
    ? new Command({ resume: { input } })
    : {
        messages: [
          new SystemMessage(
            'You are a helpful AI assistant that answers questions and performs actions related to 100 Humanitarians.  Look at the user query, and determine how it relates to 100 humanitarians.  Then, call the appropriate tool to either get the answer to the question or perform the desired action.  If you do not know the answer, please call the tool: getInformation for the answer.  Once you have either the answer or the action has been performed, call the tool "talk_to_user" to inform the user about their request.'
          ),
          new HumanMessage(input),
        ],
      };

  const result = await graph.invoke(inputs, threadConfig);

  const lastMessage = getMessageToUser(result.messages.at(-1) as AIMessage);
  return lastMessage;
}

function getMessageToUser(message: AIMessage) {
  if (message.content) {
    return message.content as string;
  }

  if (message.tool_calls?.length) {
    return message.tool_calls[0].args.message as string;
  }
}

startConversation(
  'How much money does a chicken bring in for a family in Kenya, and donate 10 times that amount.'
);
