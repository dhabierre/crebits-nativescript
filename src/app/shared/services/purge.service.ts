import { Injectable } from "@angular/core";
import { Operation } from "../models/operation";
import { OperationDataService } from "./data/operation.data.service";
import { TranslationService } from "../../shared/services/translation.service";

let Toast = require("nativescript-toast");
let Dialogs = require("ui/dialogs");

@Injectable()
export class PurgeService {
    
    constructor(
        private translationService: TranslationService,
        private dataService: OperationDataService) {
    }

    public purge(callback: () => any) {
        Dialogs.confirm({
            title: this.translationService.get('Dialog.Title.Continue'),
            message: this.translationService.get('Purge.Message'),
            okButtonText: this.translationService.get('Common.Yes'),
            cancelButtonText: this.translationService.get('Common.No')
        }).then(isOK => {
            if (isOK) {
                this.dataService.purge(isPurged => {
                    if (isPurged) {
                        Toast.makeText(this.translationService.get('Purge.Success')).show();
                        callback();
                    }
                    else {
                        Toast.makeText(this.translationService.get('Purge.Error')).show();
                    }
                });
            }
        });
    }
}