import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateStepService } from './service/create-step.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [],
  exports: [],
  providers: [CreateStepService],
})
export class CreateStepModule { }
