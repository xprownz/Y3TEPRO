import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../authorization/auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
// injecting the auth service into the header component to adjust UI depending on login status
export class HeaderComponent implements OnInit, OnDestroy{
  userIsAuthenticated = false;
  private authListenerSub: Subscription
  constructor(private authService: AuthService) {}
    ngOnInit() {
      // this is where you listen for th boolean value that determines authentiication
      this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated
      });
    }

    ngOnDestroy() {
      this.authListenerSub.unsubscribe();
    }

}
