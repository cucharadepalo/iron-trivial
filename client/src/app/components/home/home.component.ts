import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { Game } from '../../interfaces/game.interface';
import { GameUser } from '../../interfaces/gameuser.interface';
import { GameService } from '../../services/game.service';
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
    private games: GameService,
    private auth: AuthService,
    private router: Router
  ) {
    games.getOpenGames().subscribe(
      (games:Game[]) => this.openGames = games
    )
  }

  ngOnInit() {
    this.games.checkUserGames(this.auth.user.id).subscribe (
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
    this.games.createGame(gameName).subscribe(
      (game: Game) => {
        //console.log(game.id);
        this.router.navigate(['game', game.id])
      }
    );
  }
  joinGame(id) {
    this.games.joinGame(id).subscribe(
      (game: Game) => {
        //console.log(game.participants);
        this.router.navigate(['game', id])
      },
      (err) => console.log(err.message)
    );
  }
}
