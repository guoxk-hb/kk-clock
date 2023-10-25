<template>
  <!--设置-->
  <div>
    <el-form :model="setting" ref="settingform" :rules="rules" label-width="auto" :inline="false" size="small">
     <el-form-item label="当前铃声">
        <el-col :span="12" >
      <el-form-item >
        {{settingForm.ringName}}
      </el-form-item>
        </el-col>
        <el-col :span="12">
      <el-form-item >
         <el-upload v-model="settingForm.ringFileUrl">自定义铃声</el-upload>
      </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="自定义铃声片段">
        <el-col :span="2" >
        <el-form-item label="" size="normal">
          <span>00:00</span>
        </el-form-item>
        </el-col>
        <el-col :span="20">
        <el-form-item >
        <el-slider v-model="settingForm.ringVal" range></el-slider>
        </el-form-item>
        </el-col>
         <el-col :span="2">
        <el-form-item label="" size="normal">
          <span>00:00</span>
        </el-form-item>
         </el-col>
      </el-form-item>
      <el-form-item label="默认时钟样式">
          <el-radio  label="1">电子</el-radio>
          <el-radio  label="2">古典</el-radio>
      </el-form-item>
      <el-form-item label="退出">
          <el-radio label="1">最小化</el-radio>
          <el-radio label="2">退出进程</el-radio>
      </el-form-item>
      <el-form-item label="开机自启动">
          <el-switch  :active-value="true" :inactive-value="false">
          </el-switch>
      </el-form-item>
      <el-form-item  size="normal">
        <el-button type="primary" size="default">保存</el-button>
      </el-form-item>  
    </el-form>
    <el-alert title="修改设置后重启应用生效。" type="success" effect="dark" show-icon ></el-alert>
    
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
const settingForm = reactive({
  ringVal:[4,10],
  ringName:"day by day",
  ringFileUrl:"",
})
</script>

<style lang="scss" scoped>

</style>