import { RunResultsModel } from "./run-results-model";

export class RunOutputModel {
    run_id : number;
    pipeline_id : number;
    version_id : number;
    submitted_by: string;
    submission_time: number;
    end_time: number;
    attributes: any[];
    run_status: string;
    run_results: RunResultsModel[];

    constructor(pipeline_id : number, version_id : number, submitted_by: string, attributes: any[]){
        this.pipeline_id = pipeline_id;
        this.version_id = version_id;
        this.submitted_by = submitted_by;
        this.attributes = attributes;
    }
}