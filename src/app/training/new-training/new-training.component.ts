import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainigService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs'
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit,OnDestroy {

  exercises:Exercise[];
  exerciseSubscription:Subscription;
  lodingSubs:Subscription;
  isLoading = false;

  constructor(private trainingService:TrainigService,private uiService:UIService) { }

  ngOnInit() {
    this.lodingSubs = this.uiService.loadingStateChanged.subscribe(isLOading =>{
      this.isLoading = isLOading;
    })

  this.exerciseSubscription =  this.trainingService.exercisesChanges.subscribe(exercise =>{
      this.exercises = exercise;
    })
    this.fetchExercises()
  }

  onStartTraining(form:NgForm) {
this.trainingService.startExercise(form.value.exercise)
  }

  fetchExercises(){
    this.trainingService.fetchAvailableExcercises();
  }

  ngOnDestroy(){
    if(this.exerciseSubscription){
      this.exerciseSubscription.unsubscribe()
    }
    if(this.lodingSubs){
      this.lodingSubs.unsubscribe()
    }
  }

}
