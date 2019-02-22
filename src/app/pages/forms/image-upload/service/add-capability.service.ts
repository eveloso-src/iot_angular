import { environment } from '../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {CapabilityModel} from '../model/capability-model';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';

@Injectable()
export class AddCapabilityService {
    private subject = new Subject<any>();
    constructor(private http: HttpClient  , private ngxService: NgxUiLoaderService) {
    }

    addCapability(capabilityModel: CapabilityModel) {
        return new Promise((resolve, reject) => {
        this.ngxService.start();
        this.http.post<CapabilityModel>(`${environment.metadataApiUrl}/capabilities/environmental`,
        {
            'name': capabilityModel.name,
            'type': capabilityModel.type,
        })
        .subscribe(data => {
                this.subject.next({ data});
                resolve(data);
                this.ngxService.stop();
        },
            err => {
                reject(err);
                this.ngxService.stop();
                throw err;
            },
        );
    });
    }

    getPostedCapability(): Observable<any> {
        return this.subject.asObservable();
    }
}
