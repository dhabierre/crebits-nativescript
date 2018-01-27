import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class NavigateService {
    
    constructor(
        private router: Router) {
    }

    public toAbout() {
        this.router.navigate(["/about"]);
    }

    public toCategory(id: number) {
        if (id > 0) {
            this.router.navigate(["/category", id]);
        }
        else {
            this.router.navigate(["/category"]);
        }
    }

    public toCategoryList(action: string) {
        if (action !== null && action.length > 0) {
            this.router.navigate(["/category-list", action]);
        }
        else {
            this.router.navigate(["/category-list"]);
        }
    }

    public toOperation(id: number) {
        if (id > 0) {
            this.router.navigate(["/operation", id]);
        }
        else {
            this.router.navigate(["/operation"]);
        }
    }

    public toOperationList(action: string) {
        if (action !== null && action.length > 0) {
            this.router.navigate(["/operation-list", action]);
        }
        else {
            this.router.navigate(["/operation-list"]);
        }
    }

    public toOptions() {
        this.router.navigate(["/options"]);
    }

    public toSynthesis() {
        this.router.navigate(["/home"]);
    }
}