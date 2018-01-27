import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import * as Platform from "platform";
import { TranslateService } from "ng2-translate";
import { Language } from "../../shared/models/language";
import { Options } from "../../shared/models/options";
import { OptionsDataService } from "../../shared/services/data/options.data.service";
import { TranslationService } from "../../shared/services/translation.service";

import FrameModule = require("ui/frame");

let Toast = require("nativescript-toast");
let Dialogs = require("ui/dialogs");

@Component({    
    selector: "options",
    //templateUrl: "pages/options/options.xml",
    //styleUrls: ["pages/options/options.css"]
    templateUrl: "./options.xml",
    styleUrls: ["./options.css"]
})
export class OptionsComponent implements OnInit {
    
    public dbLanguage: string;
    public languages: Array<Language> = [];
    public needRestart: boolean = false;
    public options: Options;
    public selectedLanguageIndex: number;

    constructor(
        private optionsDataService: OptionsDataService,
        private translateService: TranslateService,
        private translationService: TranslationService) {
    }

    ngOnInit() {
        this.loadLanguages();
        this.optionsDataService.load(options => {
            this.options = options;
            this.dbLanguage = this.options.language;
            this.updateSelectedLanguage(this.languages.findIndex(l => l.id === this.options.language));
        });
    }

    public update() {
        this.optionsDataService.update(this.options, (isWellSet, isUpdated) => {
            if (isWellSet) {
                if (isUpdated) {
                    Toast.makeText(this.translationService.get('Common.Updated')).show();
                    FrameModule.topmost().goBack();
                }
                else {
                    Dialogs.alert({
                        title: this.translationService.get('Dialog.Title.Error'),
                        message: this.translationService.get('Common.SavingError'),
                        okButtonText: this.translationService.get('Common.OK')
                    });
                }
            }
            else {
                Dialogs.alert({
                    title: this.translationService.get('Dialog.Title.Warning'),
                    message: this.translationService.get('Common.NotWellSet'),
                    okButtonText: this.translationService.get('Common.OK')
                });
            }
        });
    }
    
    public cancel() {
        FrameModule.topmost().goBack();
    }

    private loadLanguages() {
        let en = new Language();
        en.id = "en";
        en.caption = "English";
        this.languages.push(en);
        let fr = new Language();
        fr.id = "fr";
        fr.caption = "Français";
        this.languages.push(fr);
    }

    private updateSelectedLanguage(selectedLanguageIndex: number) {
        this.selectedLanguageIndex = selectedLanguageIndex;
        this.options.language = this.languages[selectedLanguageIndex].id;
        this.needRestart = this.options.language !== this.dbLanguage;
    }

    public onLanguageIndexChanged(args) {
        if (args !== null) {
            let selectedLanguageIndex: number = args.value;
            this.updateSelectedLanguage(selectedLanguageIndex);
        }
    }
}