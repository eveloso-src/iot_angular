import { DeviceStepResultModel } from "./device-step-result-model";
import { StepSuccessFailureModel } from "./step-success-failure-model";

export class RunResultsModel{
    stepId: number;
    step_name: string;
    step_type: string;
    step_status: string;
    device_step_result: DeviceStepResultModel[];
    success: StepSuccessFailureModel[];
    failure: StepSuccessFailureModel[];
}