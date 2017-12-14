import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
import { Game } from '../../interfaces/game.interface';
import { Question } from '../../interfaces/question.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { ResultsComponent } from '../results/results.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  @ViewChild(ResultsComponent) results: ResultsComponent;

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
