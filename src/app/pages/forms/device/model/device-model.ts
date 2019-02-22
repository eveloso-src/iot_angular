export class DeviceModel {
    registrationId: string;
    publicKey: string;
    keepAliveFrequency: number;
    orchestationTopic: string;
    telemetryQueue: string;
    telemtryUrl: string;
    capabilitiesID: number[];
    name: string;
    status: string;

    // tslint:disable-next-line:max-line-length
    constructor( registrationId: string, publicKey: string, keepAliveFrequency: number,
            orchestationTopic: string, telemetryQueue: string, telemtryUrl: string, capabilitiesID: number[] ) {
        this.registrationId = registrationId;
        this.publicKey = publicKey;
        this.keepAliveFrequency = keepAliveFrequency;
        this.orchestationTopic = orchestationTopic;
        this.telemetryQueue = telemetryQueue;
        this.capabilitiesID = capabilitiesID;
        this.telemtryUrl = telemtryUrl;
    }
}
