//生产环境的插件
import type { Plugin } from 'vite'
import fs from 'node:fs'

import * as electronBuilder from "electron-builder"

import path from 'node:path'
//vite 打包配置
const buildElectron = () => {
  require("esbuild").buildSync({
    entryPoints: ['main/index.ts', 'main/preload.ts', 'main/nodeApi.ts', 'main/schedule.ts', 'main/windowSetting.ts'],
    bundle: true,
    outdir: 'dist/main',
    platform: 'node',
    target: 'node18',
    external: ['electron']
  })
}
//对象中有很多钩子

//vite 插件要求 必须要导出一个对象 必须有name属性

//打包需要先等vite 打完包  electron再打包， 因为用的index.html文件
export const ElectronBuildPlugin = (): Plugin => {
  return {
    name: 'electron-build',
    apply: 'build',
    //vite || rollup 打包完成之后 触发的钩子
    closeBundle() {
      buildElectron()
      // 
      const json = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
      //打包的时候 会以dist为一个 基准的目录
      json.main = 'main/index.js'
      fs.writeFileSync('dist/package.json', JSON.stringify(json, null, 4))
      //bug electron-builder 他会下载垃圾文件
      fs.mkdirSync('dist/node_modules')
      electronBuilder.build({
        config: {
          // files:[
          //   path.resolve(process.cwd(),'dist/public'),
          // ],
          directories: {
            output: path.resolve(process.cwd(), 'release'),
            app: path.resolve(process.cwd(), 'dist'),
          },
          asar: true,
          appId: 'com.kk-clock.app',//appid
          productName: 'kk-clock',//包名
          nsis: {
            oneClick: false,//取消一键安装
            // 是否开启安装时权限限制（此电脑或当前用户）
            perMachine: true,
            // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
            allowElevation: false,
            // 允许修改安装目录，建议为 true，是否允许用户改变安装目录，默认是不允许
            allowToChangeInstallationDirectory: true,
            // 卸载时删除用户数据
            deleteAppDataOnUninstall: true,
            // 安装图标
            // installerIcon: 'build/installerIcon_120.ico',
            // 卸载图标
            // uninstallerIcon: 'build/uninstallerIcon_120.ico',
            // 安装时头部图标
            // installerHeaderIcon: 'build/installerHeaderIcon_120.ico',
            // 创建桌面图标
            createDesktopShortcut: true,
            // 创建开始菜单图标
            createStartMenuShortcut: true
          },
          win: {
            icon: path.resolve(process.cwd(), 'public/logo.png'),
            artifactName: `kk-clock`
          },
          //检测自动更新用
          // publish:[
          //   {
          //     provider:'generic',
          //     url:'http://127.0.0.1:8080/release/'
          //   }
          // ]
        }
      })
    }
  }
}