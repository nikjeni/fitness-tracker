import { Component, OnInit, Output, EventEmitter,OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth = false;
  authSubscrition : Subscription
  constructor(private authService:AuthService) { }

  ngOnInit() {
   this.authSubscrition = this.authService.authChange.subscribe(authStatus =>{
      this.isAuth = authStatus;
    })
  }

  onToggleSideNav(){
this.sidenavToggle.emit()
  }

  ngOnDestroy(){
this.authSubscrition.unsubscribe()
  }

  onLogout(){
this.authService.logout()
  }

}
