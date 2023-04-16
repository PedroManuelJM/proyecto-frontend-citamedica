import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from './login.service';
import { MenuService } from './menu.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { Menu } from '../model/menu';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(
    private loginService: LoginService,
    private menuService: MenuService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //1) VERIFICAR SI EL USUARIO ESTA LOGUEADO
    const rpta = this.loginService.isLogged();
    if(!rpta){
      this.loginService.logout();
      return false;
    }
    //2) VERIFICAR SI EL TOKEN NO HA EXPIRADO
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);

    if(!helper.isTokenExpired(token)){
      //3) VERIFICAR SI TIENES EL ROL NECESARIO PARA ACCEDER A ESE COMPONENTE 'PAGINA'

      //url -> /pages/patient
      const url = state.url;
      const decodedToken = helper.decodeToken(token);
      const username = decodedToken.sub;
      //const username = decodedToken.preferred_username;

      return this.menuService.getMenusByUser(username).pipe(map( (data: Menu[]) => {
        this.menuService.setMenuChange(data);

        let count = 0;
        for(let m of data){
          if(url.startsWith(m.url)){
            count++;
            break;
          }
        }

        if(count > 0){
          return true;
        }else{
          this.router.navigate(['/pages/not-403']);
          return false;
        }

      }));


    }else{
      this.loginService.logout();
      return false;
    }    
  }
}
