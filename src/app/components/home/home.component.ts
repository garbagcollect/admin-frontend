import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLogged: boolean;
  username: string;

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.isLogged = this.authenticationService.isLogged();
    if (this.isLogged) {
      this.username = this.authenticationService.getSubject();
    }
  }

  logout() {
    this.authenticationService.logout();
    this.isLogged = false;
    this.username = null;
  }

}
