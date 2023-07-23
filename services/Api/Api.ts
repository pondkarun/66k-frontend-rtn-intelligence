import axios from 'axios';
import { Cookies } from 'react-cookie'

const cookies = new Cookies();
export default axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVICE}`,
    headers: {
        'Content-Type': 'application/json',
        'x-key-rtn-ttt': `${process.env.NEXT_PUBLIC_KEY}`,
    },
    transformRequest: [function (data, headers) {
        const token = cookies.get('access_token');
        if (token) {
            headers.Authorization = "Bearer " + token;
        }
        return JSON.stringify(data);
    }],
});