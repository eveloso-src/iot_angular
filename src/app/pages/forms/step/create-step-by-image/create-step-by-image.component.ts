import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { CapabilityModel } from '../../image-upload/model/capability-model';
import { Device } from '../../image-upload/model/device-model';
import { ImageUploadModel } from '../../image-upload/model/image-upload-model';
import { ImageUploadService } from '../../image-upload/service/image-upload.service';
import { StepModel } from '../model/step-model';
import { CreateStepService } from '../service/create-step.service';

@Component({
  selector: 'create-step-by-image',
  templateUrl: './create-step-by-image.component.html',
  styleUrls: ['./create-step-by-image.component.scss'],
})

export class CreateStepByImageComponent implements OnInit {
  createStepForm: FormGroup;
  imagesDropdownList: ImageUploadModel[];
  capabilitiesDropdownList: CapabilityModel[];
  devicesDropdownList: Device[];
  completeImageList: ImageUploadModel[];
  capabilitiesDropdownSettings: {};
  imagesDropdownSettings: {};
  devicesDropdownSettings: {};
  filteredTags: ImageUploadModel[] = [];
  filteredTagName: string[];
  regexPattern = '^[A-Za-z0-9 _-]+$';
  stepTypeList: any = [
    { id: 1, name: 'evaluation' },
    { id: 2, name: 'recipe' },
  ];
  argButtonText: string;

  constructor(private formBuilder: FormBuilder, private imageUploadService: ImageUploadService,
    private createStepService: CreateStepService) { }

  ngOnInit() {
    this.createStepForm = this.formBuilder.group({
      name: ['', Validators.required],
      stepType: ['', Validators.required],
      author: ['', Validators.required],
      capabilities: ['', Validators.required],
      imageName: ['', Validators.required],
      imageTag: ['', Validators.required],
      devices: [''],
      language: ['', Validators.required],
      architecture: [''],
      tags: [''],
      args: new FormArray([
        this.initArgs(),
      ]),
    });

    this.imageUploadService.getAllImages()
      .subscribe((data: ImageUploadModel[]) => {
        if (typeof data !== undefined && data.length >= 1) {
          this.completeImageList = data;
          const imageList = [];
          for (const image of data) {
            if (image.name !== undefined) {
              if (imageList.length > 0) {
                if (imageList.some(e => e.image_name === image.image_name)) {
                  continue;
                }
                else {
                  imageList.push(image);
                }
              }
              if (imageList.length === 0) {
                imageList.push(image);
              }
            }
          }
          this.imagesDropdownList = imageList;
        }

        //this.imagesDropdownList = data;
      },
        err => {
          throw err;
        });

    this.imageUploadService.getAllCapabilities()
      .subscribe((data: CapabilityModel[]) => {
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
        });

    this.imageUploadService.getAllDevices()
      .subscribe((data: Device[]) => {
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
        });

    this.capabilitiesDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.devicesDropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      noDataAvailablePlaceholderText: 'Please select Image first',
    };

    this.imagesDropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'image_name',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
    };

    this.argButtonText = ' Add Argument ';
    document.getElementById('argsElement').style.display = 'none';
    const control = <FormArray>this.createStepForm.controls['args'];
    control.removeAt(0);
  }

  // Invoked when Image Name is selected
  onImageNameSelect(item: any) {
    if (!(this.filteredTagName === undefined || this.filteredTagName === null)) {
      this.createStepForm.patchValue({
        imageTag: '',
      });
      this.filteredTags.length = 0;
    }
    const selectedImageName = item.image_name;
    for (const image of this.completeImageList) {
      if (image.image_name === selectedImageName) {
        this.filteredTags.push(image);
      }
    }
    this.filteredTagName = this.filteredTags.map(image => image.image_tag);

    this.filteredTagName = this.filteredTagName.filter((value, index, array) => index === array.indexOf(value));
  }

  // Invoked when Image Name is unselected
  onImageNameDeSelect(item: any) {
    this.createStepForm.patchValue({
      imageTag: '',
    });
    this.filteredTagName.length = 0;
    this.filteredTagName = [];
  }

  // Invoked when single drop-down element is selected
  onItemSelect(item: any) {

  }

  // Invoked when Language field is selected
  getLanguage() {
    this.createStepForm.patchValue({
      language: 'Python 3',
    });
  }

  // Invoked to initialize Argument when form is loaded
  initArgs() {
    return new FormGroup({
      key: new FormControl(''),
      value: new FormControl(''),
    });
  }

  // Invoked on clicking 'Add another argument'
  addArgs() {
    const control = <FormArray>this.createStepForm.controls['args'];
    control.push(this.initArgs());
  }

  // Invoked when an individual Argument row is removed by clicking (x)
  removeArgs(i: number) {
    const control = <FormArray>this.createStepForm.controls['args'];
    control.removeAt(i);
  }

  getArgs(form) {
    return form.get('args').controls;
  }

  // Invoked on clicking 'Add Argument'/'Remove all Arguments' button
  argsToggle() {
    const element = document.getElementById('argsElement');
    const control = <FormArray>this.createStepForm.controls['args'];
    if (element.style.display === 'none') {
      this.argButtonText = ' Remove all Arguments ';
      element.style.display = 'block';
      if (control.length === 0) {
        control.push(this.initArgs());
      }
    } else {
      this.argButtonText = ' Add Argument ';
      element.style.display = 'none';
      while (control.length !== 0) {
        control.removeAt(0);
      }
    }
  }

  // Invoked on adding a Tag
  onItemAdded(item: any) {

  }

  // Invoked on removing a Tag
  onItemRemoved(item: any) {

  }

  // Invoked on submitting the form
  onCreateStep() {
    const capabilitiesSelectedItems: number[] = [];
    this.createStepForm.value['capabilities'].forEach((item, index) => {
      capabilitiesSelectedItems.push(item.id);
    });
    let selectedImageName: string = null;
    this.createStepForm.value['imageName'].forEach((item, index) => {
      selectedImageName = item.image_name;
    });
    let selectedStepType: string = null;
    this.createStepForm.value['stepType'].forEach((item, index) => {
      selectedStepType = item.name;
    });
    let selectedImageTag: string = null;
    this.createStepForm.value['imageTag'].forEach((item, index) => {
      selectedImageTag = item;
    });
    let selectedDevice: number = null;
    if (this.createStepForm.value['devices'].length > 0) {
      this.createStepForm.value['devices'].forEach((item, index) => {
        selectedDevice = item.id;
      });
    }
    const tags: string[] = [];
    if (this.createStepForm.value['tags'].length > 0) {
      this.createStepForm.value['tags'].forEach((a, index) => {
        tags.push(a.value);
      });
    }

    const argInput = this.createStepForm.get('args') as FormArray;
    const map = new Map();
    for (let i = 0; i < argInput.length; i++) {
      const argKey = argInput.at(i).get('key').value;
      const argValue = argInput.at(i).get('value').value;
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
      Array.from(map)
        .reduce((arg, [key, value]) => {
          arg[key] = value;
          return arg;
        }, {}),
    )
    const stepModel = new StepModel(this.createStepForm.value['name'], selectedStepType, this.createStepForm.value['author'],
      capabilitiesSelectedItems, selectedImageName, selectedImageTag, selectedDevice, this.createStepForm.value['language'],
      this.createStepForm.value['architecture'], tags, argsJSON);

    this.createStepService.createStepByImage(stepModel);
  }

  // Invoked on click of RESET button
  onReset(){
    this.createStepForm.reset();
    this.createStepForm.markAsPristine();
    const element = document.getElementById('argsElement');
    const control = <FormArray>this.createStepForm.controls['args'];
    this.argButtonText = ' Add Argument ';
    element.style.display = 'none';
    while (control.length !== 0) {
      control.removeAt(0);
    }
  }

}
