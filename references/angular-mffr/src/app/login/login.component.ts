import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { User, UserResponse } from '../shared/models/user';
import { Observable } from 'rxjs';
import { AppState } from './../app.state';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loading: boolean = false;
  public user: Observable<User[]>;
  public errorMessage: string;

  constructor(private store: Store<AppState>,
    private userService: UserService) {
      this.user = this.store.select(state => state.user);
    }

  ngOnInit() {}

  // TODO: replace any type
  login(event: Event) {
    // name: 'U10133', pwd: 'e3$f!rt78UNml90!'
    this.loading = true;

    /* TODO: replace any wtih a shared type that exists in the API - functions/src/app/user.ts */
    this.userService.login(event).subscribe((data: UserResponse) => {
      if (!data.success) {
        this.errorMessage = data.message;
      }
      this.loading = false;
    });
  }
}
