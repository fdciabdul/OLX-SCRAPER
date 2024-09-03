import { CONFIG } from "../constant";

export function buildHeaders(referrer:string) {
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
      "x-panamera-client-id": CONFIG.PANAMERA_CLIENT,
      Referer: referrer,
      "Referrer-Policy": "no-referrer-when-downgrade",
    };
  }