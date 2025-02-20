import React, { useState, useMemo, useEffect } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import AddDocumentsCard from './AddDocumentsCard';
import { sendFilePostRequest } from '../../services/projectService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
                try {
                    const response = await sendFilePostRequest('dipak', file);
                    if (response.status === 200) {
                        onUploadSuccess?.();
                    }
                } catch (error) {
                    console.error('File upload failed:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        input.click();
    };

    const columns = useMemo<MRT_ColumnDef<Document>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                size: isFullscreen ? 250 : 150,
                Cell: ({ cell }) => (
                    <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        paddingLeft: '16px'
                    }}>
                        {cell.getValue<string>()}
                    </div>
                ),
            },
            {
                accessorKey: 'type',
                header: 'Type',
                size: isFullscreen ? 200 : 100,
                Cell: ({ cell }) => (
                    <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
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
        ],
        [isFullscreen],
    );

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                {loading ? (
                    <div>Uploading...</div>
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