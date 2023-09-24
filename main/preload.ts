const { contextBridge, ipcRenderer} = require('electron')
import { readTask } from "./nodeApi"
contextBridge.exposeInMainWorld('electronAPI', {
  readTask: async () => readTask(),
  writeTask:()=> ipcRenderer.invoke('readTask')
})