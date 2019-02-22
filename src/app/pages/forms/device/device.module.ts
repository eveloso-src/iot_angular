import { DeviceService } from './service/device.service';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './modal/modal.component';
import {UpdateDeviceModalComponent} from './update/update-device.component';


@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
      ],
  declarations: [ ],
  entryComponents: [
                    ModalComponent,
                    UpdateDeviceModalComponent,
                  ],
  exports: [
  ],
  providers: [DeviceService],
})
export class DeviceModule { }
