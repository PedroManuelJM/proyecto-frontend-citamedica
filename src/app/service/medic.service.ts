import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medic } from '../model/medic';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class MedicService extends GenericService<Medic>{

  //private url: string = `${environment.HOST}/medics`;
  
  //VARIABLE REACTIVA
  private medicChange = new Subject<Medic[]>;
  private messageChange = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/medics`);
  }

  ///////////////////////
  setMedicChange(data: Medic[]){
    this.medicChange.next(data);
  }

  getMedicChange(){
    return this.medicChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
