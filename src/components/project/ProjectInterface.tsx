import { useEffect, useState } from "react";
import { ProjectHeader } from "./ProjectHeader";
import { DocumentTable } from "./DocumentTable";
import { sendDocumentsGetRequest } from '@/src/services/projectService';
import StreamingChatInterface from "../chat/StreamingChatInterface";

const ProjectContent = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [chatQuery, setChatQuery] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const refreshDocuments = () => {
    console.log("Refreshing documents");
    sendDocumentsGetRequest('dipak')
      .then(data => setDocuments(data))
      .catch(error => console.error('Error fetching documents:', error));
  };

  useEffect(() => {
    refreshDocuments();
  }, []);

  if (chatQuery) {
    return <StreamingChatInterface initialQuery={chatQuery} shouldSendMessage={true} />;
  }

  return (
    <>
      <ProjectHeader />
      <DocumentTable documents={documents} onUploadSuccess={refreshDocuments} />
    </>
  );
};

export default function ProjectInterface() {
  return (
    <ProjectContent />
  );
}
