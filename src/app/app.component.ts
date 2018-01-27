import { Component, OnInit } from "@angular/core";
import * as Platform from "platform";
import { TranslateService } from "ng2-translate";
import { DbService } from "./shared/services/db.service";
import { LogService } from "./shared/services/log.service";
import { OptionsDataService } from "./shared/services/data/options.data.service";
import { TranslationService } from "./shared/services/translation.service";

@Component({
    selector: "main",
    //templateUrl: "app.component.xml"
    templateUrl: "./app.component.xml"
})
export class AppComponent implements OnInit { 
    
    constructor(
        private translate: TranslateService,
        private translationService: TranslationService,
        private dbService : DbService,
        private optionsDataService: OptionsDataService,
        private logService: LogService) {
    }

    ngOnInit() {
        let deviceLanguage = this.getDeviceLanguage();
        this.changeLanguage(deviceLanguage);
        this.translationService.load(() => {
            let exists = this.dbService.exists();
            /*
            if (exists) {
                this.logService.debug("AppComponent.setupDatabase() > The database exists. Deleting it...");
                this.dbService.delete();
            }
            exists = this.dbService.exists();
            */
            if (exists) {
                this.logService.debug("AppComponent.setupDatabase() > The database exists. Updating it...");
                this.dbService.update(() => {
                    this.optionsDataService.load(options => {
                        this.optionsDataService.increaseRunCount();
                        if (options.language !== null) {
                            this.changeLanguage(options.language);
                            this.translationService.load(() => {
                            });
                        }
                    });
                });
            }
            else {
                this.logService.debug(`AppComponent.setupDatabase('${deviceLanguage}') > The database does not exist. Creating it...`);
                this.dbService.create(deviceLanguage, () => {});
            }
        });
    }

    private changeLanguage(language: string) {
        this.translate.setDefaultLang("en");
        if (language !== null) {
            this.translate.use(language);
        }
    }

    private getDeviceLanguage(): string {
        return Platform.device.language.split("-")[0];
    }
}
