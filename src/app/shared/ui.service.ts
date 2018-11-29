import { Subject } from "rxjs";
import { MatSnackBar } from '@angular/material';
import { Injectable } from "@angular/core";

@Injectable()
export class UIService{
    loadingStateChanged = new Subject<boolean>();

    constructor(private snakBar:MatSnackBar){}

    showSnakBar(message,action,duration){
        this.snakBar.open(message,action,{
            duration:duration
        })
    }
}