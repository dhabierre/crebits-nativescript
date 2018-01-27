import { Injectable } from "@angular/core";

export class LogService {
    
    private withDebug : boolean = true;
    private withError : boolean = true;
    private withDump : boolean = false;

    public debug(message: string): void {
        if (this.withDebug) {
            console.log(`*** [DEBUG] > ${message}`);
        }
    }

    public error(message: string): void {
        if (this.withError) {
            console.log(`!!! [ERROR] > ${message}`);
        }
    }

    public dump(value: any): void {
        if (this.withDump) {
            console.dir(value);
        }
    }
}