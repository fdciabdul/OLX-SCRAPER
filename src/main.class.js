const axios = require("axios");
const { BASE_URL, PANAMERA_CLIENT } = require("./constant");
const { generateDeviceInfo } = require("./utils/genDeviceInfo");
const cookieBuilder = require("./utils/cookieBuilder");
const { load } = require("cheerio");

class OLXClient {
  /**
   * Create an OLX client.
   * Author: fdciabdul
   * @param {string} email - The username for OLX.
   * @param {string} password - The password for OLX.
   */
  constructor(email, password) {
    this.user = email;
    this.password = password;
    this.baseUrl = BASE_URL;
  }

  /**
   * Build headers for HTTP requests.
   * Author: fdciabdul
   * @param {string} [referrer=this.baseUrl] - The referrer URL.
   * @returns {Object} The headers object.
   */
  buildHeaders(referrer = this.baseUrl) {
    return {
      accept: "*/*",
      "accept-language":
        "en-US,en;q=0.9,es-ES;q=0.8,es;q=0.7,id-ID;q=0.6,id;q=0.5,zh-CN;q=0.4,zh;q=0.3",
      "content-type": "application/json",
      "sec-ch-ua": '"Chromium";v="117", "Not;A=Brand";v="8"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-panamera-client-id": PANAMERA_CLIENT,
      Referer: referrer,
      "Referrer-Policy": "no-referrer-when-downgrade",
    };
  }

  /**
   * Log in to OLX.
   * Author: fdciabdul
   * @returns {Promise<Object>} A promise that resolves to the login response.
   * @throws {Error} Throws an error if login fails.
   */
  async loginOLX() {
    try {
      console.log(this.user, this.password);
      const response = await axios.post(
        `${this.baseUrl}/api/auth/authenticate/login`,
        {
          grantType: "email",
          email: this.user,
          password: this.password,
          language: "id",
          metadata: { deviceInfo: generateDeviceInfo() },
        },
        {
          headers: this.buildHeaders(),
        }
      );
      const { accessToken, refreshToken, user, chatToken, notificationHubId } =
        response.data;
      const cookie = cookieBuilder(
        user,
        accessToken,
        refreshToken,
        chatToken,
        notificationHubId
      );
      return {
        statu: true,
        message: "Login Success",
        cookie: cookie,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  /**
   * Fetch user data from OLX.
   * Author: fdciabdul
   * @param {string} userId - The user ID.
   * @param {string} cookie - The cookie obtained after login.
   * @returns {Promise<Object>} A promise that resolves to user data.
   * @throws {Error} Throws an error if fetching user data fails.
   */
  async getUserData(userId, cookie) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/users/${userId}`, {
        headers: {
          Cookie: cookie,
          ...this.buildHeaders(),
        },
      });

      return response.data;
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  /**
   * Get categories from OLX.
   * Author: fdciabdul
   * @returns {Promise<Array>} A promise that resolves to an array of category links.
   */
  async getCategory() {
    try {
      const response = await axios.get(this.baseUrl);

      const $ = load(response.data);
      const links = [];

      $("a").each((index, element) => {
        const href = $(element).attr("href");
        if (href && href.includes("_c")) {
          const idMatch = href.match(/_c(\d+)/);
          if (idMatch) {
            const id = idMatch[1];
            const text = $(element).text().trim();
            links.push({ id, text });
          }
        }
      });
      return {
        status: true,
        data: links,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  /**
   * Search for categories on OLX.
   * Author: fdciabdul
   * @param {number} categoryId - The ID of the category to search.
   * @param {number} locationId - The ID of the location to search in.
   * @returns {Promise<Object>} A promise that resolves to the search results.
   * @throws {Error} Throws an error if search fails.
   */
  async searchbyCategory(categoryId, locationId,page=0) {
    const params = {
      category: categoryId,
      facet_limit: 100,
      location: locationId,
      location_facet_limit: 20,
      platform: "web-desktop",
      relaxedFilters: true,
      page
    };

    try {
      const { data } = await axios.get(
        `${this.baseUrl}/api/relevance/v4/search`,
        { params }
      );
      return {
        status: true,
        data: data.data,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  /**
   * Search for locations on OLX.
   * Author: fdciabdul
   * @param {string} query - The search query for location.
   * @returns {Promise<Object>} A promise that resolves to location search results.
   * @throws {Error} Throws an error if location search fails.
   */
  async searchLocation(query) {
    const params = {
      input: query,
      limit: 5,
    };

    try {
      const { data } = await axios.get(
        `${this.baseUrl}/api/locations/autocomplete`,
        { params }
      );
      if (data) {
        return {
          status: true,
          location: data.data.suggestions,
        };
      }
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
}

module.exports = {
  OLXClient,
};
