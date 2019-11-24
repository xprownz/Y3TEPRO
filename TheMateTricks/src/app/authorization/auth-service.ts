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
        this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/authorization/login', authInfo)
        .subscribe(response => {
            const token = response.token;
            this.token = token;
            if (token){
                const expiresIn = response.expiresIn;
                console.log(expiresIn);
                // applying a timeout to the expiration of the token and calling logout function, multiply by 1000 because it uses milliseconds
                this.tokenTimer = setTimeout(() => {
                    this.logout();
                }, expiresIn * 1000);
                this.isAuthenicated = true;
                this.authStatusListener.next(true);
                //console.log(token);
                // uses the anguler router to navigate back to the home page
                this.router.navigate(['/']);
            }
        });
    }
    
    //this logout functionally end the users session and returns values to unauthenticated status 
    logout() {
        this.token = null;
        this.isAuthenicated = false; 
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.router.navigate(['/']);
    }
}
