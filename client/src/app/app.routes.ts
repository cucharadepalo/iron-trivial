import { Routes } from "@angular/router";
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";

const routes:Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [IsAuthenticatedGuard] },
  { path: 'login', component: LoginComponent },
  //{ path: 'movie/:slug', component: MoviesComponent }
  { path: '**', redirectTo: '' }
];

export {routes};
