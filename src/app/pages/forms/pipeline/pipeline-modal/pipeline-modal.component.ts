import {Component , OnInit, Output, EventEmitter} from '@angular/core';
import { StepModel } from './../model/step-model';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PipelineComponent } from '../pipeline-component/pipeline.component'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PipelineModalService}  from '../service/pipeline-modal.service';
@Component({
  selector: 'ngbd-modal-basic',
  templateUrl: './pipeline-modal.component.html'
})
export class NgbdPipelineModal implements OnInit {
  closeResult: string;
  submitted = false;
  successDropdownList: StepModel[];
  FailureDropdownList: StepModel[];
  pipelineModalForm: FormGroup;
  dropdownSettings = {};
  selectedStepModalData;
  @Output() messageEvent = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder, private modalService: NgbModal, private pipelineComponent: PipelineComponent, private pipelineModalService: PipelineModalService) {
    pipelineComponent.getStepDropDownList().subscribe(value => {
      this.successDropdownList = value.data;
      this.FailureDropdownList = value.data;
      });
      this.dropdownSettings = {
        singleSelection: true,
        idField: 'id',
        textField: 'name',
        itemsShowLimit: 3,
        allowSearchFilter: true, //EDGEMM-875
        closeDropDownOnSelection: true,
      };
  }
  ngOnInit() {
    this.pipelineModalService.currentMessage.subscribe(message => this.selectedStepModalData = message)
    this.pipelineModalForm = this.formBuilder.group({
      successStep: ['', Validators.required],
      failureStep: ['', Validators.required],
    });


  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
      return  `with: ${reason}`;
    }
  }


  hideAddCapabilityModal() {
    this.modalService.dismissAll();
  }

  onSubmit() {
    this.submitted = true;
    
    var selectedModalData =[];
    selectedModalData.push(this.pipelineModalForm.value['successStep']),
    selectedModalData.push(this.pipelineModalForm.value['failureStep']),
    console.log(selectedModalData)
    this.selectedStepModalData = selectedModalData ;
    this.pipelineModalService.changeMessage(this.selectedStepModalData)
    this.hideAddCapabilityModal();
    this.onReset();

  }

  onReset() {
    this.pipelineModalForm.reset();
    this.pipelineModalForm.markAsPristine();
  }


  onSuccessSelect(item: any) {
    console.log(item);
  }
  onFailureSelect(item: any) {
    console.log(item);
  }

  onSuccessRemove(item: any) {
    console.log(item);
  }
  onFailureRemove(item: any) {
    console.log(item);
  }


  getSelectedEvalStepsOfModel() {
    return this.selectedStepModalData;
}
}
