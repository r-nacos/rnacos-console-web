import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import router from '@/route/router.js';
import { IApiResult } from '@/types/base';
import { getMessage as t } from '@/i18n';

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
      timeout: 15000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    return config;
  }

  getJsonInsideConfig() {
    const config = {
      //baseURL: this.baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
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

  requestJSON(options: AxiosRequestConfig): Promise<AxiosResponse> {
    const instance = axios.create();
    options = Object.assign(this.getJsonInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}

const request = new HttpRequest();
export default request;

export const handleApiResult = function <T>(
  response: AxiosResponse<IApiResult<T>>
): T | null {
  if (response.status == 200 && response.data.success) {
    return response.data.data;
  } else {
    let errorMsg;
    if (response.status == 200) {
      let errorCode = response.data.code;
      let errorCodeMsg = t('error.' + errorCode);
      if (errorCodeMsg !== '' && errorCode !== 'SYSTEM_ERROR') {
        errorMsg = errorCodeMsg;
      } else {
        errorMsg = t('error.SYSTEM_ERROR');
        if (response.data.message) {
          errorMsg += ' : ' + response.data.message;
        }
      }
    } else {
      errorMsg = 'request error,http code:' + response.status;
    }
    throw new Error(errorMsg);
  }
};

export const printApiSuccess = function () {
  if (window.$message) {
    window.$message.info(t('common.submitSuccess'));
  }
};

export const printApiError = function (err: any) {
  if (window.$message) {
    window.$message.error(err.message);
  } else {
    console.error(err.message);
  }
};
