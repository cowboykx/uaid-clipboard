class Item {
  public id: number;
  public title: string;
  public content: string;
  public favourite: boolean;
  public createTime: number;
  public isDelete: boolean;
  public categoryId: number;

  constructor(content, title = '') {
    this.id = Date.now();
    this.title = title;
    this.content = content;
    this.favourite = false;
    this.createTime = this.id;
    this.isDelete = false;
    this.categoryId = -100;
  }

  toString() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      favourite: this.favourite,
      isDelete: this.isDelete,
      createTime: this.createTime,
      categoryId: this.categoryId,
    }
  }
}

export {
  Item
}