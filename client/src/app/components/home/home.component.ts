import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { Game } from '../../interfaces/game.interface';
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

  constructor(
    private games: GameService,
    private authService: AuthService,
    private router: Router
  ) {
    games.getOpenGames().subscribe(
      (games:Game[]) => this.openGames = games
    )
  }

  ngOnInit() {
  }

  logout() {
    this.authService.authLogout().subscribe( () => {
      this.router.navigate(['login']);
    });
  }

  newGame(gameName:string) {
    this.games.createGame(gameName).subscribe();
  }
  joinGame(id) {
    this.games.joinGame(id).subscribe();
  }
}
