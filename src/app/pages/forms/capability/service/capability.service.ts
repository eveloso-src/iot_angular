import { environment } from '../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { Device } from '../../image-upload/model/device-model';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class CapabilityService {

  constructor(private http: HttpClient, private ngxService: NgxUiLoaderService, private toastr: ToastrService) {}

  // To get all device definitions
  getAllDeviceDef() {
        return this
            .http
            .get<Device[]>(`${environment.metadataApiUrl}/device-definition`);
  }

  // To deploy capability on device
  onDeployCapDevice(capabilitiesSelectedItems, selectedDev) {
        console.log('Deploying Capability to Device');
        this.ngxService.start();

        capabilitiesSelectedItems.forEach((item, index) => {
          this.http.post(`${environment.metadataApiUrl}/device-definition/${selectedDev}/environmental`,
          {
            'id': item,
          })
          .subscribe(
            data => {
              this.ngxService.stop();
              this.toastr.success('Capability is deployed to device ' + selectedDev);
            },
            err => {
              this.ngxService.stop();
              throw err;
            },
          );
        });
  }
}
