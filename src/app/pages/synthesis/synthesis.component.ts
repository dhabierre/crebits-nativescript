import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { Page } from "ui/page";
import { ActionBarComponent } from "../ActionBarComponent";
import { Synthesis } from "../../shared/models/synthesis";
import { ExportService } from "../../shared/services/export.service";
import { NavigateService } from "../../shared/services/navigation.service";
import { OptionsDataService } from "../../shared/services/data/options.data.service";
import { PurgeService } from "../../shared/services/purge.service";
import { SynthesisDataService } from "../../shared/services/data/synthesis.data.service";

@Component({
  selector: "synthesis",
  changeDetection: ChangeDetectionStrategy.OnPush,
  //templateUrl: "pages/synthesis/synthesis.xml",
  //styleUrls: ["pages/synthesis/synthesis.css"]
  templateUrl: "./synthesis.xml",
  styleUrls: ["./synthesis.css"]
})
export class SynthesisComponent extends ActionBarComponent implements OnInit {

  public isCashLimit: boolean = false;
  public isPressed: boolean = false;
  public synthesis: Synthesis;

  constructor(
    private changeRef: ChangeDetectorRef,
    protected exportService: ExportService,
    protected navigation: NavigateService,
    private optionsDataService: OptionsDataService,
    private page: Page,
    protected purgeService: PurgeService,
    private synthesisDataService: SynthesisDataService) {
    super(exportService, navigation, purgeService);
    this.registerEvents();
  }

  ngOnInit() {
    this.loadData();
  }

  private registerEvents() {
    this.page.on(Page.navigatingToEvent, () => {
      this.isPressed = false;
      this.loadData();
    });
  }

  private loadData() {
    this.synthesisDataService.load(synthesis => {
      this.synthesis = synthesis;
      this.optionsDataService.load(options => {
        this.isCashLimit = this.synthesis.debits > 0 && this.synthesis.cash < options.cashLimit;
        // the following is required, otherwise the view will not be updated
        this.changeRef.markForCheck();
      });
    });
  }

  public purge() {
    super.purge(() => {
      this.loadData();
    });
  }

  public navigateToOperations() {
    this.isPressed = true;
    super.navigateToOperations();
  }
}