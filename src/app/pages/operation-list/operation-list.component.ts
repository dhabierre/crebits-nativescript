import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import { ActionBarComponent } from "../ActionBarComponent";
import { Operation } from "../../shared/models/operation";
import { ExportService } from "../../shared/services/export.service";
import { NavigateService } from "../../shared/services/navigation.service";
import { OperationDataService } from "../../shared/services/data/operation.data.service";
import { PurgeService } from "../../shared/services/purge.service";
import { TranslationService } from "../../shared/services/translation.service";
import { CurrencyWithoutSymbolPipe } from "../../shared/pipes/currency-without-symbol";

import FrameModule = require("ui/frame");

let Dialogs = require("ui/dialogs");
let Toast = require("nativescript-toast");

@Component({
  selector: "operation-list",
  changeDetection: ChangeDetectionStrategy.OnPush,
  //templateUrl: "pages/operation-list/operation-list.xml",
  //styleUrls: ["pages/operation-list/operation-list.css"]
  templateUrl: "./operation-list.xml",
  styleUrls: ["./operation-list.css"]
})
export class OperationListComponent extends ActionBarComponent {
  
  public credits: Array<Operation> = [];
  public debits: Array<Operation> = [];

  constructor(
    private changeRef: ChangeDetectorRef,
    protected exportService: ExportService,
    protected navigation: NavigateService,
    private operationDataService: OperationDataService,
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
    this.operationDataService.load(operations => {
      this.debits = operations.filter(o => o.isDebit);
      this.credits = operations.filter(o => o.isCredit);
      // the following is required, otherwise the view will not be updated
      this.changeRef.markForCheck();
    });
  }

  public delete(operation: Operation) {
    let operationValue = operation.overridedValue > 0 ? operation.overridedValue : operation.value;
    Dialogs.confirm({
      title: this.translationService.get('Dialog.Title.Delete'),
      message: `${operation.caption} (${this.setCurrency(operationValue)})`,
      okButtonText: this.translationService.get('Common.Yes'),
      cancelButtonText: this.translationService.get('Common.No')
    }).then(isOK => {
      if (isOK) {
        this.operationDataService.delete(operation.id, () => {
          this.loadData();
          Toast.makeText(this.translationService.get('Common.Deleted')).show();
        });
      }
    });
  }

  public edit(operation: Operation) {
    this.navigation.toOperation(operation.id);
  }

  public purge() {
    super.purge(() => {
      this.loadData();
    });
  }
  
  public back() {
    FrameModule.topmost().goBack();
  }
  
  private setCurrency(value: number): string {
    return new CurrencyWithoutSymbolPipe().transform(value, null)
  }
}