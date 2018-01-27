export class Language {
    
    public id: string = null;
    public caption: string = null;

    toString(): string { // for ListPicker
        return this.caption;
    }
}