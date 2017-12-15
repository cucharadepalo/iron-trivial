import { Component, ViewChild } from '@angular/core';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
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
    public router: Router,
  ) {
    this.route.params.subscribe(params => {
      this.gameService.joinGame(params['id']);
    })
  }

  startGame() {
    this.gameService.adminStartGame();
  }
  finishGame() {
    this.gameService.adminFinishGame()
      .subscribe(
        data => this.router.navigate(['home'])
      )
  }

}
