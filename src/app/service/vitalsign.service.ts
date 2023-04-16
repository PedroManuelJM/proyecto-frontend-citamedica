import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Vitalsign } from '../model/vitalsign';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
@Injectable({
  providedIn: 'root'
})
export class VitalsignService extends GenericService<Vitalsign> {

  //VARIABLE REACTIVA
  private vitalsignChange = new Subject<Vitalsign[]>;
  private messageChange = new Subject<string>;

  constructor(protected override http: HttpClient){
    super(http, `${environment.HOST}/vitalsigns`)
  }


    ///////////////get & set/////////////////////
  setVitalSignChange(data: Vitalsign[]) {
      this.vitalsignChange.next(data);
  }


  getVitalSignChange(){
    return this.vitalsignChange.asObservable();
   // console.log(this.vitalsignChange)
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
