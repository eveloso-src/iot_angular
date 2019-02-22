import { AddCapabilityService } from "./../service/add-capability.service";
import { ImageUploadModel } from "./../model/image-upload-model";
import { ImageUploadService } from "./../service/image-upload.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Device } from "../model/device-model";
import { CapabilityModel } from "../model/capability-model";
import { ImageUploadValidator } from "../validation/image-upload.validator";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "image-upload",
  templateUrl: "./image-upload.component.html",
  styleUrls: ["./image-upload.component.scss"]
})
export class ImageUploadComponent implements OnInit {
  imageUploadForm: FormGroup;
  loading = false;
  submitted = false;
  capabilitiesDropdownList: CapabilityModel[];
  devicesDropdownList: Device[];
  devicesSelectedItems = [];
  deviceDropdownSettings = {};
  dropdownSettings = {};
  ImagesList = [];
  imageuploadPercentage: string = "";
  inputFileName = "No file selected";
  private _imagesList: ImageUploadModel[];
  constructor(
    private formBuilder: FormBuilder,
    private imageUploadService: ImageUploadService,
    private addCapabilityService: AddCapabilityService,
    private imageUploadValidator: ImageUploadValidator,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService
  ) {
    addCapabilityService.getPostedCapability().subscribe(value => {
      this.capabilitiesDropdownList = this.capabilitiesDropdownList.concat(
        value.data
      );
    });
    imageUploadService.getUploadedImagePercentage().subscribe(value => {
      if (value.uploadedPercentage !== "NaN%") {
        this.imageuploadPercentage =
          "Image " + value.uploadedPercentage + " completed";
      }
    });
  }

  ngOnInit() {
    this.imageUploadForm = this.formBuilder.group({
      name: ["", Validators.required],
      imageName: [
        "",
        Validators.required,
        this.imageUploadValidator.checkImageName.bind(this.imageUploadValidator)
      ],
      tagName: [
        "",
        Validators.required,
        this.imageUploadValidator.checkTagName.bind(this.imageUploadValidator)
      ],
      author: [""],
      capabilities: ["", Validators.required],
      devices: [""],
      uploadFile: [
        "",
        [Validators.required, this.imageUploadValidator.fileUploadValidator]
      ]
    });

    this.imageUploadService.getAllCapabilities().subscribe(
      (data: CapabilityModel[]) => {
        this.capabilitiesDropdownList = [];
            if ( typeof data !== undefined && data.length >= 1 ) {
              for ( const cap of data ) {
                if ( cap.id !== undefined ) {
                  let capability = {id: cap.id, name: cap.name + ' [ ' + cap.id + ' ]', type: cap.type};
                  this.capabilitiesDropdownList.push(capability);
                }
              }
            }
      },
      err => {
        throw err;
      }
    );
    this.imageUploadService.getAllDevices().subscribe(
      (data: Device[]) => {
        if (typeof data !== undefined && data.length >= 1) {
          const deviceList = [];
          for (const device of data) {
            if (device.name !== undefined) {
              deviceList.push(device);
            }
          }
          this.devicesDropdownList = deviceList;
        }
      },
      err => {
        throw err;
      }
    );
    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.deviceDropdownSettings = {
      singleSelection: true,
      idField: "id",
      textField: "name",
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
  }

  onItemSelect(item: any) {
    //    console.log(item);
  }

  get f() {
    return this.imageUploadForm.controls;
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    const element: HTMLElement = document.getElementById(
      "inputGroupFile01"
    ) as HTMLElement;
    element.click();
  }
  onFileSelected(event) {
    this.inputFileName = "No file selected";
    this.inputFileName = event.target.files[0].name;
    this.imageUploadService.onFileSelected(event);
  }

  onImageUpload() {
    this.submitted = true;
    const capabilitiesSelectedItems: number[] = [];
    // stop here if form is invalid
    // if (this.imageUploadForm.invalid) {
    //     return;
    // }

    this.imageUploadForm.value["capabilities"].forEach((item, index) => {
      capabilitiesSelectedItems.push(item.id);
    });
    // tslint:disable-next-line:max-line-length
    const imageUploadModel = new ImageUploadModel(
      this.imageUploadForm.value["name"],
      this.imageUploadForm.value["imageName"],
      this.imageUploadForm.value["tagName"],
      this.imageUploadForm.value["author"],
      capabilitiesSelectedItems,
      this.imageUploadForm.value["devices"]
    );
    console.log("Submitted the form");
    this.ngxService.start();
    this.imageUploadService.onImageUpload(imageUploadModel).then(() => {
      this.imageUploadService
        .tagImageToRegistry(
          imageUploadModel.image_name,
          imageUploadModel.image_tag
        )
        .then(() => {
          this.imageUploadService
            .inspectUploadedImage(
              imageUploadModel.image_name,
              imageUploadModel.image_tag
            )
            .then(() => {
              this.imageUploadService
                .pushImageToRegistry(
                  imageUploadModel.image_name,
                  imageUploadModel.image_tag
                )
                .then(() => {
                  this.imageUploadService.getRegistryId().then(()=> {
                    this.imageUploadService.postImageMetadata(imageUploadModel);
                  })

                  //this.imageUploadService.deleteDockerImage(imageUploadModel.image_name, imageUploadModel.image_tag);
                  this.toastr.success(
                    "Image " +
                      imageUploadModel.image_name +
                      ":" +
                      imageUploadModel.image_tag +
                      " pushed to Registry successfully",
                    "Success",
                    {
                      disableTimeOut: true,
                      closeButton: true
                    }
                  );
                });
            });
        });
    });
  }

  public get imagesList(): ImageUploadModel[] {
    return this._imagesList;
  }
  public set imagesList(value: ImageUploadModel[]) {
    this._imagesList = value;
  }
  onReset() {
    this.imageUploadForm.reset();
    this.imageUploadForm.markAsPristine();
    this.inputFileName = "No file selected";
  }
}
