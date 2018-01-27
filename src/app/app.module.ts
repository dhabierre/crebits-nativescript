import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from "ng2-translate";
import { Http } from "@angular/http";
import { TNSCheckBoxModule } from "nativescript-checkbox/angular";

import { AppComponent } from "./app.component";

import { AboutComponent } from "./pages/about/about.component";
import { CategoryComponent } from "./pages/category/category.component";
import { CategoryListComponent } from "./pages/category-list/category-list.component";
import { OperationComponent } from "./pages/operation/operation.component";
import { OperationListComponent } from "./pages/operation-list/operation-list.component";
import { OptionsComponent } from "./pages/options/options.component";
import { SynthesisComponent } from "./pages/synthesis/synthesis.component";

//import { ActionBarItemsComponent } from "./components/actionbaritems/actionbaritems.component";

import { CategoryDataService } from "./shared/services/data/category.data.service";
import { DbService } from "./shared/services/db.service";
import { ExportService } from "./shared/services/export.service";
import { FeedbackService } from "./shared/services/feedback.service";
import { LogService } from "./shared/services/log.service";
import { NavigateService } from "./shared/services/navigation.service";
import { OperationDataService } from "./shared/services/data/operation.data.service";
import { OptionsDataService } from "./shared/services/data/options.data.service";
import { PurgeService } from "./shared/services/purge.service";
import { SynthesisDataService } from "./shared/services/data/synthesis.data.service";
import { TranslationService } from "./shared/services/translation.service";

import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { TNSFontIconModule } from "nativescript-ngx-fonticon";

import { enableProdMode } from "@angular/core";
enableProdMode();

import { registerElement } from "nativescript-angular/element-registry";
registerElement("Fab", () => require("nativescript-floatingactionbutton").Fab);

import { CurrencyWithoutSymbolPipe } from "./shared/pipes/currency-without-symbol";

import { DatePickerModalViewComponent } from "./components/datepicker-modalview/datepicker-modalview";
import { ListPickerModalViewComponent } from "./components/listpicker-modalview/listpicker-modalview";

export function translateLoaderFactory(http: Http) {
    return new TranslateStaticLoader(http, "/i18n", ".json");
};

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptHttpModule,
        TNSCheckBoxModule,
        TranslateModule.forRoot([{
            provide: TranslateLoader,
            deps: [Http],
            useFactory: (translateLoaderFactory)}]),
        TNSFontIconModule.forRoot({
            'mdi': 'material-design-icons.css'})
    ],
    declarations: [
        AppComponent,
        AboutComponent,
        CategoryComponent,
        CategoryListComponent,
        OptionsComponent,
        OperationComponent,
        OperationListComponent,
        SynthesisComponent,
        // Pipes
        CurrencyWithoutSymbolPipe,
        // TODO
        //ActionBarItemsComponent,
        // Components
        DatePickerModalViewComponent,
        ListPickerModalViewComponent
    ],
    entryComponents: [
        DatePickerModalViewComponent,
        ListPickerModalViewComponent
    ],
    providers: [
        DbService,
        CategoryDataService,
        OperationDataService,
        OperationDataService,
        OptionsDataService,
        SynthesisDataService,
        ExportService,
        FeedbackService,
        PurgeService,
        NavigateService,
        LogService,

        TranslationService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }