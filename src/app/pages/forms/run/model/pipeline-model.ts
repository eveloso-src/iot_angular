import { PipelineEntityModel } from "./pipeline-entity-model";

export class PipelineModel {
    pipeline_id: number ;
    attributes: {name: string};
    versions: [{
        pipeline_entities: PipelineEntityModel[];
    }];

}
