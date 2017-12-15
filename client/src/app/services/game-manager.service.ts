import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class GameManagerService {
  private baseUrl = `${environment.apiUrl}/api`;

  constructor( private http: HttpClient) { }

  createGame(gameName: string){
    return this.http.post(`${this.baseUrl}/game`, {gameName})
  }

  getOpenGames() {
    return this.http.get(`${this.baseUrl}/games?status=open`)
  }

  getInPlayGames() {
    return this.http.get(`${this.baseUrl}/games?status=playing`)
  }

  checkUserGames(id) {
    return this.http.get(`${this.baseUrl}/gameuser?id=${id}`)
  }

  getGame(gameID){
    return this.http.get(`${this.baseUrl}/game?id=${gameID}`)
  }

  getGameRanking(gameID){
    return this.http.get(`${this.baseUrl}/game/ranking?gameId=${gameID}`)
  }

}
