import { User } from './../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable, Subject } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

const CURRENT_USER_KEY = 'currentUser';

@Injectable()
export class AuthService {
  // private headers = new Headers({ 'Content-Type': 'application/json'});
  // private options = new RequestOptions({ headers: this.headers, withCredentials: false });
  public loginEvent = new EventEmitter<User>();
  private user: User;

  constructor( private http: HttpClient ) {
    this.isAuthenticated();
  }

  checkAuthentication() {
    return this.user !== null && this.user !== undefined;
  }

  isAuthenticated() {
    return this.http.get(`${environment.apiUrl}/auth/user`)
      .subscribe(
        (user: User) => {
          this.setUser(user);
        },
        (err) => {
          this.handleError
        }
      );
  }

  authGithub() {
    window.location.href = `${environment.apiUrl}/auth/github`;
  }

  authFacebook() {
    window.location.href = `${environment.apiUrl}/auth/facebook`;
  }

  authLogout() {
    console.log("Do Logout");
    return this.http.get(`${environment.apiUrl}/auth/logout`)
                    .map( res => this.setUser(null));
  }

  private setUser(user: User): User {
    console.log("Setted user");
    console.log(user);
    this.user = user;
    this.loginEvent.emit(user);
    return this.user;
  }

  protected handleError(error: Response | any): Observable<any> {
    console.error(error);
    return Observable.throw(error.json());
  }


}
