import axios from 'axios'


class HttpRequest{
    constructor (baseURL = baseURL) {
        this.baseUrl = baseURL
    }

    interceptors(instance,url) {
        instance.interceptors.request.use(config=> {
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
        instance.interceptors.response.use(config=> {
            return config;
        });
    }

    getInsideConfig(){
        const config = {
            baseURL: this.baseURL,
            timeout: 1000,
            headers :{
                "Content-Type":"application/x-www-form-urlencoded",
            },
        }
        return config
    }

    request( options ){
        const instance = axios.create();
        options = Object.assign(this.getInsideConfig(),options)
        this.interceptors(instance,options.url)
        return instance(options)
    }
}

const request = new HttpRequest({baseURL:""});
export default request