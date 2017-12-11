import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
import { Game } from '../../interfaces/game.interface';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  // id: string;
  // creator: string;
  // name: string;
  // isOpen: boolean;
  // isInPlay: boolean;
  // isFinished: boolean;
  // participants: Array<object>;
  // questions: Array<object>;
  // ranking: Array<object>;
  // createdAt: Date;
  // updatedAt: Date;
  game:Game

  constructor(
    private games: GameService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    route.params.subscribe(params => {
      games.getGame(params['id'])
        .subscribe(
          (game:Game) => this.game = game);
    })
  }

  ngOnInit() {
  }

}
