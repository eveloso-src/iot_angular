import { ImageUploadModel } from "./../image-upload/model/image-upload-model";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl
} from "@angular/forms";
import { CapabilityModel } from "../image-upload/model/capability-model";
import { Device } from "../image-upload/model/device-model";
import { ImageUploadService } from "../image-upload/service/image-upload.service";
import { StepModelScript } from "./model/step-model-script";
import { CreateStepService } from "../step/service/create-step.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "stepScript",
  styleUrls: ["./step-script.component.scss"],
  templateUrl: "./step-script.component.html"
})
export class CreateStepByScriptComponent implements OnInit {
  createStepForm: FormGroup;
  capabilitiesDropdownList: CapabilityModel[];
  devicesDropdownList: Device[];
  capabilitiesDropdownSettings: {};
  devicesDropdownSettings: {};
  regexPattern = "^[A-Za-z0-9 _-]+$";
  stepTypeList: any = [
    { id: 1, name: "evaluation" },
    { id: 2, name: "recipe" }
  ];
  argButtonText: string;
  scriptFileName = "No file selected";
  artifactsFileName = "No file selected";

  constructor(
    private formBuilder: FormBuilder,
    private createStepService: CreateStepService,
    private imageUploadService: ImageUploadService,
    private ngxService: NgxUiLoaderService,
  ) {}

  ngOnInit() {
    this.createStepForm = this.formBuilder.group({
      name: ["", Validators.required],
      stepType: ["", Validators.required],
      author: ["", Validators.required],
      capabilities: ["", Validators.required],
      uploadScript: ["", Validators.required],
      artifacts: [""],
      devices: [""],
      language: ["", Validators.required],
      architecture: [""],
      tags: [""],
      args: new FormArray([this.initArgs()])
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
        if (typeof data !== undefined && data.length > 1) {
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

    this.capabilitiesDropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.devicesDropdownSettings = {
      singleSelection: true,
      idField: "id",
      textField: "name",
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };

    this.argButtonText = " Add Argument ";
    document.getElementById("argsElement").style.display = "none";
    const control = <FormArray>this.createStepForm.controls["args"];
    control.removeAt(0);
  }

  // Invoked on click of SELECT SCRIPT TO UPLOAD button
  openFileBrowserScript(event: any) {
    event.preventDefault();
    const element: HTMLElement = document.getElementById(
      "uploadScript"
    ) as HTMLElement;
    element.click();
  }

  // Invoked on selection of Script file in File Browser
  onScriptSelect(event) {
    this.scriptFileName = "No file selected";
    this.scriptFileName = event.target.files[0].name;

    if (
      this.artifactsFileName !== "No file selected" &&
      this.scriptFileName !== "No file selected"
    ) {
      if (this.artifactsFileName.includes(this.scriptFileName)) {
        this.createStepForm.controls["uploadScript"].setErrors({
          duplicateScript: true
        });
      } else {
        this.createStepForm.controls["uploadScript"].setErrors(null);
        this.createStepForm.controls["artifacts"].setErrors(null);
      }
    }

    this.createStepService.onScriptSelect(event);
  }

  // Invoked on click of SELECT ARTIFACTS TO UPLOAD button
  openFileBrowserArtifacts(event: any) {
    event.preventDefault();
    const element: HTMLElement = document.getElementById(
      "artifacts"
    ) as HTMLElement;
    element.click();
  }

  // Invoked on selection of Artifact files in File Browser
  onArtifactsSelect(event) {
    this.artifactsFileName = "No file selected";

    if (event.target.files.length !== 0) {
      this.artifactsFileName = "";
      for (const file of event.target.files) {
        this.artifactsFileName += file.name + ", ";
      }
      this.artifactsFileName = this.artifactsFileName.substring(
        0,
        this.artifactsFileName.length - 2
      );
    }

    if (
      this.artifactsFileName !== "No file selected" &&
      this.scriptFileName !== "No file selected"
    ) {
      if (this.artifactsFileName.includes(this.scriptFileName)) {
        this.createStepForm.controls["artifacts"].setErrors({
          duplicateArtifact: true
        });
      } else {
        this.createStepForm.controls["artifacts"].setErrors(null);
        this.createStepForm.controls["uploadScript"].setErrors(null);
      }
    }
    this.createStepService.onArtifactsSelect(event);
  }

  // Invoked when Language field is selected
  getLanguage() {
    this.createStepForm.patchValue({
      language: "Python 3"
    });
  }

  // Invoked to initialize Argument when form is loaded
  initArgs() {
    return new FormGroup({
      key: new FormControl(""),
      value: new FormControl("")
    });
  }

  // Invoked on clicking 'Add another argument'
  addArgs() {
    const control = <FormArray>this.createStepForm.controls["args"];
    control.push(this.initArgs());
  }

  // Invoked when an individual Argument row is removed by clicking (x)
  removeArgs(i: number) {
    const control = <FormArray>this.createStepForm.controls["args"];
    control.removeAt(i);
  }

  getArgs(form) {
    return form.get("args").controls;
  }

  // Invoked on click of 'Add Argument'/'Remove all Arguments' button
  argsToggle() {
    const element = document.getElementById("argsElement");
    const control = <FormArray>this.createStepForm.controls["args"];
    if (element.style.display === "none") {
      this.argButtonText = " Remove all Arguments ";
      element.style.display = "block";
      if (control.length === 0) {
        control.push(this.initArgs());
      }
    } else {
      this.argButtonText = " Add Argument ";
      element.style.display = "none";
      while (control.length !== 0) {
        control.removeAt(0);
      }
    }
  }

  // Invoked on click of CREATE STEP button
  onCreateStep() {
    const capabilitiesSelectedItems: number[] = [];
    this.createStepForm.value["capabilities"].forEach((item, index) => {
      capabilitiesSelectedItems.push(item.id);
    });
    let selectedStepType: string = null;
    this.createStepForm.value["stepType"].forEach((item, index) => {
      selectedStepType = item.name;
    });
    let selectedDevice: number = null;
    if (this.createStepForm.value["devices"].length > 0) {
      this.createStepForm.value["devices"].forEach((item, index) => {
        selectedDevice = item.id;
      });
    }
    const tags: string[] = [];
    if (this.createStepForm.value["tags"].length > 0) {
      this.createStepForm.value["tags"].forEach((a, index) => {
        tags.push(a.value);
      });
    }

    const argInput = this.createStepForm.get("args") as FormArray;
    const map = new Map();
    for (let i = 0; i < argInput.length; i++) {
      const argKey = argInput.at(i).get("key").value;
      const argValue = argInput.at(i).get("value").value;
      if( argValue == "" || argValue == null){
        map.set(argKey, argValue);
      }
      else if( isNaN(Number(argValue))){
        map.set(argKey, argValue);
      }
      else{
        map.set(argKey, Number(argValue));
      }
    }
    const argsJSON = JSON.stringify(
      Array.from(map).reduce((arg, [key, value]) => {
        arg[key] = value;
        return arg;
      }, {})
    );
    const stepModel = new StepModelScript(
      this.createStepForm.value["name"],
      selectedStepType,
      this.createStepForm.value["author"],
      capabilitiesSelectedItems,
      selectedDevice,
      this.createStepForm.value["language"],
      this.createStepForm.value["architecture"],
      tags,
      argsJSON
    );
    this.ngxService.start();
    this.createStepService
      .checkBaseImage(capabilitiesSelectedItems)
      .then(res => {
        console.log(res);
        this.imageUploadService.getRegistryId().then(() => {
          this.imageUploadService
            .postImageMetadata(
              new ImageUploadModel(
                "BASE IMAGE",
                "localhost:5000/python_3.4",
                "x86_64",
                null,
                capabilitiesSelectedItems,
                null
              )
            )
            .then(() => {
              this.createStepService.createStepByScript(stepModel);
            });
        });
      },
      msg => {
        console.log(msg);
        this.createStepService.createStepByScript(stepModel);
      }
      );
  }

  // Invoked on click of RESET button
  onReset() {
    this.createStepForm.reset();
    this.createStepForm.markAsPristine();
    this.scriptFileName = "No file selected";
    this.artifactsFileName = "No file selected";

    const element = document.getElementById("argsElement");
    const control = <FormArray>this.createStepForm.controls["args"];
    this.argButtonText = " Add Argument ";
    element.style.display = "none";
    while (control.length !== 0) {
      control.removeAt(0);
    }
  }
}
