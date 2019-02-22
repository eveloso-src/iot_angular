import { ImageUploadValidator } from './validation/image-upload.validator';
import { ImageUploadService } from './service/image-upload.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AddCapabilityService} from './service/add-capability.service';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
      ],
  declarations: [ ],
  exports: [
  ],
  providers: [ImageUploadService, ImageUploadValidator, AddCapabilityService],
})
export class ImageModule { }

