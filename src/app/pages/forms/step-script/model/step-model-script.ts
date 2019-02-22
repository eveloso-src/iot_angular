
export class StepModelScript {
    id: number ;
    type: string;
    name: string ;
    author: string;
    capabilities: number [];
    device_id: number;
    language: string;
    architecture: string;
    tags: string[];
    argsJSON: any;

    constructor(name: string, type: string, author: string, capabilities: number[],
        device_id: number, language: string, architecture: string, tags: string[], argsJSON: any) {

            this.name = name;
            this.type = type;
            this.author = author;
            this.capabilities = capabilities;
            this.device_id = device_id;
            this.language = language;
            this.architecture = architecture;
            this.tags = tags;
            this.argsJSON = argsJSON;
    }
}
