import { Injectable } from "@angular/core";
import * as Email from "nativescript-email";
import * as AppVersion from "nativescript-appversion";
import { TranslationService } from "../../shared/services/translation.service";

let Dialogs = require("ui/dialogs");

@Injectable()
export class FeedbackService {
    
    constructor(
        private translationService: TranslationService) {
    }

    public compose() {
        Email.available().then(isAvailable => {
            if (isAvailable) {
                let composeOptions: Email.ComposeOptions;
                AppVersion.getVersionName().then(version => {
                    let subject = this.translationService.get('Feedback.Subject').replace("{{version}}", version);
                    let to = [this.translationService.get('Feedback.To')];
                    composeOptions = {
                        subject: subject,
                        to: to
                    };
                    Email.compose(composeOptions).catch(error => {
                        Dialogs.alert({
                            title: this.translationService.get('Dialog.Title.Warning'),
                            message: error,
                            okButtonText: this.translationService.get('Common.OK')
                        });
                    });
                });
            }
        });
    }
}