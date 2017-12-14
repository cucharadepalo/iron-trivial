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
  //public gameEvent = new EventEmitter<Game>();
  public socket: any;

  public serviceStatus: string = 'open';
  public gameInPlay: boolean = false;
  public gameFinished: boolean = false;
  public showResults: boolean = false;
  public showRanking: boolean = false;
  public joinedUsers: Array<any> = [];
  public gameMessage: string = 'Please wait, the game should start shortly';
  public currentQuestion: Question = null;
  public currentQuestionIndex: number = null;
  public questionTime: number = null;
  public answers: Answer[] = [];
  public correctAnswers: string[] = [];
  public wrongAnswers: Answer[] = [];
  public score: number = 0;
  public ranking: Array<any> = [];

  constructor( private http: HttpClient) {
    this.socket = io.connect(environment.apiUrl);
    this.socket.on('recibe-user', function(user:any){
      if (!_.includes(this.joinedUsers, user)) {
        this.joinedUsers.push(user);
      }
    }.bind(this));

    this.socket.on('start-game', function(data:any){
      this.gameMessage = 'Game is about to start';
      this.serviceStatus = 'playing';
      this.gameInPlay = true;
    }.bind(this));

    this.socket.on('question', function(data:any){
      data.question.answers = _.shuffle(data.question.answers)
      this.currentQuestion = data.question;
      this.questionTime = data.timeRemaining;
      this.currentQuestionIndex = data.questionIndex;
    }.bind(this));

    this.socket.on('calculate-game', function(data:any){
      console.log(`Ya están todas las preguntas, veamos quien ha ganado`);
      this.gameMessage = 'The game is over';
      this.currentQuestion = data.question;
      this.questionTime = data.timeRemaining;
      this.currentQuestionIndex = data.questionIndex;
      this.calculateGame();
      this.serviceStatus = 'finished';
      this.showResults = true;
      this.gameInPlay = false;
    }.bind(this));

    this.socket.on('game-end', function(data:any) {
      console.log(`El juego ha terminado, veamos el ranking`)
      this.gameMessage = 'This is the ranking';
      //this.setGame(data.game);
      this.showResults = false;
      this.showRanking = true;
      this.ranking = data.ranking;
    })

  }

  joinGame(gameID) {
    this.http.put(`${this.baseUrl}/game/${gameID}`, {})
      .map((res:any) => {
        let game:Game = res.game;
        this.setGame(game);
        let participants = game.participants.length;
        let newParticipant = game.participants[participants - 1];
        this.socket.emit('join-game', {
          gameId: game.id,
          userId: newParticipant.id
        })
      })
      .catch(this.handleError)
      .subscribe();
  }

  calculateGame() {
    console.log(`The game '${this.game.name}' is being calculated.`);
    this.score = _.sumBy(this.answers, (o) => { return o.score});
    this.wrongAnswers = _.filter(this.answers, (o) => { return !o.guessed });
    //console.log(this.score);
    //console.log(this.wrongAnswers);
    let body = { answers: this.answers, score: this.score };
    //console.log(JSON.stringify(body));
    return this.http.put(`${this.baseUrl}/user/answers?gameId=${this.game.id}`, body)
      .subscribe(
        res => {
          this.socket.emit('game-calculated', {
            gameID: this.game.id
          })
        }
      )
  }

  /* Only admin can do this */
  adminStartGame() {
    let gameID = this.game.id;
    console.log(`Starting setted game ${gameID}`);
    return this.http.put(`${this.baseUrl}/game/start/${gameID}`, {})
      .subscribe(
        (game:Game) => {
          console.log(`Iniciando el juego: "${game.id}"`);
          this.socket.emit('init-game',{
            gameId:game.id
          })
        }
      )
  }
  adminFinishGame() {
    let gameID = this.game.id;
    return this.http.put(`${this.baseUrl}/game/finish/${gameID}`, {})
      .catch(this.handleError)
  }

  /* Set the game and fill the answers array */
  private setGame(game: Game): Game {
    this.game = game;
    for(let i = 0; i < this.game.questions.length; i++) {
      let answer = <Answer> {};
      answer._questionId = this.game.questions[i].id;
      answer.category = this.game.questions[i].category;
      answer.guessed = false;
      answer.score = 0;
      this.answers.push(answer);
      let correctAnswer:string = this.game.questions[i].correctAnswer;
      this.correctAnswers.push(correctAnswer);
    }
    //console.log(JSON.stringify(this.answers));
    //this.gameEvent.emit(game);
    return this.game;
  }

  protected handleError(error: Response | any): Observable<any> {
    console.error(error);
    return Observable.throw(error.json());
  }

}
