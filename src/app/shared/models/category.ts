export class Category {
    
    public id: number = 0;
    public caption: string = null;

    toString(): string { // for ListPicker
        return this.caption;
    }
}