import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { Game } from '../../interfaces/game.interface';
import { GameUser } from '../../interfaces/gameuser.interface';
import { GameService } from '../../services/game.service';
import { GameManagerService } from '../../services/game-manager.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  openGames: Game[];
  message: string;

  constructor(
    private gameService: GameService,
    private gameManagerService: GameManagerService,
    private auth: AuthService,
    private router: Router
  ) {
    this.gameManagerService.getOpenGames().subscribe(
      (games:Game[]) => this.openGames = games
    )
  }

  ngOnInit() {
    this.gameManagerService.checkUserGames(this.auth.user.id).subscribe (
      (doc: GameUser ) => {
        if (doc !== null && doc !== undefined) {
          this.router.navigate(['game', doc._gameId])
        }
      }
    )
  }

  logout() {
    this.auth.authLogout().subscribe( () => {
      this.router.navigate(['login']);
    });
  }

  newGame(gameName:string) {
    this.gameManagerService.createGame(gameName).subscribe(
      (game: Game) => {
        //console.log(game.id);
        this.router.navigate(['game', game.id])
      }
    );
  }
  joinGame(id) {
    this.router.navigate(['game', id]);
  }
}
