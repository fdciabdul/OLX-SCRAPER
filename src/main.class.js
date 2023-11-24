const axios = require('axios');
const { BASE_URL ,PANAMERA_CLIENT} = require('./constant');
const { generateDeviceInfo } = require('./utils/genDeviceInfo');
const cookieBuilder = require('./utils/cookieBuilder');
const { load } = require('cheerio');
class OLXClient {
    constructor(username,password) {
        this.user = username;
        this.password = password;
        this.baseUrl = BASE_URL;
    }

    buildHeaders(referrer = this.baseUrl) {
        return {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,es-ES;q=0.8,es;q=0.7,id-ID;q=0.6,id;q=0.5,zh-CN;q=0.4,zh;q=0.3",
            "content-type": "application/json",
            "sec-ch-ua": "\"Chromium\";v=\"117\", \"Not;A=Brand\";v=\"8\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-panamera-client-id" : PANAMERA_CLIENT,
            "Referer": referrer,
            "Referrer-Policy": "no-referrer-when-downgrade"
        };
    }

    async loginOLX() {
        try {
            const response = await axios.post(`${this.baseUrl}/api/auth/authenticate/login`, {
                grantType: "email",
                email : this.user,
                password : this.password,
                language: "id",
                metadata: { deviceInfo: generateDeviceInfo() }
            }, {
                headers: this.buildHeaders()
            });
            const { accessToken, refreshToken, user, chatToken, notificationHubId } = response.data;
            const cookie = cookieBuilder(user,accessToken,refreshToken,chatToken,notificationHubId);
            return cookie;
        } catch (error) {
            throw new Error('Login Failed: ' + error.message);
        }
    }

    async getUserData(userId, cookie) {
        try {
            const response = await axios.get(`${this.baseUrl}/api/users/${userId}`, {
                headers: {
                    'Cookie': cookie,
                    ...this.buildHeaders()
                }
            });

            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch user data: ' + error.message);
        }
    }

    async getCategory(){
        const response = await axios.get(BASE_URL);
        
        const $ = load(response.data);
        const links = [];

          $('a').each((index, element) => {
            const href = $(element).attr('href');
            if (href && href.includes('_c')) {
                const idMatch = href.match(/_c(\d+)/);
                if (idMatch) {
                    const id = idMatch[1];
                    const text = $(element).text().trim();
                    links.push({ id, text });
                }
            }
        });

        return links;
    }
}



module.exports = {
    OLXClient
}