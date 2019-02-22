import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { DeviceService } from '../service/device.service';

@Component( {
    selector: 'ngx-modal',
    templateUrl: './update-device.component.html',
} )
export class UpdateDeviceModalComponent {

    modalHeader: string;
    modalContent: string;

    deviceUploadFormGroup: FormGroup;


    constructor( private formBuilder: FormBuilder, private activeModal: NgbActiveModal ) { }

    ngOnInit() {

        this.deviceUploadFormGroup = this.formBuilder.group( {
            keepAlive: ['5000', Validators.required],
            queue: ['telem', Validators.required],
            url: ['tcp://10.20.2.12', Validators.required],

        } );

    }
    updateDevice() {
        
    }
    closeModal() {
        this.activeModal.close();
    }
}
