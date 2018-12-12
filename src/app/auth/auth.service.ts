import { AuthData } from './auth-data.model';

import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

import { AngularFireAuth } from '@angular/fire/auth'
import { TrainigService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer'
import * as UI from '../shared/ui.actions';
import * as Auth from '../auth/auth.actions';

@Injectable()
export class AuthService {
    constructor(private router: Router,
        private afAuth: AngularFireAuth,
        private trainingService: TrainigService,
        private uiService: UIService,
        private store: Store<fromRoot.State>) { }

    registerUser(authData: AuthData) {
        this.store.dispatch(new UI.StartLoading)
        this.afAuth.auth.createUserWithEmailAndPassword(
            authData.email,
            authData.password
        ).then(result => {
            this.store.dispatch(new UI.StopLoading)
            //  this.uiService.loadingStateChanged.next(false)
        }).catch(err => {
            this.store.dispatch(new UI.StopLoading)
            // this.uiService.loadingStateChanged.next(false)
            this.uiService.showSnakBar(err.message, null, 3000)
        })
    }

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.store.dispatch(new Auth.SetAuthenticated());
                this.router.navigate(['/training'])
            } else {
                this.trainingService.cancelSubscription()
                this.store.dispatch(new Auth.SetUnauthenticated());
                this.router.navigate(['/login'])
            }
        })
    }

    login(authData: AuthData) {
        // this.uiService.loadingStateChanged.next(true)
        this.store.dispatch(new UI.StartLoading)
        this.afAuth.auth.signInWithEmailAndPassword(
            authData.email,
            authData.password
        ).then(result => {
            this.store.dispatch(new UI.StopLoading)
            // this.uiService.loadingStateChanged.next(false)
        })
            .catch(err => {
                this.store.dispatch(new UI.StopLoading)
                //   this.uiService.loadingStateChanged.next(false)
                this.uiService.showSnakBar(err.message, null, 3000)
            })
    }

    logout() {
        this.afAuth.auth.signOut();
    }
}