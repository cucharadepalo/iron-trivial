import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
import { Game } from '../../interfaces/game.interface';
import { Question } from '../../interfaces/question.interface';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private auth: AuthService,
  ) {
    this.route.params.subscribe(params => {
      this.gameService.joinGame(params['id']);
    })
  }

  startGame() {
    this.gameService.adminStartGame();
  }

}
