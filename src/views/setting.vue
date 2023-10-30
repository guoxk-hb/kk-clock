<template>
  <!--设置-->
  <div class="px-[5vw] py-[2vw]">
    <el-form :model="settingForm" ref="settingForm" label-width="auto" :inline="false" size="small">
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
            <el-slider v-model="settingForm.ringVal" range></el-slider>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label="">
            <span>00:00</span>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="默认时钟样式">
        <el-radio v-model="settingForm.clockStyle" label="1">电子</el-radio>
        <el-radio label="2">古典</el-radio>
      </el-form-item>
      <el-form-item label="退出">
        <el-radio label="1">最小化</el-radio>
        <el-radio label="2">退出进程</el-radio>
      </el-form-item>
      <el-form-item label="开机自启动">
        <el-switch :active-value="true" :inactive-value="false">
        </el-switch>
      </el-form-item>
      <el-form-item label="位置">
        <el-col :span="6">
          <el-form-item label="省份">
            <el-select v-model="settingForm.province" value-key="" placeholder="请选择您的省份" clearable filterable @change="">
              <!-- <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option> -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="城市">
            <el-select v-model="settingForm.city" value-key="" placeholder="请选择您的城市" clearable filterable @change="">
              <!-- <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option> -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="区县">
            <el-select v-model="settingForm.county" value-key="" placeholder="请选择您的区县" clearable filterable @change="">
              <!-- <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option> -->
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
    <el-alert title="修改设置后重启应用生效。" type="success" effect="dark" show-icon></el-alert>

  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { getDistrictInfo } from '@/api/common'
const settingForm = reactive({
  ringVal: [4, 10],
  ringName: "day by day",
  ringFileUrl: "",
  province: "",
  city: "",
  county: "",
  clockStyle: "",
})
// let res = await getDistrictInfo({})
// console.log(res,'行政区res');
</script>

<style lang="scss" scoped></style>