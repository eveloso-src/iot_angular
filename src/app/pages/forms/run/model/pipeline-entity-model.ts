
export class PipelineEntityModel {
    step_id: number;
    step_name: string;
    step_type: string;
    success : [{
        step_id: number,
        step_name: string
    }];
    failure : [{
        step_id: number,
        step_name: string
    }]
}