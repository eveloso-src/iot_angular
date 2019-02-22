import { ImageUploadService } from "./../../image-upload/service/image-upload.service";
import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { StepModel } from "../model/step-model";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ToastrService } from "ngx-toastr";
import { StepModelScript } from "../../step-script/model/step-model-script";

@Injectable({
  providedIn: "root"
})
export class CreateStepService {
  selectedScript: File = null;
  selectedArtifacts: File[] = null;
  isBaseImageAvailable: boolean = false;

  constructor(
    private http: HttpClient,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private imageUploadService: ImageUploadService
  ) {}

  onScriptSelect(event) {
    this.selectedScript = event.target.files[0];
  }
  onArtifactsSelect(event) {
    this.selectedArtifacts = event.target.files;
  }

  // Service to create a Step with Image
  createStepByImage(stepModel: StepModel) {
    let capabilityList = "";
    capabilityList = stepModel.capabilities.toString();

    let device = "";
    if (stepModel.device_id !== null && stepModel.device_id !== undefined) {
      device = stepModel.device_id.toString();
    }

    let tagsList = "";
    if (stepModel.tags !== null && stepModel.tags !== undefined) {
      tagsList = stepModel.tags.toString();
    }

    const formData = new FormData();
    formData.append("name", stepModel.name);
    formData.append("type", stepModel.type);
    formData.append("author", stepModel.author);
    formData.append("capabilities", capabilityList);
    formData.append("image_name", stepModel.image_name);
    formData.append("image_tag", stepModel.image_tag);
    formData.append("device_id", device);
    formData.append("language", stepModel.language);
    formData.append("architecture", stepModel.architecture);
    formData.append("tags", tagsList);
    formData.append("args", stepModel.argsJSON);

    this.ngxService.start();
    this.http.post(`${environment.mmUrl}/steps`, formData).subscribe(
      data => {
        this.ngxService.stop();
        this.toastr.success(
          "Step name: " +
            stepModel.name +
            " with Id: " +
            data["id"] +
            " created",
          "Success",
          {
            disableTimeOut: true
          }
        );
      },
      err => {
        this.ngxService.stop();
        throw err;
      }
    );
  }

  // Service to create a Step with Script
  createStepByScript(stepModel: StepModelScript) {
    let capabilityList = "";
    capabilityList = stepModel.capabilities.toString();

    let device = "";
    if (stepModel.device_id !== null && stepModel.device_id !== undefined) {
      device = stepModel.device_id.toString();
    }

    let tagsList = "";
    if (stepModel.tags !== null && stepModel.tags !== undefined) {
      tagsList = stepModel.tags.toString();
    }

    const formData = new FormData();
    formData.append("name", stepModel.name);
    formData.append("type", stepModel.type);
    formData.append("author", stepModel.author);
    formData.append("capabilities", capabilityList);
    formData.append("invocation_script", this.selectedScript);
    if (this.selectedArtifacts !== null && this.selectedArtifacts.length > 0) {
      for (let i = 0; i < this.selectedArtifacts.length; i++) {
        formData.append("artifacts" + (i + 1), this.selectedArtifacts[i]);
      }
    }
    formData.append("device_id", device);
    formData.append("language", stepModel.language);
    formData.append("architecture", stepModel.architecture);
    formData.append("tags", tagsList);
    formData.append("args", stepModel.argsJSON);

    this.ngxService.start();
    this.http.post(`${environment.mmUrl}/steps`, formData).subscribe(
      data => {
        this.ngxService.stop();
        this.toastr.success(
          "Step name: " +
            stepModel.name +
            " with Id: " +
            data["id"] +
            " created",
          "Success",
          {
            disableTimeOut: true
          }
        );
      },
      err => {
        this.ngxService.stop();
        throw err;
      }
    );
  }

  checkBaseImage(capabilities: number[]) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.http.get(`${environment.metadataApiUrl}/image`).subscribe(
          (responseData: any[]) => {
            if (
              typeof responseData !== "undefined" &&
              responseData.length > 0
            ) {
              this.isBaseImageAvailable = false;
              for (let image of responseData) {
                let getCapabilities: number[] = image.capabilities;
                getCapabilities.sort(function(a, b) {
                  return a - b;
                });
                capabilities.sort(function(a, b) {
                  return a - b;
                });
                if (getCapabilities.toString() == capabilities.toString()) {
                  this.isBaseImageAvailable = true;
                  break;
                }
              }
              if (!this.isBaseImageAvailable) {
                console.log("Found");
                resolve("Image Not Available");
              } else {
                console.log("Im here");
                reject("Image Available");
              }
            } else {
              reject("Image Available");
            }
          },
          err => {
            reject();
            throw err;
          }
        );
      }, 1000);
    });
  }
}
