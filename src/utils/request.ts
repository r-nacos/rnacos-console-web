import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
class HttpRequest {
  router: any
  constructor() {}

  interceptors(instance: AxiosInstance, url: string | undefined) {
    instance.interceptors.request.use(config => {
      return config
    })
    instance.interceptors.response.use(config => {
      const basePath = import.meta.env.VITE_APP_WEB_ROOT_PATH
      if (config.headers['No-Logig'] === '1' || config.headers['no-login'] === '1') {
        let url = basePath !== '/' ? `${basePath}/login` : '/login'
        url += '?redirect_url=' + encodeURIComponent(location.pathname + location.search)
        location.href = url
        // router.push('/p/login?redirect_url=' + encodeURIComponent(location.pathname + location.search))
      }
      return config
    })
  }

  getInsideConfig() {
    const config = {
      //baseURL: this.baseURL,
      timeout: 1000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    return config
  }

  getJsonInsideConfig() {
    const config = {
      //baseURL: this.baseURL,
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return config;
  }

  request(options: AxiosRequestConfig): Promise<AxiosResponse> {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }

  requestJSON(options: AxiosRequestConfig): Promise<AxiosResponse> {
    const instance = axios.create();
    options = Object.assign(this.getJsonInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}

export default new HttpRequest()
