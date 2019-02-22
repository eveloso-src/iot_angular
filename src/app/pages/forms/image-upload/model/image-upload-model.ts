export class ImageUploadModel {
    id: number;
    name: string;
    image_name: string;
    image_tag: string;
    Author: string;
    capabilities: number [];
    devices: number [];

    // tslint:disable-next-line:max-line-length
    constructor(name: string , image_name: string , image_tag: string , author: string , capabilities: number [] , devices: number []) {
        this.name = name ;
        this.image_name = image_name;
        this.image_tag = image_tag;
        this.Author = author;
        this.capabilities = capabilities ;
        this.devices = devices ;
     }
}
