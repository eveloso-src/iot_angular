
export class StepModel {
    id: number ;
    type: string;
    name: string ;
    author: string;
    capabilities: number [];
    image_name: string;
    image_tag: string;
    device_id: number;
    language: string;
    architecture: string;
    tags: string[];
    argsJSON: any;

    constructor(name: string, type: string, author: string, capabilities: number[], image_name: string,
        image_tag: string, device_id: number, language: string, architecture: string, tags: string[], argsJSON: any) {

            this.name = name;
            this.type = type;
            this.author = author;
            this.capabilities = capabilities;
            this.image_name = image_name;
            this.image_tag = image_tag;
            this.device_id = device_id;
            this.language = language;
            this.architecture = architecture;
            this.tags = tags;
            this.argsJSON = argsJSON;
    }
}
