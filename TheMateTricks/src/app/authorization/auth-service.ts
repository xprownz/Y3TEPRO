import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthInfo } from './auth.model';

@Injectable({providedIn: "root"})
export class AuthService {
    constructor(private http: HttpClient) {}

    createNewUser(email: string, password: string) {
        // create a new user object using the AuthInfo interface
        const authInfo: AuthInfo = { email: email, password: password }
        this.http.post('http://localhost:3000/api/authorization/signup', authInfo)
        .subscribe(response => {
            console.log(response);
        });
    }
}