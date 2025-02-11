"use client"

import { useState, useEffect, ReactNode } from "react"
import styles from '../styles/Navbar.module.css'
import Sidebar from "./Sidebar"
import { getChatHistory } from "../../services/chatService" // Adjust path as needed

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

    return (
        <>
            <Sidebar onToggle={setIsNavCollapsed} conversations={conversations} />
            <main className={`${styles.mainContent} ${isNavCollapsed ? styles.shifted : ''}`}>
                {childWidget}
            </main>
        </>
    )
}