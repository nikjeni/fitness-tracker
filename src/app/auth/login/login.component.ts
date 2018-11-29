import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UIService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private loadingSubs:Subscription;

  constructor(private authservice:AuthService,private uiService:UIService) { }

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading
    })
  }

  onSubmit(form:NgForm){
    this.authservice.login({
      email:form.value.email,
      password:form.value.password
    })
  }

  ngOnDestroy(){
    if(this.loadingSubs) {
      this.loadingSubs.unsubscribe()
    }
  }
}
