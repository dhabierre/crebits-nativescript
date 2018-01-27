import { Injectable } from "@angular/core";
import { Operation } from "./../../models/operation";
import { DbService } from "./../db.service";
import { LogService } from "./../log.service";

let Sqlite = require("nativescript-sqlite");

export interface IOperationDataService {
  load(callback: (operations: Array<Operation>) => any);
  get(id: number, callback: (operation: Operation) => any);
  save(operation: Operation, callback: (isWellSet: boolean, isSaved: boolean) => any);
  update(operation: Operation, callback: (isWellSet: boolean, isUpdated: boolean) => any);
  delete(id: number, callback: () => any);
  purge(callback: (isPurged: boolean) => any);
  dump();
}

@Injectable()
export class OperationDataService implements IOperationDataService {

  constructor(
    private dbService: DbService,
    private logService: LogService) {
  }

  public load(callback: (operations: Array<Operation>) => any) {
    new Sqlite(this.dbService.dbName, (error, db) => {
      this.traceError(error);
      let operations = new Array<Operation>();
      db.resultType(Sqlite.RESULTSASOBJECT);
      db.all("SELECT * FROM [Operation] ORDER BY [value] DESC;", (error, rows) => {
        this.traceError(error);
        rows.forEach(row => {
          let operation = new Operation();
          operation.id = row.id;
          operation.isDebit = this.getBool(row.isDebit);
          operation.isCredit = this.getBool(row.isCredit);
          operation.categoryId = row.categoryId;
          operation.isRecurrent = this.getBool(row.isRecurrent);
          operation.caption = row.caption;
          operation.value = row.value / 100;
          operation.overridedValue = row.overridedValue / 100;
          operation.when = row.when;
          operation.isDisabled = this.getBool(row.isDisabled);
          operations.push(operation);
        });
      });
      db.close();
      return callback(operations);
    });
  }

  public get(id: number, callback: (operation: Operation) => any) {
    new Sqlite(this.dbService.dbName, (error, db) => {
      this.traceError(error);
      let operation: Operation;
      db.resultType(Sqlite.RESULTSASOBJECT);
      db.get(`SELECT * FROM [Operation] WHERE [id] = '${id}';`, (error, row) => {
        this.traceError(error);
        if (row !== null) {
          operation = new Operation();
          operation.id = row.id;
          operation.isCredit = this.getBool(row.isCredit);
          operation.isDebit = this.getBool(row.isDebit);
          operation.categoryId = row.categoryId;
          operation.isRecurrent = this.getBool(row.isRecurrent);
          operation.caption = row.caption;
          operation.value = row.value / 100;
          operation.overridedValue = row.overridedValue / 100;
          operation.when = row.when;
          operation.isDisabled = this.getBool(row.isDisabled);
        }
        db.close();
        return callback(operation);
      });
    });
  }

  public save(operation: Operation, callback: (isWellSet: boolean, isSaved: boolean) => any) {
    this.prepare(operation);
    if (this.canOperationBeSaved(operation)) {
      new Sqlite(this.dbService.dbName, (error, db) => {
        this.traceError(error);
        let request = "INSERT INTO [Operation] ([id], [categoryId], [isCredit], [isDebit], [isRecurrent], [when], [caption], [value], [overridedValue], [isDisabled]) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        let value = Math.trunc(operation.value * 100);
        let overridedValue = operation.overridedValue !== null ? Math.trunc(operation.overridedValue * 100) : 0;
        db.execSQL(request, [operation.categoryId, operation.isCredit ? 1 : 0, operation.isDebit ? 1 : 0, operation.isRecurrent ? 1 : 0, operation.when, this.secureText(operation.caption), value, overridedValue, operation.isDisabled ? 1 : 0], error => {
          this.traceError(error);
          db.close();
          callback(true, true);
        });
      });
    }
    else {
      return callback(false, false);
    }
  }

  public update(operation: Operation, callback: (isWellSet: boolean, isUpdated: boolean) => any) {
    this.prepare(operation);
    if (this.canOperationBeUpdated(operation)) {
      new Sqlite(this.dbService.dbName, (error, db) => {
        this.traceError(error);
        let request = "UPDATE [Operation] SET [categoryId] = ?, [isRecurrent] = ?, [when] = ?, [caption] = ?, [value] = ?, [overridedValue] = ?, [isDisabled] = ? WHERE [id] = ?;";
        let value = Math.trunc(operation.value * 100);
        let overridedValue = operation.overridedValue !== null ? Math.trunc(operation.overridedValue * 100) : 0;
        db.execSQL(request, [operation.categoryId, operation.isRecurrent ? 1 : 0, operation.when, this.secureText(operation.caption), value, overridedValue, operation.isDisabled ? 1 : 0, operation.id], error => {
          this.traceError(error);
          db.close();
          callback(true, true);
        });
      });
    }
    else {
      return callback(false, false);
    }
  }

  public delete(id: number, callback: () => any) {
    new Sqlite(this.dbService.dbName, (error, db) => {
      this.traceError(error);
      let request = "DELETE FROM [Operation] WHERE [id] = ?;";
      db.execSQL(request, [id], error => {
        this.traceError(error);
        db.close();
        callback();
      });
    });
  }

  public dump() {
    this.load(operations => {
      this.logService.dump(operations);
    })
  }

  public purge(callback: (isPurged: boolean) => any) {
    new Sqlite(this.dbService.dbName, (error, db) => {
      this.traceError(error);
      let deleteRequest = "DELETE FROM [Operation] WHERE [isRecurrent] = 0;";
      let updateRequest = "UPDATE [Operation] SET [overridedValue] = 0;";
      db.execSQL(updateRequest, error => {
        this.traceError(error);
        db.execSQL(deleteRequest, error => {
          this.traceError(error);
          db.close();
          callback(true);
        });
      });
    });
  }

  private canOperationBeSaved(operation: Operation): boolean {
    return operation !== null && operation.id === 0 && operation.caption !== null && operation.caption.length > 0 && operation.value > 0;
  }

  private canOperationBeUpdated(operation: Operation): boolean {
    return operation !== null && operation.id !== 0 && operation.caption !== null && operation.caption.length > 0 && operation.value > 0;
  }

  private prepare(operation: Operation) {
    if (!operation.isRecurrent) {
      operation.overridedValue = 0;
    }
  }

  private getValue(value: number, overridedValue: number): number {
    return overridedValue > 0 ? overridedValue : value;
  }
  
  private getBool(value: number): boolean {
    return value > 0 ? true : false;
  }

  private secureText(text: string): string {
    return text !== null ? text.replace("'", "''") : text;
  }

  private traceError(error: any) {
    if (error !== null) {
      this.logService.error(`OperationDataService: ${error}`);
    }
  }
}