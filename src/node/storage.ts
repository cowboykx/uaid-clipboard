import { app, ipcMain } from 'electron';
import Datastore from 'nedb';
import path from 'path';

export type TCurdParams = {
  name: string,
  action: string,
  query?: any,
  update?: any,
  options?: any,
}

const DB = {
  sidebar: new Datastore({
    autoload: true,
    filename: path.join(app.getPath('userData'), 'db/uaidclipboard/sidebar.db')
  }),
  list: new Datastore({
    autoload: true,
    filename: path.join(app.getPath('userData'), 'db/uaidclipboard/list.db')
  }),
  setting: new Datastore({
    autoload: true,
    filename: path.join(app.getPath('userData'), 'db/uaidclipboard/setting.db')
  })
}

export async function dbCrud(params: TCurdParams): Promise<any> {
  const { name, action, query, update, options } = params;

  return await new Promise((resolve, reject) => {
    const callback = (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    }

    if (action === 'update') {
      DB[name][action](query, update, callback);
    } else {
      DB[name][action](query, callback);
    }
    
  });
}

ipcMain.on('dbcrud', async (event, params) => {
  event.returnValue = await dbCrud(params);
});