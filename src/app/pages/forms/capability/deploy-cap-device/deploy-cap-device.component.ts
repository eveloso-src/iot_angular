import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageUploadService } from '../../image-upload/service/image-upload.service';
import { CapabilityService } from '../service/capability.service';
import { CapabilityModel } from '../../image-upload/model/capability-model';
import { Device } from '../../image-upload/model/device-model';
import {AddCapabilityService} from '../../image-upload/service/add-capability.service'

@Component( {
    selector: 'deploy-cap-device',
    styleUrls: ['./deploy-cap-device.component.scss'],
    templateUrl: './deploy-cap-device.component.html',
} )

export class DeployCapDeviceComponent implements OnInit {
    deployCapDeviceForm: FormGroup;
    capDropdownList: CapabilityModel[];
    DdefDropdownList: Device[];
    capDropdownSettings = {};
    DdefDropdownSettings = {};
    submitted = false;
    selectedDev: number;

    constructor( private formBuilder: FormBuilder, private imageUploadService: ImageUploadService,
      private capabilityService: CapabilityService ,private addCapabilityService: AddCapabilityService) {
        addCapabilityService.getPostedCapability().subscribe(value => {
          this.capDropdownList = this.capDropdownList.concat(value.data)
        });

       }

    ngOnInit() {
        this.deployCapDeviceForm = this.formBuilder.group({
          capabilities: ['', Validators.required],
          deviceDef: ['', Validators.required],
        });

        this.capDropdownSettings = {
          singleSelection: false,
          idField: 'id',
          textField: 'name',
          itemsShowLimit: 3,
          enableCheckAll: false,
          allowSearchFilter: true,
          closeDropDownOnSelection: true,
        };

        this.DdefDropdownSettings = {
          singleSelection: true,
          idField: 'id',
          textField: 'name',
          itemsShowLimit: 3,
          allowSearchFilter: true,
          closeDropDownOnSelection: true,
        };

        this.imageUploadService.getAllCapabilities()
          .subscribe((data: CapabilityModel[]) => {
            this.capDropdownList = [];
            if ( typeof data !== undefined && data.length >= 1 ) {
              for ( const cap of data ) {
                if ( cap.id !== undefined ) {
                  let capability = {id: cap.id, name: cap.name + ' [ ' + cap.id + ' ]', type: cap.type};
                  this.capDropdownList.push(capability);
                }
              }
            }
          },
          err => {
              throw err;
        });

        this.capabilityService.getAllDeviceDef()
	      .subscribe((data: Device[]) => {
	        if (typeof data !== undefined && data.length >= 1) {
	          const deviceList = [];
	          for (const device of data) {
	            if (device.name !== undefined && device.name !== null) {
	              deviceList.push(device);
	            }
	          }
	          this.DdefDropdownList = deviceList;
	        }
	      },
	      err => {
	          throw err;
	    });

    }

  onItemSelect(item: any) {
  }
  // To deploy capability to device.
  onDeployCap() {
    this.submitted = true;
    const capabilitiesSelectedItems: number[] = [];
    this.deployCapDeviceForm.value['capabilities'].forEach((item, index) => {
      capabilitiesSelectedItems.push(item.id);
    });
    this.deployCapDeviceForm.value['deviceDef'].forEach((item, index) => {
        this.selectedDev = item.id;
    });

    this.capabilityService.onDeployCapDevice(capabilitiesSelectedItems, this.selectedDev);
  }

    // Invoked when RESET button is clicked
    onReset() {
      this.deployCapDeviceForm.reset();
      this.deployCapDeviceForm.markAsPristine();
    }
}
