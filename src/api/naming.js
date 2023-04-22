import request from '../utils/request';
let axios = request;

class NamingApi {
    queryServicePage({
        namespaceId,
        serviceNameParam,
        groupNameParam,
        pageNo,
        pageSize,
        accessToken,
    }) {
        return axios.request({
            method: "get",
            url: '/nacos/v1/ns/catalog/services',
            params: {
                namespaceId,
                serviceNameParam,
                groupNameParam,
                pageNo,
                pageSize,
                accessToken,
            }
        });
    }
}
const namingApi = new NamingApi();
export default namingApi