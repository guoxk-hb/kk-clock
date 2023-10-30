//开发环境的插件
import type { Plugin } from 'vite'
import type { AddressInfo } from 'net'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'

import fs from 'node:fs'
//vite 插件要求 必须要导出一个对象 必须有name属性
//对象中有很多钩子

//electron 不认识ts文件 编译成js文件

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

const stdoutOn = (ElectronProcess: ChildProcessWithoutNullStreams) => {
  ElectronProcess.stdout?.on('data', (data) => {
    console.log(`更新日志`, `${data}`);
  })
}

const stdoutOff = (ElectronProcess: ChildProcessWithoutNullStreams) => {
  ElectronProcess.stdout?.off('data', () => {
    console.log('停止了监听');
  })
}
export const ElectronDevPlugin = (): Plugin => {
  return {
    name: 'electron-dev',
    //用于配置开发服务的钩子
    configureServer(server) {
      buildElectron()
      let ElectronProcess: ChildProcessWithoutNullStreams
      server.httpServer?.once('listening', () => {
        //读取vite 服务信息，ip、ip协议类型、端口号
        const addressInfo = server.httpServer?.address() as AddressInfo
        const IP = `http://localhost:${addressInfo.port}`
        //第一个参数是electron shell 命令，运行elcetron
        ElectronProcess = spawn(require("electron"), ['dist/main/index.js', IP])
        fs.readdir('main', (err, files) => {
          if (err) {
            console.error(`Error reading directory: ${err}`);
            return;
          }
          files.forEach(file => {
            fs.watchFile(`main/${file}`, () => {
              ElectronProcess.kill()
              buildElectron()
              stdoutOff(ElectronProcess)
              //electorn 启动命令
              ElectronProcess = spawn(require("electron"), ['dist/main/index.js', IP])
              stdoutOn(ElectronProcess)
            })
          });
        })
        //监听Electron进程的log
        stdoutOn(ElectronProcess)
      })
      //关闭服务的时候 杀死electron进程
      server.httpServer?.once('close', () => {
        ElectronProcess.kill()
        console.log("结束了服务")
      })
    }
  }
}