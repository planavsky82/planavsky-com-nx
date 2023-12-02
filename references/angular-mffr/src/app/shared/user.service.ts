import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { User, UserAuth, Rankings } from '../shared/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,  } from 'rxjs';
import { header } from '../shared/http/config';
import { AppState } from './../app.state';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

/* TODO: remove any types */

@Injectable( { providedIn: 'root' } )
export class UserService {
  public httpOptions = {
    headers: new HttpHeaders(header)
  };
  public user: Observable<User[]>;

  constructor(private http: HttpClient,
    private store: Store<AppState>,
    private router: Router) {
      this.user = this.store.select(state => state.user);
    }

  addUserState(email: string, rankings: Rankings[]) {
    this.store.dispatch({
      type: 'ADD_USER',
      payload: <User> {
        name: email,
        pwd: 'active',
        admin: false,
        email: email,
        loggedIn: true,
        rankings: rankings
      }
    });
  }

  // TODO: replace any type
  login(event: any) {
    let name = event.detail.email ? event.detail.email.replace('.', 'dot') : event.detail.email;
    return this.http.post<UserAuth>('https://us-central1-planavsky-com.cloudfunctions.net/app/authenticate',
      { name: name, pwd: event.detail.pwd }, this.httpOptions).pipe(
        map((data: UserAuth) => {
          if (data.success) {
            this.addUserState(event.detail.email, data.rankings);
            this.router.navigate(['/rankings']);
          }
          return data;
        })
      );
  }

  logout() {
    this.store.dispatch({
      type: 'LOGOUT',
      payload: <User> {
        name: '',
        pwd: 'inactive',
        admin: false,
        email: '',
        loggedIn: false
      }
    });
    this.router.navigate(['/']);
  }

  getUserData() {
    return this.user;
  }

  getRankings(data: UserAuth) {
    return this.http.get<Rankings>('https://us-central1-planavsky-com.cloudfunctions.net/app/rankings',
      { params: { 'token': data.token } });
  }
}
