import { environment } from '../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PipelineModel } from '../model/pipeline-model';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class PipelineService {

	constructor(private http: HttpClient, private toastr: ToastrService, private ngxService: NgxUiLoaderService) { }

	getAllSteps() {
		return this
			.http
			.get(`${environment.mmUrl}/steps`);
	}

	onCreatePipeline(pipelineModel: PipelineModel) {
		console.log('Posting Pipeline Metadata');
		
		var i: any;
		var stepList: Array<{ step_id: string }> = [];

		for (i in pipelineModel.steps) {
			stepList.push({ step_id: pipelineModel.steps[i].toString() });
		}

        this.ngxService.start();
		this.http.post(`${environment.mmUrl}/pipelines`,
			{
				'attributes': {
					'name': pipelineModel.name,
					'description': pipelineModel.description,
					'project': pipelineModel.project
				},
				'note': pipelineModel.note,
				'author': pipelineModel.author,
				'pipeline_entities': stepList

			})
			.subscribe(
				(data : PipelineModel) => {
					this.ngxService.stop();
					this.toastr.success('Pipeline name: ' + pipelineModel.name + ' with id: ' + data.pipeline_id +' created',
					'',
					{
					disableTimeOut: true
				  });
				},
				err => {
					this.ngxService.stop();
					throw err;
				}
			);
	}
	
	onCreatePipelineWithEVal(pipelineModel: PipelineModel, evalMap: Map<any, any>) {
		console.log('Posting Pipeline Metadata');
		var stepList: Array<{ step_id: string }> = [];
		var completeStepList = [];
		evalMap.forEach((value: any, key: any) => {
			if (value === '') {
				stepList.push({ step_id: String(key) });
			}
			else if (key !== undefined){
				if((value[0] === '' || value[0] === null) && !(value[1] === '')){
					let stepIDList = 
					{ step_id: String(key) ,
				  		failure: [ { "step_id": String(value[1][0].id) } ],
					};
			  		completeStepList.push(stepIDList);
				}
				else if((value[1] === '' || value[1] === null) && !(value[0] === '')){
					let stepIDList = 
					{ step_id: String(key) ,
				  		success: [ { "step_id":  String(value[0][0].id)} ],
					};
			  		completeStepList.push(stepIDList);
				}
				else{
					let stepIDList = 
					{ step_id: String(key) ,
				  		success: [ { "step_id":  String(value[0][0].id)} ],
				  		failure: [ { "step_id": String(value[1][0].id) } ],
					};
			  		completeStepList.push(stepIDList);
				}
			}
		});
		for (let step of stepList) {
			completeStepList.push(step);
		}

		this.ngxService.start();
		this.http.post(`${environment.mmUrl}/pipelines`,
			{
				'attributes': {
					'name': pipelineModel.name,
					'description': pipelineModel.description,
					'project': pipelineModel.project
				},
				'note': pipelineModel.note,
				'author': pipelineModel.author,
				'pipeline_entities': completeStepList

			})
			.subscribe(
				(data: PipelineModel) => {
					this.ngxService.stop();
					this.toastr.success('Pipeline name: ' + pipelineModel.name + ' with id: ' + data.pipeline_id +' created','',
					{
					disableTimeOut: true
				  });
				},
				err => {
					this.ngxService.stop();
					throw err;
				}
			);
	}

	onCreatePipelineWithRecipeAndEval(pipelineModel: PipelineModel, evalMap: Map<any, any>) {
		console.log('Posting Pipeline Metadata');
		var i: any;
		var stepList: Array<{ step_id: string }> = [];
		var completeStepList = [];
		
		evalMap.forEach((value: any, key: any) => {
			if (value === '') {
				stepList.push({ step_id: String(key) });
			}
			else if (key !== undefined){
				if((value[0] === '' || value[0] === null) && !(value[1] === '')){	
					let stepIDList = 
					{ step_id: String(key) ,
				  		failure: [ { "step_id": String(value[1][0].id) } ],
					};
			  		completeStepList.push(stepIDList);
				}
				else if((value[1] === '' || value[1] === null) && !(value[0] === '')){	
					let stepIDList = 
					{ step_id: String(key) ,
				  		success: [ { "step_id":  String(value[0][0].id)} ],
					};
			  		completeStepList.push(stepIDList);
				}
				else{
					let stepIDList = 
					{ step_id: String(key) ,
				  		success: [ { "step_id":  String(value[0][0].id)} ],
				  		failure: [ { "step_id": String(value[1][0].id) } ],
					};
			  		completeStepList.push(stepIDList);
				}
			}
		});
		for (i in pipelineModel.steps) {
			stepList.push({ step_id: pipelineModel.steps[i].toString() });
		}
		for (let step of stepList) {
			completeStepList.push(step);
		}

		this.ngxService.start();
		this.http.post(`${environment.mmUrl}/pipelines`,
			{
				'attributes': {
					'name': pipelineModel.name,
					'description': pipelineModel.description,
					'project': pipelineModel.project
				},
				'note': pipelineModel.note,
				'author': pipelineModel.author,
				'pipeline_entities': completeStepList

			})
			.subscribe(
				(data: PipelineModel) => {
					this.ngxService.stop();
					this.toastr.success('Pipeline name: ' + pipelineModel.name + ' with id: ' + data.pipeline_id +' created','',
					{
					disableTimeOut: true
				  });
				},
				err => {
					this.ngxService.stop();
					throw err;
				}
			);
	}

}
