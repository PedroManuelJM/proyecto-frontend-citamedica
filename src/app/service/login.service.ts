import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

interface ILoginRequest{
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url: string = `${environment.HOST}/login`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(username: string, password: string){
    const body: ILoginRequest = { username, password };
    return this.http.post<any>(this.url, body);
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  isLogged() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }

   ///send mail from backend
   sendMail(username: string) {
    return this.http.post<number>(`${environment.HOST}/mail/sendMail`, username, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain')
    });
  }

  checkTokenReset(random: string) {
    return this.http.get<number>(`${environment.HOST}/mail/reset/check/${random}`);
  }

  reset(random: string, newPassword: string) {
    return this.http.post(`${environment.HOST}/mail/reset/${random}`, newPassword, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain')
    });
  }
}
