import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AuthenticationDetails } from '../models/authenticationdetails';
import { Constants } from '../constants';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(
        private http: HttpClient
    ) { }

    login(username: string, password: string) {
        return this.http.post<AuthenticationDetails>('/api/login', { username: username, password: password })
            .pipe(map(authentication => {
                // login successful if there's a jwt token in the response
                if (authentication && authentication.token) {
                    console.debug('Login successful for\'', username, '\', token:\'', authentication.token, '\'');

                    // store authentication details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem(Constants.CURRENT_AUTHENTICATION_KEY, JSON.stringify(authentication));
                }

                return authentication;
            }));
    }

    logout() {
        // remove authentication from local storage to log user out
        localStorage.removeItem(Constants.CURRENT_AUTHENTICATION_KEY);
    }
}