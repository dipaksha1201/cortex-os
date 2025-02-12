import React, { useState } from "react";
import styles from "../styles/DocumentTable.module.css";
import AddDocumentsCard from './AddDocumentsCard';
import { sendFilePostRequest } from '../../services/projectService';

interface Document {
    id: string;
    name: string;
    type: string;
    summary: string;
    highlights: string[];
}

export default Document;

interface DocumentTableProps {
    documents: Document[];
}

export function DocumentTable({ documents }: DocumentTableProps) {

    const [loading, setLoading] = useState(false);

    const handleAddDocumentClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = "*/*";
        input.onchange = async (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const file = target.files[0];
                setLoading(true);
                try {
                    await sendFilePostRequest('dipak', file);
                } catch (error) {
                    console.error('File upload failed:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        input.click();
    };

    const columns = [
        { key: 'num', title: '#', dataIndex: '' },
        { key: 'name', title: 'Name', dataIndex: 'name' },
        { key: 'type', title: 'Type', dataIndex: 'type' },
        { key: 'summary', title: 'Summary', dataIndex: 'summary' },
        { key: 'highlights', title: 'Highlights', dataIndex: 'highlights' }
    ];

    return (
        <div className={styles.chatTable}>
            <div className={styles.documentTableHeader}>
                {loading ? (
                    <div>Uploading...</div>
                ) : (
                    <AddDocumentsCard onClick={handleAddDocumentClick} />
                )}
            </div>
            <div className={styles.chatTable__container}>
                <table className={styles.chatTable__table}>
                    <thead>
                        <tr className={styles.chatTable__thead}>
                            {columns.map((col) => (
                                <th key={col.key}>{col.title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={styles.chatTable__tbody}>
                        {documents.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                                {columns.map((col) => (
                                    <td key={col.key}>
                                        {col.key === 'num' ? rowIdx + 1 : row[col.dataIndex as keyof Document]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}