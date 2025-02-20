export async function sendDocumentsGetRequest(user_id: string): Promise<any> {
    const url = new URL('http://localhost:8000/doc/documents/all');
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

export async function sendFilePostRequest(user_name: string, file: File): Promise<any> {
    // Create URL with query parameter 'user_name'
    const url = new URL('http://localhost:8000/doc/index');
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