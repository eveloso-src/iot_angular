export class PipelineModel {
    pipeline_id: number;
    name: string;
    description: string;
    project: string;
    note: string;
    author: string;
    steps: number [];

    // tslint:disable-next-line:max-line-length
    constructor(name: string , description: string , project: string , note: string , author: string , steps: number []) {
        this.name = name ;
        this.description = description;
        this.project = project;
        this.note = note;
        this.author = author ;
        this.steps = steps ;
     }
}
