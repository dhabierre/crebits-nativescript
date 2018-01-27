import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import { ActionBarComponent } from "../ActionBarComponent";
import { Category } from "../../shared/models/category";
import { CategoryDataService } from "../../shared/services/data/category.data.service";
import { ExportService } from "../../shared/services/export.service";
import { NavigateService } from "../../shared/services/navigation.service";
import { PurgeService } from "../../shared/services/purge.service";
import { TranslationService } from "../../shared/services/translation.service";

let Dialogs = require("ui/dialogs");
let Toast = require("nativescript-toast");

@Component({
  selector: "category-list",
  changeDetection: ChangeDetectionStrategy.OnPush,
  //templateUrl: "pages/category-list/category-list.xml",
  //styleUrls: ["pages/category-list/category-list.css"]
  templateUrl: "./category-list.xml",
  styleUrls: ["./category-list.css"]
})
export class CategoryListComponent extends ActionBarComponent {
  
  public categories: Array<Category> = [];

  constructor(
    private categoryDataService: CategoryDataService,
    private changeRef: ChangeDetectorRef,
    protected exportService: ExportService,
    protected navigation: NavigateService,
    private page: Page,
    protected purgeService: PurgeService,
    private translationService: TranslationService) {
    super(exportService, navigation, purgeService);
    this.registerEvents();
  }

  private registerEvents() {
    this.page.on(Page.navigatingToEvent, () => {
      this.loadData();
    });
  }

  private loadData() {
    this.categoryDataService.load(true, categories => {
      this.categories = categories;
      // the following is required, otherwise the view will not be updated
      this.changeRef.markForCheck();
    });
  }

  public delete(category: Category) {
    Dialogs.confirm({
      title: this.translationService.get('Dialog.Title.Delete'),
      message: category.caption,
      okButtonText: this.translationService.get('Common.Yes'),
      cancelButtonText: this.translationService.get('Common.No')
    }).then(isOK => {
      if (isOK) {
        this.categoryDataService.delete(category.id, isDeleted => {
          let toast;
          if (isDeleted) {
            this.loadData();
            toast = Toast.makeText(this.translationService.get('Common.Deleted'));
          }
          else {
            toast = Toast.makeText(this.translationService.get('Page.Categories.Actions.NotDeleted'));
          }
          toast.show();
        });
      }
    });
  }

  public edit(category: Category) {
    this.navigation.toCategory(category.id);
  }

  public purge() {
    super.purge(() => {
      this.loadData();
    });
  }
}