import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/constants';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLogged: boolean;

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.isLogged = localStorage.getItem(Constants.CURRENT_AUTHENTICATION_KEY) !== null;
  }

  logout() {
    console.debug('Logout');

    this.authenticationService.logout();
    this.isLogged = false;
  }

}
