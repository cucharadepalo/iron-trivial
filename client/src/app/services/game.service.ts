import { Game } from './../interfaces/game.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

@Injectable()
export class GameService {
  private baseUrl = `${environment.apiUrl}/api`;
  public game: Game;

  constructor( private http: HttpClient ) { }

  createGame(gameName: string){
    return this.http.post(`${this.baseUrl}/game`, {gameName})
  }
  getOpenGames() {
    return this.http.get(`${this.baseUrl}/games?open=true`)
  }
  joinGame(id) {
    return this.http.put(`${this.baseUrl}/game/${id}`, {})
  }

}
