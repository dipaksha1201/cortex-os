"use client"

import { useState, useEffect, ReactNode } from "react"
import styles from '../styles/Navbar.module.css'
import Sidebar from "./Sidebar"
import { getChatHistory, deleteConversation } from "../../services/chatService" // Adjust path as needed

interface CortexInterfaceProps {
    childWidget: ReactNode
}

export default function CortexInterface({ childWidget }: CortexInterfaceProps) {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false)
    const [conversations, setConversations] = useState<any[]>([])

    useEffect(() => {
        async function fetchConversations() {
            try {
                const data = await getChatHistory("dipak")
                setConversations(data["conversations"])
            } catch (error) {
                console.error("Error fetching chat history:", error)
            }
        }
        fetchConversations()
    }, [])

    const handleDeleteConversation = async (conversationId: string) => {
        try {
            await deleteConversation(conversationId);
            // Remove the deleted conversation from state
            setConversations(prevConversations =>
                prevConversations.filter(conv => conv._id !== conversationId)
            );
        } catch (error) {
            console.error("Error deleting conversation:", error);
        }
    };

    return (
        <>
            <Sidebar
                onToggle={setIsNavCollapsed}
                conversations={conversations}
                onDeleteConversation={handleDeleteConversation}
            />
            <main className={`${styles.mainContent} ${isNavCollapsed ? styles.shifted : ''}`}>
                {childWidget}
            </main>
        </>
    )
}