import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { ForgotComponent } from './pages/login/forgot/forgot.component';
import { RandomComponent } from './pages/login/forgot/random/random.component';
import { LoginComponent } from './pages/login/login.component';
import { Not404Component } from './pages/not404/not404.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'pages',
    component: LayoutComponent,
    loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: 'forgot',
    component: ForgotComponent,
    children: [{ path: ':random', component: RandomComponent }],
  },
  {
    path: 'not-404',
    component: Not404Component
  },
  {
    path: '**',
    redirectTo: 'not-404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
