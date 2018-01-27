import { Injectable } from "@angular/core";
import * as Email from "nativescript-email";
import { Operation } from "../models/operation";
import { Options } from "../models/options";
import { OperationDataService } from "./data/operation.data.service";
import { OptionsDataService } from "./data/options.data.service";
import { SynthesisDataService } from "./data/synthesis.data.service";
import { TranslationService } from "../../shared/services/translation.service";
import { CurrencyWithoutSymbolPipe } from "../../shared/pipes/currency-without-symbol";

let Dialogs = require("ui/dialogs");

@Injectable()
export class ExportService {
    
    constructor(
        private translationService: TranslationService,
        private operationDataService: OperationDataService,
        private synthesisDataService: SynthesisDataService,
        private optionsDataService: OptionsDataService) {
    }

    public compose() {
        Email.available().then(isAvailable => {
            if (isAvailable) {
                let composeOptions: Email.ComposeOptions;
                this.optionsDataService.load(options => {
                    this.createBody(body => {
                        let subject = this.translationService.get('ExportData.Subject').replace("{{date}}", this.getDisplayDate(new Date()));
                        composeOptions = {
                            subject: subject,
                            body: body
                        };
                        if (options.email != null && options.email.length > 0) {
                            composeOptions.to = [options.email];
                        }
                        Email.compose(composeOptions).catch(error => {
                            Dialogs.alert({
                                title: this.translationService.get('Dialog.Title.Warning'),
                                message: error,
                                okButtonText: this.translationService.get('Common.OK')
                            });
                        });
                    });
                });
            }
            else {
                Dialogs.alert({
                    title: this.translationService.get('Dialog.Title.Warning'),
                    message: this.translationService.get('Common.EmailComposeError.NotAvailable'),
                    okButtonText: this.translationService.get('Common.OK')
                });
            }
        })
        .catch(error => {
            Dialogs.alert({
                title: this.translationService.get('Dialog.Title.Warning'),
                message: error,
                okButtonText: this.translationService.get('Common.OK')
            });
        });
    }
    
    private createBody(callback: (body: string) => any) {
        this.synthesisDataService.load(synthesis => {
            let body: string = '';
            // Synthesis - Global
            body += `<b>-- ${this.translationService.get('Common.Credits')}</b><br />`;
            body += `<br />`;
            body += `<span>${this.translationService.get('Common.Total')}: ${this.setCurrency(synthesis.credits)}</span><br />`;
            body += `<span>${this.translationService.get('Common.Recurrent')}: ${this.setCurrency(synthesis.recurrentCredit)}</span><br />`;
            body += `<span>${this.translationService.get('Common.NotRecurrent')}: ${this.setCurrency(synthesis.notRecurrentCredit)}</span><br />`;
            body += `<br />`;
            body += `<b>-- ${this.translationService.get('Common.Debits')}</b><br />`;
            body += `<br />`;
            body += `<span>${this.translationService.get('Common.Total')}: ${this.setCurrency(synthesis.debits)}</span><br />`;
            body += `<span>${this.translationService.get('Common.Recurrent')}: ${this.setCurrency(synthesis.recurrentDebit)}</span><br />`;
            body += `<span>${this.translationService.get('Common.NotRecurrent')}: ${this.setCurrency(synthesis.notRecurrentDebit)}</span><br />`;
            body += `<br />`;
            body += `<b>-- ${this.translationService.get('Common.Cash')}</b><br />`;
            body += `<br />`;
            body += `<span>${this.setCurrency(synthesis.cash)} (${synthesis.cashPercent}%)</span><br />`;
            body += `<br />`;
            // Synthesis - Categories
            if (synthesis.categories.length > 0) {
                body += `<b>-- ${this.translationService.get('Page.Categories.Title')}</b><br />`;
                body += `<br />`;
                synthesis.categories.forEach(category => {
                    body += `<span>${category.caption}: ${this.setCurrency(category.total)} (${category.percent}%)</span><br />`;
                });
                body += `<br />`;
            }
            this.operationDataService.load(operations => {
                if (operations.length > 0) {
                    body += `<b>-- ${this.translationService.get('Page.Operations.Title')}</b><br />`;
                    // Operations - Credits
                    let credits: Array<Operation> = operations.filter(o => o.isCredit && !o.isDisabled);
                    if (credits.length > 0) {
                        body += `<br />`;
                        credits.forEach(credit => {
                            let value = this.setCurrency(this.getValue(credit.value, credit.overridedValue));
                            if (credit.isRecurrent) {
                                body += `<span>${credit.caption}: ${value}</span><br />`;
                            }
                            else {
                                body += `<span>${credit.caption}: ${credit.value} (${this.getDisplayDate(credit.when)})</span><br />`;
                            }
                        });
                    }
                    // Operations - Debits
                    let debits: Array<Operation> = operations.filter(o => o.isDebit && !o.isDisabled);
                    if (debits.length > 0) {
                        body += `<br />`;
                        debits.forEach(debit => {
                            let value = this.setCurrency(this.getValue(debit.value, debit.overridedValue));
                            if (debit.isRecurrent) {
                                body += `<span>${debit.caption}: ${value}</span><br />`;
                            }
                            else {
                                body += `<span>${debit.caption}: ${value} (${this.getDisplayDate(debit.when)})</span><br />`;
                            }
                        });
                    }
                }
                callback(body);
            });
        });
    }

    private getValue(value: number, overridedValue: number): number {
        return overridedValue > 0 ? overridedValue : value;
    }

    private getDisplayDate(value: Date): string {
        try {
            return new Date(value).toISOString().slice(0, 10);
        }
        catch {
            return value.toString();
        }
    }

    private setCurrency(value: number): string {
        return new CurrencyWithoutSymbolPipe().transform(value, null)
    }
}