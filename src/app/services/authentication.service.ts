import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';

import { AuthenticationDetails } from '../models/authenticationdetails';
import { Constants } from '../constants';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(
        private http: HttpClient,
    ) { }

    login(username: string, password: string) {
        return this.http.post<AuthenticationDetails>('/api/login', { username: username, password: password })
            .pipe(map(authentication => {
                // login successful if there's a jwt token in the response
                if (authentication && authentication.token) {
                    console.debug("Login successful for", username, ", token:", authentication.token);
                    this.setToken(authentication.token);
                }

                return authentication;
            }));
    }

    logout() {
        this.removeToken();
    }

    isLogged(): boolean {
        const token = this.getToken();
        if (!token) {
            console.error("There is no token");
            return false;
        }

        const parsedToken = this.parseToken(token);
        if (!parsedToken || !parsedToken.hasOwnProperty('exp')) {
            console.error("The token can't be parsed or doesn't have an expiration date ('exp')", parsedToken);
            return false;
        }

        const expDate = new Date(0);
        expDate.setUTCSeconds(parsedToken.exp);
        const expired = expDate.valueOf() < new Date().valueOf();
        if (expired) {
            console.error("The token is expired", expDate);
            return false;
        }

        return true;
    }

    getSubject(): string {
        const token = this.getToken();
        if (!token) {
            console.error("There is no token");
            return null;
        }

        const parsedToken = this.parseToken(token);
        if (!parsedToken || !parsedToken.hasOwnProperty('sub')) {
            console.error("The token can't be parsed or doesn't have a subject ('sub')", parsedToken);
            return null;
        }

        return parsedToken.sub;
    }

    /**
     * Store JWT token in the local storage to keep user logged in between page refreshes
     * @param token
     */
    private setToken(token: string): void {
        localStorage.setItem(Constants.CURRENT_AUTHENTICATION_KEY, token);
    }

    /**
     * Get the JWT token from the local storage
     */
    private getToken(): string {
        return localStorage.getItem(Constants.CURRENT_AUTHENTICATION_KEY);
    }

    /**
     * Remove the JWT token from local storage to log user out
     */
    private removeToken(): void {
        localStorage.removeItem(Constants.CURRENT_AUTHENTICATION_KEY);
    }

    /**
     * Parse the given JWT token
     */
    private parseToken(token: string) {
        return jwt_decode(token);
    }
}