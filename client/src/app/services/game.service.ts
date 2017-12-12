import { Game } from './../interfaces/game.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

@Injectable()
export class GameService {
  private baseUrl = `${environment.apiUrl}/api`;
  public game: Game;
  public gameEvent = new EventEmitter<Game>();

  constructor( private http: HttpClient) { }

  getGame(id) {
    return this.http.get(`${this.baseUrl}/game?id=${id}`)
      .subscribe(
        (game: Game) => {
          this.setGame(game);
        },
        (err) => {
          this.handleError
        }
      );
  }
  createGame(gameName: string){
    return this.http.post(`${this.baseUrl}/game`, {gameName})
  }
  getOpenGames() {
    return this.http.get(`${this.baseUrl}/games?status=open`)
  }
  getInPlayGames() {
    return this.http.get(`${this.baseUrl}/games?status=playing`)
  }
  joinGame(id) {
    return this.http.put(`${this.baseUrl}/game/${id}`, {})
  }
  checkUserGames(id) {
    return this.http.get(`${this.baseUrl}/gameuser?id=${id}`)
  }
  startGame(id) {
    return this.http.put(`${this.baseUrl}/game/start/${id}`, {})
  }

  private setGame(game: Game): Game {
    //console.log("Setted game");
    //console.log(game);
    this.game = game;
    this.gameEvent.emit(game);
    return this.game;
  }

  protected handleError(error: Response | any): Observable<any> {
    console.error(error);
    return Observable.throw(error.json());
  }

}
