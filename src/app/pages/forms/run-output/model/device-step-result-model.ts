export class DeviceStepResultModel{
    device_id: number;
    submission_time: number;
    start_time: number;
    end_time: number;
    status: string;
    last_recevived_log: Date;
    messages: string[];
}