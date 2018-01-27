import { Injectable } from "@angular/core";
import { LogService } from "./log.service";
import { TranslationService } from "../../shared/services/translation.service";

let Sqlite = require("nativescript-sqlite");

export interface IDbService {
    exists(): boolean;
    delete();
    create(defaultLanguage: string, callback: () => any);
    update(callback: () => any);
}

@Injectable()
export class DbService implements IDbService {
    
    public dbName: string = "db.sqlite";
    private dbVersion: number = 1;

    constructor(
        private logService: LogService,
        private translationService: TranslationService) {
    }

    public exists(): boolean {
        return Sqlite.exists(this.dbName);
    }

    public delete() {
        Sqlite.deleteDatabase(this.dbName);
    }

    public create(defaultLanguage: string, callback: () => any) {
        new Sqlite(this.dbName, (error, db) => {
            this.traceError(error);
            this.createTables(db);
            this.insertCategories(db);
            this.insertOptions(db, defaultLanguage);
            this.insertOperations(db);
            db.version(this.dbVersion);
            db.close();
            callback();
        });
    }

    public update(callback: () => any) {
        new Sqlite(this.dbName, (error, db) => {
            db.execSQL("INSERT INTO [Options] ([key], [value]) SELECT 'CASHLIMIT', '200' WHERE NOT EXISTS (SELECT 1 FROM [Options] WHERE [key] = 'CASHLIMIT');");
            db.close();
            callback();
        });
    }

    private createTables(db: any) {
        db.execSQL("CREATE TABLE IF NOT EXISTS [Category] ([id] INTEGER PRIMARY KEY NOT NULL, [caption] TEXT NOT NULL);");
        db.execSQL("CREATE TABLE IF NOT EXISTS [Operation] ([id] INTEGER PRIMARY KEY NOT NULL, [categoryId] INTEGER NOT NULL, [isCredit] INTEGER NOT NULL, [isDebit] INTEGER NOT NULL, [isRecurrent] INTEGER NOT NULL, [when] DATETIME NOT NULL, [caption] TEXT NOT NULL, [value] INTEGER NOT NULL, [overridedValue] INTEGER NOT NULL, [isDisabled] INTEGER NOT NULL);");
        db.execSQL("CREATE TABLE IF NOT EXISTS [Options] ([key] TEXT NOT NULL, [value] TEXT NULL);");
    }

    private insertCategories(db: any) {
        db.execSQL(`INSERT INTO [Category] ([id], [caption]) VALUES (NULL, '${this.translationService.get('Categories.None')}');`); // must be the first one (ID = 1)
        db.execSQL(`INSERT INTO [Category] ([id], [caption]) VALUES (NULL, '${this.translationService.get('Categories.Food')}');`);
        db.execSQL(`INSERT INTO [Category] ([id], [caption]) VALUES (NULL, '${this.translationService.get('Categories.Gifts')}');`);
        db.execSQL(`INSERT INTO [Category] ([id], [caption]) VALUES (NULL, '${this.translationService.get('Categories.HealthCare')}');`);
        db.execSQL(`INSERT INTO [Category] ([id], [caption]) VALUES (NULL, '${this.translationService.get('Categories.HighTech')}');`);
        db.execSQL(`INSERT INTO [Category] ([id], [caption]) VALUES (NULL, '${this.translationService.get('Categories.Hobbies')}');`);
        db.execSQL(`INSERT INTO [Category] ([id], [caption]) VALUES (NULL, '${this.translationService.get('Categories.Placements')}');`);
        db.execSQL(`INSERT INTO [Category] ([id], [caption]) VALUES (NULL, '${this.translationService.get('Categories.Restaurant')}');`);
        db.execSQL(`INSERT INTO [Category] ([id], [caption]) VALUES (NULL, '${this.translationService.get('Categories.Taxes')}');`);
    }

    private insertOptions(db: any, defaultLanguage: string) {
        db.execSQL(`INSERT INTO [Options] ([key], [value]) VALUES ('EMAIL', NULL);`);
        db.execSQL(`INSERT INTO [Options] ([key], [value]) VALUES ('LANGUAGE', '${defaultLanguage}');`);
        db.execSQL(`INSERT INTO [Options] ([key], [value]) VALUES ('RUNCOUNT', '1');`);
        db.execSQL(`INSERT INTO [Options] ([key], [value]) VALUES ('FIRSTRUN', DATE('NOW'));`);
        db.execSQL("INSERT INTO [Options] ([key], [value]) VALUES ('CASHLIMIT', '200');");
    }

    private insertOperations(db: any) {
        /* Screenshots - EN */
        /*
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 1, 1, 0, 1, '2017-01-01', 'Payroll', 260000, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 1, 1, 0, 0, '2017-01-01', 'Cheque no. 409', 15000, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 2, 0, 1, 1, '2017-01-01', 'Apartment rental', 65000, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 6, 0, 1, 1, '2017-01-01', 'Placement (+)', 50000, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 2, 0, 1, 1, '2017-01-01', 'Local taxes', 32700, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 4, 0, 1, 0, '2017-01-01', 'Restaurent', 7620, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 7, 0, 1, 0, '2017-01-01', 'Gift', 3850, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 5, 0, 1, 0, '2017-01-01', 'PS4 game', 4990, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 2, 0, 1, 1, '2017-01-01', 'Internet payement', 3797, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 2, 0, 1, 1, '2017-01-01', 'Telephone payement', 3797, 0, 0);");
        */
        /* Screenshots - FR */
        /*
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 1, 1, 0, 1, '2017-01-01', 'Salaire', 260000, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 1, 1, 0, 0, '2017-01-01', 'Chèque no. 409', 15000, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 2, 0, 1, 1, '2017-01-01', 'Location', 65000, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 6, 0, 1, 1, '2017-01-01', 'Placement (+)', 50000, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 2, 0, 1, 1, '2017-01-01', 'Impôts locaux', 32700, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 4, 0, 1, 0, '2017-01-01', 'Restaurent', 7620, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 7, 0, 1, 0, '2017-01-01', 'Cadeau', 3850, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 5, 0, 1, 0, '2017-01-01', 'Jeu PS4', 4990, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 2, 0, 1, 1, '2017-01-01', 'Free ADSL', 3797, 0, 0);");
        db.execSQL("INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, 2, 0, 1, 1, '2017-01-01', 'Free Mobile', 3797, 0, 0);");
        */
    }

    private traceError(error: any) {
        if (error !== null) {
            this.logService.error(`DbService: ${error}`);
        }
    }
}