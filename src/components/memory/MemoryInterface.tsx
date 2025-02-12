import { useEffect, useState, ComponentType } from "react";
import { MemoryHeader } from "./MemoryHeader";
import { useComponentContext } from '@/src/components/global/ComponentContext';
import { sendMemoriesGetRequest } from "@/src/services/memoryService";
import { MemoryList } from "./MemoryList";

const MemoryLibraryContent: ComponentType = () => {
    const { setCurrentComponent } = useComponentContext();

    // Add state for documents
    const [memories, setMemories] = useState<any[]>([]);

    // Fetch documents during initialization
    useEffect(() => {
        // Replace 'user123' with actual user id when available
        sendMemoriesGetRequest('dipak')
            .then(data => setMemories(data))
            .catch(error => console.error('Error fetching documents:', error));
    }, []);


    return (
        <>
            <MemoryHeader />
            <MemoryList memories={memories} />
        </>
    );
};

export default function MemoryInterface() {
    return (
        <MemoryLibraryContent />
    );
}
