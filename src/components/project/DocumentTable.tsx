import React, { useState, useMemo, useEffect } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import AddDocumentsCard from './AddDocumentsCard';
import { sendFileStreamingRequest, sendDocumentDeleteRequest } from '../../services/projectService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Document {
    id: string;
    name: string;
    type: string;
    summary: string;
    highlights: string[];
}

interface DocumentTableProps {
    documents: Document[];
    onUploadSuccess?: () => void;
}

export function DocumentTable({ documents, onUploadSuccess }: DocumentTableProps) {
    const [loading, setLoading] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isFullscreen]);

    const handleAddDocumentClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = "*/*";
        input.onchange = async (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const file = target.files[0];
                setLoading(true);
                setUploadStatus('Starting');
                setUploadMessage('Preparing to upload file...');
                setErrorMessage(null);
                try {
                    await sendFileStreamingRequest('dipak', file, (data) => {
                        console.log("Data:", data);
                        if (data.status) {
                            setUploadStatus(data.status);
                        }

                        if (data.message) {
                            setUploadMessage(data.message);
                        }

                        if (data.error) {
                            setErrorMessage(data.error);
                            setUploadStatus('Error');
                        }

                        if (data.status === 'Completed') {
                            console.log("Uploading success");
                            onUploadSuccess?.();
                        }
                    });
                } catch (error) {
                    console.error('File upload failed:', error);
                    setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
                    setUploadStatus('Error');
                } finally {
                    if (errorMessage) {
                        setTimeout(() => {
                            setLoading(false);
                            setUploadStatus(null);
                            setUploadMessage(null);
                            setErrorMessage(null);
                        }, 5000);
                    } else {
                        setLoading(false);
                        setUploadStatus(null);
                        setUploadMessage(null);
                    }
                }
            }
        };
        input.click();
    };

    const handleDelete = async (documentId: string) => {
        try {
            const userId = 'dipak'; // Replace with actual user ID
            console.log('Deleting document with id:', documentId);
            const response = await sendDocumentDeleteRequest(userId, documentId);

            onUploadSuccess?.();
            console.log('Delete successful:', response);
            // Optionally, update the UI or state to reflect the deletion
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const columns = useMemo<MRT_ColumnDef<Document>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                size: isFullscreen ? 250 : 200,
                Cell: ({ cell }) => (
                    <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                    }}>
                        {cell.getValue<string>()}
                    </div>
                ),
            },
            {
                accessorKey: 'document_type',
                header: 'Type',
                size: isFullscreen ? 200 : 150,
                Cell: ({ cell }) => (
                    <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '0.9rem',
                        fontWeight: 600
                    }}>
                        {cell.getValue<string>()}
                    </div>
                ),
            },
            {
                accessorKey: 'summary',
                header: 'Summary',
                size: isFullscreen ? 600 : 400,
                Cell: ({ cell }) => (
                    <div
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: '1.2em',
                            maxHeight: '11vh',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            cursor: 'pointer',
                            fontWeight: 'initial'
                        }}
                        onClick={() => setSelectedSummary(cell.getValue<string>())}
                    >
                        {cell.getValue<string>()}
                    </div>
                ),
            },
            {
                accessorKey: 'highlights',
                header: 'Highlights',
                size: isFullscreen ? 500 : 300,
                Cell: ({ cell }) => {
                    const highlights = cell.getValue<string[]>();
                    return (
                        <div
                            style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: '1.2em',
                                maxHeight: '11vh',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 600
                            }}
                            onClick={() => setSelectedSummary(
                                highlights?.map((highlight, index) =>
                                    `<p style="margin-bottom: 1.2em; font-size: 1rem; font-weight: 600;">${index + 1}. ${highlight}</p>`
                                ).join('')
                            )}
                        >
                            {highlights?.[0] || ''}
                        </div>
                    );
                },
            },
            {
                accessorKey: '_id',
                header: '',
                size: 100,
                Cell: ({ cell }) => (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                    }}>
                        <IconButton
                            aria-label="delete"
                            onClick={() => handleDelete(cell.getValue<string>())}
                            sx={{
                                border: '1px solid rgba(0, 0, 0, 0.23)',
                                borderRadius: '50%',
                                padding: '4px',
                                color: 'inherit',
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    color: 'red',
                                    borderColor: 'red',
                                }
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </div>
                ),
            },
        ],
        [isFullscreen],
    );

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                {loading ? (
                    <div style={{
                        padding: '20px',
                        textAlign: 'center',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                        background: errorMessage ? '#fff8f8' : '#f9f9f9',
                        borderColor: errorMessage ? '#ffdddd' : 'rgba(0, 0, 0, 0.1)'
                    }}>
                        {uploadStatus && (
                            <div style={{
                                marginBottom: '10px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: errorMessage ? '#d32f2f' : 'inherit'
                            }}>
                                {uploadStatus}
                            </div>
                        )}
                        {uploadMessage && (
                            <div style={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: errorMessage ? '#d32f2f' : '#4a4a4a',
                                padding: '10px',
                                animation: errorMessage ? 'none' : 'pulse 1.5s infinite'
                            }}>
                                {uploadMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div style={{
                                fontSize: '14px',
                                color: '#d32f2f',
                                padding: '10px',
                                marginTop: '10px',
                                background: '#ffeeee',
                                borderRadius: '4px',
                                border: '1px solid #ffcccc'
                            }}>
                                {errorMessage}
                            </div>
                        )}
                    </div>
                ) : (
                    <AddDocumentsCard onClick={handleAddDocumentClick} />
                )}
            </div>
            <MaterialReactTable
                columns={columns}
                data={documents}
                enableColumnResizing={false}
                enableColumnOrdering={false}
                enablePinning={false}
                enableRowVirtualization
                enableColumnActions={false}
                enableColumnFilters={false}
                enableSorting={false}
                enableTopToolbar={true}
                enableFullScreenToggle={true}
                enableGlobalFilter={false}
                enableDensityToggle={false}
                enableHiding={false}
                enableFilters={false}
                enableRowSelection={false}
                enableMultiRowSelection={false}
                enableSelectAll={false}
                onIsFullScreenChange={setIsFullscreen}
                renderTopToolbarCustomActions={() => null}
                muiTopToolbarProps={{
                    sx: {
                        backgroundColor: 'white',
                        position: 'sticky',
                        top: 0,
                        right: 0,
                        zIndex: 1,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        padding: '0px',
                        minHeight: '40px',
                        height: '40px',
                        marginRight: '8px',
                        '& .MuiButtonBase-root': {
                            padding: '8px',
                            minWidth: '32px',
                            height: '32px',
                            color: '#666',
                            backgroundColor: 'white',
                            marginTop: '4px',
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                                color: '#000'
                            }
                        }
                    }
                }}
                muiTableHeadProps={{
                    sx: {
                        '& tr': {
                            height: '32px'
                        },
                        position: 'sticky',
                        top: 0,
                        zIndex: 2,
                        backgroundColor: 'white'
                    }
                }}
                muiTableHeadCellProps={{
                    sx: {
                        padding: '0px 8px 8px 8px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        height: '32px',
                        backgroundColor: 'white',
                        borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
                        verticalAlign: 'top',
                        '&:first-of-type': {
                            paddingLeft: '24px'
                        }
                    }
                }}
                muiTableBodyRowProps={{
                    hover: false,
                    sx: {
                        height: '10vh',
                        backgroundColor: 'white'
                    }
                }}
                muiTableBodyCellProps={{
                    sx: {
                        padding: '8px',
                        paddingTop: '16px',
                        paddingBottom: '16px',
                        height: '10vh',
                        verticalAlign: 'top',
                        overflow: 'hidden',
                        '&:hover': {
                            backgroundColor: 'transparent !important'
                        },
                        '& > div': {
                            height: '100%',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            textOverflow: 'ellipsis'
                        },
                        '& .MuiTableCell-root': {
                            height: '10vh'
                        }
                    }
                }}
                muiTableContainerProps={{
                    sx: {
                        height: isFullscreen ? '100vh' : '55vh',
                        maxHeight: isFullscreen ? '100vh' : '55vh',
                        width: isFullscreen ? '100vw' : '80vw',
                        maxWidth: isFullscreen ? '100vw' : '80vw',
                        borderRadius: isFullscreen ? '0px' : '12px',
                        overflow: 'auto',
                        position: isFullscreen ? 'fixed' : 'relative',
                        top: isFullscreen ? 0 : 'auto',
                        left: isFullscreen ? 0 : 'auto',
                        zIndex: isFullscreen ? 9999 : 1,
                        padding: 0,
                        backgroundColor: 'white',
                        '&::-webkit-scrollbar': {
                            display: 'none'
                        },
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none'
                    }
                }}
                muiTablePaperProps={{
                    sx: {
                        borderRadius: isFullscreen ? '0px' : '12px',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        height: 'auto'
                    }
                }}
                initialState={{
                    density: 'compact',
                    columnVisibility: { id: false }
                }}
                enableBottomToolbar={false}
                enablePagination={false}
                muiTableProps={{
                    sx: {
                        '& .MuiTableRow-hover': {
                            backgroundColor: 'inherit !important'
                        }
                    }
                }}
            />
            <Dialog open={!!selectedSummary} onOpenChange={() => setSelectedSummary(null)}>
                <DialogContent style={{ width: '60vw', maxWidth: '60vw' }} className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Details</DialogTitle>
                    </DialogHeader>
                    <div
                        className="p-6"
                        dangerouslySetInnerHTML={{ __html: selectedSummary || '' }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}