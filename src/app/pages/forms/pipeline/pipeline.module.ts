import { PipelineService } from './service/pipeline.service';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {PipelineModalService } from './service/pipeline-modal.service'
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
  providers: [PipelineService ,PipelineModalService],
})
export class PipelineModule { }

