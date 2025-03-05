import React from 'react';
import { FilePlus } from 'lucide-react';

interface AddDocumentsCardProps {
  onClick: () => void;
}

const AddDocumentsCard: React.FC<AddDocumentsCardProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        marginBottom: '10px',
        padding: '8px 16px',
        background: '#4a4a4a',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: 'bold'
      }}
    >
      <FilePlus size={18} />
      Add Documents
    </button>
  );
};

export default AddDocumentsCard;
