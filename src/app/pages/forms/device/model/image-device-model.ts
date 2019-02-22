export class ImageDeviceModel {
    id: number;
    repository_id: number;
    image_name: string;
    image_id: string;
    name: string;
    hostname: string;
    sighned: string;
    encryption_key: string;
    command: string;
    status: string;
    image_tag: string;
    capabilities: number[];

    constructor( id: number,
        repository_id: number,
        image_name: string,
        image_id: string,
        name: string,
        hostname: string,
        sighned: string,
        encryption_key: string,
        command: string,
        status: string,
        image_tag: string,
        capabilities: number[] ) {
        this.id = id;
        this.repository_id = repository_id;
        this.image_name = image_name;
        this.image_id = image_id;
        this.name = name;
        this.hostname = hostname;
        this.sighned = sighned;
        this.encryption_key = encryption_key;
        this.command = command;
        this.status = status;
        this.image_tag = image_tag;
        this.capabilities = capabilities;
    }
}
