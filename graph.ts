import {
  START,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from '@langchain/langgraph';
import { agentNode } from './graphNodes/agent.ts';
import { userNode, checkForUserNode } from './graphNodes/user.ts';
import { toolNode } from './graphNodes/tools.ts';

const workflow = new StateGraph(MessagesAnnotation)
  .addNode('agent', agentNode)
  .addNode('tools', toolNode)
  .addNode('user', userNode)
  .addEdge(START, 'agent')
  .addEdge('tools', 'agent')
  .addEdge('user', 'agent')
  .addConditionalEdges('agent', checkForUserNode);

const checkpointer = new MemorySaver();
export const graph = workflow.compile({ checkpointer });
