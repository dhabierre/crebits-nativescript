import { PipeTransform, Pipe } from "@angular/core";
import { DecimalPipe } from "@angular/common";

@Pipe({
    name: "currencyWithoutSymbol"
})
export class CurrencyWithoutSymbolPipe implements PipeTransform {
    transform(value, args): string {
         let pipe = new DecimalPipe('');
         return pipe.transform(value, ".2").replace(",", ".");
    }
}