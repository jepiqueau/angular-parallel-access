import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { Guid } from 'guid-typescript';

@Injectable({providedIn: 'root'})
export class DatabaseService{
    private readonly isWeb: boolean;
    private readonly platform: string;
    private readonly sqlite: SQLiteConnection;
    private db: SQLiteDBConnection | null = null;
//    private db1: SQLiteDBConnection | null = null;

    private readonly t1 = 'table1';
    private readonly t2 = 'table2';

    constructor() {
        this.isWeb = !Capacitor.isNativePlatform();
        this.sqlite = new SQLiteConnection(CapacitorSQLite);
        this.platform = Capacitor.getPlatform();
    }

    public async initialize(): Promise<void>{
      try {
        console.log(`in DatabaseService.initialize isWeb: ${this.isWeb}`);
        if (this.isWeb) {
            const webStoreName = 'jeep-sqlite';
            if (!document.querySelector(webStoreName)) {
              const jeepSqlite = document.createElement(webStoreName);
              document.body.appendChild(jeepSqlite);
              await customElements.whenDefined(webStoreName);
          }
          await this.sqlite.initWebStore();
        }

        this.db = await this.sqlite.createConnection('test', false, 'no-encryption', 1, false);
        if(this.db != null) {
          await this.db.open();
          if (this.platform !== 'android') {
            await this.db.execute(`PRAGMA journal_mode=WAL;`,false);
          }
          await this.ensureTablesExist(this.db, this.t1);
          await this.ensureTablesExist(this.db, this.t2);
          const tableList = await this.db.getTableList();
          console.log(`in initialize tableList: ${JSON.stringify(tableList)}`);
          if(tableList.values.length !== 2) {
            return Promise.reject(`Error: table's list !== 2`);
          }
          if (this.isWeb) {
            await this.sqlite.saveToStore('test');
          }
          return;
        } else {
          return Promise.reject(`Error: createConnection failed`);
        }
      } catch (err) {
        const msg = err.message ? err.message : err;
        return Promise.reject(`Error: ${msg}`);
      }
    }
    public async runTests(): Promise<void> {
      const transaction = ['ios','android'].includes(this.platform) ? true : false;

      try {
        const isTable1 = (await this.db.isTable(this.t1)).result;
        console.log(`isTable1: ${isTable1}`);
        const res1 = isTable1 ? (await this.db.query(`Select Count(*) as count from ${this.t1};`)).values[0].count : 0;
        const isTable2 = (await this.db.isTable(this.t2)).result;
        console.log(`isTable2: ${isTable2}`);
        const res2 = isTable2 ? (await this.db.query(`Select Count(*) as count from ${this.t2};`)).values[0].count : 0;

        console.log(`number of data: ${res1} in table ${this.t1}`);
        console.log(`number of data: ${res2} in table ${this.t2}`);

        if(res1 > 0) {
          await this.db.execute(`DELETE FROM ${this.t1};`,true);
        }
        if(res2 > 0) {
          await this.db.execute(`DELETE FROM ${this.t2};`,true);
        }
        if (!transaction) {
          await this.db.execute('BEGIN TRANSACTION;', false);
          console.log('after begin');
        }
        await Promise.all([
            this.test(this.db,this.t1, transaction),this.test(this.db,this.t2, transaction),
        ]);
        if (!transaction) {
          await this.db.execute('COMMIT TRANSACTION;', false);
          console.log('after commit');
        }

        console.log(`count in ${this.t1}: ${await this.getCount(this.db, this.t1)}`);
        console.log(`count in ${this.t2}: ${await this.getCount(this.db, this.t2)}`);
        return;
      } catch (err) {
        if (!transaction) {
          await this.db.execute('ROLLBACK TRANSACTION;', false);
          console.log('after rollback');
        }
        const msg = err.message ? err.message : err;
        return Promise.reject(`Error: ${msg}`);
      } finally {
        await this.sqlite.closeConnection('test',false);

      }
    }

    private async ensureTablesExist(db: SQLiteDBConnection, table: string){
      try{
        console.log(`in ensureTablesExist tableName: ${table}`);
        const res = await db.execute(`CREATE TABLE IF NOT EXISTS ${table} (id text, nb number, description text);`,true);
        const isTable = (await this.db.isTable(table)).result;
        console.log(`in ensureTablesExist '${table}' isTable: ${isTable}`);
        return;
      } catch (err) {
        const msg = err.message ? err.message : err;
        return Promise.reject(`Error: ${msg}`);
      }
    }


    private async test(db: SQLiteDBConnection, tableName: string, transaction: boolean): Promise<void> {
      try {
        console.log(`>>>>> in test table: ${tableName} starts >>>>>`);
        const values = [];
        values.push(Guid.create().toString());
        const statement1 = `Insert into ${tableName} (id, nb, description) values (?,?,?)`;
        const iters = 1000;
        let i =0;
        do
        {
            i++;
            const nb = Math.random() * 1000;
            const desc = Guid.create().toString();
            await this.createItem(db, statement1, [Guid.create().toString(), nb, desc], transaction);
            if(i === 200 || i === 400 || i === 600 || i === 800 || i === 1000) {
              console.log(`>>>>> in test table: ${tableName} iteration: ${i} >>>>>`);
            }
        } while(i < iters );
        console.log(`>>>>> in test table: ${tableName} ends >>>>>`);
        return;
      } catch (err) {
        const msg = err.message ? err.message : err;
        return Promise.reject(`Error: ${msg}`);
      }

    }
    private async getCount(db: SQLiteDBConnection, tableName: string): Promise<number> {
      return (await db.query(`Select Count(*) as count from ${tableName};`)).values[0].count;
    }
    private async createItem(db: SQLiteDBConnection, stmt: string, values: any[],
                             transaction: boolean): Promise<void> {
      try {
        await db.run(stmt, values, transaction);
        return;
      } catch (err) {
        const msg = err.message ? err.message : err;
        return Promise.reject(`createItem: ${msg}`);
      }
    }
}
