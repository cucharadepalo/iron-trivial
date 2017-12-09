import { User } from './../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable, Subject } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

const CURRENT_USER_KEY = 'currentUser';

@Injectable()
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;
  private githubUrl = `${this.baseUrl}/github`;
  private facebookUrl = `${this.baseUrl}/facebook`;
  private authenticatedUrl = `${this.baseUrl}/user`;
  // private headers = new Headers({ 'Content-Type': 'application/json'});
  // private options = new RequestOptions({ headers: this.headers, withCredentials: false });

  private user: User;
  private userSubject: Subject<User>;

  constructor( private http: HttpClient ) {
    this.user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    this.userSubject = new Subject<User>();
  }

  checkAuthentication() {
    return this.user !== null && this.user !== undefined;
  }

  isAuthenticated() {
    return this.http.get(this.authenticatedUrl)
      .subscribe(
        (user: User) => {
          this.doAuthentication(user);
        },
        (err) => {
          this.handleError
        }
      );
  }

  authGithub() {
    window.location.href = this.githubUrl
  }

  authFacebook() {
    window.location.href = this.facebookUrl
  }

  private doAuthentication(user: User): User {
    this.user = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(this.user))
    this.userSubject.next(this.user);
    return this.user;
  }

  protected handleError(error: Response | any): Observable<any> {
    console.error(error);
    return Observable.throw(error.json());
  }


}
