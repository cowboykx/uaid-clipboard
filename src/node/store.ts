
class Store {
  public isRecord = false;
  public list = [];
  public selectedListId = false;

  setRecord() {
    this.isRecord = true;
  }

  setUnRecord() {
    this.isRecord = false;
  }

  setList(list) {
    this.list = list;
  }

  setSelectedListId(id) {
    this.selectedListId = id;
  }
}

class RecordStatus {
  public active: boolean = true;

  activeRecord() {
    this.active = true;
  }

  inActiveRecord() {
    this.active = false;
  }
}

export const store = new Store();
export const recordStatus = new RecordStatus();