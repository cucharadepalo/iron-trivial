import { Routes } from "@angular/router";
import { resolve } from 'Q';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';
import { GameResolverGuard } from './guards/game-resolver.guard';
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { GameComponent } from "./components/game/game.component";
import { RankingComponent } from './components/ranking/ranking.component';

const routes:Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [IsAuthenticatedGuard] },
  { path: 'game/:id', component: GameComponent, canActivate: [IsAuthenticatedGuard] },
  { path: 'game-recap/:id', component: RankingComponent, resolve: {
    game: GameResolverGuard
  } },
  //{ path: '**', redirectTo: '' }
];

export {routes};
