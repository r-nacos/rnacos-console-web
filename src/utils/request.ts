import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

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
      return config;
    });
  }

  getInsideConfig() {
    const config = {
      //baseURL: this.baseURL,
      timeout: 1000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
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
