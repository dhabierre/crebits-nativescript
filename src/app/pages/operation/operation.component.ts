import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { Component, ViewContainerRef, ChangeDetectorRef, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DatePickerModalViewComponent } from "../../components/datepicker-modalview/datepicker-modalview";
import { ListPickerModalViewComponent } from "../../components/listpicker-modalview/listpicker-modalview";
import { Category } from "../../shared/models/category";
import { Operation } from "../../shared/models/operation";
import { CategoryDataService } from "../../shared/services/data/category.data.service";
import { LogService } from "../../shared/services/log.service";
import { NavigateService } from "../../shared/services/navigation.service";
import { OperationDataService } from "../../shared/services/data/operation.data.service";
import { OptionsDataService } from "../../shared/services/data/options.data.service";
import { TranslationService } from "../../shared/services/translation.service";

import FrameModule = require("ui/frame");

var Toast = require("nativescript-toast");
var Dialogs = require("ui/dialogs");
var Moment = require("moment");

@Component({
    selector: "options",
    templateUrl: "pages/operation/operation.xml"
    //templateUrl: "./operation.xml"
})
export class OperationComponent implements OnInit, OnDestroy {
    
    public categories: Array<Category>;
    public currentMonth: string;
    public operation: Operation = new Operation();
    public selectedCategory: Category;
    private paramSubcription: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private categoryDataService: CategoryDataService,
        private logService: LogService,
        private modalService: ModalDialogService,
        private operationDataService: OperationDataService,
        private optionsDataService: OptionsDataService,
        private translationService: TranslationService,
        private viewContainerRef: ViewContainerRef) {
        this.operation.isDebit = true;
        this.operation.isCredit = false;
    }

    ngOnInit() {
        this.categoryDataService.load(false, categories => {
            this.categories = categories;
            this.paramSubcription = this.activatedRoute.params.subscribe(params => {
                let id = params['id'];
                if (id > 0) {
                    this.operationDataService.get(id, operation => {
                        this.operation = operation;
                        if (this.operation.overridedValue === 0) {
                            this.operation.overridedValue = null; // UI: to display the hint
                        }
                    });
                }
                this.selectedCategory = this.categories.find(c => c.id === this.operation.categoryId);
            });
        });
        this.optionsDataService.load(options => {
            this.currentMonth = Moment().locale(options.language).format("MMMM");
        });
    }

    ngOnDestroy() {
        if (this.paramSubcription) {
            this.paramSubcription.unsubscribe();
        }
    }

    public persist() {
        if (this.operation.isCredit) {
            this.operation.categoryId = 1; // None -> no categorie on Credit operation
        }
        if (this.operation.id > 0) {
            this.update();
        }
        else {
            this.save();
        }
    }

    public cancel() {
        FrameModule.topmost().goBack();
    }

    private save() {
        this.operationDataService.save(this.operation, (isWellSet, isSaved) => {
            if (isWellSet) {
                if (isSaved) {
                    Toast.makeText(this.translationService.get('Common.Saved')).show();
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

    private update() {
        this.operationDataService.update(this.operation, (isWellSet, isUpdated) => {
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

    // Fix poor Switch 2-way binding...
    public onIsDebitChange(args: any) {
        if (args !== null && args.value !== null) {
            let checked: boolean = args.value;
            this.operation.isDebit = checked;
            this.operation.isCredit = !checked;
        }
    }

    // Fix poor Switch 2-way binding...
    public onIsRecurrentChange(args: any) {
        if (args !== null && args.value !== null) {
            let checked: boolean = args.value;
            this.operation.isRecurrent = checked;
        }
    }

    // Fix poor Switch 2-way binding...
    public onIsDisabledChange(args: any) {
        if (args !== null && args.value !== null) {
            let checked: boolean = args.value;
            this.operation.isDisabled = checked;
        }
    }

    // When (DatePicker)

    public selectWhen() {
        this.createDatePickerModalView().then(when => {
            if (!!when) {
                this.operation.when = when;
            }
        }).catch(error => this.logService.dump(error));
    }

    private createDatePickerModalView(): Promise<any> {
        let title = `${this.translationService.get('Page.Operation.Title')} > ${this.translationService.get('Common.Date')}`;
        let message = null;
        const options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            context: {
                title: title,
                message: message,
                currentDate: this.operation.when
            },
            fullscreen: true,
        };
        return this.modalService.showModal(DatePickerModalViewComponent, options);
    }

    // Category (ListPicker)

    public selectCategory() {
        this.createListPickerModalView().then(selectedCategoryId => {
            if (!!selectedCategoryId) {
                this.selectedCategory = this.categories.find(c => c.id == selectedCategoryId);
                this.operation.categoryId = this.selectedCategory.id;
            }
        }).catch(error => this.logService.dump(error));
    }

    private createListPickerModalView(): Promise<any> {
        let title = `${this.translationService.get('Page.Operation.Title')} > ${this.translationService.get('Page.Category.Title')}`;
        let message = this.translationService.get('Page.Operation.AddCategory');
        const options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            context: {
                title: title,
                message: message,
                items: this.categories,
                selectedItemId: this.operation.categoryId
            },
            fullscreen: true,
        };
        return this.modalService.showModal(ListPickerModalViewComponent, options);
    }
}