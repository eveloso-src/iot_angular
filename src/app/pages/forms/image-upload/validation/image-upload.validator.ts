import { ImageUploadModel } from '../model/image-upload-model';
import { AbstractControl } from '@angular/forms';
import { ImageUploadService } from '../service/image-upload.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ImageUploadValidator {

    debouncer: any;
    userImageName: string;
    constructor(private imageUploadService: ImageUploadService) {
    }

    checkImageName(control: AbstractControl): any {
        clearTimeout(this.debouncer);
        return new Promise(resolve => {
            this.debouncer = setTimeout(() => {
                this.userImageName = control.value;
                resolve(null);
            }
                , 1000);
        });
    }

    checkTagName(control: AbstractControl): any {
        const imagesTagList: ImageUploadModel[]  = [];
        clearTimeout(this.debouncer);
        return new Promise(resolve => {
            this.debouncer = setTimeout(() => {
                this.imageUploadService.getAllImages().subscribe((data: ImageUploadModel[]) => {
                    if (typeof data !== 'undefined' && data.length > 0) {
                    for (const image of data) {
                        if (image.image_name  === this.userImageName) {
                            imagesTagList.push(image);
                        }
                    }
                    if (typeof imagesTagList !== 'undefined' && imagesTagList.length > 0) {
                        for (const image of imagesTagList) {
                            if (image.image_tag === control.value) {
                                resolve({
                                    'tagnameInUse': true,
                                  });
                            }
                        }
                    }
                    resolve(null);
                }
                else{
                    resolve(null);
                }
            });
            }
                , 1000);
        });
    }


    fileUploadValidator(control: AbstractControl) {
        if (control && (typeof control.value !== undefined && control.value)) {
            if (!(control.value.substring(control.value.lastIndexOf('.') + 1).toLowerCase() === 'tar')) {
                return { isError: true };
            }
        }
        return null;
    }
}

