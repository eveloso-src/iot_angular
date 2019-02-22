import { ImageDeviceModel } from './image-device-model';
import { EnvironmentCapabilityDeviceModel } from './environment-capability-device-model';

export class ImageCapabilityModel {

    id: number;
    name: string;
    image: ImageDeviceModel;
    environmentCapabilities: EnvironmentCapabilityDeviceModel[];

    constructor( image: ImageDeviceModel,
        environmentCapabilities: EnvironmentCapabilityDeviceModel[] ) {
        this.image = image;
        this.environmentCapabilities = environmentCapabilities;
    }
}
