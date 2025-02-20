"use client"

import {
    FileText,
    Trash2
} from "lucide-react"
import * as React from "react"
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import styles from "../styles/Sidebar.module.css"
import { BiSidebar } from "react-icons/bi";
import { useComponentContext } from '@/src/components/global/ComponentContext';
import ChatInterface from "@/src/components/chat/ChatInterface";
import ProjectInterface from "@/src/components/project/ProjectInterface";
import MemoryInterface from "../memory/MemoryInterface"
import { deleteConversation } from "@/src/services/chatService"

interface Conversation {
    _id: string;
    title: string | null;
    messages: any[];
    last_updated: string;
}

interface SidebarProps {
    onToggle: (collapsed: boolean) => void;
    conversations: Conversation[];
}

export default function Sidebar({ onToggle, conversations }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false)
    const { setCurrentComponent } = useComponentContext();

    const handleToggle = () => {
        const newCollapsed = !collapsed
        setCollapsed(newCollapsed)
        onToggle(newCollapsed)
    }

    const handleComponentChange = (component: React.ReactNode) => {
        setCurrentComponent(component);
    }

    const handleDelete = async (e: React.MouseEvent, conversationId: string) => {
        e.stopPropagation();
        console.log("Deleting conversation:", conversationId);
        try {
            await deleteConversation(conversationId);
            handleComponentChange(<ChatInterface />);
        } catch (error) {
            console.error("Error deleting conversation:", error);
        }
    };

    return (
        <nav className={`${styles.navbar} ${collapsed ? styles.collapsed : ''}`}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
            }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", gap: "0.2rem" }} >
                    <Avatar style={{ marginLeft: "1rem" }} onClick={() => handleComponentChange(<ProjectInterface />)}>
                        <AvatarImage src="/product_img/CJ.png" style={{ filter: "brightness(0)", scale: 1.4 }} />
                        <AvatarFallback>CX</AvatarFallback>
                    </Avatar>
                    <div style={{ marginRight: collapsed ? "2vw" : "4vw", height: "100%", fontSize: "1.5rem", fontWeight: "bold" }} onClick={() => handleComponentChange(<ProjectInterface />)}>Cortex</div>
                    <BiSidebar size={28} onClick={handleToggle} />
                </div>
            </div>
            {!collapsed && (
                <div style={{
                    marginTop: '1rem',
                }}>
                    <TopBar handleComponentChange={handleComponentChange} />
                    <ScrollArea className={styles.scrollArea}>
                        <div className={styles.sectionContainer}>
                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bolder',
                                margin: "0.5rem 0 0.5rem 0.2rem"
                            }}>Chats</h3>
                            <div style={{ overflowY: "auto", height: "75vh" }}>
                                {Array.isArray(conversations) &&
                                    [...conversations]
                                        .sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime())
                                        .map((section, index) => (
                                            <div key={index}>
                                                <div className={styles.sectionItems}>
                                                    <Button
                                                        variant="ghost"
                                                        className={styles.sectionItemButton}
                                                        onClick={() => handleComponentChange(<ChatInterface conversation={section} />)}
                                                    >
                                                        <FileText className={styles.fileIcon} />
                                                        <div className={styles.sectionItemText}>
                                                            {section.title != null ? section.title : section.messages[0].content}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            className={styles.deleteButton}
                                                            onClick={(e) => handleDelete(e, section._id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                }
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            )}
        </nav>
    );
}

interface TopBarProps {
    handleComponentChange: (component: React.ReactElement) => void;
}


const TopBar: React.FC<TopBarProps> = ({ handleComponentChange }) => {
    return (

        <>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', padding: '0.7rem' }}>
                <button
                    style={{
                        backgroundColor: 'white',
                        width: '14rem',
                        color: 'black',
                        border: '1.5px solid black',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        padding: '0.3rem 0.7rem',
                        cursor: 'pointer'
                    }}
                    onClick={() => handleComponentChange(<MemoryInterface />)}
                >
                    Memory Library
                </button>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', padding: '0.7rem' }}>
                <button
                    style={{
                        backgroundColor: 'white',
                        width: '14rem',
                        color: 'black',
                        border: '1.5px solid black',
                        borderRadius: '8px',
                        padding: '0.3rem 0.7rem',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                    onClick={() => handleComponentChange(<ChatInterface />)}
                >
                    + New Chat
                </button>
                <button
                    style={{
                        backgroundColor: 'white',
                        border: '1.5px solid black',
                        borderRadius: '8px',
                        padding: '0.4rem 0.7rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <svg
                        height="16"
                        width="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {/* Folder icon path */}
                        <path d="M4 4h5l2 2h9a2 2 0 0 1 2 2v9c0 1.1-.9 2-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2z" />
                        {/* Plus sign path */}
                        <line x1="12" y1="9" x2="12" y2="15" />
                        <line x1="9" y1="12" x2="15" y2="12" />
                    </svg>
                </button>
            </div>
        </>
    );
};