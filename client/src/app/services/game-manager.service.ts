import { Game } from './../interfaces/game.interface';
import { User } from './../interfaces/user.interface';
import { Question } from './../interfaces/question.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

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

}
