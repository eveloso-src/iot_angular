import { environment } from '../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { ImageUploadModel } from '../model/image-upload-model';
import { CapabilityModel } from '../model/capability-model'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';
import { Device } from '../model/device-model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/operator/map'

@Injectable()
export class ImageUploadService {
    selectedFile: File = null;

    private subject = new Subject<any>();
    constructor(private http: HttpClient, private ngxService: NgxUiLoaderService, private toastr: ToastrService) { }
    registryId: number;
    imageId: string;
    onFileSelected(event) {
        this.selectedFile = event.target.files[0];
    }

    getAllImages() {
        return this
            .http
            .get<ImageUploadModel[]>(`${environment.metadataApiUrl}/image`);
    }

    getAllCapabilities() {
        return this
            .http
            .get<CapabilityModel[]>(`${environment.metadataApiUrl}/capabilities/environmental`);
    }

    getAllDevices() {
        return this
            .http
            .get<Device[]>(`${environment.metadataApiUrl}/device`);
    }

    deleteImageMetaData(id: number) {
        return this
            .http
            .delete(`${environment.metadataApiUrl}/image/id`);
    }

    getRegistryId() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this
                    .http
                    .get(`${environment.metadataApiUrl}/repository`)
                    .subscribe((responseData: any[]) => {
                        if (typeof responseData !== 'undefined' && responseData.length > 0) {
                            this.registryId = responseData[0].id;
                            resolve();
                        } else {
                            reject();
                            //console.log('More than 1 Registry Exists');
                        }
                    },
                        err => {
                            reject(err);
                            throw err;
                        });
            }
                , 1000);
        });
    }

    onImageUpload(imageUploadModel: ImageUploadModel) {
        let uploadedPercentage: string;
        return new Promise((resolve, reject) => {
            this.http.post(`${environment.dockerEngineApiUrl}/images/load`, this.selectedFile, { reportProgress: true, observe: 'events' })
                .subscribe(event => {
                    if (event.type === HttpEventType.UploadProgress) {
                        uploadedPercentage = 'upload ' + Math.round(100 * event.loaded / event.total) + '%';
                        this.subject.next({ uploadedPercentage });
                        //                        console.log('Image  upload Progress, Completed =' + uploadedPercentage);
                    } else if (event.type === HttpEventType.Response) {
                        resolve();
                    }
                },
                    err => {
                        this.ngxService.stop();
                        this.toastr.error(err.error, 'Image Loading Error', {
                            disableTimeOut: true,
                        })
                        reject(err);
                        throw err;
                    });

        });
    }


    tagImageToRegistry(imageName: String, tagName: String) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.http.post(
                    `${environment.dockerEngineApiUrl}/images/${imageName}/tag?repo=${environment.dockerRepo}/${imageName}&tag=${tagName}`, null)
                    .subscribe(data => {
                        var uploadedPercentage = 'Tagging'
                        this.subject.next({ uploadedPercentage });
                        //                console.log('Image Tagging completed');
                        resolve();
                    },
                        err => {
                            this.ngxService.stop();
                            this.toastr.error(err.error.message + ' \n , make sure Image Name and Name of uploaded docker image are same', 'Image Tagging Error', {
                                disableTimeOut: true,
                            })
                            reject(err);
                            throw err;
                        },
                    );
            },
                1000);
        });
    }

    pushImageToRegistry(imageName: String, tagName: String) {
        return new Promise((resolve, reject) => {
            const headers = new HttpHeaders({
                'Content-Type': 'application/octet-stream',
                // tslint:disable-next-line:max-line-length
                'X-Registry-Auth': 'eyAidXNlcm5hbWUiOiAiYWRtaW4iLCJwYXNzd29yZCI6ICJhZG1pbiIsInNlcnZlcmFkZHJlc3MiOiAibG9jYWxob3N0OjUwMDAifQ==',
            });
            const options = { headers: headers };
            this.http.post(`${environment.dockerEngineApiUrl}/images/${environment.dockerRepo}/${imageName}:${tagName}/push`, null, options)
                .subscribe(data => {
                    var uploadedPercentage = 'Push to Registry'
                    this.subject.next({ uploadedPercentage });
                    resolve();
                },
                    err => {
                        console.log(err)
                        if (err.status == 200 && err.statusText == 'OK') {
                            var uploadedPercentage = 'Pushed to Registry'
                            this.subject.next({ uploadedPercentage });
                        }
                        resolve(err);
                        throw err;
                    },
                );
        });
    }

    postImageMetadata(imageUploadModel: ImageUploadModel) {
	    return new Promise((resolve, reject) => {
	      setTimeout(() => {
	        if (typeof this.registryId !== null) {
	          this.http
	            .post<ImageUploadModel>(`${environment.metadataApiUrl}/image`, {
	              'name': imageUploadModel.name,
                  'repository_id': this.registryId,
                  'image_name': imageUploadModel.image_name,
                  'image_id': this.imageId,
                  'image_tag': imageUploadModel.image_tag,
                  'capabilities': imageUploadModel.capabilities,
	            })
	            .subscribe(
	              data => {
	                this.ngxService.stop();
	                resolve();
	              },
	              err => {
	                this.ngxService.stop();
	                this.toastr.error(
	                  err.error.message,
	                  "Error posting metadata API",
	                  {
	                    disableTimeOut: true
	                  }
	                );
	                reject(err);
	                throw err;
	              }
	            );
	        }
	      }, 1000);
	    });
	}

    getUploadedImagePercentage(): Observable<any> {
        return this.subject.asObservable();
    }



    inspectUploadedImage(imageName: String, tagName: String) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.http.get(`${environment.dockerEngineApiUrl}/images/${environment.dockerRepo}/${imageName}:${tagName}/json`)
                    .subscribe((responseData: any) => {
                        if (typeof responseData !== 'undefined') {
                            let unformattedImageId = responseData.Id
                            this.imageId = unformattedImageId.substring(unformattedImageId.indexOf(':') + 1, 19);
                            resolve();
                        } else {
                            reject();
                        }
                    },
                        err => {
                            reject(err);
                            throw err;
                        });
            }
                , 1000);
        });
    }



    deleteDockerImage(imageName: String, tagName: String) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.http.delete(`${environment.dockerEngineApiUrl}/images/${environment.dockerRepo}/${imageName}:${tagName}`)
                    .subscribe(
                        err => console.error(err));
            }, 1000);
        });
    }

}
