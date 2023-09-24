import fs from "fs"
import path from 'path'

export function readTask() {
  const filePath = path.join(__dirname.replace('main', ''), 'task.json')
  const dataObj = new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error(err)
        reject(err)
      }
      resolve(data)
    })
  })
  return dataObj
}
