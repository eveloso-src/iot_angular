import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { PipelineModel } from '../model/pipeline-model';
import { RunModel } from '../model/run-model';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})
export class RunService {

  constructor(
	  private http: HttpClient,
	  private toastr: ToastrService,
	  private ngxService: NgxUiLoaderService,
	) { }

  // To get all Pipelines
  getAllPipelines() {
		return this
			.http
			.get<PipelineModel[]>(`${environment.mmUrl}/pipelines`);
	}
	// To get a Step
	getAStep(step_id: number){
		return this
			.http
			.get(`${environment.mmUrl}/steps/${step_id}`);
	}

	// To Run a pipeline
	onRun(runModel: RunModel) {
		const attributes = Object.keys(runModel.attributes).map(key => (runModel.attributes[key]));
		
		this.ngxService.start();
		this.http.post(`${environment.mmUrl}/run`,
			{
				"pipeline": {
					"pipeline_id": runModel.pipeline_id,
					"version_id": runModel.version_id
				},
				"submitted_by":runModel.submitted_by,
				"attributes": attributes,		
			})
			.subscribe(
				(data: RunModel) => {
					this.ngxService.stop();
					this.toastr.success(
						'Pipeline execution is successful and generated run id is: ' + 
						data.run_id ,
						'',
						{
						disableTimeOut: true
					  });
				},
				err => {
					this.ngxService.stop();
					throw err;
				},
		);
			
	}
}
