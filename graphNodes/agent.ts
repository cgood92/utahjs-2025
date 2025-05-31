import { MessagesAnnotation } from '@langchain/langgraph';
import {
  AIMessage,
  SystemMessage,
  ToolMessage,
  BaseMessage,
} from '@langchain/core/messages';
import { ChatOllama } from '@langchain/ollama';
import { tools } from './tools.ts';

const llm = new ChatOllama({
  model: 'qwen3:8b',
  verbose: true,
}).bindTools(tools);

export async function agentNode(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages.at(-1) as AIMessage;

  if (isToolResponse(lastMessage)) {
    const response = await llm.invoke([
      ...state.messages,
      new SystemMessage(
        'Process the tool response and determine the next step.'
      ),
    ]);
    return { messages: [response] };
  }

  const response = await llm.invoke(state.messages);
  return { messages: [response] };
}

function isToolResponse(message: BaseMessage) {
  return message instanceof ToolMessage;
}
