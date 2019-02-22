import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RunOutputModel } from '../model/run-output-model';
import { RunService } from '../service/run.service';
import { RunResultsModel } from '../model/run-results-model';

@Component({
  selector: 'run-output',
  templateUrl: './run-output.component.html',
  styleUrls: ['./run-output.component.scss']
})
export class RunOutputComponent implements OnInit {
  runResultForm: FormGroup;
  runDropdownSettings: {};
  runDropdownList : RunOutputModel[];
  selectedRunOutput: RunOutputModel;
  areValuesAvailable: boolean = false;
  runidPattern = "^[0-9]+$";
  flagDropdown : boolean;
  flagInput : boolean;

  constructor(private formBuilder: FormBuilder, private runService: RunService) { }

  ngOnInit() {

    this.runResultForm = this.formBuilder.group({
      runid: ['', Validators.required],
    });



    this.runService.getAllRuns()
      .subscribe((data: RunOutputModel[]) => {
         this.runDropdownList = data;
      },
        err => {
          throw err;
        });

    this.runDropdownSettings = {
      singleSelection: true,
      idField: 'run_id',
      textField: 'run_id',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      noDataAvailablePlaceholderText: 'Please wait. Loading data..................'
    };
  }

  // Invoked when an item is selected
  onRunSelect(item: any){
    this.flagInput = false;
    this.flagDropdown = true;
    for(let run of this.runDropdownList){
      if(run.run_id === item){
        this.selectedRunOutput = run;
        this.areValuesAvailable = true;
        break;
      }
    }
  }

  // Invoked when an item is de-selected
  onRunDeSelect(item: any){
    if(this.flagInput === false){
      this.areValuesAvailable = false;
    }
  }

  onGetResult(){
    this.runService.getRunResultFor(this.runResultForm.value['runid']).subscribe((data: RunOutputModel) => {
      this.selectedRunOutput = data;
      this.areValuesAvailable = true;
      this.flagDropdown = false;
      this.flagInput = true;
    },
    err => {
      throw err;
    });
    
  }

}
