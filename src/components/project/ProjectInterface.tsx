import { useEffect, useState, ComponentType } from "react";
import { ProjectHeader } from "./ProjectHeader";
import { useComponentContext } from '@/src/components/global/ComponentContext';
import { ChatInput } from "../chat/ChatInput";
import ChatInterface from "../chat/ChatInterface";
import { DocumentTable } from "./DocumentTable";
import { sendDocumentsGetRequest } from '@/src/services/projectService';

const ProjectContent: ComponentType = () => {
  const { setCurrentComponent } = useComponentContext();

  // Add state for documents
  const [documents, setDocuments] = useState<any[]>([]);

  // Fetch documents during initialization
  useEffect(() => {
    // Replace 'user123' with actual user id when available
    sendDocumentsGetRequest('dipak')
      .then(data => setDocuments(data))
      .catch(error => console.error('Error fetching documents:', error));
  }, []);

  const handleSendMessage = async (query: string) => {
    setCurrentComponent(<ChatInterface initialQuery={query} shouldSendMessage={true} />);
  };

  return (
    <>
      <ProjectHeader />
      <ChatInput onSendMessage={handleSendMessage} />
      <DocumentTable documents={documents} />
      {/* <ChatList chatItems={[]} /> */}
    </>
  );
};

export default function ProjectInterface() {
  return (
    <ProjectContent />
  );
}
