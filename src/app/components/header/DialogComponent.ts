import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject } from "@angular/core";

@Component({
    selector: 'app-dialog',
    template: `
    <div>
        <h2 mat-dialog-title>{{description}}</h2>
        <div mat-dialog-actions>
            <div class="mat-button" (click)="close()" cdkFocusInitial>OK</div>
        </div>
    </div>
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
