import { Game } from './../interfaces/game.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

@Injectable()
export class GameService {
  private baseUrl = `${environment.apiUrl}/api`;
  public game: Game;

  constructor( private http: HttpClient) { }

  getGame(id) {
    return this.http.get(`${this.baseUrl}/game?id=${id}`)
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

}
