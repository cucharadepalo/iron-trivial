import { Game } from './../interfaces/game.interface';
import { User } from './../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class GameService {
  private baseUrl = `${environment.apiUrl}/api`;
  public game: Game;
  public gameEvent = new EventEmitter<Game>();
  public socket: any;

  joinedUsers:Array<any> = [];
  gameMessage: string = 'Espera un momento, el juego comenzará en breve';

  constructor( private http: HttpClient) {
    this.socket = io.connect(environment.apiUrl);

    this.socket.on('start-game', function(data:any){
      //console.log(`Game Recibido: ${data.name}`);
      this.gameMessage = 'la partida va a empezar';
    }.bind(this));

    this.socket.on('recibe-user', function(data:any){
      //console.log(data);
      //console.log(`El usuario ${data.username} se ha unido al juego`)
      this.joinedUsers.push(`El usuario ${data.username} se ha unido al juego`)
    }.bind(this));

  }

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
      .map(
        (game:Game) => {
          let participants = game.participants.length;
          let newParticipant: User = game.participants[participants - 1];
          //console.log(newParticipant);
          this.socket.emit('join-game', {
            userId: newParticipant.id
          })
        }
      )
  }
  checkUserGames(id) {
    return this.http.get(`${this.baseUrl}/gameuser?id=${id}`)
  }
  startGame(id) {
    return this.http.put(`${this.baseUrl}/game/start/${id}`, {})
      .subscribe(
        (game:Game) => {
          //console.log(`Iniciando el juego: "${game.id}"`);
          this.socket.emit('init-game',{
            gameId:game.id
          })
        }
      )
  }

  private setGame(game: Game): Game {
    this.game = game;
    this.gameEvent.emit(game);
    return this.game;
  }

  protected handleError(error: Response | any): Observable<any> {
    console.error(error);
    return Observable.throw(error.json());
  }

}
