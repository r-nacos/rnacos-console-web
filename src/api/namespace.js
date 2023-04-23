import request from '../utils/request';
let axios = request;

class NamespaceApi {
    queryList() {
        return axios.request({
            method: "get",
            url: '/nacos/v1/console/namespaces',
        });
    }
    add({
        namespaceId,
        namespaceName,
    }) {
        return axios.request({
            method: "post",
            url: '/nacos/v1/console/namespaces',
            data:{
                namespaceId,
                namespaceName,
            }
        });
    }
    update({
        namespaceId,
        namespaceName,
    }) {
        return axios.request({
            method: "put",
            url: '/nacos/v1/console/namespaces',
            data:{
                namespaceId,
                namespaceName,
            }
        });
    }
    delete({
        namespaceId,
    }) {
        return axios.request({
            method: "delete",
            url: '/nacos/v1/console/namespaces',
            data:{
                namespaceId,
            }
        });
    }
}
const namespaceApi = new NamespaceApi();
export default namespaceApi