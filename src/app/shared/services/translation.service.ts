import { Injectable } from "@angular/core";
import * as Platform from "platform";
import { TranslateService } from "ng2-translate";

export interface ITranslationService {
    get(id: string): string;
    load(callback: () => any);
}

@Injectable()
export class TranslationService implements ITranslationService {

    private static Translations: Array<TranslationItem> = [];

    constructor(
        private translateService: TranslateService) {
    }

    public get(id: string): string {
        let item = TranslationService.Translations.find(t => t.id == id);
        return item !== null ? item.content : id;
    }

    public load(callback: () => any) {
        let keys: Array<string> = this.getKeys();
        this.translateService.get(keys).subscribe(translations => {
            if (translations !== null) {
                TranslationService.Translations = [];
                keys.forEach(key => {
                    TranslationService.Translations.push(new TranslationItem(key, translations[key]));
                });
            }
            callback();
        });
        
    }

    private getKeys(): Array<string> {
        let keys: Array<string> = [
            "ActionBar.Categories",
            "ActionBar.Export",
            "ActionBar.Purge",
            "Categories.None",
            "Categories.Food",
            "Categories.Gifts",
            "Categories.HealthCare",
            "Categories.HighTech",
            "Categories.Hobbies",
            "Categories.Placements",
            "Categories.Recurrent",
            "Categories.Restaurant",
            "Categories.Taxes",
            "Common.Caption",
            "Common.Cash",
            "Common.Credit",
            "Common.Credits",
            "Common.Date",
            "Common.Debit",
            "Common.Debits",
            "Common.Deleted",
            "Common.Disabled",
            "Common.Enabled",
            "Common.No",
            "Common.NoCategory",
            "Common.NoData",
            "Common.NoOperation",
            "Common.NotRecurrent",
            "Common.NotWellSet",
            "Common.OK",
            "Common.OverridedValue",
            "Common.Recurrent",
            "Common.Saved",
            "Common.SavingError",
            "Common.Total",
            "Common.Updated",
            "Common.Value",
            "Common.Yes",
            "Dialog.Title.Continue",
            "Dialog.Title.Delete",
            "Dialog.Title.Error",
            "Dialog.Title.Warning",
            "ExportData.Subject",
            "Feedback.Subject",
            "Feedback.To",
            "Page.About.Developed.Title",
            "Page.About.Donation.Title",
            "Page.About.Donation.Caption",
            "Page.About.Feedback.Title",
            "Page.About.Information.Title",
            "Page.About.Information.Caption",
            "Page.About.Version.Title",
            "Page.About.Title",
            "Page.Categories.Title",
            "Page.Category.AlreadyExists",
            "Page.Category.Title",
            "Page.Operation.AddCategory",
            "Page.Operation.Title",
            "Page.Operations.Title",
            "Page.Options.CashLimit.Hint",
            "Page.Options.CashLimit.Note",
            "Page.Options.CashLimit.Title",
            "Page.Options.ExportDataEmailHint",
            "Page.Options.ExportData.EmailNote",
            "Page.Options.ExportData.Title",
            "Page.Options.Language.Section",
            "Page.Options.NeedRestart",
            "Page.Options.Title",
            "Page.Synthesis.Categories",
            "Page.Synthesis.Global",
            "Page.Synthesis.Title",
            "Purge.Error",
            "Purge.Message",
            "Purge.Success"          
        ];
        return keys;
    }
}

export class TranslationItem {
    public id: string;
    public content: string;
    constructor(id: string, content: string) {
        this.id = id;
        this.content = content;
    }
}