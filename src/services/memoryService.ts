import { API_CONFIG_CORTEX_SERVICE } from '../config'

export async function sendMemoriesGetRequest(user_id: string): Promise<any> {
    const url = new URL(`${API_CONFIG_CORTEX_SERVICE.BASE_URL}/get/memories/all`);
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