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
      //console.log(`Game Recibido: ${data.name}`);
      this.gameMessage = 'La partida va a empezar';
      //console.log(_.shuffle(this.game.questions[0].answers))
    }.bind(this));

    this.socket.on('question', function(data:any){
      //console.log(`Game Recibido: ${data.name}`);
      this.currentQuestion = data.question;
      this.questionTime = data.questionTime;
      //console.log(_.shuffle(this.game.questions[0].answers))
    }.bind(this));

    this.socket.on('recibe-user', function(user:any){
      //console.log(data);
      //console.log(`El usuario ${data.username} se ha unido al juego`)
      // TODO: Check the joined users array;
      this.joinedUsers.push(user);
    }.bind(this));

  }


  joinGame(gameID) {
    console.log(`Joining game ${gameID}`);
    this.http.put(`${this.baseUrl}/game/${gameID}`, {})
      .map((res:any) => {
        console.log(res.message);
        let game:Game = res.game;
        this.setGame(game);
        let participants = game.participants.length;
        let newParticipant: User = game.participants[participants - 1];
        //console.log(newParticipant);
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
