import styles from "../styles/projectActions.module.css"
import { useRef } from "react"
import AddDocumentsCard from './AddDocumentsCard';
import DocumentsListCard from './DocumentsListCard';

export function ProjectActions() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCardClick = () => {
    console.log('Card clicked'); // Log when the card is clicked
    fileInputRef.current?.click();
  };

  // Add a change event handler for the file input
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed'); // Log when the file input changes
    const file = event.target.files?.[0];
    console.log('Selected file:', file); // Log the selected file
    console.log('File name:', file?.name); // Log file name
    console.log('File size:', file?.size); // Log file size
    console.log('File type:', file?.type); // Log file type

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log('Server response:', data); // Log server response
        console.log('Server response status:', response.status); // Log server response status
        console.log('Server response headers:', response.headers); // Log server response headers
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.warn('No file selected'); // Log if no file is selected
    }
  };

  const documents = [
    'Document 1.pdf',
    'Document 2.pdf',
    'Document 3.pdf'
  ];

  return (
    <div className={styles.actionsContainer}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="*/*"
      />
      <AddDocumentsCard onClick={handleCardClick} />
      <DocumentsListCard documents={documents} />
    </div>
  )
}
