import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject } from "@angular/core";

@Component({
    selector: 'app-dialog',
    template: `
        <h2 mat-dialog-title>{{description}}</h2>
    `
})
export class DialogComponent implements OnInit {

    description:string;

    constructor(private dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) data) {

        this.description = data.description;
    }

    ngOnInit() {
    }

    public close() {
        this.dialogRef.close();
    }
}
