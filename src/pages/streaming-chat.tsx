import React from 'react';
import StreamingChat from '../components/chat/StreamingChat';
import { useRouter } from 'next/router';

const StreamingChatPage: React.FC = () => {
    const router = useRouter();
    const { query } = router.query;

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <header style={{
                padding: '16px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f5f5f5'
            }}>
                <h1 style={{ margin: 0, fontSize: '24px' }}>Cortex Chat</h1>
            </header>

            <main style={{ flex: 1, overflow: 'hidden' }}>
                <StreamingChat
                    userId="dipak"
                    initialQuery={typeof query === 'string' ? query : undefined}
                />
            </main>
        </div>
    );
};

export default StreamingChatPage; 