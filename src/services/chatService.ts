import { API_CONFIG_CORTEX_SERVICE, API_CONFIG_CHAT_WEBSOCKET } from '../config';
// WebSocket connection for streaming chat
export class ChatWebSocketService {
  private ws: WebSocket | null = null;
  private userId: string;
  private conversationId: string | null;
  private retryCount = 0;
  private maxRetries = 3;
  private retryTimeout = 2000; // 2 seconds
  private connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error' = 'disconnected';
  private onStreamCallback: ((data: any) => void) | null = null;
  private onFinishedCallback: (() => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onStatusChangeCallback: ((status: string) => void) | null = null;

  constructor(userId: string, conversationId: string | null) {
    this.userId = userId;
    this.conversationId = conversationId;
  }

  connect(): ChatWebSocketService {
    try {
      // Disconnect existing connection if any
      if (this.ws) {
        console.log('Closing existing connection before reconnecting');
        this.disconnect();
      }

      this.connectionStatus = 'connecting';
      this.updateStatus('connecting');
      console.log(`Attempting to connect to WebSocket at ${API_CONFIG_CHAT_WEBSOCKET.BASE_URL}`);

      this.ws = new WebSocket(API_CONFIG_CHAT_WEBSOCKET.BASE_URL);

      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.connectionStatus = 'connected';
        this.updateStatus('connected');
        this.retryCount = 0; // Reset retry count on successful connection

        // Send user ID as first message
        console.log(`Sending user_id: ${this.userId}`);
        this.ws?.send(this.userId);

        // Send conversation ID as second message (empty string if null)
        const conversationIdToSend = this.conversationId || '';
        console.log(`Sending conversation_id: ${conversationIdToSend || '(empty)'}`);
        this.ws?.send(conversationIdToSend);
      };

      this.ws.onmessage = (event) => {
        try {
          console.log('Raw message received:', event.data);

          // Try to parse as JSON, but handle non-JSON messages too
          let data;
          try {
            data = JSON.parse(event.data);
            console.log('Parsed message:', data);
          } catch (parseError) {
            // If it's not JSON, treat it as a plain text message
            console.log('Received non-JSON message:', event.data);
            if (this.onStreamCallback) {
              this.onStreamCallback({
                type: 'text',
                content: event.data
              });
            }
            return;
          }

          // The server sends messages with a 'type' field
          // The actual content is in the 'data' field for stream messages
          if (data.type === 'error') {
            console.error('Error from server:', data.message || data.data);
            if (this.onErrorCallback) {
              this.onErrorCallback(data.message || data.data || 'Unknown error from server');
            }
          } else if (data.type === 'finished') {
            console.log('Stream finished');
            if (this.onFinishedCallback) {
              this.onFinishedCallback();
            }
          } else if (data.type === 'stream') {
            // For stream type, the actual data is in the 'data' field
            console.log('Stream data received:', data.data);
            if (this.onStreamCallback && data.data) {
              this.onStreamCallback(data.data);
            }
          } else {
            // For any other message type, pass the entire data object
            console.log('Other message type received:', data);
            if (this.onStreamCallback) {
              this.onStreamCallback(data);
            }
          }
        } catch (error) {
          console.error('Error handling message:', error, 'Raw message:', event.data);
          if (this.onErrorCallback) {
            this.onErrorCallback('Failed to process server message');
          }
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connectionStatus = 'error';
        this.updateStatus('error');
        if (this.onErrorCallback) {
          this.onErrorCallback('WebSocket connection error');
        }
      };

      this.ws.onclose = (event) => {
        console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}, Clean: ${event.wasClean}`);
        this.connectionStatus = 'disconnected';
        this.updateStatus('disconnected');

        // Don't attempt to reconnect if we closed the connection cleanly
        if (event.wasClean) {
          console.log('Connection closed cleanly, not attempting to reconnect');
          return;
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.connectionStatus = 'error';
      this.updateStatus('error');
      if (this.onErrorCallback) {
        this.onErrorCallback('Failed to establish WebSocket connection');
      }
    }

    return this;
  }

  onStream(callback: (data: any) => void): ChatWebSocketService {
    this.onStreamCallback = callback;
    return this;
  }

  onFinished(callback: () => void): ChatWebSocketService {
    this.onFinishedCallback = callback;
    return this;
  }

  onError(callback: (error: string) => void): ChatWebSocketService {
    this.onErrorCallback = callback;
    return this;
  }

  onStatusChange(callback: (status: string) => void): ChatWebSocketService {
    this.onStatusChangeCallback = callback;
    return this;
  }

  private updateStatus(status: string): void {
    if (this.onStatusChangeCallback) {
      this.onStatusChangeCallback(status);
    }
  }

  sendMessage(message: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      const error = 'WebSocket is not connected. Cannot send message.';
      console.error(error);
      if (this.onErrorCallback) {
        this.onErrorCallback(error);
      }
      return;
    }

    try {
      // Send just the message text as the server expects
      console.log('Sending message:', message);
      this.ws.send(message);
    } catch (error) {
      console.error('Error sending message:', error);
      if (this.onErrorCallback) {
        this.onErrorCallback('Failed to send message');
      }
    }
  }

  disconnect(): void {
    if (this.ws) {
      console.log('Disconnecting WebSocket');
      this.ws.close(1000, 'Client disconnected');
      this.ws = null;
      this.connectionStatus = 'disconnected';
      this.updateStatus('disconnected');
    }
  }

  getConnectionStatus(): string {
    return this.connectionStatus;
  }
}

// Function to stream chat messages using WebSocket
export const streamChatMessage = async (
  conversationId: string | null,
  userId: string,
  query: string,
  callbacks: {
    onStream: (data: any) => void;
    onFinished: () => void;
    onError: (error: string) => void;
    onStatusChange?: (status: string) => void;
  }
): Promise<{ disconnect: () => void }> => {
  // Create a promise that resolves when the connection is established
  let connectionResolve: () => void;
  const connectionPromise = new Promise<void>((resolve) => {
    connectionResolve = resolve;
  });

  // Create the WebSocket service
  const wsService = new ChatWebSocketService(userId, conversationId)
    .connect()
    .onStream(callbacks.onStream)
    .onFinished(callbacks.onFinished)
    .onError(callbacks.onError);

  // Add status change callback if provided
  if (callbacks.onStatusChange) {
    wsService.onStatusChange((status) => {
      callbacks.onStatusChange!(status);

      // Resolve the connection promise when connected
      if (status === 'connected') {
        connectionResolve();
      }
    });
  } else {
    // If no status callback provided, still need to resolve the promise
    wsService.onStatusChange((status) => {
      if (status === 'connected') {
        connectionResolve();
      }
    });
  }

  try {
    // Wait for the connection to be established with a timeout
    const connectionTimeout = 5000; // 5 seconds
    await Promise.race([
      connectionPromise,
      new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), connectionTimeout)
      )
    ]);

    // Add a small delay after connection is established before sending the message
    await new Promise(resolve => setTimeout(resolve, 500));

    // Send the message
    console.log('Connection established, sending message:', query);
    wsService.sendMessage(query);
  } catch (error) {
    console.error('Error in connection process:', error);
    callbacks.onError(error instanceof Error ? error.message : 'Failed to establish connection');
    wsService.disconnect();
  }

  return {
    disconnect: () => wsService.disconnect()
  };
};

export const getChatHistory = async (userName: string) => {
  const response = await fetch(`${API_CONFIG_CORTEX_SERVICE.BASE_URL}/get/conversation/all?user_id=${userName}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}

export const deleteConversation = async (conversationId: string) => {
  const response = await fetch(`${API_CONFIG_CORTEX_SERVICE.BASE_URL}/conversation/${conversationId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}