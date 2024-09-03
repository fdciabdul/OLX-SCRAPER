import { buildHeaders } from "./utils/header";
import axios, { type AxiosResponse } from "axios";
import {CONFIG} from "./constant";
import { generateDeviceInfo } from "./utils/genDeviceInfo";
import cookieBuilder from "./utils/cookieBuilder";
import { load } from "cheerio";
import type {CategoryLink, CategoryResponse, LoginResponse, SearchCategoryResponse, SearchLocationResponse, UserDataResponse, } from "./interfaces";
class OLXClient {
  user: string;
  baseUrl: string;
  password: string;

  /**
   * Create an OLX client.
   * Author: fdciabdul
   * @param {string} email - The username for OLX.
   * @param {string} password - The password for OLX.
   */
  constructor(email: string, password: string) {
    this.user = email;
    this.password = password;
    this.baseUrl = CONFIG.BASE_URL;
  }

  /**
   * Log in to OLX.
   * Author: fdciabdul
   * @returns {Promise<LoginResponse>} A promise that resolves to the login response.
   * @throws {Error} Throws an error if login fails.
   */
  async loginOLX(): Promise<LoginResponse> {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseUrl}/api/auth/authenticate/login`,
        {
          grantType: "email",
          email: this.user,
          password: this.password,
          language: "id",
          metadata: { deviceInfo: generateDeviceInfo() },
        },
        {
          headers: buildHeaders(this.baseUrl),
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
        status: true,
        message: "Login Success",
        cookie: cookie,
      };
    } catch (error: any) {
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
   * @returns {Promise<UserDataResponse>} A promise that resolves to user data.
   * @throws {Error} Throws an error if fetching user data fails.
   */
  async getUserData(userId: any, cookie: any): Promise<UserDataResponse> {
    try {
      const response: AxiosResponse = await axios.get(
        `${this.baseUrl}/api/users/${userId}`,
        {
          headers: {
            Cookie: cookie,
            ...buildHeaders(this.baseUrl),
          },
        }
      );

      return { status: true, data: response.data };
    } catch (error: any) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  /**
   * Get categories from OLX.
   * Author: fdciabdul
   * @returns {Promise<CategoryResponse>} A promise that resolves to an array of category links.
   */
  async getCategory(): Promise<CategoryResponse> {
    try {
      const response: AxiosResponse = await axios.get(this.baseUrl);

      const $ = load(response.data);
      const links: CategoryLink[] = [];

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
    } catch (error: any) {
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
   * @param {number} [page=0] - The page number for pagination.
   * @returns {Promise<SearchCategoryResponse>} A promise that resolves to the search results.
   * @throws {Error} Throws an error if search fails.
   */
  async searchbyCategory(
    categoryId: number,
    locationId: number,
    page: number = 0
  ): Promise<SearchCategoryResponse> {
    const params = {
      category: categoryId,
      facet_limit: 100,
      location: locationId,
      location_facet_limit: 20,
      platform: "web-desktop",
      relaxedFilters: true,
      page,
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
    } catch (error: any) {
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
   * @returns {Promise<SearchLocationResponse>} A promise that resolves to location search results.
   * @throws {Error} Throws an error if location search fails.
   */
  async searchLocation(query: string): Promise<SearchLocationResponse> {
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
      } else {
        return {
          status: false,
          message: 'No data found',
        };
      }
    } catch (error: any) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
}

export default OLXClient;