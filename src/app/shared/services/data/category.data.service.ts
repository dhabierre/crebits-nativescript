import { Injectable } from "@angular/core";
import { Category } from "./../../models/category";
import { DbService } from "./../db.service";
import { LogService } from "./../log.service";

let Sqlite = require("nativescript-sqlite");

export interface ICategoryDataService {
  load(excludeNoneCategory: boolean, callback: (categories: Array<Category>) => any);
  get(id: number, callback: (category: Category) => any);
  save(category: Category, callback: (isWellSet: boolean, isSaved: boolean) => any);
  update(category: Category, callback: (isWellSet: boolean, isUpdated: boolean) => any);
  delete(id: number, callback: () => any);
  dump();
}

@Injectable()
export class CategoryDataService implements ICategoryDataService {

  constructor(
    private dbService: DbService,
    private logService: LogService) {
  }

  public load(excludeNoneCategory: boolean, callback: (categories: Array<Category>) => any) {
    new Sqlite(this.dbService.dbName, (error, db) => {
      this.traceError(error);
      let categories = new Array<Category>();
      db.resultType(Sqlite.RESULTSASOBJECT);
      let request = "SELECT * FROM [Category] ORDER BY [caption];";
      if (excludeNoneCategory) {
        request = "SELECT * FROM [Category] WHERE [id] > 1 ORDER BY [caption];";
      }
      db.all(request, (error, rows) => {
        this.traceError(error);
        rows.forEach(row => {
          let category = new Category();
          category.id = row.id;
          category.caption = row.caption;
          categories.push(category);
        });
        db.close();
        return callback(categories);
      });
    });
  }

  public get(id: number, callback: (category: Category) => any) {
    new Sqlite(this.dbService.dbName, (error, db) => {
      this.traceError(error);
      let category: Category;
      db.resultType(Sqlite.RESULTSASOBJECT);
      db.get(`SELECT * FROM [Category] WHERE [id] = '${id}';`, (error, row) => {
        this.traceError(error);
        if (row !== null) {
          category = new Category();
          category.id = row.id;
          category.caption = row.caption;
        }
        db.close();
        return callback(category);
      });
    });
  }

  public save(category: Category, callback: (isWellSet: boolean, alreadyExists: boolean, isSaved: boolean) => any) {
    if (!this.canCategoryBeSaved(category)) {
      callback(false, false, false);
    }
    else {
      this.doesCategoryExist(category, exists => {
        if (!exists) {
          new Sqlite(this.dbService.dbName, (error, db) => {
            this.traceError(error);
            let request = "INSERT INTO [Category] ([id], [caption]) VALUES (NULL, ?);";
            db.execSQL(request, [this.secureText(category.caption)], error => {
              this.traceError(error);
              db.close();
              callback(true, false, true);
            });
          });
        }
        else {
          callback(true, true, false);
        }
      });
    }
  }

  public update(category: Category, callback: (isWellSet: boolean, alreadyExists: boolean, isUpdated: boolean) => any) {
    if (!this.canCategoryBeUpdated(category)) {
      callback(false, false, false);
    }
    else {
      this.doesCategoryExist(category, exists => {
        if (!exists) {
          new Sqlite(this.dbService.dbName, (error, db) => {
            this.traceError(error);
            let request = "UPDATE [Category] SET [caption] = ? WHERE [id] = ?;";
            db.execSQL(request, [this.secureText(category.caption), category.id], error => {
              this.traceError(error);
              db.close();
              callback(true, false, true);
            });
          });
        }
        else {
          callback(true, true, false);
        }
      });
    }
  }

  public delete(id: number, callback: (isDeleted: boolean) => any) {
    if (this.canCategoryBeDeleted(id)) {
      new Sqlite(this.dbService.dbName, (error, db) => {
        this.traceError(error);
        let updateRequest = "UPDATE [Operation] SET [categoryId] = 1 WHERE [categoryId] = ?;";
        db.execSQL(updateRequest, [id], error => {
          this.traceError(error);
          let deleteRequest = "DELETE FROM [Category] WHERE [id] = ?";
          db.execSQL(deleteRequest, [id], error => {
            this.traceError(error);
            db.close();
            callback(true);
          });
        });
      });
    }
    else {
      callback(false);
    }
  }

  public dump() {
    this.load(false, categories => {
      this.logService.dump(categories);
    })
  }

  private doesCategoryExist(category: Category, callback: (exists: boolean) => any) {
    this.load(false, categories => {
      if (categories.find(c => c.caption.toUpperCase() === category.caption.toUpperCase() && c.id !== category.id)) {
        callback(true);
      }
      else {
        callback(false);
      }
    });
  }

  private canCategoryBeSaved(category: Category): boolean {
    return category !== null && category.id === 0 && category.caption !== null && category.caption.length > 0;
  }

  private canCategoryBeUpdated(category: Category) {
    return category !== null && category.id > 0 && category.caption !== null && category.caption.length > 0;
  }
  
  private canCategoryBeDeleted(id: number): boolean {
    return id > 1;
  }
  
  private secureText(text: string): string {
    return text !== null ? text.replace("'", "''") : text;
  }

  private traceError(error: any) {
    if (error !== null) {
      this.logService.error(`CategoryDataService: ${error}`);
    }
  }
}