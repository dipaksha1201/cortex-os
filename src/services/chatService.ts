import { ChatItem, chatItems } from '../data/chatData'

export const chatService = {
  getChatItems: async (): Promise<ChatItem[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return chatItems
  },
}
