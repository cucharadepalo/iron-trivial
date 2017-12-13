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
import { Answer } from './../interfaces/answer.interface';

@Injectable()
export class GameService {
  private baseUrl = `${environment.apiUrl}/api`;
  public game: Game;
  public gameEvent = new EventEmitter<Game>();
  public socket: any;

  joinedUsers:Array<any> = [];
  gameMessage: string = 'Espera un momento, el juego comenzará en breve';
  currentQuestion:Question = null;
  currentQuestionIndex:Number = null;
  questionTime:number = null;
  answers:Answer[] = [];
  correctAnswers:string[] = [];

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

  /* Set the game and fill the answers array */
  private setGame(game: Game): Game {
    this.game = game;
    for(let i = 0; i < this.game.questions.length; i++) {
      let answer = <Answer> {}
      answer._questionId = this.game.questions[i].id;
      answer.category = this.game.questions[i].category;
      answer.guessed = false;
      answer.score = 0;
      this.answers.push(answer);
      let correctAnswer:string = this.game.questions[i].correctAnswer;
      this.correctAnswers.push(correctAnswer);
    }
    //console.log(JSON.stringify(this.answers));
    this.gameEvent.emit(game);
    return this.game;
  }

  protected handleError(error: Response | any): Observable<any> {
    console.error(error);
    return Observable.throw(error.json());
  }

}
