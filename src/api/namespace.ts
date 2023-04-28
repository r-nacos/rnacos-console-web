import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { INamespace } from '@/types/namespace';
let axios = request;

class NamespaceApi {
    queryList() : Promise<AxiosResponse> {
        return axios.request({
            method: "get",
            url: '/nacos/v1/console/namespaces',
        });
    }
    add(namespace:INamespace) : Promise<AxiosResponse> {
        return axios.request({
            method: "post",
            url: '/nacos/v1/console/namespaces',
            data:{
                ...namespace
            }
        });
    }
    update(namespace:INamespace) : Promise<AxiosResponse>  {
        return axios.request({
            method: "put",
            url: '/nacos/v1/console/namespaces',
            data:{
                ...namespace
            }
        });
    }
    delete(namespace:INamespace) : Promise<AxiosResponse> {
        return axios.request({
            method: "delete",
            url: '/nacos/v1/console/namespaces',
            data:{
                namespaceId:namespace.namespaceId,
            }
        });
    }
}
const namespaceApi = new NamespaceApi();
export default namespaceApi
