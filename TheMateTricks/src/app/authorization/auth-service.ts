import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthInfo } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
    
    private isAuthenicated = false;
    private token: string;
    private tokenTimer: any;
    private userId: string;
    // subject is used to push the authentication information to the components that are listening
    // don't need th token - just need to know if the user is authenticated or not
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}
    
    // allows access to the token as it is a private property
    getToken() {
        return this.token;
    }

    getIsAuthenticated(){
        return this.isAuthenicated;
    }
    
    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getUserId() {
        return this.userId;
    }


    createNewUser(email: string, password: string) {
        // create a new user object using the AuthInfo interface
        const authInfo: AuthInfo = { email, password };
        this.http.post('http://localhost:3000/api/authorization/signup', authInfo)
        .subscribe(response => {
            //console.log(response);
        });
        this.router.navigate(['/login']);
    }

    login(email: string, password: string) {
        const authInfo: AuthInfo = { email, password };
        // adding the token to the login header
        // adding the expires in paramter to the login header
        this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/authorization/login', authInfo)
        .subscribe(response => {
            const token = response.token;
            this.token = token;
            if (token){
                const expiresIn = response.expiresIn;
                this.setAuthTimer(expiresIn);
                this.isAuthenicated = true;
                this.userId = response.userId;
                this.authStatusListener.next(true);
                const now = new Date();
                // creating a new constant to store the expiration date and passing it to the saveAuthenticationData function
                const expirationDate = new Date(now.getTime() + expiresIn * 1000);
                this.saveAuthenticationData(token, expirationDate, this.userId)
                console.log(expirationDate);
                // uses the anguler router to navigate back to the home page
                this.router.navigate(['/']);
            }
        });
    }

    autoAuthenticate() {
        const authInfo = this.getAuthenticationData();
        if (!authInfo) {
            return;
        }
        const now = new Date();
        // this lets us check if the duration is in the future
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0) {
            this.token = authInfo.token;
            this.isAuthenicated = true;
            this.userId = authInfo.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }
    
    //this logout functionally end the users session and returns values to unauthenticated status 
    logout() {
        this.token = null;
        this.isAuthenicated = false; 
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthenticationData();
        this.userId = null;
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration: number) {
        console.log('Setting timer: ' + duration);
        // applying a timeout to the expiration of the token and calling logout function, multiply by 1000 because it uses milliseconds
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthenticationData(token: string, expirationDate: Date, userId: string ) {
        // stores data as key value pairs
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthenticationData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthenticationData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }
}
