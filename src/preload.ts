import { ipcRenderer, clipboard } from 'electron';

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: any) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
});

ipcRenderer.on('msg', (e: any, res: any) => {
  window.onClipboardUpdate(res.data);
});

ipcRenderer.on('updateCategoryId', (e: any, id: string) => {
  window.onUpdateCategoryId(id);
});

ipcRenderer.on('opensetting', () => {
  window.onOpenSetting();
});

window.writeText2Clipboard = (text: string) => {
  clipboard.writeText(text);
};

window.onCategoryChange = (list: any) => {
  ipcRenderer.send('categorychange', list.filter(item => item.id && item.id !== -300));
};

window.onCategorySelectChange = (id: number) => {
  ipcRenderer.send('categoryselectchange', id);
};

window.onRebindShortcuts = () => {
  ipcRenderer.send('rebindshortcuts');
}

window.dbCrud = (name, action, query, update) => {
  return ipcRenderer.sendSync('dbcrud', { name, action, query, update });
};