import React from 'react';
import styles from './styles/DocumentsListCard.module.css';
import { FilePlus, FileText } from "lucide-react"

interface DocumentsListCardProps {
  documents: string[];
}

const DocumentsListCard: React.FC<DocumentsListCardProps> = ({ documents }) => {
  return (
    <div className={styles.documentsCard}>
      <div className={styles.showAllButton}>show all</div>
      <div className={styles.documentsList}>
        {documents.map((doc, index) => (
          <div key={index} className={styles.documentItem}>
            <div className={styles.iconContainer}>
              <FileText className={styles.icon} />
            </div>
            {doc}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsListCard;
