import {Component, OnDestroy} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnDestroy{
  loggedIn = false;
  authSubscription;

  constructor(public auth: AuthService) {
    this.authSubscription = auth.isAuthenticated$.subscribe((isAuthenticated) => {
      this.loggedIn = isAuthenticated;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
