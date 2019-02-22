export class StepModel{
    id: number ;
    name: string ;
    args: any ;
    constructor(id:number, name:string, args: any){
        this.id = id;
        this.name = name;
        this.args = args;
    }
}