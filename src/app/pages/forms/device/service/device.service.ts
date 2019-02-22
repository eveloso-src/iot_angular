import { environment } from '../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DeviceModel } from '../model/device-model';
import { RequestOptions, Request, RequestMethod } from '@angular/http';
import { of as observableOf, Observable, BehaviorSubject } from 'rxjs';
import { ImageCapabilityModel } from '../model/image-capability-model';

@Injectable()
export class DeviceService {

    constructor( private http: HttpClient, private ngxService: NgxUiLoaderService ) { }

    getImageCapabilities() {
        return this
            .http
            .get<ImageCapabilityModel[]>( `${environment.metadataApiUrl}/image-capability` );

    }

    enroll( deviceModel: DeviceModel ): Observable<any> {
        return this.http.post<DeviceModel>( `${environment.mmiotadmin}enrollment`, deviceModel )
    }

    getAll(): Observable<any> {
        return this.http.get( `${environment.metadataApiUrl}/device` )
    }
}
