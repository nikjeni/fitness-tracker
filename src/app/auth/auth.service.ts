import { AuthData } from './auth-data.model';

import { Subject } from 'rxjs'
import {Injectable} from '@angular/core'
import { Router } from '@angular/router'

import { AngularFireAuth } from '@angular/fire/auth'
import { TrainigService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

@Injectable()
export class AuthService {
    private isAthenticated = false;
    authChange = new Subject<boolean>();

    constructor(private router:Router,
        private afAuth:AngularFireAuth,
        private trainingService:TrainigService,
        private uiService:UIService){}

    registerUser(authData:AuthData){
        this.uiService.loadingStateChanged.next(true)
        this.afAuth.auth.createUserWithEmailAndPassword(
            authData.email,
            authData.password
        ).then(result =>{
            this.uiService.loadingStateChanged.next(false)
        }).catch(err =>{
            this.uiService.loadingStateChanged.next(false)
            this.uiService.showSnakBar(err.message,null,3000)
        })
    }

    initAuthListener(){
        this.afAuth.authState.subscribe(user =>{
            if(user){
                this.isAthenticated = true;
                this.authChange.next(true)
                this.router.navigate(['/training'])
            } else {
                this.trainingService.cancelSubscription()
                this.authChange.next(false)
                this.router.navigate(['/login'])
                this.isAthenticated = false;
            }
        })
    }

    login(authData:AuthData){
        this.uiService.loadingStateChanged.next(true)
        this.afAuth.auth.signInWithEmailAndPassword(
            authData.email,
            authData.password
        ).then(result => {
            this.uiService.loadingStateChanged.next(false)
        })
        .catch(err =>  {
            this.uiService.loadingStateChanged.next(false)
            this.uiService.showSnakBar(err.message,null,3000)
        })
    }

    logout(){
        this.afAuth.auth.signOut();
    }

    isAuth(){
       return this.isAthenticated;
    }
}