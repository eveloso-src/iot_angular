import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CapabilityModel } from '../model/capability-model';
import { AddCapabilityService } from './../service/add-capability.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-capability',
  templateUrl: './add-capability.component.html',
  styleUrls: ['./add-capability.component.scss'],
})
export class AddCapabilityComponent implements OnInit {
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
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private addCapabilityService: AddCapabilityService, private toastr: ToastrService) {
    this.getCapabilityTypeList();
  }
  hideAddCapabilityModal() {
    this.modalService.dismissAll();
  }

  open(content: any) {
    this.onReset();
    this.addCapabilityForm.markAsPristine();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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

  onSubmit() {
    this.submitted = true;
    if (this.addCapabilityForm.invalid) {
      return;
    }

    const capabilityModel = new CapabilityModel(this.addCapabilityForm.value['capabilityName'],
      this.selectedCapabilityType);
    this.addCapabilityService.addCapability(capabilityModel).then((data: CapabilityModel) => {
      this.toastr.success('Capability name: ' + data.name + ' with id: ' + data.id +' created', '', {
        disableTimeOut: true,
        closeButton: true,
      });
      this.modalService.dismissAll();
    });

  }

  onReset() {
    this.addCapabilityForm.reset();
    this.addCapabilityForm.markAsPristine();
  }

  getCapabilityTypeList() {
    this.capabilityTypeList = this.data;
  }

  onItemSelect(item: any) {
    this.selectedCapabilityType = item.name;
  }

  get f() { return this.addCapabilityForm.controls; }

}
