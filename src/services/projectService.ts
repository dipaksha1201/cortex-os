import { API_CONFIG_DOC_SERVICE } from '../config'

export async function sendDocumentsGetRequest(user_id: string): Promise<any> {
    const url = new URL(`${API_CONFIG_DOC_SERVICE.BASE_URL}/documents/all`);
    url.searchParams.append('user_id', user_id);
    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error in GET request:', error);
        throw error;
    }
}

export async function sendDocumentDeleteRequest(user_id: string, document_id: string): Promise<any> {
    const url = new URL(`${API_CONFIG_DOC_SERVICE.BASE_URL}/document/${document_id}`);
    url.searchParams.append('user_id', user_id);
    try {
        const response = await fetch(url.toString(), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error in DELETE request:', error);
        throw error;
    }
}

export async function sendFilePostRequest(user_name: string, file: File): Promise<any> {
    // Create URL with query parameter 'user_name'
    const url = new URL(`${API_CONFIG_DOC_SERVICE.BASE_URL}/index`);
    url.searchParams.append('user_name', user_name);

    // Create FormData and append the file
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            body: formData,
            // Note: Do not set Content-Type header; browser will set it automatically.
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error in POST request:', error);
        throw error;
    }
}

export async function sendFileStreamingRequest(user_name: string, file: File, onProgress: (data: any) => void): Promise<void> {
    // Create URL with query parameter 'user_name'
    const url = new URL(`${API_CONFIG_DOC_SERVICE.BASE_URL}/index`);
    url.searchParams.append('user_name', user_name);

    // Create FormData and append the file
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            body: formData,
            // Note: Do not set Content-Type header; browser will set it automatically.
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the reader from the response body stream
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('Response body is null');
        }

        // Read the stream
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Decode the chunk and split by newlines (for ndjson)
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim());

            // Process each line as a JSON object
            for (const line of lines) {
                try {
                    const data = JSON.parse(line);
                    onProgress(data);
                } catch (e) {
                    console.error('Error parsing JSON:', e, line);
                }
            }
        }
    } catch (error) {
        console.error('Error in streaming POST request:', error);
        throw error;
    }
}