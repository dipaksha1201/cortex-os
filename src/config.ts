import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();


// Backend API configuration
export const API_CONFIG_DOC_SERVICE = {
    BASE_URL: process.env.API_BASE_URL_DOC_SERVICE || 'https://cortex-doc-service-992105959996.us-east1.run.app/api',
    TIMEOUT: parseInt(process.env.API_TIMEOUT_DOC_SERVICE || '30000', 10),
};

export const API_CONFIG_CORTEX_SERVICE = {
    BASE_URL: process.env.API_BASE_URL_CORTEX_SERVICE || 'https://cortex-agent-service-992105959996.us-east1.run.app/api',
    TIMEOUT: parseInt(process.env.API_TIMEOUT_CORTEX_SERVICE || '30000', 10),
};

export const API_CONFIG_CHAT_WEBSOCKET = {
    BASE_URL: process.env.API_BASE_URL_CHAT_WEBSOCKET || 'ws://cortex-agent-service-992105959996.us-east1.run.app/api/chat/stream',
    TIMEOUT: parseInt(process.env.API_TIMEOUT_CHAT_WEBSOCKET || '30000', 10),
};
