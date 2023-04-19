import request from '../utils/request';
let axios = request;

class ConfigApi {
    setConfig(tenant,group,dataId,content) {
        return axios.request({
            method: "post",
            url: '/nacos/v1/cs/configs',
            data: {
                tenant,
                group,
                dataId,
                content,
            }
        });
    }

    getConfig(tenant,group,dataId) {
        return axios.request({
            method: "get",
            url: '/nacos/v1/cs/configs',
            params: {
                tenant,
                group,
                dataId,
            }
        });
    }
}
const configApi = new ConfigApi();
export default configApi