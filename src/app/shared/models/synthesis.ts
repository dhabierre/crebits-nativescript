import { Category } from "./category"

export class Synthesis {

    public recurrentCredit: number = 0;
    public notRecurrentCredit: number = 0;
    public recurrentDebit: number = 0;
    public notRecurrentDebit: number = 0;
    public categories: Array<CategorySynthesis> = [];
    public recurrent: CategorySynthesis;

    public get credits() : number {
        return this.recurrentCredit + this.notRecurrentCredit;
    } 
    
    public get debits() : number {
        return this.recurrentDebit + this.notRecurrentDebit;
    }
    
    public get cash() : number {
        return this.credits - this.debits;
    }
    
    public get cashPercent() : number {
        return this.credits == 0 ? 0 : Math.round(this.cash * 100 / this.credits);
    }

    public updateCategory(id: number, caption: string, value: number, totalDebits: number) {
        if (this.categories.findIndex(c => c.id === id) < 0) {
            let category = new CategorySynthesis();
            category.id = id;
            category.caption = caption;
            this.categories.push(category);
        }
        let category = this.categories.find(c => c.id === id);
        category.total += value;
        category.percent = Math.round(category.total * 100 / totalDebits);
    }

    public setRecurrent(caption: string, value: number, totalDebits: number) {
        this.recurrent = new CategorySynthesis();
        this.recurrent.id = -1;
        this.recurrent.caption = caption;
        this.recurrent.total = value;
        this.recurrent.percent = Math.round(value * 100 / totalDebits);
    }
}

export class CategorySynthesis {
    
    public id: number = 0
    public caption: string = null;
    public total: number = 0;
    public percent: number = 0;
}