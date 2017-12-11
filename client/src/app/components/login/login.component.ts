import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User;
  error: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.authService.loginEvent.subscribe( user => {
      this.router.navigate(['home']);
    });
  }

  githubLogin() {
    this.authService.authGithub();
  }
  facebookLogin() {
    this.authService.authFacebook();
  }


}
