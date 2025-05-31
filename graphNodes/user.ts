import { MessagesAnnotation, interrupt } from '@langchain/langgraph'
import { AIMessage, ToolMessage } from '@langchain/core/messages'

/* Nodes that have interrupt in them will get run twice.
Once with the interrupt until the interrupt (then an error is thrown, execution stop).
Once all the way through, but the interrupt will have the input from user rather than throwing an error.
Therefore, do not put side-effects in this node, as it will run twice. */
export async function userNode(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages.at(-1) as AIMessage
  const { input: humanInput } = interrupt({
    message: getMessageToUser(lastMessage),
  })

  return {
    messages: [
      ...state.messages,
      new ToolMessage({
        content: humanInput,
        tool_call_id: getToolCallId(lastMessage),
      }),
    ],
  }
}

function getMessageToUser(message: AIMessage) {
  return message.tool_calls![0].args.message
}

function getToolCallId(message: AIMessage) {
  return message.tool_calls![0].id!
}

export function checkForUserNode({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages.at(-1) as AIMessage

  if (hasToolCalls(lastMessage)) {
    if (getToolCalled(lastMessage) === 'talk_to_user') {
      return 'user'
    }

    return 'tools'
  }

  return 'agent'
}

function hasToolCalls(message: AIMessage) {
  return message.tool_calls?.length
}

function getToolCalled(message: AIMessage) {
  return message.tool_calls![0].name
}
