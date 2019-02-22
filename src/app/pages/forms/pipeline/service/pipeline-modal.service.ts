import { Injectable } from '@angular/core';
import { PipelineModel } from '../model/pipeline-model';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class PipelineModalService {

    private messageSource = new BehaviorSubject('default message');
    currentMessage = this.messageSource.asObservable();
  
    constructor() { }
  
    changeMessage(message: any) {
      this.messageSource.next(message)
    }
}