import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { RunOutputModel } from '../model/run-output-model';

@Injectable({
  providedIn: 'root'
})
export class RunService {

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  // To get all Pipelines
  getAllRuns() {
		return this
			.http
			.get<RunOutputModel[]>(`${environment.mmUrl}/run`);
  }
  getRunResultFor(runid: number) {
		return this
			.http
			.get<RunOutputModel>(`${environment.mmUrl}/run/${runid}`);
	}
}
