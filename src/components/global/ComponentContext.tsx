"use client"

import { createContext, useContext, useState, ReactNode } from 'react';
import StreamingChatInterface from '../chat/StreamingChatInterface';
interface ComponentContextProps {
    currentComponent: ReactNode;
    setCurrentComponent: (component: ReactNode) => void;
}

const ComponentContext = createContext<ComponentContextProps | undefined>(undefined);

export const ComponentProvider = ({ children }: { children: ReactNode }) => {
    const [currentComponent, setCurrentComponent] = useState<ReactNode>(<StreamingChatInterface />);

    return (
        <ComponentContext.Provider value={{ currentComponent, setCurrentComponent }}>
            {children}
        </ComponentContext.Provider>
    );
};

export const useComponentContext = () => {
    const context = useContext(ComponentContext);
    if (!context) {
        throw new Error('useComponentContext must be used within a ComponentProvider');
    }
    return context;
};