import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { header } from '../shared/http/config';
import { UserService } from '../shared/user.service';
import { UserResponse } from '../shared/models/user';

/* TODO: remove any types */

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public httpOptions = {
    headers: new HttpHeaders(header)
  };
  public loading: boolean = false;
  public errorMessage: string;

  constructor(private http: HttpClient,
    private userService: UserService) { }

  ngOnInit() {}

  signUp(event: any) {
    this.postSignup(event)
      .subscribe((data: any) => {
        if (data.success) {
          this.userService.login({
            detail: {
              email: event.detail.email,
              pwd: event.detail.pwd1
            }
          }).subscribe((loginData: any) => {
            if (!loginData.success) {
              this.errorMessage = loginData.message;
            }
            this.loading = false;
          });
        } else {
          this.errorMessage = data.message;
          this.loading = false;
        }
      });
  }

  postSignup(event: any) {
    this.loading = true;
    let name = event.detail.email ? event.detail.email.replace('.', 'dot') : event.detail.email;
    return this.http.post<UserResponse>('https://us-central1-planavsky-com.cloudfunctions.net/app/user',
      { name: name,
        email: event.detail.email,
        email2: event.detail.email,
        pwd: event.detail.pwd1,
        pwd2: event.detail.pwd2
      }, this.httpOptions).pipe(
        catchError(this.handleError<UserResponse>({ success: false, message: 'There was a problem submitting your signup request. Please make sure all fields are filled out correctly.' }))
      );
  }

  private handleError<T>(result?: T) {
    return (): Observable<T> => {
      return of(result as T);
    };
  }
}
