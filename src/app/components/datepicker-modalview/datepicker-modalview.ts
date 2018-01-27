import { Component, OnInit, NgModule } from "@angular/core";
import { Page } from "ui/page";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { DatePicker } from "ui/date-picker";

@Component({
    templateUrl: "components/datepicker-modalview/datepicker-modalview.xml"
    //templateUrl: "./datepicker-modalview.xml"
})
export class DatePickerModalViewComponent implements OnInit {
    
    public title: string;
    public message: string;
    public currentDate: Date;
    private innerCtrlId: string = "innerPicker";

    constructor(
        private page: Page,
        private params: ModalDialogParams) {
        this.title = params.context.title
        this.message = params.context.message
        this.currentDate = new Date(params.context.currentDate);
        this.page.on("unloaded", () => {
            this.params.closeCallback();
        });
    }

    ngOnInit() {
        let datePicker: DatePicker = <DatePicker>this.page.getViewById<DatePicker>(this.innerCtrlId);
        datePicker.date = this.currentDate;
        datePicker.minDate = new Date(datePicker.year - 1, 0, 1);
        datePicker.maxDate = new Date(datePicker.year + 1, 11, 31);
    }

    public submit() {
        let datePicker: DatePicker = <DatePicker>this.page.getViewById<DatePicker>(this.innerCtrlId);
        this.params.closeCallback(datePicker.date);
    }

    public cancel() {
        this.params.closeCallback(null);
    }
}