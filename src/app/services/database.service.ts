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

    private readonly t1 = 'table1';
    private readonly t2 = 'table2';

    constructor() {
        this.isWeb = !Capacitor.isNativePlatform();
        this.sqlite = new SQLiteConnection(CapacitorSQLite);
        this.platform = Capacitor.getPlatform();
    }

    public async initialize(): Promise<boolean>{
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

        this.db = await this.sqlite.createConnection('test', false, 'no-encryption', 1);
        if(this.db != null) {
          await this.ensureTablesExist();
          return true;
        } else {
          return false;
        }

    }
    public async runTests(){
      let res1 = await this.db.query(`Select Count(*) as count from ${this.t1};`);
      let res2 = await this.db.query(`Select Count(*) as count from ${this.t1};`);

      console.log(res1.values[0].count);
      console.log(res2.values[0].count);

        await this.db.execute(`Delete from ${this.t1}`,false);
        await this.db.execute(`Delete from ${this.t2}`,false);

        await Promise.all([
            this.test('table1'),this.test('table2'),
        ]);

/*
        await this.test(this.t1)
        await this.test(this.t2)
*/
/*         await Promise.all([
          console.log(`t1 count: ${await this.getCount(this.t1)}`), console.log(`t2 count: ${await this.getCount(this.t2)}`)
         ])
*/
        res1 = await this.db.query(`Select Count(*) as count from ${this.t1};`);
        res2 = await this.db.query(`Select Count(*) as count from ${this.t1};`);

        console.log(res1.values[0].count);
        console.log(res2.values[0].count);
        await this.sqlite.closeConnection('test');
    }

    private async ensureTablesExist(){
        await this.db.open();
        if (this.platform !== 'android') {
          await this.db.execute(`PRAGMA journal_mode=WAL;`,false);
        }
        await this.db.execute(`CREATE TABLE IF NOT EXISTS ${this.t1} (id text, nb number, description text);`,false);
        await this.db.execute(`CREATE TABLE IF NOT EXISTS ${this.t2} (id text, nb number, description text);`,false);
    }


    private async test(tableName: string){
      console.log(`>>>>> in test table: ${tableName} starts >>>>>`);
        const values = [];
        values.push(Guid.create().toString());
        const nb = Math.random() * 1000;
        const desc = Guid.create().toString();
        const statement1 = `Insert into ${tableName} (id, nb, description) values (?,?,?)`;
        const iters = 1000;
        let i =0;
        do
        {
            i++;
            await this.db.run(statement1, [Guid.create().toString(), nb, desc],false);
            if(i === 200 || i === 400 || i === 600 || i === 800 || i === 1000) {
              console.log(`>>>>> in test table: ${tableName} iteration: ${i} >>>>>`);
            }
        } while(i < iters );
        console.log(`>>>>> in test table: ${tableName} ends >>>>>`);

    }
    private async getCount(tableName: string) {
      return (await this.db.query(`Select Count(*) as count from ${tableName};`)).values[0].count;
    }
}
