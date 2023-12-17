import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { IApiResult, IPageResult, WebResource } from '@/types/base';
let axios = request;

export interface ILoginParam {
  username: string;
  password: string;
  captcha: string;
}

export interface IResetPasswordParam {
  oldPassword: string;
  newPassword: string;
}

export interface IUserPageParam {
  like_username?: string;
  pageNo: Number;
  pageSize: Number;
  isRev: boolean;
}

export interface IUserInfo {
  username: string;
  nickname: string;
  password?: string;
  gmtCreate: number;
  gmtModified: number;
  enable: boolean;
  roles: Array<String>;
  extendInfo?: Map<String, String>;
}

export interface IUpdateUserParam {
  username: string;
  nickname?: string;
  password?: string;
  enable?: boolean;
  roles?: string;
}

class UserApi {
  login(info: ILoginParam): Promise<AxiosResponse<IApiResult<boolean>>> {
    return axios.request({
      method: 'post',
      url: '/nacos/v1/console/login/login',
      data: info
    });
  }
  genCaptcha(): Promise<AxiosResponse<IApiResult<string>>> {
    return axios.request({
      method: 'get',
      url: '/nacos/v1/console/login/captcha'
    });
  }
  logout(): Promise<AxiosResponse<IApiResult<boolean>>> {
    return axios.request({
      method: 'post',
      url: '/nacos/v1/console/login/logout'
    });
  }
  resetPassword(
    info: IResetPasswordParam
  ): Promise<AxiosResponse<IApiResult<boolean>>> {
    return axios.request({
      method: 'post',
      url: '/nacos/v1/console/user/reset_password',
      data: info
    });
  }
  getUserList(
    param: IUserPageParam
  ): Promise<AxiosResponse<IApiResult<IPageResult<IUserInfo>>>> {
    return axios.request({
      method: 'get',
      url: '/nacos/v1/console/user/list',
      params: {
        ...param
      }
    });
  }
  getUserWebResources(): Promise<AxiosResponse<IApiResult<WebResource>>> {
    return axios.request({
      method: 'get',
      url: '/nacos/v1/console/user/web_resources',
      params: {}
    });
  }
  addUser(info: IUpdateUserParam): Promise<AxiosResponse<IApiResult<boolean>>> {
    return axios.request({
      method: 'post',
      url: '/nacos/v1/console/user/add',
      data: info
    });
  }
  updateUser(
    info: IUpdateUserParam
  ): Promise<AxiosResponse<IApiResult<boolean>>> {
    return axios.request({
      method: 'post',
      url: '/nacos/v1/console/user/update',
      data: info
    });
  }
  removeUser(
    info: IUpdateUserParam
  ): Promise<AxiosResponse<IApiResult<boolean>>> {
    return axios.request({
      method: 'post',
      url: '/nacos/v1/console/user/remove',
      data: info
    });
  }
}

export const userApi = new UserApi();
