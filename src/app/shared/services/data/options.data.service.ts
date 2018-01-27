import { Injectable } from "@angular/core";
import { Options } from "./../../models/options";
import { DbService } from "./../db.service";
import { LogService } from "./../log.service";

let Sqlite = require("nativescript-sqlite");

export interface IOptionsDataService {
  load(callback: (options: Options) => any);
  update(options: Options, callback: (isWellSet: boolean, isUpdated: boolean) => any);
}

@Injectable()
export class OptionsDataService implements IOptionsDataService {

  constructor(
    private dbService: DbService,
    private logService: LogService) {
  }

  public load(callback: (options: Options) => any) {
    new Sqlite(this.dbService.dbName, (error, db) => {
      this.traceError(error);
      let options = new Options();
      db.resultType(Sqlite.RESULTSASOBJECT);
      db.all("SELECT * FROM [Options]", (error, rows) => {
        this.traceError(error);
        rows.forEach(row => {
          if (row.key === "EMAIL") {
            options.email = row.value;
          }
          else if (row.key === "LANGUAGE") {
            options.language = row.value;
          }
          else if (row.key === "RUNCOUNT") {
            options.runCount = parseInt(row.value);
          }
          else if (row.key === "FIRSTRUN") {
            options.firstRun = row.value;
          }
          else if (row.key === "CASHLIMIT") {
            options.cashLimit = parseInt(row.value);
          }
        });
        db.close();
        return callback(options);
      });
    });
  }

  public update(options: Options, callback: (isWellSet: boolean, isUpdated: boolean) => any) {
    if (this.canOptionsBeUpdated(options)) {
      new Sqlite(this.dbService.dbName, (error, db) => {
        this.traceError(error);
        let emailRequest = "UPDATE [Options] SET [value] = ? WHERE [key] = 'EMAIL';";
        let languageRequest = "UPDATE [Options] SET [value] = ? WHERE [key] = 'LANGUAGE';";
        let cashLimitRequest = "UPDATE [Options] SET [value] = ? WHERE [key] = 'CASHLIMIT';";
        db.execSQL(emailRequest, [this.secureText(options.email)], error => {
          this.traceError(error);
          db.execSQL(languageRequest, [options.language], error => {
            this.traceError(error);
            db.execSQL(cashLimitRequest, [options.cashLimit ? options.cashLimit : 0], error => {
              this.traceError(error);
              db.close();
              callback(true, true);
            });
          });
        });
      });
    }
    else {
      return callback(false, false);
    }
  }

  private canOptionsBeUpdated(options: Options) :boolean {
    return true;
  }

  public updateLanguage(language: string, callback: (isWellSet: boolean, isUpdated: boolean) => any) {
    if (this.canLanguageBeUpdated(language)) {
      new Sqlite(this.dbService.dbName, (error, db) => {
        this.traceError(error);
        let request = "UPDATE [Options] SET [value] = ? WHERE [key] = 'LANGUAGE';";
        db.execSQL(request, [language], error => {
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

  public increaseRunCount() {
    new Sqlite(this.dbService.dbName, (error, db) => {
      this.traceError(error);
      db.execSQL("UPDATE [Options] SET [value] = CAST((CAST([value] AS INTEGER) + 1) AS TEXT) WHERE [key] = 'RUNCOUNT'");
      db.close();
    });
  }

  private canLanguageBeUpdated(language: string) :boolean {
    return language !== null;
  }

  private secureText(text: string): string {
    return text !== null ? text.replace("'", "''") : text;
  }

  private getShortDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private traceError(error: any) {
    if (error !== null) {
      this.logService.error(`OptionsDataService: ${error}`);
    }
  }
}