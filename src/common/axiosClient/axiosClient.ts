// axiosClient.ts
import axios, { AxiosInstance } from "axios";
import { MMKV } from 'react-native-mmkv';  // Ensure you have this imported correctly

// const BASEURL = "http://dev-myca.vopa.in/"                 //Dev URL
const BASEURL = "https://myca.vopa.in/";                      //Prod URL

const storage = new MMKV();

let axiosClient: AxiosInstance = axios.create({
  baseURL: BASEURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  async (config) => {
    const token = storage.getString('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export { axiosClient };
