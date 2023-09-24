//生产环境的插件
import type { Plugin} from'vite'
import fs from 'node:fs'

import * as electronBuilder from "electron-builder"

import path from 'node:path'
//vite 打包配置
const buildElectron=()=>{
  require("esbuild").buildSync({
    entryPoints: ['main/index.ts','main/preload.ts','main/nodeApi.ts'],
    bundle:true,
    outdir:'dist/main',
    platform:'node',
    target:'node18',
    external:['electron']
  })
}
//对象中有很多钩子

//vite 插件要求 必须要导出一个对象 必须有name属性

//打包需要先等vite 打完包  electron再打包， 因为用的index.html文件
export const ElectronBuildPlugin=():Plugin=>{
  return {
    name:'electron-build',
    apply:'build',
    //vite || rollup 打包完成之后 触发的钩子
    closeBundle(){
     buildElectron()
     // 
   const json= JSON.parse(fs.readFileSync('package.json','utf-8'))
   //打包的时候 会以dist为一个 基准的目录
   json.main='main/index.js'
    fs.writeFileSync('dist/package.json',JSON.stringify(json,null,4))
    //bug electron-builder 他会下载垃圾文件
    fs.mkdirSync('dist/node_modules')
    electronBuilder.build({
      config:{
        directories:{
          output:path.resolve(process.cwd(),'release'),
          app:path.resolve(process.cwd(),'dist')
        },
        asar:true,
        appId:'com.example.app',//appid
        productName:'kk-clock',//包名
        nsis:{
          oneClick:false,//取消一键安装
          allowToChangeInstallationDirectory:true,//可以安装到其他磁盘，默认C盘
        }
      }
    })
  }
  }
}