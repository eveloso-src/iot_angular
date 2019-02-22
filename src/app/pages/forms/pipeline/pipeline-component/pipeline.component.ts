import { StepModel } from './../model/step-model';
import { PipelineModel } from './../model/pipeline-model';
import { PipelineService } from './../service/pipeline.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { PipelineModalService } from '../service/pipeline-modal.service';

@Component({
  selector: 'pipeline',
  styleUrls: ['./pipeline.component.scss'],
  templateUrl: './pipeline.component.html',
})

export class PipelineComponent implements OnInit {
  stepsRecipeDropdownList: StepModel[];
  stepsEvaluationDropdownList: StepModel[];
  stepsDropdownList: StepModel[];
  pipelineCreationForm: FormGroup;
  pipelinePattern = "^[a-zA-Z0-9-_ ]+$";
  pipelineProjectNameFieldPattern = "/^[a-z\d\-_\s]+$/i";
  dropdownSettings = {};
  submitted = false;
  selectedRecipeType: boolean = false;
  selectedEvalType: boolean = false;
  marked = false;
  theCheckbox = false;
  evalParentChildmap = new Map();
  currentId: number;
  selectedStepId;
  private subject = new Subject<any>();
  entries = [{ id: 1, type: 'Recipe Step' }, { id: 2, type: 'Evaluation Step' }];
  constructor(private formBuilder: FormBuilder, private pipelineService: PipelineService , 
  		private pipelineModalService: PipelineModalService) {
    this.pipelineModalService.currentMessage.subscribe(message => {
      this.selectedStepId = message
      this.evalParentChildmap.set(this.currentId,message);
    }
      )
    
  }

  ngOnInit() {

    this.pipelineCreationForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      project: [''],
      note: [''],
      author: ['', Validators.required],
      recipeSteps: [''],
      evaluationSteps: [''],
      checkbox: ['', Validators.required]
    });

    this.pipelineService.getAllSteps()
      .subscribe((data: StepModel[]) => {
        if (typeof data !== undefined && data.length > 1) {
          let recipList = [];
          let evaluationList = [];
          for (let stepModel of data) {
            if (stepModel.type == "recipe") {
              stepModel.name = stepModel.id+"_"+stepModel.name;
              recipList.push(stepModel);
            }
            else if (stepModel.type == "evaluation") {
              stepModel.name = stepModel.id+"_"+stepModel.name;
              evaluationList.push(stepModel);
            }
          }
          this.stepsRecipeDropdownList = recipList;
          this.stepsEvaluationDropdownList = evaluationList
          this.stepsDropdownList = data;
          this.subject.next({ data });
        }
      },
        err => {
          throw err;
        });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: false,
    };
  }

  onRecipeItemSelect(item: any) {
    console.log(item);
  }

  onReset() {
    this.pipelineCreationForm.reset();
    this.pipelineCreationForm.markAsPristine();
    this.selectedRecipeType = false;
    this.selectedEvalType = false;
  }

  onCreatePipeline() {
    this.submitted = true;
    const stepsSelectedItems: number[] = [];
    var recSteps = this.pipelineCreationForm.value['recipeSteps'];
    var evalSteps = this.pipelineCreationForm.value['evaluationSteps'];
    
    //typeof evalSteps === 'undefined' || evalSteps === '' || evalSteps === null
    //typeof recSteps !== 'undefined' && recSteps.length > 0
    if (typeof evalSteps === 'undefined' || evalSteps === '' || evalSteps === null) {
      if (typeof recSteps !== 'undefined' && recSteps.length > 0) {
        for (let stepIds of recSteps) {
          stepsSelectedItems.push(stepIds.id)
        }
        const pipelineModel = new PipelineModel(this.pipelineCreationForm.value['name'], this.pipelineCreationForm.value['description'], this.pipelineCreationForm.value['project'], this.pipelineCreationForm.value['note'], this.pipelineCreationForm.value['author'], stepsSelectedItems);
        this.pipelineService.onCreatePipeline(pipelineModel);
      }

    }
    if (typeof evalSteps !== 'undefined' && evalSteps.length > 0) {
      if (typeof recSteps === 'undefined' || recSteps === '' || recSteps === null ) {
        const pipelineModel = new PipelineModel(this.pipelineCreationForm.value['name'], this.pipelineCreationForm.value['description'], this.pipelineCreationForm.value['project'], this.pipelineCreationForm.value['note'], this.pipelineCreationForm.value['author'], stepsSelectedItems);
         this.pipelineService.onCreatePipelineWithEVal(pipelineModel,this.evalParentChildmap);
      }
    }
    if (typeof evalSteps !== 'undefined' && evalSteps.length > 0){
      if (typeof recSteps !== 'undefined' && recSteps.length > 0) {
        for (let stepIds of recSteps) {
          stepsSelectedItems.push(stepIds.id)
        }
        const pipelineModel = new PipelineModel(this.pipelineCreationForm.value['name'], this.pipelineCreationForm.value['description'], this.pipelineCreationForm.value['project'], this.pipelineCreationForm.value['note'], this.pipelineCreationForm.value['author'], stepsSelectedItems);
        this.pipelineService.onCreatePipelineWithRecipeAndEval(pipelineModel,this.evalParentChildmap);
      }
    }
   


  }

  toggleVisibility(e) {
    if (e.target.defaultValue == 1) {
      if (e.target.checked) {
        this.selectedRecipeType = true;
        this.pipelineCreationForm.get('recipeSteps').setValidators([Validators.required]);
        this.pipelineCreationForm.get('recipeSteps').updateValueAndValidity();
        this.pipelineCreationForm.get('checkbox').clearValidators();
        this.pipelineCreationForm.get('checkbox').updateValueAndValidity();
        
      }
      else {
        this.selectedRecipeType = false;
        this.pipelineCreationForm.get('recipeSteps').clearValidators();
        this.pipelineCreationForm.controls['recipeSteps'].reset();
        this.pipelineCreationForm.get('recipeSteps').updateValueAndValidity();
        this.pipelineCreationForm.get('checkbox').setValidators([Validators.required]);
        this.pipelineCreationForm.get('checkbox').updateValueAndValidity();
      }
    }
    else if (e.target.defaultValue == 2) {
      if (e.target.checked) {
        this.selectedEvalType = true;
        this.pipelineCreationForm.get('evaluationSteps').setValidators([Validators.required]);
        this.pipelineCreationForm.get('evaluationSteps').updateValueAndValidity();
        this.pipelineCreationForm.get('checkbox').clearValidators();
        this.pipelineCreationForm.get('checkbox').updateValueAndValidity();
      }
      else {
        this.selectedEvalType = false;
        this.pipelineCreationForm.get('evaluationSteps').clearValidators();
        this.pipelineCreationForm.controls['evaluationSteps'].reset();
        this.evalParentChildmap.clear();
        this.pipelineCreationForm.get('evaluationSteps').updateValueAndValidity();
        this.pipelineCreationForm.get('checkbox').setValidators([Validators.required]);
        this.pipelineCreationForm.get('checkbox').updateValueAndValidity();
      }
    }
    
    if( this.selectedEvalType == false && this.selectedRecipeType == false ){
      this.pipelineCreationForm.controls['checkbox'].reset();
    } 

  }

  onEvalItemSelect(content: any) {
    this.currentId = content.id;
    this.evalParentChildmap.set(content.id,'');
    event.preventDefault();
    const element: HTMLElement = document.getElementById('pipelineModal') as HTMLElement;
    element.click();
  }

  getStepDropDownList(): Observable<any> {
    return this.subject.asObservable();
  }

  onRecipeItemRemove(Item: any) {
    console.log(Item);
  }

  onEvalItemRemove(Item: any) {
    this.evalParentChildmap.delete(Item.id);
  }
  
}
