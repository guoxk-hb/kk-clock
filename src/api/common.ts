import request from '@/common/request'

//高德接口
let gaodeBaseUrl = 'https://restapi.amap.com/v3'

export function getDistrictInfo(params) {
  let key = 'd4dd431d99386d63590abc59b4d5ab9c'
  let subdistrict = 3
  let output = 'JSON'
  let extensions = 'base'
  //行政区接口地址 https://lbs.amap.com/api/webservice/guide/api/district/
  request.get(`/config/district?key=${key}&subdistrict=${subdistrict}&extensions=${extensions}&output=${output}&page=${params.page}&offset=${params.offset}`, {
    baseURL: gaodeBaseUrl,//高德API
    timeout: 10000,// 30s
  })
}

export function getWeatherInfo(params) {
  let key = 'd4dd431d99386d63590abc59b4d5ab9c'
  let output = 'JSON'
  let extensions = 'base'
  request.get(`/weather/weatherInfo?parameters?key=${key}&city=${params.city}&extensions=${extensions}&output=${output}`, {
    baseURL: gaodeBaseUrl,//高德API
    timeout: 10000,// 10s
  })
}