import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConsultListExamDTO } from '../dto/consultListExamDTO';
import { consultListExamDTOI } from '../dto/consultListExamDTOI';
import { FilterConsultDTO } from '../dto/filterConsultDTO';
import { Consult } from '../model/consult';

@Injectable({
  providedIn: 'root'
})
export class ConsultService {

  private url: string = `${environment.HOST}/consults`

  constructor(
    private http: HttpClient
  ) { }

  saveTransactional(dto: consultListExamDTOI){
    return this.http.post(this.url, dto);
  }

  searchOthers(dto: FilterConsultDTO){
    return this.http.post<Consult[]>(`${this.url}/search/others`, dto);
  }

  searchByDates(date1: string, date2: string){
    /*let params: HttpParams = new HttpParams();
    params.set('date1', date1)
    params.set('date2', date2)

    return this.http.get<Consult[]>(`${this.url}/search/date`, {
      params: params
    });*/

    return this.http.get<Consult[]>(`${this.url}/search/date?date1=${date1}&date2=${date2}`)
  }

  getExamsByIdConsult(idConsult: number){
    return this.http.get<ConsultListExamDTO[]>(`${environment.HOST}/consultsexams/${idConsult}`);
  }

  callProcedureOrFunction(){
    return this.http.get<any>(`${this.url}/callProcedure`);
  }

  //pdf
  generateReport(){
    return this.http.get(`${this.url}/generateReport`, { responseType: 'blob'});
  }

  //Files, Image
  saveFile(data: File){
    const formdata: FormData = new FormData();
    formdata.append('file', data);

    return this.http.post(`${this.url}/saveFile`, formdata);
  }

  readFile(id: number){
    return this.http.get(`${this.url}/readFile/${id}`, { responseType: 'blob'});
  }
}
