import axios from 'axios'
import bus from '../assets/js/bus';
import router from '../router'

let apiHost = window.location.origin;
if(apiHost.indexOf('dev.ieasygo.cn') !== -1 || apiHost.indexOf('localhost:8080') !== -1){
    //开发环境
    apiHost = 'http://api.dev.ieasygo.cn';
} else if(apiHost.indexOf('store.ieasygo.cn') !== -1){
    //正式环境
    apiHost = 'https://api.store.ieasygo.cn';
}
axios.defaults.timeout = 6000;              // 响应时间
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';         //配置请求头
axios.defaults.baseURL = `${apiHost}/propertyapi/`;
axios.defaults.withCredentials = true;  //请求带上cookie
// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use(config => {
    //在发送请求之前做某事
    if (config.url !== '/api/v1/auth/login' && config.url !== '/api/v1/users/register' && config.url !== '/api/v2/auth/refresh') {
        
        let loginInfo = JSON.parse(window.localStorage.getItem('loginInfo'));
        config.headers['Authorization'] = loginInfo.token_type + ' ' + loginInfo.access_token;
        let loginTime = window.localStorage.getItem('loginTime');
        let outTime = Number(loginTime) + 1296000*1000;
        if(new Date().getTime() >= outTime || !loginInfo){
            //登录过期
            window.localStorage.clear();
            if (router.history.current.name != 'login') {
                bus.$emit('showMode', '登录状态变化，请重新登录', false);
                // return
            }
        }
    }
    return config
}, error => {
    //请求错误时做某事
	
    return Promise.reject(error)
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use(res => {
    //对响应数据做某事 
	if(res.data.code == 9001 || res.data.code == 9003 || res.data.code == 9004){
		window.localStorage.clear();
		bus.$emit('showMode', '登录状态变化，请重新登录', false)
	}
    return res.data
}, error => {
    //请求错误时做某事
    return Promise.reject(error.data)
});

export default axios;
