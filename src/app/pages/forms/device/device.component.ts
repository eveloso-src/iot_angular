import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from './service/device.service';
import { DeviceModel } from './model/device-model';
import { ModalComponent } from './modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateDeviceModalComponent } from './update/update-device.component';
import { ImageCapabilityModel } from './model/image-capability-model';
import { of as observableOf, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component( {
    selector: 'ngx-form-inputs',
    styleUrls: ['./device.component.scss'],
    templateUrl: './device.component.html',
} )
export class DeviceComponent {

    deviceFormGroup: FormGroup;
    device: DeviceModel;
    capabilitiesDropdownList: ImageCapabilityModel[];
    dropdownSettings = {};
    devices: any[];
    data: any[];

    constructor( private modalService: NgbModal,
        private formBuilder: FormBuilder, private deviceService: DeviceService
        , private toastr: ToastrService) {
    }

    ngOnInit() {

        this.deviceFormGroup = this.formBuilder.group( {
            registrationId: ['', Validators.required, ],
            publicKey: ['', Validators.required, ],
            keepAlive: ['', Validators.required, ],
            topic: ['', Validators.required, ],
            queue: ['', Validators.required, ],
            url: ['', Validators.required, ],
            capabilitiesID: ['', Validators.required],
        } );

        this.deviceService.getAll().subscribe(
            ( data: DeviceModel[] ) => {
                this.devices = data;
            }
            ,
            err => {
                throw err;
            } );

        this.deviceService.getImageCapabilities()
            .subscribe((
                data: ImageCapabilityModel[] ) => {
                this.capabilitiesDropdownList = [];
                if ( typeof data !== undefined && data.length >= 1 ) {
                    let capList = [];
                    for ( const cap of data ) {
                        if ( cap.image !== undefined ) {
                            capList.push( cap );
                        }
                    }

                    this.data = capList;

                    capList.forEach( elementImage => {

                        elementImage.image.name += ' [ ';

                        elementImage.image.capabilities.forEach( element => {
                            elementImage.image.name += element + ' ';
                        } );

                        elementImage.image.name += ']';
                        this.capabilitiesDropdownList.push( elementImage.image );
                    } )
                }
            },
            err => {
                throw err;
            } );

        this.dropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Select One',
            unSelectAllText: 'UnSelect',
            itemsShowLimit: 3,
            allowSearchFilter: true,
        };
    }

    onItemSelect( item: any ) {
    }
    onSelectAll( items: any ) {
    }

    onDeviceClick( id: number ) {
        const activeModal = this.modalService.open( UpdateDeviceModalComponent, { size: 'sm', container: 'nb-layout' } );
        activeModal.componentInstance.modalContent = 'Please, update the following fields';
        activeModal.componentInstance.modalHeader = 'Update';
    }

    enroll(): void {
        if (isNaN(  this.deviceFormGroup.value['keepAlive'])) {
            this.deviceFormGroup.value['keepAlive'] = 0;
        }
        const capabilitiesSelectedItems: number[] = [];
        this.deviceFormGroup.value['capabilitiesID'].forEach(( item, index ) => {
            const selected = this.data.filter( x => x.image.id === item.id );
            selected.forEach( x => {
                x.image.capabilities.forEach( elem => {
                    capabilitiesSelectedItems.push( elem );
                } )
            } )
        } );

        const device = new DeviceModel( this.deviceFormGroup.value['registrationId'], this.deviceFormGroup.value['publicKey'],
            this.deviceFormGroup.value['keepAlive'],
            this.deviceFormGroup.value['topic'],
            this.deviceFormGroup.value['queue'],
            this.deviceFormGroup.value['url'],
            capabilitiesSelectedItems,
        );

        this.deviceService.enroll( device ).subscribe(
            res => {
                this.toastr.success('Device Enrolled Successfully', 'Success', {
                    disableTimeOut: true,
                    closeButton: true,
                  });
                  this.modalService.dismissAll();

//                const activeModal = this.modalService.open( ModalComponent, { size: 'lg', container: 'nb-layout' } );
//                activeModal.componentInstance.modalContent = res;
//                activeModal.componentInstance.modalHeader = 'Result';
                return res;
            },
            err => {
//                const activeModal = this.modalService.open( ModalComponent, { size: 'lg', container: 'nb-layout' } );
//                activeModal.componentInstance.modalHeader = 'Result';
                if (err.status == 200) {
                    this.toastr.success('Device Enrolled Successfully', 'Success', {
                        disableTimeOut: true,
                        closeButton: true,
                      });
                      this.modalService.dismissAll();

                }
                else {
                    if ( err.error.text != null  ) {

                        this.toastr.error( err.error.text, 'Device Enrollment Error', {
                            disableTimeOut: true,
                        } );
                    }
                    else {
                        this.toastr.error( err.error, 'Device Enrollment Error', {
                            disableTimeOut: true,
                        } );
                    }

                }
                return err;
            }
        );
    }

        // Invoked on click of RESET button
        onReset(){
            this.deviceFormGroup.reset();
            this.deviceFormGroup.markAsPristine();
          }
}
