import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateStepService } from '../step/service/create-step.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
   // BrowserAnimationsModule
  ],
  declarations: [],
  exports: [],
  providers: [CreateStepService],
})
export class CreateStepScriptModule { }
