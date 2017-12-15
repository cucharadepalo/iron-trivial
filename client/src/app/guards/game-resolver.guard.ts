import { Observable } from 'rxjs/Rx';
import { Game } from './../interfaces/game.interface';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { GameManagerService } from '../services/game-manager.service';
import { Injectable } from '@angular/core';

@Injectable()
export class GameResolverGuard implements Resolve<Game> {

  constructor(
    private games: GameManagerService,
    private router: Router
  ) {}

  resolve(routes: ActivatedRouteSnapshot): Observable<Game> {
    return this.games.getGameRanking(routes.params['id'])
      .catch((err) => {
        this.router.navigate(['/home']);
        return Observable.of(err);
      });
  }
}
