import { Component, OnInit, Output, EventEmitter,OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit,OnDestroy {
  

  @Output() closeSideNav = new EventEmitter<void>()
  isAuth = false;
  authSubscrition : Subscription
  constructor(private authService:AuthService) { }

  ngOnInit() {
    this.authSubscrition = this.authService.authChange.subscribe(authStatus =>{
      this.isAuth = authStatus;
    })
  }

  onClose(){
this.closeSideNav.emit()
  }

  onLogout(){
    this.onClose()
    this.authService.logout()
      }

      ngOnDestroy(){
        this.authSubscrition.unsubscribe()
      }

}
