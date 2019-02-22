import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component( {
    selector: 'ngx-form-inputs',
    styleUrls: ['./nifi.component.scss'],
    templateUrl: './nifi.component.html',
} )
export class NifiComponent {
    nifiFormGroup: FormGroup;
    ngOnInit() {
        this.nifiFormGroup = this.formBuilder.group( {
            match: [''],
            topic: [''],
            replace: [''],
        } );
    }

    constructor( private formBuilder: FormBuilder
    ) {
    }
}
