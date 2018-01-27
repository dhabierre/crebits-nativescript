export class Operation {
    
    public id: number = 0;
    public categoryId: number = 1; // None
    public isCredit: boolean = false;
    public isDebit: boolean = false;
    public isRecurrent: boolean = false;
    public when: Date = new Date();
    public caption: string = null;
    public value: number = null;
    public overridedValue: number = 0;
    public isDisabled: boolean = false;

    public get cssClass() : string {
        if (this.isDisabled) {
            return "disabled";
        }
        if (this.isCredit) {
            return "credit";
        }
        if (this.isDebit) {
            if (this.caption.indexOf("(+)") > -1 ||
                this.caption.indexOf("[+]") > -1) {
                return "placement";
            }
            else {
                return "debit";
            }
        }
        return "operation";
    }
}