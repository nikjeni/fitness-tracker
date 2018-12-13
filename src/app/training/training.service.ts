import { Exercise } from "./exercise.model";
import { Subject, Subscription } from 'rxjs'
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map, take } from "rxjs/operators";
import { UIService } from "../shared/ui.service";
import * as fromTrainig from './training.reducer';
import * as Trainig from './training.actions';
import { Store } from "@ngrx/store";

@Injectable()
export class TrainigService {
    fbSubscription: Subscription[] = [];

    constructor(private db: AngularFirestore, private uiService: UIService, private store: Store<fromTrainig.State>) { }

    fetchAvailableExcercises() {
        this.uiService.loadingStateChanged.next(true)
        this.fbSubscription.push(this.db.collection('availableExercises')
            .snapshotChanges()
            .pipe(
                map(docArray => {
                    return docArray.map(doc => {
                        return {
                            id: doc.payload.doc.id,
                            name: doc.payload.doc.data()['name'],
                            duration: doc.payload.doc.data()['duration'],
                            calories: doc.payload.doc.data()['calories']
                        }
                    })
                })
            ).subscribe((exercises: Exercise[]) => {
                console.log(exercises)
                this.uiService.loadingStateChanged.next(false)
                this.store.dispatch(new Trainig.SetAvailableTrainings(exercises))
            }, error => {
                this.uiService.loadingStateChanged.next(false)
                this.uiService.showSnakBar('Fetching issue', null, 3000)
            }))
    }

    startExercise(selectedId: string) {
        this.store.dispatch(new Trainig.StartTraining(selectedId))
    }

    completeExercise() {
        this.store.select(fromTrainig.getActiveTrainig)
            .pipe(take(1))
            .subscribe(ex => {
                this.addDataToDatabase({ ...ex, date: new Date(), state: 'completed' });
            })
        this.store.dispatch(new Trainig.StopTraining())
    }

    cancelExercise(progress: number) {
        this.store.select(fromTrainig.getActiveTrainig).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase(
                {
                    ...ex, date: new Date(),
                    duration: ex.duration * (progress / 100),
                    calories: ex.calories * (progress / 100),
                    state: 'cancelled'
                }
            );
        })
        this.store.dispatch(new Trainig.StopTraining())
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubscription.push(this.db.collection('finishedExercises')
            .valueChanges()
            .subscribe((exercises: Exercise[]) => {
                this.store.dispatch(new Trainig.SetFinishedTrainings(exercises))
            }))
    }

    cancelSubscription() {
        this.fbSubscription.forEach(sub => sub.unsubscribe())
    }

    addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise)
    }
}