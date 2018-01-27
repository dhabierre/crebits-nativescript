import { Component, ChangeDetectorRef, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";

import * as Platform from "platform";
import { TranslateService } from "ng2-translate";

import { ExportService } from "../shared/services/export.service";
import { PurgeService } from "../shared/services/purge.service";
import { NavigateService } from "../shared/services/navigation.service";
import { LogService } from "../shared/services/log.service";

export abstract class ActionBarComponent {

    constructor(
        protected exportService: ExportService,
        protected navigation: NavigateService,
        protected purgeService: PurgeService) {
    }
    
    public purge(loadData: () => any) {
        this.purgeService.purge(() => {
          loadData();
        });
    }
    
    public export() {
        this.exportService.compose();
    }

    public navigateToOperations() {
        this.navigation.toOperationList(null);
    }

    public navigateToCreateOperation() {
        this.navigation.toOperation(0);
    }
  
    public navigateToCategories() {
        this.navigation.toCategoryList(null);
    }
      
    public navigateToCreateCategory() {
        this.navigation.toCategory(0);
    }
    
    public navigateToOptions() {
        this.navigation.toOptions();
    }
    
    public navigateToAbout() {
        this.navigation.toAbout();
    }
}