import { observable, autorun, action, computed, toJS, transaction, runInAction, configure } from 'mobx';

const dbCrud = window.dbCrud;

configure({
  enforceActions: true
});

class SideBarStore {
  @observable selectedId = -100
  @observable list = dbCrud('sidebar', 'find', {})

  constructor() {
    autorun(() => {
      window.onCategoryChange && window.onCategoryChange(toJS(this.currentList));
    });

    autorun(() => {
      window.onCategorySelectChange && window.onCategorySelectChange(this.selectedId);
    });
  }

  @action
  add(name) {
    const item = {
      id: Date.now(),
      name,
    };

    dbCrud('sidebar', 'insert', item)
    this.list.push(item);
  }

  @action
  remove(id) {
    dbCrud('sidebar', 'remove', { id });
    const index = this.list.findIndex(item => item.id === id);

    listStore.bactchRemove(
      listStore
        .list
        .filter(item => item.categoryId === id)
        .map(item => item.id)
    );
    
    this.list.splice(index, 1);
    this.selectedId = -100;
  }

  @action
  select(id) {
    this.selectedId = id;
    listStore.updateSelectedRowKeys([]);
  }

  @computed
  get currentList() {
    return [
      { id: -100, name: '全部', removeable: false, icon: 'unordered-list' },
      { id: -200, name: '收藏', removeable: false, icon: 'star' },
      ...toJS(this.list),
      { name: '删除' },
      { id: -300, name: '最近删除', removeable: false, icon: 'delete' }
    ]
  }
}

class ListStore {
  @observable list = dbCrud('list', 'find', {});
  @observable selectedRowKeys = [];
  @observable detailVisible = false;
  
  detailItem = null
  isLock = false

  constructor() {
  }

  lock() {
    this.isLock = true;
    setTimeout(() => this.isLock = false, 1500);
  }

  @action
  setDetailVisible() {
    this.detailVisible = true;
  }

  @action
  setDetailInvisible() {
    this.detailVisible = false;
  }

  @action
  updateSelectedRowKeys(list) {
    this.selectedRowKeys = [...list];
  }

  @action
  bactchRemove(ids) {
    transaction(() => {
      for (let index = this.list.length - 1; index >= 0; index --) {
        if (ids.includes(this.list[index].id)) {
          dbCrud('list', 'remove', { id: this.list[index].id });
          this.list.splice(index, 1);
        }
      }
    });
  }

  @action
  batchDelete() {
    const ids = this.selectedRowKeys;

    if (sideBarStore.selectedId === -300) {
      this.bactchRemove(ids);
      return;
    }

    transaction(() => {
      this.list.filter(item => ids.includes(item.id)).forEach(item => {
        dbCrud('list', 'update', { id: item.id }, { $set: { isDelete: true }});
        item.isDelete = true;
      });
    });
  }

  @action
  batchRecover() {
    const ids = this.selectedRowKeys;

    transaction(() => {
      this.list.filter(item => ids.includes(item.id)).forEach(item => {
        dbCrud('list', 'update', { id: item.id }, { $set: { isDelete: false }});
        item.isDelete = false;
      });
    });
  }

  @action
  delete(id) {
    const index = this.list.findIndex(item => item.id === id);

    dbCrud('list', 'update', { id }, { $set: { isDelete: true }});
    this.list[index].isDelete = true;
  }

  @action
  cancelDelete(id) {
    const index = this.list.findIndex(item => item.id === id);

    dbCrud('list', 'update', { id }, { $set: { isDelete: true }});
    this.list[index].isDelete = false;
  }

  getCurrentCategoryList() {
    const list = toJS(this.list);

    return list.filter((item) => {
      // 删除状态
      if (item.isDelete) {
        // 删除
        if (sideBarStore.selectedId === -300) {
          return true;
        }

        return false;
      }

      // 全部
      if (sideBarStore.selectedId === -100) {
        return true;
      }

      // 收藏
      if (sideBarStore.selectedId === -200 && item.favourite) {
        return true;
      }
      
      // 归类
      return item.categoryId === sideBarStore.selectedId;
    })
  }

  @computed 
  get currentCategoryList() {
    return this
      .list
      .filter(item => {
        if (sideBarStore.selectedId === -100) {
          return true;
        }

        if (sideBarStore.selectedId === -200) {
          return item.favourite;
        }

        if (sideBarStore.selectedId === -300) {
          return true
        }

        return item.categoryId === sideBarStore.selectedId;
      })
      .filter(item => {
        if (sideBarStore.selectedId === -300) {
          return item.isDelete;
        }
        return item.isDelete === false
      })
      .slice();
  }

  @action
  add(item) {
    if (sideBarStore.selectedId === -300 ){
      item.categoryId = -100;
    } else {
      if (sideBarStore.selectedId === -200) {
        item.favourite = true;
      }

      item.categoryId = sideBarStore.selectedId;
    }

    dbCrud('list', 'insert', item);
    this.list.unshift(item);
  }

  @action
  remove(id) {
    const index = this.list.findIndex(item => item.id === id);

    dbCrud('list', 'remove', { id });
    this.list.splice(index, 1);
  }

  findIndex(id) {
    return this.list.findIndex(item => item.id === id);
  }

  @action
  toggleFav(id) {
    const index = this.list.findIndex(item => item.id === id);

    dbCrud('list', 'update', { id }, { $set: { favourite: !this.list[index].favourite }});
    this.list[index].favourite = !this.list[index].favourite;
  }

  @action
  currentCategorySelectAll() {
    this.selectedRowKeys = this.currentCategoryList.map(item => item.id);
  }


  @action
  currentCategoryUnSelectAll() {
    this.selectedRowKeys = [];
  }

  getSelectedItem() {
    return this.selectedRowKeys.map((id) => this.currentCategoryList.find(item => item.id === id));
  }
  
}

class SettingStore {
  @observable visible = false;
  @observable mainShortcuts = '';
  @observable recorderShortcuts = '';
  @observable mainShortcutsStatus = true;
  @observable recordShortcutsStatus = true;

  constructor() {
    if (dbCrud('setting', 'find', { name: 'mainshortcuts' }).length === 0) {
      dbCrud('setting', 'insert', {
        name: 'mainshortcuts',
        value: 'Command+Ctrl+M',
        enable: true
      });
    }

    if (dbCrud('setting', 'find', { name: 'recordershortcuts' }).length === 0) {
      dbCrud('setting', 'insert', {
        name: 'recordershortcuts',
        value: 'Command+Ctrl+R',
        enable: true
      });
    }

    runInAction(() => {
      const mainShortcuts = dbCrud('setting', 'findOne', { name: 'mainshortcuts' });
      const recorderShortcuts = dbCrud('setting', 'findOne', { name: 'recordershortcuts' });

      this.mainShortcuts = mainShortcuts.value;
      this.mainShortcutsStatus = mainShortcuts.enable;

      this.recorderShortcuts = recorderShortcuts.value;
      this.recordShortcutsStatus = recorderShortcuts.enable;
    });
  }

  rebind() {
    window.onRebindShortcuts && window.onRebindShortcuts();
  }

  @action
  toggleVisible() {
    this.visible = !this.visible;
  }

  @action
  setVisible() {
    this.visible = true;
  }

  @action
  setMainShortcuts(shortcuts) {
    dbCrud('setting', 'update', { name: 'mainshortcuts' }, { $set: {value: shortcuts} });
    this.mainShortcuts = shortcuts;
    this.rebind();
  }

  @action
  setRecorderShortcuts(shortcuts) {
    dbCrud('setting', 'update', { name: 'recordershortcuts' }, { $set: {value: shortcuts} });
    this.recorderShortcuts = shortcuts;
    this.rebind();
  }

  @action
  setMainShortcutsStatus(status){
    dbCrud('setting', 'update', { name : 'mainshortcuts'}, { $set: { enable: status } });
    this.mainShortcutsStatus = status;
    this.rebind();
  }

  @action
  setRecordShortcutsStatus(status){
    dbCrud('setting', 'update', { name : 'recordershortcuts'}, { $set: { enable: status } });
    this.recordShortcutsStatus = status;
    this.rebind();
  }

}

const sideBarStore = new SideBarStore()
const listStore = new ListStore()
const settingStore = new SettingStore()

window.onUpdateCategoryId = (id) => sideBarStore.select(id);
window.onOpenSetting = () => settingStore.setVisible();

export default {
  sideBarStore,
  listStore,
  settingStore
}