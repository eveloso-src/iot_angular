import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsRoutingModule, routedComponents } from './forms-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddCapabilityComponent } from './image-upload/';
import { NgxUiLoaderModule, NgxUiLoaderConfig, PB_DIRECTION } from 'ngx-ui-loader';
import { TagInputModule } from 'ngx-chips';
import { EnvironmentalCapabilityComponent } from './capability/environmental-capability/environmental-capability.component';
import {NgbdPipelineModal} from '../../pages/forms/pipeline/pipeline-modal/pipeline-modal.component'

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
   fgsColor: '#0568c6',
   fgsPosition: 'center-center',
   fgsSize: 80,
   fgsType: 'circle',
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5,
  hasProgressBar: false,
};

@NgModule({
  imports: [
    ThemeModule,
    FormsRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    TagInputModule,
  ],
  declarations: [
    ...routedComponents, AddCapabilityComponent, EnvironmentalCapabilityComponent, NgbdPipelineModal,
  ],
})
export class FormsModule { }
