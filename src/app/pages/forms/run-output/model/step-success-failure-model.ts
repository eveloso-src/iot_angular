import { DeviceStepResultModel } from "./device-step-result-model";

export class StepSuccessFailureModel{
    stepId: number;
    step_name: string;
    step_type: string;
    step_status: string;
    device_step_result: DeviceStepResultModel[];
}
