import { Component, OnInit } from '@angular/core';
import { Game } from '../../interfaces/game.interface';
import { GameManagerService } from '../../services/game-manager.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'game-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  recap: Game;

  constructor(
    public gameManagerService: GameManagerService,
    public route: ActivatedRoute,
    public auth: AuthService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.route.data.subscribe(
      (resolved) => {
        this.recap = resolved['game'];
      }
    )
  }

}
