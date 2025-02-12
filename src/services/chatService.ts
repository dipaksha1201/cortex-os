import { ChatMessageProps } from '../components/chat/ChatMessage'

export const talkToCortex = {
  postChat: async (conversationId: string | null, userName: string, query: string) => {
    const body = { "conversation_id": conversationId, "user_id": userName, "content": query, "sender": "user", "type": "query" }
    console.log("Sending to Cortex API:", body);
    const response = await fetch('http://localhost:8000/chat/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  }
};

// New function to add a user message, call the cortex api, and add the response message.
export const sendChatMessage = async (
  conversationId: string | null,
  projectName: string,
  query: string,
  currentMessages: ChatMessageProps[]
): Promise<any> => {


  try {
    // Send the query to the Cortex API
    const cortexResponse = await talkToCortex.postChat(conversationId, projectName, query);

    conversationId = cortexResponse.conversation_id;
    console.log("Cortex response:", cortexResponse);
    // Append the API response message
    currentMessages.push(cortexResponse.response);
  } catch (error) {
    const errorMessage = {
      message: error.message.toString(),
      sender: 'error',
    };
    currentMessages.push(errorMessage);
    // setMessages(updatedMessages);
    console.error("Error sending message:", error);
  }

  return { "messages": currentMessages, "id": conversationId };
};

export const getChatHistory = async (userName: string) => {
  const response = await fetch(`http://localhost:8000/chat/get/conversation/all?user_id=${userName}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}