import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Specialty } from '../model/specialty';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';


@Injectable({
  providedIn: 'root'
})
export class SpecialtyService extends GenericService<Specialty> {
  private specialtyChange = new Subject<Specialty[]>();
  private messageChange = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/specialties`);
  }

  ///////////////get & set/////////////////////
  setSpecialtyChange(data: Specialty[]) {
    this.specialtyChange.next(data);
  }

  getSpecialtyChange() {
    return this.specialtyChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
