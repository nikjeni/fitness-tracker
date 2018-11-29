import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainigService } from './training.service';

import { Subscription } from 'rxjs'

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit,OnDestroy {

  ongoingTraining = false;
  exerciseSubscription:Subscription;

  constructor(private trainingService:TrainigService) {
    console.log('trainig comp')
   }

  ngOnInit() {
    this.exerciseSubscription = this.trainingService.exerciseChanged.subscribe(
      exercise => {
        if(exercise){
          this.ongoingTraining = true;
        }else {
          this.ongoingTraining = false;
        }
      }
    )
  }

  ngOnDestroy(){
    if(this.exerciseSubscription){
      this.exerciseSubscription.unsubscribe()
    }
  }

}
