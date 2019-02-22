import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { RunService } from '../service/run.service';
import { PipelineModel } from '../model/pipeline-model';
import { ShortenedPipelineModel } from '../model/shortened-pipeline-model';
import { RunModel } from '../model/run-model';
import { StepModel } from '../model/step-model';

@Component({
  selector: 'run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.scss']
})
export class RunComponent implements OnInit {
  runForm: FormGroup;
  pipelineDropdownSettings: {};
  allPipeline: PipelineModel[];
  pipelineDropdownList : ShortenedPipelineModel[];
  stepDropdownList : StepModel[];
  runPattern = '^[A-Za-z ]+$';
  showSteps: boolean = false;
  showOnPipelineSelect: boolean = false;
  showArgs: boolean = false;
  selectedPipeline: PipelineModel;
  stepDropdownSettings: { };
  stepsInPipeline: StepModel[];
  argsSaveButton: string = '';
  finalArgsMap: Map<number, any> = new Map<number, any>();

  constructor(private formBuilder: FormBuilder, private runService: RunService) { }

  ngOnInit() {
    this.runForm = this.formBuilder.group ({
      pipeline: ['', Validators.required],
      version: ['', Validators.required],
      submittedBy: [''],
      step: [''],
      args: new FormArray([
        this.initArgs(),
      ]),
    });

    this.runService.getAllPipelines()
      .subscribe((data: PipelineModel[]) => {
        this.allPipeline = data;
        this.pipelineDropdownList = [];
        for(let a of data){
          let pipeline ={pipeline_id: a.pipeline_id, pipeline_name: (a.attributes.name +' [ ' + a.pipeline_id +' ]')};
          this.pipelineDropdownList.push(pipeline);
        }
      },
        err => {
          throw err;
        });
        
    this.pipelineDropdownSettings = {
      singleSelection: true,
      idField: 'pipeline_id',
      textField: 'pipeline_name',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      noDataAvailablePlaceholderText: 'Please wait. Loading data..................',
    };

    this.stepDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      enableCheckAll: false,
    };

  }

  // Invoked when a Pipeline is selected
  onPipelineSelect(item: any){
    this.showOnPipelineSelect = false;
    this.showArgs = false;
    this.runForm.patchValue({
      step: '',
    });
    
    this.finalArgsMap.clear();
    
    for(let pipeline of this.allPipeline){
      if(item.pipeline_id === pipeline.pipeline_id){
        this.showOnPipelineSelect = true;
        this.stepDropdownList = []; 
      
        for(let version of pipeline.versions){
          for(let entity of version.pipeline_entities){
            let step ={id: entity.step_id, name: (entity.step_name +' [ ' + entity.step_id +' ]'), args: ''};
            this.stepDropdownList.push(step);
            if(entity.step_type === "evaluation") {
              if(entity.failure){
                let stepFailure ={id: entity.failure[0].step_id, name: (entity.failure[0].step_name +' [ ' + entity.failure[0].step_id +' ]'), args: ''};
                this.stepDropdownList.push(stepFailure);
              }
              if(entity.success){
                let stepSuccess ={id: entity.success[0].step_id, name: (entity.success[0].step_name +' [ ' + entity.success[0].step_id +' ]'), args: ''};
                this.stepDropdownList.push(stepSuccess);
              
              }
            }
          }
        }
        this.stepsInPipeline = [];
        for(let step of this.stepDropdownList){
          this.runService.getAStep(step.id)
          .subscribe((data: StepModel) => {
            this.stepsInPipeline.push({id: data.id,name: data.name,args: data.args});
          },
          err => {
            throw err;
          });
        }
        
      }
    }
  }

  // Invoked when a Pipeline is DeSelected
  onPipelineDeSelect(item: any){
    this.showOnPipelineSelect = false;
    this.showSteps = false;
    this.showArgs = false;
    this.finalArgsMap.clear();
  }

  // Invoked when RESET button is clicked
  onReset() {
    this.runForm.reset();
    this.runForm.markAsPristine();
    this.showOnPipelineSelect = false;
    this.showSteps = false;
    this.showArgs = false;
  }

  // Invoked when Radio Button Yes/No is selected
  radioToggle(item){
    let radioValue = item.target.value;
    
    if(radioValue === "Yes"){
      this.showSteps = true;
    }
    else if(radioValue === "No"){
      this.showSteps = false;
      this.showArgs = false;
      this.finalArgsMap.clear();
      this.runForm.patchValue({
        step: '',
      });
    }
  }

  // Invoked when a Step is selected
  onStepSelect(item: any){
    let args: Map<string, string> = new Map<string, string>();
    const control = <FormArray>this.runForm.controls['args'];
    while (control.length !== 0) {
      control.removeAt(0);
    }
    this.showArgs = true;
    this.argsSaveButton = item.id;
    document.getElementById('argsElement').click();

    for(let step of this.stepsInPipeline){
      if(step.id === item.id){
        Object.keys(step.args[0]).forEach(function(key) {
          args.set(key, step.args[0][key])
        });
      }
    }
    
    args.forEach((value: string, key: string) => {
      control.push(this.initArgsWithExistingValues(key, value))
    });
  
  }

  // Invoked when a Pipeline is DeSelected
  onStepDeSelect(item: any){
    this.finalArgsMap.delete(item.id);
    const control = <FormArray>this.runForm.controls['args'];
    while (control.length !== 0) {
      control.removeAt(0);
    }
    this.showArgs = false;
  }

  // Invoked to initialize a new blank Argument row
  initArgs() {
    return new FormGroup({
      key : new FormControl(''),
      value : new FormControl(''),
    });
  }

  // Invoked to initialize a new Argument row with key-value pair
  initArgsWithExistingValues(key, value) {
    return new FormGroup({
      key : new FormControl(key),
      value : new FormControl(value),
    });
  }

  // Invoked on clicking 'Add another argument'
  addArgs() {
    const control = <FormArray>this.runForm.controls['args'];
    control.push(this.initArgs());
  }
 
  // Invoked when an individual Argument row is removed by clicking (x)
  removeArgs(i: number) {
    const control = <FormArray>this.runForm.controls['args'];
    control.removeAt(i);
  }

  getArgs(form) {
    return form.get('args').controls;
  }

  // Invoked on clicking SAVE FOR ARGS button
  saveArgs(){
    this.saveArgsToMap();
    this.showArgs = false;
  }
  saveArgsToMap(){
    let selectedStep: number = null;
      this.runForm.value['step'].forEach((item, index) => {
        selectedStep = item.id;
      });

      const argInput = this.runForm.get('args') as FormArray;
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
      const argsJSON = 
        Array.from(map)
        .reduce((arg, [key, value]) => {
          arg[key] = value;
          return arg;
        }, {})
      ;

      this.finalArgsMap.set(selectedStep, argsJSON);
  }

  // Invoked when Language field is selected
  getVersion() {
    this.runForm.patchValue({
      version: '1',
    });
  }
// Invoked when Run is clicked
  onRun(){
    let pipelineId: number = null;
    this.runForm.value['pipeline'].forEach((item, index) => {
      pipelineId = item.pipeline_id;
    });
    let attribute: any;
    let attributesArray: any[]=[];
    this.finalArgsMap.forEach((value: any, key: number) => {
      attribute={'step_id': key, 'args': value};
      attributesArray.push(attribute);
    });

    const runModel = new RunModel(pipelineId, this.runForm.value['version'], this.runForm.value['submittedBy'], attributesArray);
    this.runService.onRun(runModel);
  }

}
