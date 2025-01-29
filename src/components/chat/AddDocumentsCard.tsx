import React from 'react';
import { Card } from '@/components/ui/card';
import styles from './styles/AddDocumentsCard.module.css';
import { FilePlus } from 'lucide-react';

interface AddDocumentsCardProps {
  onClick: () => void;
}

const AddDocumentsCard: React.FC<AddDocumentsCardProps> = ({ onClick }) => {
  return (
    <Card className={styles.actionCard} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.actionContent}>
        <div className={styles.actionInfo}>
          <h2 className={styles.actionTitle}>Add files</h2>
          <p className={styles.actionDescription}>Chats in this project can access file content</p>
        </div>
        <div className={styles.iconWrapper}>
          <FilePlus className={styles.refreshIcon} />
        </div>
      </div>
    </Card>
  );
};

export default AddDocumentsCard;
