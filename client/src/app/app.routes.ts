import { Routes } from "@angular/router";
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { GameComponent } from "./components/game/game.component";

const routes:Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [IsAuthenticatedGuard] },
  { path: 'game/:id', component: GameComponent, canActivate: [IsAuthenticatedGuard] },
  { path: '**', redirectTo: '' }
];

export {routes};
