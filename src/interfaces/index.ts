export interface LoginResponse {
    status: boolean;
    message: string;
    cookie?: string;
  }
  
export interface UserDataResponse {
    status: boolean;
    message?: string;
    data?: any;
  }
  
export  interface CategoryLink {
    id: string;
    text: string;
  }
  
export  interface CategoryResponse {
    status: boolean;
    data?: CategoryLink[];
    message?: string;
  }
  
export  interface SearchCategoryResponse {
    status: boolean;
    data?: any;
    message?: string;
  }
  
export  interface SearchLocationResponse {
    status: boolean;
    location?: any;
    message?: string;
  }

  export interface loginDetails {
    cityName: string;
    state: string;
    location: any;
  }