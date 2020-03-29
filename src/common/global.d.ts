export declare global {
  interface Window {
    dbCrud(name: string, action: string, query: any, update?: any): any;
    onRebindShortcuts(): void;
    onCategorySelectChange(id: number): void;
    onCategoryChange(list: any): void;
    writeText2Clipboard(text: string): void;
    onUpdateCategoryId(id: string): void;
    onClipboardUpdate(data: any): void;
    onOpenSetting(): void;
  }
}
