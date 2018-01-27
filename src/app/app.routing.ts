import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { AboutComponent } from "./pages/about/about.component";
import { CategoryComponent } from "./pages/category/category.component";
import { CategoryListComponent } from "./pages/category-list/category-list.component";
import { OperationComponent } from "./pages/operation/operation.component";
import { OperationListComponent } from "./pages/operation-list/operation-list.component";
import { OptionsComponent } from "./pages/options/options.component";
import { SynthesisComponent } from "./pages/synthesis/synthesis.component";

const routes: Routes = [
    { path: "", component: SynthesisComponent },
    { path: "home", component: SynthesisComponent },
    { path: "about", component: AboutComponent },
    { path: "category", component: CategoryComponent },
    { path: "category/:id", component: CategoryComponent },
    { path: "category-list", component: CategoryListComponent },
    { path: "category-list/:action", component: CategoryListComponent },
    { path: "operation", component: OperationComponent },
    { path: "operation/:id", component: OperationComponent },
    { path: "operation-list", component: OperationListComponent },
    { path: "operation-list/:action", component: OperationListComponent },
    { path: "options", component: OptionsComponent }
];

export const navigatableComponents = [
    AboutComponent,
    OperationComponent,
    OperationListComponent,
    OptionsComponent,
    SynthesisComponent
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }