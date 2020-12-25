import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthDataService } from "../auth/auth-data.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  authSub:Subscription;
  loggedinUser:string;
  constructor(private authDataService: AuthDataService) { }
  ngOnInit() {
    //After logging out and logging in
    this.authSub=this.authDataService.getAuthStatusListener().subscribe(result => {
      this.isLoggedIn = result;
      this.loggedinUser= localStorage.getItem("loggedinuser");
    });
    //After performing a page refresh
    this.isLoggedIn = this.authDataService.getLoggedInStatus();
    this.loggedinUser= localStorage.getItem("loggedinuser");
  }

  onLogout() {
    this.authDataService.logout();
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

}
