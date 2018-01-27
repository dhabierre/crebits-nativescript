import { Component, ChangeDetectorRef, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import { TextField } from "ui/text-field";
import { Category } from "../../shared/models/category";
import { CategoryDataService } from "../../shared/services/data/category.data.service";
import { NavigateService } from "../../shared/services/navigation.service";
import { TranslationService } from "../../shared/services/translation.service";

import FrameModule = require("ui/frame");

let Toast = require("nativescript-toast");
let Dialogs = require("ui/dialogs");

@Component({
    selector: "options",
    templateUrl: "pages/category/category.xml"
    //templateUrl: "./category.xml"
})
export class CategoryComponent implements OnInit, AfterViewInit, OnDestroy {
    
    public category: Category = new Category();
    private paramSubcription: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private categoryDataService: CategoryDataService,
        private translationService: TranslationService) {
    }

    ngOnInit() {
        this.paramSubcription = this.activatedRoute.params.subscribe(params => {
            let id = params['id'];
            if (id > 0) {
                this.categoryDataService.get(id, category => {
                    this.category = category;
                });
            }
        });
    }

    @ViewChild("caption") caption: ElementRef;
    ngAfterViewInit() {
        let element = <TextField>this.caption.nativeElement;
        element.focus(); // TODO: does not work...
    }

    ngOnDestroy() {
        if (this.paramSubcription) {
            this.paramSubcription.unsubscribe();
        }
    }

    public persist() {
        if (this.category.id > 0) {
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
        this.categoryDataService.save(this.category, (isWellSet, alreadyExists, isSaved) => {
            if (!alreadyExists) {
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
            }
            else {
                Dialogs.alert({
                    title: this.translationService.get('Dialog.Title.Warning'),
                    message: this.translationService.get('Page.Category.AlreadyExists'),
                    okButtonText: this.translationService.get('Common.OK')
                });
            }
        });
    }

    private update() {
        this.categoryDataService.update(this.category, (isWellSet, alreadyExists, isUpdated) => {
            if (!alreadyExists) {
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
            }
            else {
                Dialogs.alert({
                    title: this.translationService.get('Dialog.Title.Warning'),
                    message: this.translationService.get('Page.Category.AlreadyExists'),
                    okButtonText: this.translationService.get('Common.OK')
                });
            }
        });
    }
}