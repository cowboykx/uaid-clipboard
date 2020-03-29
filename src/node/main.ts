import { app, BrowserWindow, Menu, Tray, globalShortcut, ipcMain, MenuItem, MenuItemConstructorOptions } from 'electron';
import path from 'path';
import clipboardWatcher from 'electron-clipboard-watcher';
import { menubar } from 'menubar';
import { store, recordStatus } from './store';
import { dbCrud } from './storage';

const rootPath = path.join(__dirname, '..', '..');

let mainWindow: BrowserWindow = null;
let tray = null;
let appVisible = false;

function activeRecord() {
  recordStatus.activeRecord();
  tray.setImage(path.join(rootPath, 'icon/icon-active.png'));
}

function inActiveRecord() {
  recordStatus.inActiveRecord();
  tray.setImage(path.join(rootPath, 'icon/icon-disactive.png'));
}

function toggleRecord() {
  if (recordStatus.active === false) {
    activeRecord();
  } else {
    inActiveRecord();
  }
  updateMenu();
}

function watchClipboard() {
  clipboardWatcher({
    watchDelay: 1000,
    onImageChange: function (nativeImage) {
      // todo
    },

    onTextChange: function (text) {
      if (recordStatus.active) {
        mainWindow.webContents.send('msg', { data: text });
      }
    }
  })
}

app.on('browser-window-blur', () => {
  appVisible = false;
});

app.on('browser-window-focus', () => {
  appVisible = true;
});

async function rebindShortcuts() {
  const mainShortcuts = await dbCrud({name: 'setting', action: 'findOne', query: { name: 'mainshortcuts' }});
  const recorderShortcuts = await dbCrud({name: 'setting', action: 'findOne', query: { name: 'recordershortcuts' }});

  globalShortcut.unregisterAll();

  if (mainShortcuts.enable) {
    globalShortcut.register(mainShortcuts.value, () => {
      if (appVisible) {
        app.hide();
        mainWindow.hide();
      } else {
        app.show();
        mainWindow.show();
      }
    });
  }

  if (recorderShortcuts.enable) {
    globalShortcut.register(recorderShortcuts.value, () => {
      toggleRecord();
    });
  }
}

ipcMain.on('categorychange', (e, list) => {
  store.setList(list);
  if (list.length > 0) {
    updateMenu();
  }
});

ipcMain.on('categoryselectchange', (e, id) => {
  store.setSelectedListId(id);
  updateMenu();
});

ipcMain.on('rebindshortcuts', rebindShortcuts);

function updateMenu() {
  tray.setContextMenu(createMenu());
}

function createMenu() {
  const list = store.list.map(item => {
    return {
      id: 'category',
      label: item.name,
      type: 'radio',
      checked: store.selectedListId === item.id,
      click() {
        activeRecord();
        mainWindow.webContents.send('updateCategoryId', item.id);
      }
    }
  });
  const menuList = [
    {
      label: '主面板',
      type: 'normal',
      click() {
        mainWindow.show();
      }
    },
    {
      label: '开始记录',
      type: 'checkbox',
      checked: activeRecord,
      click() {
        toggleRecord();
      }
    },
    {
      type: 'separator'
    },
    // self menu
    ...list,
    // self menu
    {
      type: 'separator'
    },
    {
      label: '设置',
      type: 'normal',
      click() {
        mainWindow.show();
        mainWindow.webContents.send('opensetting');
      }
    },
    {
      label: '关于',
      type: 'normal',
      click() {
        app.show();
        mainWindow.show();
        app.showAboutPanel();
        // app.exit();
      }
    },
    {
      label: '退出',
      type: 'normal',
      click() {
        app.exit();
      }
    }
  ].map(item => new MenuItem(item as MenuItemConstructorOptions));
  const contextMenu = Menu.buildFromTemplate(menuList);

  return contextMenu;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(rootPath, 'out/preload/preload.js')
    },
  })

  if (process.platform === 'darwin') {
    app.dock.show();
  }

  tray = new Tray(path.join(rootPath, 'icon/icon-active.png'));
 
  tray.setContextMenu(createMenu());
  menubar({ tray });

  mainWindow.loadFile(path.join(rootPath, 'index.html'));
  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.hide();
  });

  // watch
  watchClipboard();
  // bind shortcuts
  rebindShortcuts();
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
});

app.setAboutPanelOptions({
  applicationName: 'uAid Clipboard',
  applicationVersion: '1.0.0',
  copyright: '',
  authors: ['cowboykx'],
  iconPath: ''
})