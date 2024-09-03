import axios from 'axios';
import {CONFIG} from '../constant';

export async function getState() {
    try {
        const response = await axios.get(CONFIG.BASE_URL);
        const regex = CONFIG.REGEX_CATEGORY;

        const match = response.data.match(regex);
        let state;
        if (match) {
             state=  {
                state: match[1],
                city: match[4],
                latitude: parseFloat(match[2]),
                longitude: parseFloat(match[3])
            };

        }
        return state;
    } catch (error) {
        console.error('Error fetching or parsing URL:', error);
        return [];
    }
}
