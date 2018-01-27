import { Component, OnInit, NgModule } from "@angular/core";
import { Page } from "ui/page";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { ListPicker } from "ui/list-picker";

@Component({
    //templateUrl: "components/listpicker-modalview/listpicker-modalview.xml"
    templateUrl: "./listpicker-modalview.xml"
})
export class ListPickerModalViewComponent implements OnInit {
    
    public title: string;
    public message: string;
    public items: Array<any>;
    public selectedIndex: number;
    private innerCtrlId: string = "innerPicker";

    constructor(
        private params: ModalDialogParams,
        private page: Page) {
        this.title = params.context.title;
        this.message = params.context.message;
        this.items = params.context.items;
        this.selectedIndex = this.items.findIndex(c => c.id === params.context.selectedItemId);
        this.page.on("unloaded", () => {
            this.params.closeCallback();
        });
    }

    ngOnInit() {
        let listPicker: ListPicker = <ListPicker>this.page.getViewById<ListPicker>(this.innerCtrlId);
        listPicker.selectedIndex = this.selectedIndex;
    }

    public submit() {
        let listPicker: ListPicker = <ListPicker>this.page.getViewById<ListPicker>(this.innerCtrlId);
        let selectedItem = this.items[listPicker.selectedIndex];
        this.params.closeCallback(selectedItem.id);
    }

    public cancel() {
        this.params.closeCallback(null);
    }
    
    public onIndexChanged(args) {
        if (args !== null) {
            let selectedIndex: number = args.value;
            this.selectedIndex = selectedIndex;
        }
    }
}