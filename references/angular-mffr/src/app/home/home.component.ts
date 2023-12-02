import { Component } from '@angular/core';
import { NavigationService } from '../shared/navigation.service'
import { UserService } from '../shared/user.service';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NavigationService]
})
export class HomeComponent {
  public openModal: boolean = false;
  public user: User;

  constructor(
    private navigation: NavigationService,
    private userService: UserService) {
      this.userService.getUserData().subscribe((user) => {
        this.user = user[0];
      });
  }

  navigate(route: string) {
    this.navigation.navigate(route);
  }

  openSignup() {
    this.openModal = true;
  }

  closeSignup() {
    this.openModal = false;
  }
}
