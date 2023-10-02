const { contextBridge, ipcRenderer } = require('electron')
import { readTask, writeTask, readRing, writeRing } from "./nodeApi"
contextBridge.exposeInMainWorld('electronAPI', {
  readTask: () => readTask(),
  writeTask: (task) => writeTask(task),
  readRing: () => readRing(),
  writeRing: (ring) => writeRing(ring)
})