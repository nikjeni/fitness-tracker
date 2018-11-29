import { Exercise } from "./exercise.model";
import { Subject,Subscription } from 'rxjs'
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { UIService } from "../shared/ui.service";

@Injectable()
export class TrainigService {
    exerciseChanged = new Subject<Exercise>();
    exercisesChanges = new Subject<Exercise[]>();
    finishedExerciseChanged = new Subject<Exercise[]>();
    fbSubscription:Subscription[] = [];

   private availableExcercises : Exercise[] = [];

    private runningExercise:Exercise;

    constructor(private db:AngularFirestore,private uiService:UIService){}

    fetchAvailableExcercises(){
        this.uiService.loadingStateChanged.next(true)
       this.fbSubscription.push(this.db.collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return docArray.map(doc => {
              return {
                id : doc.payload.doc.id,
                name: doc.payload.doc.data()['name'],
                duration : doc.payload.doc.data()['duration'],
                calories : doc.payload.doc.data()['calories']
              }
            })
          })
        ).subscribe((exercises:Exercise[])=>{
            this.uiService.loadingStateChanged.next(false)
            this.availableExcercises = exercises;
            this.exercisesChanges.next([...this.availableExcercises])
        },error =>{
            this.uiService.loadingStateChanged.next(false)
            this.uiService.showSnakBar('Fetching issue',null,3000)
            this.exercisesChanges.next(null);
        }))
    }

    startExercise(selectedId:string){
    this.runningExercise = this.availableExcercises.find(ex => ex.id === selectedId)
    this.exerciseChanged.next({...this.runningExercise})
    }

    getRunningExercise(){
        return {...this.runningExercise};
    }

    completeExercise(){
        this.addDataToDatabase({...this.runningExercise,date:new Date(),state:'completed'});
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress:number){
        this.addDataToDatabase(
            {...this.runningExercise,date:new Date(),
                duration:this.runningExercise.duration * (progress/100),
                calories:this.runningExercise.calories * (progress/100),
                state:'cancelled'}
            );
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    fetchCompletedOrCancelledExercises(){
       this.fbSubscription.push(this.db.collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises:Exercise[]) => {
            this.finishedExerciseChanged.next(exercises)
        }))
    }

    cancelSubscription(){
        this.fbSubscription.forEach(sub => sub.unsubscribe())
    }

    addDataToDatabase(exercise:Exercise){
        this.db.collection('finishedExercises').add(exercise)
    }
}