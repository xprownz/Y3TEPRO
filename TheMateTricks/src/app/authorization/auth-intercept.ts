import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service';

// annotation used to inject the auth service
@Injectable()
export class AuthIntercept implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();
        const authRequest = req.clone({
            // adds the auth token as a new header called Authorization
            headers: req.headers.set('Authorization', 'Bearer ' + authToken)
        });
        // forwards the new request
        return next.handle(authRequest);
    }
}
