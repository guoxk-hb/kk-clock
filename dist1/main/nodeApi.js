var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main/nodeApi.ts
var nodeApi_exports = {};
__export(nodeApi_exports, {
  readRing: () => readRing,
  readSetting: () => readSetting,
  readTask: () => readTask,
  writeRing: () => writeRing,
  writeSetting: () => writeSetting,
  writeTask: () => writeTask
});
module.exports = __toCommonJS(nodeApi_exports);
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var taskPath = import_path.default.join(__dirname.replace("main", ""), "task.json");
function readTask() {
  const dataObj = new Promise((resolve, reject) => {
    import_fs.default.readFile(taskPath, "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
  return dataObj;
}
async function writeTask(task) {
  const dataObj = new Promise((resolve, reject) => {
    import_fs.default.writeFile(taskPath, JSON.stringify(task), "utf-8", (err) => {
      if (err) {
        reject(err);
      }
      resolve("\u5199\u5165\u6210\u529F");
    });
  });
  return dataObj;
}
var settingPath = import_path.default.join(__dirname.replace("main", ""), "setting.json");
async function writeSetting(form) {
  const dataObj = new Promise((resolve, reject) => {
    import_fs.default.writeFile(settingPath, JSON.stringify(form), "utf-8", (err) => {
      if (err) {
        reject(err);
      }
      resolve({
        status: 200,
        text: "\u5199\u5165\u6210\u529F"
      });
    });
  });
  return dataObj;
}
async function readSetting() {
  const dataObj = new Promise((resolve, reject) => {
    import_fs.default.readFile(settingPath, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
  return dataObj;
}
async function readRing() {
}
async function writeRing(ring) {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  readRing,
  readSetting,
  readTask,
  writeRing,
  writeSetting,
  writeTask
});
