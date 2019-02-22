export class ShortenedPipelineModel{
    pipeline_id: number ;
    pipeline_name: string ;
    constructor(pipeline_id: number, pipeline_name: string){
        this.pipeline_id = pipeline_id;
        this.pipeline_name = pipeline_name ;
    }
}