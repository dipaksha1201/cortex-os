import { useEffect, useState } from "react";
import { ProjectHeader } from "./ProjectHeader";
import { useComponentContext } from '@/src/components/global/ComponentContext';
import { ChatInput } from "../chat/ChatInput";
import ChatInterface from "../chat/ChatInterface";
import { DocumentTable } from "./DocumentTable";
import { sendDocumentsGetRequest } from '@/src/services/projectService';

const ProjectContent = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [chatQuery, setChatQuery] = useState<string | null>(null);

  const refreshDocuments = () => {
    sendDocumentsGetRequest('dipak')
      .then(data => setDocuments(data))
      .catch(error => console.error('Error fetching documents:', error));
  };

  useEffect(() => {
    refreshDocuments();
  }, []);

  const handleSendMessage = (query: string) => {
    console.log("Sending message:", query);
    setChatQuery(query);
  };

  if (chatQuery) {
    return <ChatInterface initialQuery={chatQuery} shouldSendMessage={true} />;
  }

  return (
    <>
      <ProjectHeader />
      <ChatInput onSendMessage={handleSendMessage} />
      <DocumentTable documents={documents} onUploadSuccess={refreshDocuments} />
    </>
  );
};

export default function ProjectInterface() {
  return (
    <ProjectContent />
  );
}
