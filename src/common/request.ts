import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

//class类写法
class Request {
  //axios 示例
  instance: AxiosInstance
  //基础信息配置
  baseConfig: AxiosRequestConfig = {
    timeout:10000,
  };
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    this.instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      //请求之前做些什么
      //比如某些页面需要判断登录 再请求头中添加什么东西
      return config
    }, error => {
      //请求错误抛出异常
      return Promise.reject(error);
    });
    this.instance.interceptors.response.use((response: AxiosResponse) => {
      //对响应回来的数据做一些处理
      return response
    }, error => {
      //请求错误抛出异常
      return Promise.reject(error);
    });
  }
  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }
  public get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.get(url, config);
  }
  public post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    {
      return this.instance.post(url, data, config);
    }
  }
}

export default new Request({})

//函数式写法
// const service = axios.create({
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     timeout: 10000,// 默认10s超时
//     withCredentials:false,//表示跨域请求时是否需要使用凭证
// });

// service.interceptors.request.use((config) => {
//   //请求之前做些什么
//   //比如某些页面需要判断登录 再请求头中添加什么东西
//   return config
// }, error => {
//     //请求错误抛出异常
//     return Promise.reject(error);
// });
// service.interceptors.response.use(response  => {
//   //对响应回来的数据做一些处理
//   return response
// }, error => {
//     //请求错误抛出异常
//     return Promise.reject(error);
// });
// export default service;