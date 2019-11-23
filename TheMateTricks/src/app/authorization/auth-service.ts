import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthInfo } from './auth.model';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
    
    private isAuthenicated = false;
    private token: string;
    // subject is used to push the authentication information to the components that are listening
    // don't need th token - just need to know if the user is authenticated or not
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient) {}
    
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
    }

    login(email: string, password: string) {
        const authInfo: AuthInfo = { email, password };
        // adding the token to the login header
        this.http.post<{token: string}>('http://localhost:3000/api/authorization/login', authInfo)
        .subscribe(response => {
            const token = response.token;
            this.token = token;
            if (token){
                this.isAuthenicated = true;
                this.authStatusListener.next(true);
                //console.log(token);
            }
        });
    }
}
