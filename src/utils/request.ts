import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import router from '@/route/router.js';

class HttpRequest {
  constructor() {}

  interceptors(instance: AxiosInstance, url: string | undefined) {
    instance.interceptors.request.use((config) => {
      /*
            if(config.method!=="get" && config.data != undefined){
                config.data = qs.stringify(config.data)
            }
            */
      /*
            if(config.method==="get" || config.method == undefined){
                config.paramsSerializer = (params)=> {return qs.stringify(params)}
            }
            */
      return config;
    });
    instance.interceptors.response.use((config) => {
      if (
        config.headers['No-Logig'] === '1' ||
        config.headers['no-login'] === '1'
      ) {
        router.push(
          '/p/login?redirect_url=' +
            encodeURIComponent(location.pathname + location.search)
        );
      }
      return config;
    });
  }

  getInsideConfig() {
    const config = {
      //baseURL: this.baseURL,
      timeout: 1000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    return config;
  }

  request(options: AxiosRequestConfig): Promise<AxiosResponse> {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}

const request = new HttpRequest();
export default request;
