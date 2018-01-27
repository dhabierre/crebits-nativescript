import { Injectable } from "@angular/core";
import { Category } from "./../../models/category";
import { Operation } from "./../../models/operation";
import { Options } from "./../../models/options";
import { Synthesis } from "./../../models/synthesis";
import { DbService } from "./../db.service";
import { CategoryDataService } from "./category.data.service";
import { LogService } from "./../log.service";
import { TranslationService } from "./../translation.service";

let Sqlite = require("nativescript-sqlite");

export interface ISynthesisDataService {
  load(callback: (synthesis: Synthesis) => any);
}

@Injectable()
export class SynthesisDataService implements ISynthesisDataService {

  constructor(
    private dbService: DbService,
    private categoryDataService: CategoryDataService,
    private logService: LogService,
    private translationService: TranslationService) {
  }

  public load(callback: (synthesis: Synthesis) => any) {
    new Sqlite(this.dbService.dbName, (error, db) => {
      this.traceError(error);
      let synthesis = new Synthesis();
      db.resultType(Sqlite.RESULTSASOBJECT);
      db.all("SELECT * FROM [Operation] WHERE [isDisabled] = 0", (error, rows) => {
        this.traceError(error);
        rows.forEach(row => {
          let value = this.getValue(row.value, row.overridedValue) / 100;
          if (row.isRecurrent) {
            if (row.isDebit) {
              synthesis.recurrentDebit += value;
            }
            else {
              synthesis.recurrentCredit += value;
            }
          }
          else {
            if (row.isDebit) {
              synthesis.notRecurrentDebit += value;
            }
            else {
              synthesis.notRecurrentCredit += value;
            }
          }
        });
        db.close();
        this.updateCategories(synthesis, callback);
      });
    });
  }

  private updateCategories(synthesis: Synthesis, callback: (synthesis: Synthesis) => any) {
    this.categoryDataService.load(false, categories => {
      new Sqlite(this.dbService.dbName, (error, db) => {
        this.traceError(error);
        db.resultType(Sqlite.RESULTSASOBJECT);
        db.all("SELECT * FROM [Operation] WHERE [isDebit] = 1 AND [isDisabled] = 0", (error, rows) => {
          this.traceError(error);
          let totalDebits: number = 0;
          rows.forEach(row => {
            let value = this.getValue(row.value, row.overridedValue) / 100;
            totalDebits += value;
          });
          rows.forEach(row => {
            let categoryId = row.categoryId;
            let categoryValue = this.getValue(row.value, row.overridedValue) / 100;
            let categoryCaption = categories.find(c => c.id === categoryId).caption;
            synthesis.updateCategory(categoryId, categoryCaption, categoryValue, totalDebits);
          });
          let recurrentCaption = this.translationService.get("Categories.Recurrent");
          let recurrentValue = 0;
          rows.forEach(row => {
            if (row.isRecurrent) {
              recurrentValue += this.getValue(row.value, row.overridedValue) / 100; 
            }
          });
          synthesis.setRecurrent(recurrentCaption, recurrentValue, totalDebits);
          db.close();
          synthesis.categories = synthesis.categories.sort((x, y) => y.total - x.total);
          callback(synthesis);
        });
      });
    });
  }

  private getValue(value: number, overridedValue: number): number {
    return overridedValue > 0 ? overridedValue : value;
  }
  
  private traceError(error: any) {
    if (error !== null) {
      this.logService.error(`SynthesisDataService: ${error}`);
    }
  }
}