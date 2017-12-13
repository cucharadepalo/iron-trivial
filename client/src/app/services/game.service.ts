import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import * as io from 'socket.io-client';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Rx';
import { map } from 'rxjs/operators';
import { Game } from './../interfaces/game.interface';
import { User } from './../interfaces/user.interface';
import { Question } from './../interfaces/question.interface';

@Injectable()
export class GameService {
  private baseUrl = `${environment.apiUrl}/api`;
  public game: Game;
  public gameEvent = new EventEmitter<Game>();
  public socket: any;

  joinedUsers:Array<any> = [];
  gameMessage: string = 'Espera un momento, el juego comenzará en breve';
  currentQuestion:Question = null;
  questionTime:number = null;

  constructor( private http: HttpClient) {
    this.socket = io.connect(environment.apiUrl);

    this.socket.on('start-game', function(data:any){
      this.gameMessage = 'La partida va a empezar';
    }.bind(this));

    this.socket.on('question', function(data:any){
      data.question.answers = _.shuffle(data.question.answers)
      this.currentQuestion = data.question;
      this.questionTime = data.questionTime;
    }.bind(this));

    this.socket.on('recibe-user', function(user:any){
      if (!_.includes(this.joinedUsers, user)) {
        this.joinedUsers.push(user);
      }
    }.bind(this));

  }

  joinGame(gameID) {
    this.http.put(`${this.baseUrl}/game/${gameID}`, {})
      .map((res:any) => {
        let game:Game = res.game;
        this.setGame(game);
        let participants = game.participants.length;
        let newParticipant = game.participants[participants - 1];
        this.socket.emit('join-game', {
          userId: newParticipant.id
        })
      })
      .catch(this.handleError)
      .subscribe();
  }

  /* Only admin can do this */
  adminStartGame() {
    let gameID = this.game.id;
    console.log(`Starting setted game ${gameID}`);
    return this.http.put(`${this.baseUrl}/game/start/${gameID}`, {})
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
