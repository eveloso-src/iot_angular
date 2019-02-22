import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CapabilityModel } from '../../image-upload/model/capability-model';
import { AddCapabilityService } from '../../image-upload/service/add-capability.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'environmental-capability',
  templateUrl: './environmental-capability.component.html',
  styleUrls: ['./environmental-capability.component.scss'],
})
export class EnvironmentalCapabilityComponent implements OnInit {

  closeResult: string;
  addCapabilityForm: FormGroup;
  capabilityTypeList: any;
  selectedCapabilityType: string = null;
  dropdownSettings = {};
  submitted = false;
  data: any = [
    { id: 1, name: 'hardware' },
    { id: 2, name: 'software' },
  ];

  constructor(private formBuilder: FormBuilder, private addCapabilityService: AddCapabilityService, private toastr: ToastrService) {
    this.getCapabilityTypeList();
  }
  ngOnInit() {

    this.addCapabilityForm = this.formBuilder.group({
      capabilityName: ['', Validators.required],
      capabilityType: ['', Validators.required],
    });

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      itemsShowLimit: 2,
      allowSearchFilter: false,
      closeDropDownOnSelection: true,
    };
  }

  // Invoked when ADD button is clicked
  onSubmit() {
    this.submitted = true;
    if (this.addCapabilityForm.invalid) {
      return;
    }
 
    const capabilityModel = new CapabilityModel(this.addCapabilityForm.value['capabilityName'], this.selectedCapabilityType);
    this.addCapabilityService.addCapability(capabilityModel).then((data: CapabilityModel) => {
      this.toastr.success('Capability name: ' + data.name + ' with id: ' + data.id +' created', '', {
        disableTimeOut: true,
        closeButton: true,
      });
    });

  }

  // Invoked when RESET button is clicked
  onReset() {
    this.addCapabilityForm.reset();
    this.addCapabilityForm.markAsPristine();
  }

  // Invoked when form is loaded to populate 'Type' dropdown list
  getCapabilityTypeList() {
    this.capabilityTypeList = this.data;
  }

  // Invoked when an item is selected from the dropdown
  onItemSelect(item: any) {
    this.selectedCapabilityType = item.name;
  }

  get f() { return this.addCapabilityForm.controls; }

}
