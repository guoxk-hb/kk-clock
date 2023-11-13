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

// main/windowSetting.ts
var windowSetting_exports = {};
__export(windowSetting_exports, {
  clockOptions: () => clockOptions,
  createWindow: () => createWindow,
  openNewWindow: () => openNewWindow,
  windowContextMenu: () => windowContextMenu,
  windowMovement: () => windowMovement,
  windowTray: () => windowTray
});
module.exports = __toCommonJS(windowSetting_exports);
var import_electron = require("electron");
var import_path = __toESM(require("path"));
var clockOptions = {
  id: "clock",
  // width: 900,
  // height: 400,
  // minWidth: 600,
  // minHeight: 400,
  // maxWidth: Infinity,
  // maxHeight: Infinity,
  width: 400,
  height: 275,
  minWidth: 200,
  minHeight: 138,
  maxWidth: 400,
  maxHeight: 275,
  transparent: true,
  frame: false,
  title: "\u65F6\u949F",
  alwaysOnTop: true,
  // devTool: true,
  aspectRatioSwtich: true,
  aspectRatio: 1.45
  /**
   * 日期和闹钟文字同时显示比例
   */
  // width: 400,
  // height: 320,
  // minWidth: 200,
  // minHeight: 160,
  // maxWidth: 400,
  // maxHeight: 320,
  // aspectRatio: 1.31,
  /**
   * 日期和闹钟文字都不显示的比例
   */
  // width: 400,
  // height: 107,
  // minWidth: 75,
  // minHeight: 20,
  // maxWidth: 400,
  // maxHeight: 107,
  // aspectRatio: 3.75,
  /**
   * 日期文字显示
   */
  // width: 400,
  // height: 229,
  // minWidth: 150,
  // minHeight: 86,
  // maxWidth: 400,
  // maxHeight: 229,
  // aspectRatio: 1.75,
  /**
   * 闹钟文字显示
   */
  // width: 400,
  // height: 178,
  // minWidth: 150,
  // minHeight: 66,
  // maxWidth: 400,
  // maxHeight: 178,
  // aspectRatio: 2.25,
};
var notepadOptions = {
  id: "notepad",
  width: 900,
  height: 400,
  minWidth: 600,
  minHeight: 400,
  maxWidth: Infinity,
  maxHeight: Infinity,
  transparent: false,
  frame: true,
  title: "\u95F9\u949F",
  url: "/notepad"
};
var settingOptions = {
  id: "setting",
  width: 900,
  height: 400,
  minWidth: 600,
  minHeight: 400,
  maxWidth: Infinity,
  maxHeight: Infinity,
  transparent: false,
  frame: true,
  title: "\u65F6\u949F\u8BBE\u7F6E",
  url: "/setting"
  // devTool: true,
};
var BrowserWindowsMap = /* @__PURE__ */ new Map();
function createWindow(windowOptions) {
  if (BrowserWindowsMap.get(windowOptions.id)) {
    return false;
  }
  let win = new import_electron.BrowserWindow({
    width: windowOptions.width || 1e3,
    height: windowOptions.height || 800,
    minWidth: windowOptions.minWidth || 0,
    minHeight: windowOptions.minWidth || 0,
    maxWidth: windowOptions.maxWidth || Infinity,
    maxHeight: windowOptions.maxHeight || Infinity,
    transparent: windowOptions.transparent || false,
    frame: windowOptions.frame || false,
    title: windowOptions.title,
    alwaysOnTop: windowOptions.alwaysOnTop || false,
    autoHideMenuBar: true,
    hasShadow: true,
    icon: import_path.default.join(__dirname.replace("main", ""), "logo.png"),
    webPreferences: {
      preload: import_path.default.join(__dirname, "preload.js"),
      nodeIntegration: true,
      //渲染进程 可以调用nodeAPI
      // contextIsolation: false, //隔离沙箱，防止恶意注入木马
      webSecurity: false,
      //关闭同源策略
      contextIsolation: true,
      sandbox: false
    }
  });
  BrowserWindowsMap.set(windowOptions.id, win);
  if (windowOptions.devTool) {
    win.webContents.openDevTools();
  }
  if (windowOptions.aspectRatioSwtich) {
    win.setAspectRatio(windowOptions.aspectRatio || 1.36);
  }
  win.setMenu(null);
  windowMovement(win, windowOptions.id);
  if (windowOptions.id === "clock") {
    windowTray(win);
  }
  win.webContents.on("context-menu", (e, params) => {
    if (win) {
      windowContextMenu(win);
    }
  });
  win.on("resize", async () => {
    win?.webContents.send("resize");
  });
  win.on("resized", async () => {
    win?.webContents.send("resize");
  });
  win.on("closed", () => {
    if (win) {
      BrowserWindowsMap.set(windowOptions.id, null);
      import_electron.ipcMain.removeAllListeners(`window-move-open-${windowOptions.id}`);
      win = null;
    }
  });
  if (process.argv[2]) {
    if (windowOptions.url) {
      win.loadURL(process.argv[2] + `${windowOptions.url}`);
    } else {
      win.loadURL(process.argv[2]);
    }
  } else {
    win.loadFile("index.html");
  }
  return win;
}
function windowMovement(win, id) {
  let winStartPosition = { x: 0, y: 0 };
  let mouseStartPosition = { x: 0, y: 0 };
  let movingInterval;
  import_electron.ipcMain.on(`window-move-open-${id}`, (events, canMoving) => {
    if (!win.isDestroyed()) {
      const currentWindowSize = win.getSize();
      const currentWindow = import_electron.BrowserWindow.getFocusedWindow();
      if (currentWindow === win) {
        if (canMoving) {
          const winPosition = win.getPosition();
          winStartPosition = { x: winPosition[0], y: winPosition[1] };
          mouseStartPosition = import_electron.screen.getCursorScreenPoint();
          if (movingInterval) {
            clearInterval(movingInterval);
          }
          movingInterval = setInterval(() => {
            if (!currentWindow.isDestroyed()) {
              if (!currentWindow.isFocused()) {
                clearInterval(movingInterval);
                movingInterval = null;
              }
              const cursorPosition = import_electron.screen.getCursorScreenPoint();
              const x = winStartPosition.x + cursorPosition.x - mouseStartPosition.x;
              const y = winStartPosition.y + cursorPosition.y - mouseStartPosition.y;
              win.setBounds({ x, y, width: currentWindowSize[0], height: currentWindowSize[1] });
            }
          }, 10);
        } else {
          clearInterval(movingInterval);
          movingInterval = null;
        }
      }
    }
  });
}
function windowMenu(win) {
  const template = [
    // accelerator 快捷键
    {
      id: "1",
      label: "\u65F6\u949F",
      type: "normal",
      commandId: 1,
      click: (e) => {
        createWindow(clockOptions);
      }
    },
    {
      id: "2",
      label: "\u95F9\u949F",
      type: "normal",
      commandId: 2,
      click(e) {
        createWindow(notepadOptions);
      }
    },
    {
      id: "3",
      label: "\u65E5\u671F",
      type: "normal",
      commandId: 3,
      click: (e) => {
        win.webContents.send("show-context-command", "\u65E5\u671F");
      }
    },
    {
      id: "4",
      label: "\u8BBE\u7F6E",
      type: "normal",
      commandId: 4,
      click: (e) => {
        createWindow(settingOptions);
      }
    },
    {
      id: "5",
      label: "\u6700\u5C0F\u5316",
      type: "normal",
      role: "minimize",
      commandId: 5,
      click: (e) => {
      }
    },
    {
      id: "6",
      label: "\u9000\u51FA",
      type: "checkbox",
      commandId: 6,
      click: (e) => {
        win.close();
      }
    }
  ];
  const contextMenu = import_electron.Menu.buildFromTemplate(template);
  return contextMenu;
}
function windowContextMenu(win) {
  const contextMenu = windowMenu(win);
  contextMenu.popup();
}
function windowTray(win) {
  const tray = new import_electron.Tray(import_path.default.join(__dirname.replace("main", ""), "logo.png"));
  const contextMenu = windowMenu(win);
  tray.setToolTip("clock\u65F6\u949F");
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });
}
function openNewWindow(win) {
}
import_electron.ipcMain.on("close-win-setting", (event, message) => {
  let win = BrowserWindowsMap.get("setting");
  win?.destroy();
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  clockOptions,
  createWindow,
  openNewWindow,
  windowContextMenu,
  windowMovement,
  windowTray
});
