<template>
  <!--设置-->
  <div class="px-[5vw] py-[2vw]">
    <!--model 和 ref 不能命名相同-->
    <el-form :model="settingForm" ref="settingFormRef" label-width="auto" :inline="false">
      <el-form-item label="当前铃声">
        <el-col :span="12">
          <el-form-item>
            {{ settingForm.ringName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-upload v-model="settingForm.ringFileUrl">
              <el-button type="primary">自定义铃声</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  目前支持MP3、WAV、FLAC格式
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="自定义铃声片段">
        <el-col :span="2">
          <el-form-item label="">
            <span>00:00</span>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item>
            <el-slider v-model="settingForm.ringVal" range ></el-slider>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label="">
            <span>00:00</span>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="默认时钟样式">
        <el-radio-group v-model="settingForm.clockStyle"  >
        <el-radio v-for="item in clockStyleOptions" :key="item.value" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关闭主窗口">
        <el-radio-group v-model="settingForm.quit" >
        <el-radio  v-for="item in quitOptions" :key="item.value" :label="item.value">{{item.label}}</el-radio>
      </el-radio-group>
      </el-form-item>
      <el-form-item label="开机自启动">
        <el-switch v-model="settingForm.bootstrap" :active-value="true" :inactive-value="false">
        </el-switch>
      </el-form-item>
      <el-form-item label="定位设置">
        <el-col :span="6">
          <el-form-item label="国家:" label-width="60">
            <el-select v-model="settingForm.country" value-key="adcode" placeholder="请选择您所在的国家" clearable filterable @change="selectCountry">
              <el-option v-for="item in countryOptions" :key="item.adcode" :label="item.name" :value="item.adcode">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="省份:" label-width="60">
            <el-select v-model="settingForm.province" value-key="adcode" placeholder="请选择您的省份" clearable filterable @change="selectProvince">
              <el-option v-for="item in provinceOptions" :key="item.adcode" :label="item.name" :value="item.adcode">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="城市:" label-width="60">
            <el-select v-model="settingForm.city" value-key="adcode" placeholder="请选择您的城市" clearable filterable @change="selectCity">
              <el-option v-for="item in cityOptions" :key="item.adcode" :label="item.name" :value="item.adcode">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="区县:" label-width="60">
            <el-select v-model="settingForm.county" value-key="adcode" placeholder="请选择您的区县" clearable filterable>
              <el-option v-for="item in countyOptions" :key="item.adcode" :label="item.name" :value="item.adcode">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
    <el-alert title="修改设置后重启应用生效。" type="success" effect="dark" show-icon></el-alert>

  </div>
</template>
<script setup lang="ts">
import { ref,reactive,onUnmounted } from 'vue'
import { getDistrictInfo } from '@/api/common'
import  { quitOptions,clockStyleOptions} from '@/common/dict'
import type { AxiosResponse } from 'axios';
interface SettingForm{
  ringVal: Array<number>,
  ringName: string,
  ringFileUrl: string,
  clockStyle: number, // 1 电子 2 古典 3 粒子
  quit:number // 1 最小化 2 退出
  bootstrap:boolean //开机自启
  country: string,
  province: string,
  city: string,
  county: string,
}
let settingForm = ref<SettingForm>({
  ringVal: [4, 10],
  ringName: "day by day",
  ringFileUrl: "",
  clockStyle: 1,
  quit: 1,
  bootstrap:false,
  country:null,
  province: null,
  city: null,
  county: null,
})
//国 省 市 县
let countryOptions = ref<Array<District>>(null)
let provinceOptions =ref<Array<District>>(null)
let cityOptions = ref<Array<District>>(null)
let countyOptions = ref<Array<District>>(null)
interface District{
 citycode:Array<number>,
 adcode:string
 name:string
 center:string
 level:string
 districts?:Array<District>
}
interface DistrictInfo{
  status:number,
  info:string
  infocode:number
  suggestion:{
    keywords:string,
    cites:string,
  },
  districts?:Array<District>
}
getDistrictInfo({}).then(async (res:AxiosResponse<DistrictInfo>)=>{
  countryOptions.value = res.data.districts
  console.log(res.data,'res');
})
function selectCountry(adcode){
  provinceOptions.value =  countryOptions.value.find((item)=>item.adcode===settingForm.value.country).districts
}
function selectProvince(){
  cityOptions.value = provinceOptions.value.find((item)=>item.adcode===settingForm.value.province).districts
}
function selectCity(){
  countyOptions.value = cityOptions.value.find((item)=>item.adcode===settingForm.value.city).districts
}

//保存setting设置
function saveSetting(){
  window.electronAPI.writeSetting(toRaw(settingForm))
}
async function readSetting(){
   let res:SettingForm =await window.electronAPI.readSetting()
   settingForm.value = res
}
readSetting()
</script>

<style lang="scss" scoped></style>