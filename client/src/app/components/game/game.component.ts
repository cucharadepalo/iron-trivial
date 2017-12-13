import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
import { GameSocketService } from '../../services/game-socket.service';
import { Game } from '../../interfaces/game.interface';
import { Question } from '../../interfaces/question.interface';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game:Game;
  currentQuestion:Question = null;

  constructor(
    private games: GameService,
    private route: ActivatedRoute,
    private auth: AuthService,
  ) {
    this.route.params.subscribe(params => {
      this.games.getGame(params['id'])
    })
  }

  ngOnInit() {
    this.games.gameEvent.map( game => {
      this.game = game;
    })
    .subscribe()
  }

  startGame(id) {
    this.games.startGame(id);
  }

  // initgame(id) {
  //   this.socket
  // }

}
